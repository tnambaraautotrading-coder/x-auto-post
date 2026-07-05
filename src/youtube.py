"""YouTube 連携モジュール - 新着動画の検知と告知文生成

YouTube Data API を使用せず、公式 RSS フィードを利用して
チャンネルの新着動画を取得します（API キー不要）。
"""
import json
import os
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone, timedelta


FEED_URL = "https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}"

NS = {
    "atom": "http://www.w3.org/2005/Atom",
    "yt": "http://www.youtube.com/xml/schemas/2015",
}

STATE_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "posts",
    "youtube_state.json"
)

# 状態ファイルに保持する告知済み動画 ID の上限
MAX_ANNOUNCED_IDS = 50


def fetch_latest_videos(channel_id, timeout=30):
    """チャンネルの RSS フィードから最新動画の一覧を取得する"""
    url = FEED_URL.format(channel_id=channel_id)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as res:
            body = res.read()
    except Exception as e:
        print(f"[ERROR] YouTube フィードの取得に失敗: {e}")
        return []

    try:
        root = ET.fromstring(body)
    except ET.ParseError as e:
        print(f"[ERROR] YouTube フィードの解析に失敗: {e}")
        return []

    videos = []
    for entry in root.findall("atom:entry", NS):
        video_id = entry.findtext("yt:videoId", default="", namespaces=NS)
        title = entry.findtext("atom:title", default="", namespaces=NS)
        published_str = entry.findtext("atom:published", default="", namespaces=NS)
        if not video_id:
            continue
        try:
            published = datetime.fromisoformat(published_str)
        except ValueError:
            published = None
        videos.append({
            "video_id": video_id,
            "title": title,
            "url": f"https://www.youtube.com/watch?v={video_id}",
            "published": published,
        })
    return videos


def load_state():
    """告知済み動画 ID の状態ファイルを読み込む"""
    try:
        with open(STATE_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data.get("announced", [])
    except FileNotFoundError:
        return []
    except json.JSONDecodeError as e:
        print(f"[WARN] 状態ファイルの解析に失敗（初期化します）: {e}")
        return []


def save_state(announced):
    """告知済み動画 ID を状態ファイルに保存する"""
    data = {"announced": announced[-MAX_ANNOUNCED_IDS:]}
    with open(STATE_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")


def get_new_videos(channel_id, lookback_hours=24):
    """未告知かつ公開が lookback_hours 以内の新着動画を古い順に返す"""
    videos = fetch_latest_videos(channel_id)
    if not videos:
        return []

    announced = set(load_state())
    threshold = datetime.now(timezone.utc) - timedelta(hours=lookback_hours)

    new_videos = []
    for video in videos:
        if video["video_id"] in announced:
            continue
        if video["published"] is not None and video["published"] < threshold:
            continue
        new_videos.append(video)

    # 公開日時の古い順に並べる（公開日時不明は末尾）
    new_videos.sort(
        key=lambda v: v["published"] or datetime.max.replace(tzinfo=timezone.utc)
    )
    return new_videos


def mark_announced(video_id):
    """動画を告知済みとして記録する"""
    announced = load_state()
    if video_id not in announced:
        announced.append(video_id)
        save_state(announced)


def build_post_text(video, template):
    """テンプレートから X への告知文を生成する"""
    return template.format(title=video["title"], url=video["url"])
