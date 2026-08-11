"""設定管理モジュール - 予約投稿対応"""
import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """環境変数から設定を読み込むクラス"""

    # X ログイン情報
    X_USERNAME = os.getenv("X_USERNAME", "")
    X_PASSWORD = os.getenv("X_PASSWORD", "")
    X_EMAIL = os.getenv("X_EMAIL", "")

    # YouTube 連携設定
    YOUTUBE_CHANNEL_ID = os.getenv("YOUTUBE_CHANNEL_ID", "")
    YOUTUBE_LOOKBACK_HOURS = int(os.getenv("YOUTUBE_LOOKBACK_HOURS", "24"))
    YOUTUBE_POST_TEMPLATE = os.getenv(
        "YOUTUBE_POST_TEMPLATE",
        "📺 新しい動画を公開しました！\n{title}\n{url}"
    )

    # ブラウザ設定
    HEADLESS = os.getenv("HEADLESS", "true").lower() == "true"
    SLOW_MO = int(os.getenv("SLOW_MO", "100"))
    BROWSER_TIMEOUT = int(os.getenv("BROWSER_TIMEOUT", "30000"))

    # X の URL
    X_LOGIN_URL = "https://x.com/i/flow/login"
    X_HOME_URL = "https://x.com/home"

    @classmethod
    def validate(cls):
        """必須設定が存在するか検証"""
        if not cls.X_USERNAME:
            print("[ERROR] X_USERNAME が設定されていません")
            return False
        if not cls.X_PASSWORD:
            print("[ERROR] X_PASSWORD が設定されていません")
            return False
        return True

    @classmethod
    def validate_youtube(cls):
        """YouTube 連携に必要な設定が存在するか検証"""
        if not cls.YOUTUBE_CHANNEL_ID:
            print("[ERROR] YOUTUBE_CHANNEL_ID が設定されていません")
            return False
        return True
