"""投稿管理モジュール - 予約投稿対応"""
import json
import os
from datetime import datetime, timezone, timedelta


JST = timezone(timedelta(hours=9))

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

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


def get_scheduled_entry(slot=None):
    """スケジュールスロットに基づいてエントリ(text/media を含む)を取得"""
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
    return messages[index]


def get_scheduled_message(slot=None):
    """スケジュールスロットに基づいてメッセージ本文を取得"""
    entry = get_scheduled_entry(slot)
    if entry is None:
        return None
    if isinstance(entry, dict):
        return entry.get("text", "")
    return str(entry)


def get_scheduled_media(slot=None):
    """スケジュールスロットに基づいて添付メディアのパスを取得 (無ければ None)"""
    entry = get_scheduled_entry(slot)
    if isinstance(entry, dict):
        return resolve_media_path(entry.get("media"))
    return None


def resolve_media_path(media):
    """メディアパスを解決する。相対パスはプロジェクトルート基準。"""
    if not media:
        return None
    if os.path.isabs(media):
        return media
    return os.path.join(PROJECT_ROOT, media)


async def _attach_media(page, media_path):
    """投稿コンポーザにメディアファイルを添付する"""
    abspath = resolve_media_path(media_path)
    if not os.path.exists(abspath):
        print(f"[ERROR] メディアファイルが見つかりません: {abspath}")
        return False

    print(f"[INFO] メディアを添付中: {abspath}")
    file_input = page.locator('input[data-testid="fileInput"]')
    await file_input.set_input_files(abspath)
    await page.wait_for_timeout(3000)
    print("[INFO] メディアのアップロードを開始しました")
    return True


async def post_message(page, message, media_path=None):
    """X にメッセージを投稿 (media_path を指定すると動画/画像を添付)"""
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

        # メディアを添付 (任意)
        if media_path:
            attached = await _attach_media(page, media_path)
            if not attached:
                return False

        # 投稿ボタンをクリック
        post_button = page.locator('[data-testid="tweetButtonInline"]')
        await post_button.wait_for(state="visible", timeout=5000)

        # メディアアップロード中は投稿ボタンが無効になるため有効化を待つ (最大120秒)
        if media_path:
            for _ in range(60):
                disabled = await post_button.get_attribute("aria-disabled")
                if disabled != "true":
                    break
                await page.wait_for_timeout(2000)
            else:
                print("[WARN] メディアのアップロードが完了しませんでした")

        await post_button.click()
        await page.wait_for_timeout(3000)

        print("[INFO] 投稿が完了しました")
        return True

    except Exception as e:
        print(f"[ERROR] 投稿に失敗しました: {e}")
        return False
