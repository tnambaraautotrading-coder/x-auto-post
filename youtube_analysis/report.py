"""分析結果を Markdown レポートに整形するモジュール"""
from datetime import datetime
from zoneinfo import ZoneInfo

JST = ZoneInfo("Asia/Tokyo")


def _table(headers: list[str], rows: list[list]) -> str:
    lines = [
        "| " + " | ".join(headers) + " |",
        "| " + " | ".join("---" for _ in headers) + " |",
    ]
    for row in rows:
        lines.append("| " + " | ".join(str(c) for c in row) + " |")
    return "\n".join(lines)


def _video_row(v: dict) -> list:
    title = v["title"][:45] + ("…" if len(v["title"]) > 45 else "")
    return [
        f"[{title}](https://youtu.be/{v['id']})",
        f"{v['views']:,}",
        f"{v['views_per_day']:,.0f}",
        f"{v['engagement_rate'] * 100:.1f}%",
        f"{v['duration_sec'] // 60}分{v['duration_sec'] % 60}秒",
    ]


def _recommendations(result: dict) -> list[str]:
    """集計結果から機械的に導ける示唆を文章化"""
    recs = []
    if result.get("duration_stats"):
        best = max(result["duration_stats"], key=lambda d: d["median_vpd"])
        recs.append(
            f"動画の長さは「{best['bucket']}」の 1日あたり再生数の中央値が最も高い"
            f"（{best['median_vpd']:,.0f}回/日）。"
        )
    if result.get("weekday_stats"):
        best = max(result["weekday_stats"], key=lambda d: d["median_vpd"])
        recs.append(
            f"投稿曜日は「{best['weekday']}曜日」が最も伸びている"
            f"（中央値 {best['median_vpd']:,.0f}回/日）。"
        )
    if result.get("hour_stats"):
        best = max(result["hour_stats"], key=lambda d: d["median_vpd"])
        recs.append(f"投稿時間帯は「{best['hour']}台（JST）」が最も伸びている。")
    for f in result.get("title_features", []):
        if f["top"] >= f["bottom"] + 0.25:
            recs.append(
                f"上位動画はタイトルに「{f['feature']}」割合が高い"
                f"（上位 {f['top'] * 100:.0f}% vs 下位 {f['bottom'] * 100:.0f}%）。"
            )
    tl = result.get("title_length")
    if tl and abs(tl["top"] - tl["bottom"]) >= 5:
        recs.append(
            f"タイトルの平均文字数は上位 {tl['top']}字 / 下位 {tl['bottom']}字。"
        )
    return recs


def build_report(subject: str, result: dict, channel_info: dict | None = None) -> str:
    """Markdown レポート本文を生成"""
    now = datetime.now(JST).strftime("%Y-%m-%d %H:%M")
    lines = [f"# YouTube 分析レポート: {subject}", "", f"生成日時: {now} (JST)", ""]

    if result.get("video_count", 0) == 0:
        lines.append("分析対象の動画が見つかりませんでした。")
        return "\n".join(lines)

    if channel_info:
        lines += [
            "## チャンネル概要",
            "",
            _table(
                ["チャンネル", "登録者数", "総動画数"],
                [[channel_info["title"], f"{channel_info['subscribers']:,}", channel_info["video_count"]]],
            ),
            "",
        ]

    lines += [
        "## サマリー",
        "",
        _table(
            ["分析動画数", "再生数中央値", "再生数平均", "1日あたり再生数(中央値)", "エンゲージメント率(中央値)"],
            [[
                result["video_count"],
                f"{result['median_views']:,}",
                f"{result['mean_views']:,}",
                f"{result['median_views_per_day']:,.0f}",
                f"{result['median_engagement']}%",
            ]],
        ),
        "",
        "## 伸びている動画 TOP10（1日あたり再生数順）",
        "",
        _table(
            ["タイトル", "再生数", "再生/日", "Eng率", "長さ"],
            [_video_row(v) for v in result["top_videos"]],
        ),
        "",
        "## 動画の長さ別パフォーマンス",
        "",
        _table(
            ["長さ", "本数", "再生/日 (中央値)"],
            [[d["bucket"], d["count"], f"{d['median_vpd']:,.0f}"] for d in result["duration_stats"]],
        ),
        "",
        "## 投稿曜日別パフォーマンス (JST)",
        "",
        _table(
            ["曜日", "本数", "再生/日 (中央値)"],
            [[d["weekday"], d["count"], f"{d['median_vpd']:,.0f}"] for d in result["weekday_stats"]],
        ),
        "",
        "## タイトル分析（上位25% vs 下位25%）",
        "",
        _table(
            ["特徴", "上位動画での割合", "下位動画での割合"],
            [[f["feature"], f"{f['top'] * 100:.0f}%", f"{f['bottom'] * 100:.0f}%"] for f in result["title_features"]],
        ),
        "",
    ]

    if result.get("distinctive_words"):
        lines += [
            "### 上位動画に特徴的なキーワード",
            "",
            _table(
                ["キーワード", "上位での出現", "下位での出現"],
                [[w["word"], w["top_count"], w["bottom_count"]] for w in result["distinctive_words"]],
            ),
            "",
        ]

    recs = _recommendations(result)
    if recs:
        lines += ["## データから導ける示唆", ""]
        lines += [f"- {r}" for r in recs]
        lines.append("")

    return "\n".join(lines)
