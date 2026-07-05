"""YouTube Data API v3 からのデータ取得モジュール"""
import re
from datetime import datetime, timezone

import requests

from .config import Config


class YouTubeAPIError(Exception):
    """YouTube API 呼び出しの失敗"""


def _get(endpoint: str, params: dict) -> dict:
    params = {**params, "key": Config.YOUTUBE_API_KEY}
    resp = requests.get(f"{Config.YOUTUBE_API_BASE}/{endpoint}", params=params, timeout=30)
    if resp.status_code != 200:
        try:
            message = resp.json()["error"]["message"]
        except Exception:
            message = resp.text[:300]
        raise YouTubeAPIError(f"{endpoint} が {resp.status_code} を返しました: {message}")
    return resp.json()


def parse_duration(iso_duration: str) -> int:
    """ISO8601 の動画時間 (PT#H#M#S) を秒に変換"""
    m = re.fullmatch(
        r"P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", iso_duration or ""
    )
    if not m:
        return 0
    days, hours, minutes, seconds = (int(g) if g else 0 for g in m.groups())
    return days * 86400 + hours * 3600 + minutes * 60 + seconds


def resolve_channel(query: str) -> dict:
    """@ハンドル / チャンネルID / URL からチャンネル情報を取得

    Returns:
        {"id", "title", "subscribers", "video_count", "uploads_playlist"}
    """
    query = query.strip()
    # URL からハンドルまたはチャンネル ID を抜き出す
    url_match = re.search(r"youtube\.com/(?:channel/(UC[\w-]+)|(@[\w.\-]+))", query)
    if url_match:
        query = url_match.group(1) or url_match.group(2)

    params = {"part": "snippet,statistics,contentDetails"}
    if re.fullmatch(r"UC[\w-]{20,}", query):
        params["id"] = query
    else:
        params["forHandle"] = query if query.startswith("@") else f"@{query}"

    data = _get("channels", params)
    items = data.get("items", [])
    if not items:
        raise YouTubeAPIError(f"チャンネルが見つかりません: {query}")

    ch = items[0]
    return {
        "id": ch["id"],
        "title": ch["snippet"]["title"],
        "subscribers": int(ch["statistics"].get("subscriberCount", 0)),
        "video_count": int(ch["statistics"].get("videoCount", 0)),
        "uploads_playlist": ch["contentDetails"]["relatedPlaylists"]["uploads"],
    }


def fetch_channel_video_ids(uploads_playlist: str, max_videos: int) -> list[str]:
    """アップロード済みプレイリストから動画 ID を新しい順に取得"""
    video_ids: list[str] = []
    page_token = None
    while len(video_ids) < max_videos:
        params = {
            "part": "contentDetails",
            "playlistId": uploads_playlist,
            "maxResults": 50,
        }
        if page_token:
            params["pageToken"] = page_token
        data = _get("playlistItems", params)
        video_ids += [it["contentDetails"]["videoId"] for it in data.get("items", [])]
        page_token = data.get("nextPageToken")
        if not page_token:
            break
    return video_ids[:max_videos]


def search_video_ids(keyword: str, max_videos: int, region: str = "JP") -> list[str]:
    """キーワード検索で動画 ID を取得（関連度順）"""
    video_ids: list[str] = []
    page_token = None
    while len(video_ids) < max_videos:
        params = {
            "part": "id",
            "q": keyword,
            "type": "video",
            "maxResults": 50,
            "regionCode": region,
            "relevanceLanguage": "ja",
        }
        if page_token:
            params["pageToken"] = page_token
        data = _get("search", params)
        video_ids += [it["id"]["videoId"] for it in data.get("items", [])]
        page_token = data.get("nextPageToken")
        if not page_token:
            break
    return video_ids[:max_videos]


def fetch_video_details(video_ids: list[str]) -> list[dict]:
    """動画の統計・メタデータをまとめて取得（50件ずつバッチ）"""
    videos: list[dict] = []
    now = datetime.now(timezone.utc)
    for i in range(0, len(video_ids), 50):
        batch = video_ids[i : i + 50]
        data = _get(
            "videos",
            {"part": "snippet,statistics,contentDetails", "id": ",".join(batch)},
        )
        for it in data.get("items", []):
            snippet = it["snippet"]
            stats = it.get("statistics", {})
            published = datetime.fromisoformat(
                snippet["publishedAt"].replace("Z", "+00:00")
            )
            age_days = max((now - published).total_seconds() / 86400, 1.0)
            views = int(stats.get("viewCount", 0))
            likes = int(stats.get("likeCount", 0))
            comments = int(stats.get("commentCount", 0))
            videos.append(
                {
                    "id": it["id"],
                    "title": snippet["title"],
                    "channel": snippet["channelTitle"],
                    "published_at": published.isoformat(),
                    "duration_sec": parse_duration(
                        it.get("contentDetails", {}).get("duration", "")
                    ),
                    "views": views,
                    "likes": likes,
                    "comments": comments,
                    "age_days": round(age_days, 1),
                    "views_per_day": round(views / age_days, 1),
                    "engagement_rate": round((likes + comments) / views, 4) if views else 0.0,
                    "tags": snippet.get("tags", []),
                }
            )
    return videos
