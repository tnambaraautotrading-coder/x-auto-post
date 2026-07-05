"""収集した動画データの統計分析モジュール

外部依存なし（標準ライブラリのみ）。日本語タイトルにも対応した
シンプルな特徴抽出を行う。
"""
import re
from collections import Counter
from datetime import datetime
from statistics import mean, median
from zoneinfo import ZoneInfo

JST = ZoneInfo("Asia/Tokyo")

WEEKDAYS_JA = ["月", "火", "水", "木", "金", "土", "日"]

DURATION_BUCKETS = [
    ("ショート (〜60秒)", 0, 60),
    ("1〜5分", 60, 300),
    ("5〜10分", 300, 600),
    ("10〜20分", 600, 1200),
    ("20分以上", 1200, float("inf")),
]

# 日本語ストップワード（頻出するが特徴にならない語）
STOPWORDS = {
    "した", "する", "です", "ます", "こと", "これ", "それ", "ため",
    "the", "and", "for", "with", "how", "what",
}


def _duration_bucket(sec: int) -> str:
    for label, lo, hi in DURATION_BUCKETS:
        if lo <= sec < hi:
            return label
    return DURATION_BUCKETS[-1][0]


def _title_tokens(title: str) -> list[str]:
    """タイトルから特徴語を抽出（英単語・カタカナ語・漢字連続・数字表現）"""
    tokens = re.findall(r"[A-Za-z][A-Za-z0-9]+|[ァ-ヶー]{2,}|[一-龠々]{2,}|\d+[万億%円年日分]?", title)
    return [t for t in tokens if t.lower() not in STOPWORDS]


def _title_features(title: str) -> dict:
    return {
        "length": len(title),
        "has_number": bool(re.search(r"\d", title)),
        "has_brackets": "【" in title or "[" in title,
        "has_question": "?" in title or "？" in title,
        "has_exclamation": "!" in title or "！" in title,
    }


def analyze(videos: list[dict]) -> dict:
    """動画リストを分析して集計結果の dict を返す"""
    if not videos:
        return {"video_count": 0}

    views = [v["views"] for v in videos]
    vpd = [v["views_per_day"] for v in videos]
    eng = [v["engagement_rate"] for v in videos]

    # views_per_day で並べ、上位/下位 25% を比較対象にする
    ranked = sorted(videos, key=lambda v: v["views_per_day"], reverse=True)
    q = max(len(ranked) // 4, 1)
    top_q, bottom_q = ranked[:q], ranked[-q:]

    # 動画長バケット別の中央値
    by_duration: dict[str, list[float]] = {}
    for v in videos:
        by_duration.setdefault(_duration_bucket(v["duration_sec"]), []).append(
            v["views_per_day"]
        )
    duration_stats = [
        {"bucket": label, "count": len(by_duration[label]),
         "median_vpd": round(median(by_duration[label]), 1)}
        for label, _, _ in DURATION_BUCKETS if label in by_duration
    ]

    # 投稿曜日・時間帯（JST）別
    by_weekday: dict[int, list[float]] = {}
    by_hour: dict[int, list[float]] = {}
    for v in videos:
        dt = datetime.fromisoformat(v["published_at"]).astimezone(JST)
        by_weekday.setdefault(dt.weekday(), []).append(v["views_per_day"])
        by_hour.setdefault(dt.hour, []).append(v["views_per_day"])
    weekday_stats = [
        {"weekday": WEEKDAYS_JA[wd], "count": len(vals), "median_vpd": round(median(vals), 1)}
        for wd, vals in sorted(by_weekday.items())
    ]
    hour_stats = [
        {"hour": f"{h:02d}時", "count": len(vals), "median_vpd": round(median(vals), 1)}
        for h, vals in sorted(by_hour.items())
    ]

    # タイトル特徴の上位/下位比較
    def feature_rate(group: list[dict], key: str) -> float:
        return round(mean(1 if _title_features(v["title"])[key] else 0 for v in group), 2)

    title_features = [
        {"feature": label,
         "top": feature_rate(top_q, key),
         "bottom": feature_rate(bottom_q, key)}
        for key, label in [
            ("has_brackets", "【】/[] を含む"),
            ("has_number", "数字を含む"),
            ("has_question", "？を含む"),
            ("has_exclamation", "！を含む"),
        ]
    ]
    title_length = {
        "top": round(mean(len(v["title"]) for v in top_q), 1),
        "bottom": round(mean(len(v["title"]) for v in bottom_q), 1),
    }

    # 上位動画に特徴的なキーワード（上位グループでの出現数 − 下位グループでの出現数）
    top_words = Counter(w for v in top_q for w in set(_title_tokens(v["title"])))
    bottom_words = Counter(w for v in bottom_q for w in set(_title_tokens(v["title"])))
    distinctive = [
        {"word": w, "top_count": c, "bottom_count": bottom_words.get(w, 0)}
        for w, c in top_words.most_common(30)
        if c >= 2 and c > bottom_words.get(w, 0)
    ][:15]

    return {
        "video_count": len(videos),
        "total_views": sum(views),
        "median_views": int(median(views)),
        "mean_views": int(mean(views)),
        "median_views_per_day": round(median(vpd), 1),
        "median_engagement": round(median(eng) * 100, 2),
        "duration_stats": duration_stats,
        "weekday_stats": weekday_stats,
        "hour_stats": hour_stats,
        "title_features": title_features,
        "title_length": title_length,
        "distinctive_words": distinctive,
        "top_videos": ranked[:10],
        "bottom_videos": ranked[-5:],
    }
