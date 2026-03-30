"""X 予約投稿ツール - メインスクリプト"""
import sys
import os
import asyncio
import argparse

# プロジェクトルートをパスに追加
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.config import Config
from src.browser import XBrowser
from src.poster import get_scheduled_message, post_message


async def run(slot=None, message=None):
    """メイン実行関数"""
    print("=" * 50)
    print("X 予約投稿ツール")
    print("=" * 50)

    # 設定の検証
    if not Config.validate():
        print("[ERROR] 設定が不正です。終了します。")
        sys.exit(1)

    # メッセージ取得
    if message:
        post_text = message
    else:
        post_text = get_scheduled_message(slot)

    if not post_text:
        print("[ERROR] 投稿するメッセージがありません")
        sys.exit(1)

    print(f"[INFO] スロット: {slot}")
    print(f"[INFO] 投稿内容: {post_text[:80]}...")

    # ブラウザ操作
    browser = XBrowser()
    try:
        await browser.launch()
        login_ok = await browser.login()
        if not login_ok:
            print("[ERROR] ログインに失敗しました")
            sys.exit(1)

        result = await post_message(browser.page, post_text)
        if result:
            print("[SUCCESS] 投稿が完了しました！")
        else:
            print("[ERROR] 投稿に失敗しました")
            sys.exit(1)
    except Exception as e:
        print(f"[ERROR] 予期しないエラー: {e}")
        sys.exit(1)
    finally:
        await browser.close()


def main():
    """エントリーポイント"""
    parser = argparse.ArgumentParser(description="X 予約投稿ツール")
    parser.add_argument("--slot", type=int, default=None, help="スケジュールスロット番号 (1-8)")
    parser.add_argument("--message", type=str, default=None, help="投稿メッセージ（直接指定）")
    args = parser.parse_args()

    asyncio.run(run(slot=args.slot, message=args.message))


if __name__ == "__main__":
    main()
