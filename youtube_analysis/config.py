"""設定管理モジュール"""
import os

from dotenv import load_dotenv

load_dotenv()


class Config:
    """環境変数から設定を読み込むクラス"""

    YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "")
    ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")

    YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3"

    # 収集する動画数の上限（API クォータ節約のため）
    MAX_VIDEOS = int(os.getenv("YT_MAX_VIDEOS", "100"))

    # レポート出力先
    REPORT_DIR = os.getenv("YT_REPORT_DIR", "reports/youtube")

    @classmethod
    def validate(cls):
        """必須設定が存在するか検証"""
        if not cls.YOUTUBE_API_KEY:
            print("[ERROR] YOUTUBE_API_KEY が設定されていません")
            print("        https://console.cloud.google.com/apis/credentials で無料で取得できます")
            return False
        return True
