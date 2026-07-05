"""CLI エントリポイント

使い方:
    python -m youtube_analysis --channel @cocona_ai_school
    python -m youtube_analysis --search "Claude Code 副業"
    python -m youtube_analysis --demo          # API キーなしで動作確認
"""
import argparse
import json
import re
import sys
from pathlib import Path

from .analyze import analyze
from .claude_insights import generate_insights
from .config import Config
from .report import build_report


def _safe_name(s: str) -> str:
    return re.sub(r"[^\w\-]+", "_", s).strip("_")[:60] or "report"


def run_demo() -> tuple[str, dict, None]:
    """同梱のサンプルデータで分析を実行（API キー不要）"""
    sample_path = Path(__file__).parent / "sample_data.json"
    videos = json.loads(sample_path.read_text(encoding="utf-8"))
    print(f"[INFO] デモモード: サンプル {len(videos)} 本を分析します")
    return "デモデータ", analyze(videos), None


def run_channel(query: str, max_videos: int) -> tuple[str, dict, dict]:
    from .fetch import fetch_channel_video_ids, fetch_video_details, resolve_channel

    ch = resolve_channel(query)
    print(f"[INFO] チャンネル: {ch['title']} (登録者 {ch['subscribers']:,})")
    ids = fetch_channel_video_ids(ch["uploads_playlist"], max_videos)
    print(f"[INFO] 直近 {len(ids)} 本の動画を取得中...")
    videos = fetch_video_details(ids)
    return ch["title"], analyze(videos), ch


def run_search(keyword: str, max_videos: int) -> tuple[str, dict, None]:
    from .fetch import fetch_video_details, search_video_ids

    print(f"[INFO] キーワード検索: {keyword}")
    ids = search_video_ids(keyword, max_videos)
    print(f"[INFO] {len(ids)} 本の動画を取得中...")
    videos = fetch_video_details(ids)
    return f"検索「{keyword}」", analyze(videos), None


def main() -> int:
    parser = argparse.ArgumentParser(description="YouTube 分析ツール")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--channel", help="@ハンドル / チャンネルID / チャンネルURL")
    group.add_argument("--search", help="検索キーワード")
    group.add_argument("--demo", action="store_true", help="サンプルデータで動作確認")
    parser.add_argument("--max-videos", type=int, default=Config.MAX_VIDEOS)
    parser.add_argument("--out", default=Config.REPORT_DIR, help="レポート出力ディレクトリ")
    parser.add_argument("--no-claude", action="store_true", help="Claude 所見生成をスキップ")
    args = parser.parse_args()

    if args.demo:
        subject, result, channel_info = run_demo()
    else:
        if not Config.validate():
            return 1
        try:
            if args.channel:
                subject, result, channel_info = run_channel(args.channel, args.max_videos)
            else:
                subject, result, channel_info = run_search(args.search, args.max_videos)
        except Exception as e:
            print(f"[ERROR] {e}")
            return 1

    report = build_report(subject, result, channel_info)

    if not args.no_claude and result.get("video_count"):
        insights = generate_insights(result)
        if insights:
            report += "\n---\n\n" + insights + "\n"
        elif Config.ANTHROPIC_API_KEY:
            pass  # 警告は generate_insights 内で出力済み
        else:
            print("[INFO] ANTHROPIC_API_KEY 未設定のため Claude 所見はスキップ（統計レポートのみ生成）")

    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{_safe_name(subject)}.md"
    out_path.write_text(report, encoding="utf-8")
    print(f"[OK] レポートを生成しました: {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
