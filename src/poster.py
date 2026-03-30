"""予約投稿モジュール - スケジュールに基づいて X へ投稿"""
import json
import os
from datetime import datetime, timezone, timedelta
from playwright.async_api import Page


JST = timezone(timedelta(hours=9))


class XPoster:
          """X への予約投稿を管理するクラス"""

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

    def get_scheduled_message(self, slot: int | None = None) -> str | None:
                  """スケジュールからスロット番号に対応するメッセージを取得"""
        try:
                          with open(self.MESSAGES_FILE, "r", encoding="utf-8") as f:
                                                data = json.load(f)

                          schedule = data.get("schedule", [])
                          if not schedule:
                                                print("[WARN] スケジュールが見つかりません")
                                                return None

                          if slot is not None:
                                                # 指定されたスロットのメッセージを取得
                                                for entry in schedule:
                                                                          if entry.get("slot") == slot:
                                                                                                        return entry.get("text", "")
                                                                                                print(f"[WARN] スロット {slot} のメッセージが見つかりません")
                                                                      return None

            # スロット未指定時は現在時刻 (UTC) から自動判定
                          now_utc = datetime.now(timezone.utc)
                          current_hour = now_utc.hour
                          best_match = None
                          for entry in schedule:
                                                entry_hour = int(entry["time_utc"].split(":")[0])
                                                if entry_hour == current_hour:
                                                                          best_match = entry
                                                                          break
                                                                  if best_match:
                                                                                        return best_match.get("text", "")

                                            print(f"[WARN] 現在時刻 (UTC {current_hour}:00) に該当するスケジュールがありません")
            return None

except FileNotFoundError:
            print(f"[ERROR] メッセージファイルが見つかりません: {self.MESSAGES_FILE}")
            return None
except json.JSONDecodeError:
            print("[ERROR] メッセージファイルの JSON が不正です")
            return None

    @staticmethod
    def _log_post(message: str) -> None:
                  """投稿ログを記録"""
        log_dir = os.path.join(os.path.dirname(__file__), "..", "logs")
        os.makedirs(log_dir, exist_ok=True)

        log_file = os.path.join(log_dir, "post_log.txt")
        now_jst = datetime.now(JST)
        timestamp = now_jst.strftime("%Y-%m-%d %H:%M:%S JST")

        with open(log_file, "a", encoding="utf-8") as f:
                          f.write(f"[{timestamp}] {message}\n")
