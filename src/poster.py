"""投稿処理モジュール - X への投稿を実行"""
import json
import os
import random
from datetime import datetime
from playwright.async_api import Page


class XPoster:
      """X への投稿を管理するクラス"""

    MESSAGES_FILE = os.path.join(os.path.dirname(__file__), "..", "posts", "messages.json")

    def __init__(self, page: Page):
              self.page = page

    async def post(self, message: str) -> bool:
              """メッセージを X に投稿"""
              try:
                            print(f"[INFO] 投稿を開始: {message[:50]}...")

                  # ホーム画面の投稿ボックスをクリック
                            compose_box = self.page.locator('[data-testid="tweetTextarea_0"]')
                            await compose_box.wait_for(state="visible", timeout=10000)
                            await compose_box.click()
                            await self.page.wait_for_timeout(500)

                  # メッセージを入力
                            await compose_box.fill(message)
                            await self.page.wait_for_timeout(1000)

                  # 投稿ボタンをクリック
                            post_button = self.page.locator('[data-testid="tweetButtonInline"]')
                            await post_button.wait_for(state="visible", timeout=5000)
                            await post_button.click()
                            await self.page.wait_for_timeout(3000)

                  print(f"[INFO] 投稿が完了しました: {message[:50]}...")
            self._log_post(message)
            return True

except Exception as e:
            print(f"[ERROR] 投稿に失敗しました: {e}")
            return False

    def get_next_message(self) -> str | None:
              """messages.json から次の投稿メッセージを取得"""
        try:
                      with open(self.MESSAGES_FILE, "r", encoding="utf-8") as f:
                                        data = json.load(f)

                      messages = data.get("messages", [])
                      if not messages:
                                        print("[WARN] 投稿メッセージが見つかりません")
                                        return None

                      # ランダムに選択
                      message = random.choice(messages)
                      return message.get("text", "")

except FileNotFoundError:
            print(f"[ERROR] メッセージファイルが見つかりません: {self.MESSAGES_FILE}")
            return None
except json.JSONDecodeError:
            print(f"[ERROR] メッセージファイルの JSON が不正です")
            return None

    @staticmethod
    def _log_post(message: str) -> None:
              """投稿ログを記録"""
        log_dir = os.path.join(os.path.dirname(__file__), "..", "logs")
        os.makedirs(log_dir, exist_ok=True)

        log_file = os.path.join(log_dir, "post_log.txt")
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        with open(log_file, "a", encoding="utf-8") as f:
                      f.write(f"[{timestamp}] {message}\n")
