"""投稿管理モジュール - 予約投稿対応"""
import json
import os
from datetime import datetime, timezone, timedelta


JST = timezone(timedelta(hours=9))

SCHEDULE_SLOTS = {
    1: "09:00",
    2: "11:00",
    3: "13:00",
    4: "15:00",
    5: "17:00",
    6: "19:00",
    7: "21:00",
    8: "23:00",
}


def load_messages():
    """メッセージファイルを読み込む"""
    messages_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "posts",
        "messages.json"
    )
    try:
        with open(messages_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data.get("schedule", [])
    except FileNotFoundError:
        print(f"[ERROR] メッセージファイルが見つかりません: {messages_path}")
        return []
    except json.JSONDecodeError as e:
        print(f"[ERROR] JSONの解析に失敗: {e}")
        return []


def get_scheduled_message(slot=None):
    """スケジュールスロットに基づいてメッセージを取得"""
    messages = load_messages()
    if not messages:
        print("[ERROR] メッセージリストが空です")
        return None

    if slot is not None:
        slot = int(slot)
    else:
        now = datetime.now(JST)
        current_hour = now.hour
        slot = None
        for s, time_str in SCHEDULE_SLOTS.items():
            hour = int(time_str.split(":")[0])
            if hour == current_hour:
                slot = s
                break
        if slot is None:
            slot = 1

    index = (slot - 1) % len(messages)
    entry = messages[index]

    if isinstance(entry, dict):
        return entry.get("text", "")
    return str(entry)


async def post_message(page, message):
    """X にメッセージを投稿"""
    try:
        print(f"[INFO] 投稿を作成中: {message[:50]}...")

        # ホームページに移動
        await page.goto("https://x.com/home", wait_until="networkidle")
        await page.wait_for_timeout(2000)

        # 投稿テキストエリアをクリック
        tweet_box = page.locator('[data-testid="tweetTextarea_0"]')
        await tweet_box.wait_for(state="visible", timeout=10000)
        await tweet_box.click()
        await page.wait_for_timeout(500)

        # メッセージを入力
        await tweet_box.fill(message)
        await page.wait_for_timeout(1000)

        # 投稿ボタンをクリック
        post_button = page.locator('[data-testid="tweetButtonInline"]')
        await post_button.wait_for(state="visible", timeout=5000)
        await post_button.click()
        await page.wait_for_timeout(3000)

        print("[INFO] 投稿が完了しました")
        return True

    except Exception as e:
        print(f"[ERROR] 投稿に失敗しました: {e}")
        return False
