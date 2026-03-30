"""X 自動投稿メインスクリプト"""
import argparse
import asyncio
import sys
import os

# プロジェクトルートをパスに追加
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from src.config import Config
from src.browser import XBrowser
from src.poster import XPoster


async def run(message: str | None = None) -> None:
      """メイン実行関数"""
      print("=" * 50)
      print("X Auto Post - 自動投稿ツール")
      print("=" * 50)

    # 設定の検証
      if not Config.validate():
                print("[ERROR] 設定に不備があります。.env ファイルを確認してください。")
                sys.exit(1)

      browser = XBrowser()

    try:
              # ブラウザ起動
              await browser.launch()

        # ログイン
              login_success = await browser.login()
              if not login_success:
                            print("[ERROR] ログインに失敗しました。認証情報を確認してください。")
                            sys.exit(1)

              # 投稿処理
              poster = XPoster(browser.page)

        if message:
                      # コマンドライン引数で指定されたメッセージを投稿
                      success = await poster.post(message)
else:
              # messages.json からメッセージを取得して投稿
              next_message = poster.get_next_message()
              if next_message:
                                success = await poster.post(next_message)
        else:
                print("[ERROR] 投稿するメッセージがありません")
                          success = False

        if success:
                      print("[INFO] 投稿処理が正常に完了しました")
else:
            print("[ERROR] 投稿処理に失敗しました")
            sys.exit(1)

except Exception as e:
        print(f"[ERROR] 予期しないエラーが発生しました: {e}")
        sys.exit(1)

finally:
        await browser.close()


def main():
      """エントリーポイント"""
    parser = argparse.ArgumentParser(description="X 自動投稿ツール")
    parser.add_argument(
              "--message", "-m",
              type=str,
              default=None,
              help="投稿するメッセージ（省略時は messages.json から取得）",
    )
    args = parser.parse_args()

    asyncio.run(run(message=args.message))


if __name__ == "__main__":
      main()
