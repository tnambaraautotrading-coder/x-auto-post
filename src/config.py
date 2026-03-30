"""設定管理モジュール"""
import os
from dotenv import load_dotenv

load_dotenv()


class Config:
      """環境変数から設定を読み込むクラス"""

    # X ログイン情報
      X_USERNAME: str = os.getenv("X_USERNAME", "")
      X_PASSWORD: str = os.getenv("X_PASSWORD", "")
      X_EMAIL: str = os.getenv("X_EMAIL", "")

    # 投稿設定
      POST_INTERVAL_MINUTES: int = int(os.getenv("POST_INTERVAL_MINUTES", "60"))
      MAX_POSTS_PER_DAY: int = int(os.getenv("MAX_POSTS_PER_DAY", "5"))

    # ブラウザ設定
      HEADLESS: bool = os.getenv("HEADLESS", "true").lower() == "true"
      SLOW_MO: int = int(os.getenv("SLOW_MO", "100"))
      BROWSER_TIMEOUT: int = int(os.getenv("BROWSER_TIMEOUT", "30000"))

    # X の URL
      X_BASE_URL: str = "https://x.com"
      X_LOGIN_URL: str = "https://x.com/i/flow/login"
      X_HOME_URL: str = "https://x.com/home"

    @classmethod
    def validate(cls) -> bool:
              """必須設定が存在するか検証"""
              if not cls.X_USERNAME:
                            print("[ERROR] X_USERNAME が設定されていません")
                            return False
                        if not cls.X_PASSWORD:
                                      print("[ERROR] X_PASSWORD が設定されていません")
                                      return False
                                  return True
