"""ブラウザ操作モジュール - Playwright を使用した X へのログイン処理"""
import asyncio
from playwright.async_api import async_playwright, Browser, BrowserContext, Page
from src.config import Config


class XBrowser:
      """X (Twitter) のブラウザ操作を管理するクラス"""

    def __init__(self):
              self.browser: Browser | None = None
              self.context: BrowserContext | None = None
              self.page: Page | None = None
              self.playwright = None

    async def launch(self) -> None:
              """ブラウザを起動"""
              self.playwright = await async_playwright().start()
              self.browser = await self.playwright.chromium.launch(
                  headless=Config.HEADLESS,
                  slow_mo=Config.SLOW_MO,
              )
              self.context = await self.browser.new_context(
                  viewport={"width": 1280, "height": 720},
                  user_agent=(
                      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                      "AppleWebKit/537.36 (KHTML, like Gecko) "
                      "Chrome/131.0.0.0 Safari/537.36"
                  ),
              )
              self.page = await self.context.new_page()
              self.page.set_default_timeout(Config.BROWSER_TIMEOUT)
              print("[INFO] ブラウザを起動しました")

    async def login(self) -> bool:
              """X にログイン"""
              if not self.page:
                            print("[ERROR] ブラウザが起動されていません")
                            return False

              try:
                            print("[INFO] X ログインページに移動中...")
                            await self.page.goto(Config.X_LOGIN_URL, wait_until="networkidle")
                            await self.page.wait_for_timeout(2000)

                  # ユーザー名入力
                            print("[INFO] ユーザー名を入力中...")
                            username_input = self.page.locator('input[autocomplete="username"]')
                            await username_input.wait_for(state="visible", timeout=15000)
                            await username_input.fill(Config.X_USERNAME)
                            await self.page.locator('text="次へ"').click()
                            await self.page.wait_for_timeout(2000)

                  # メールアドレス確認が求められる場合
                            try:
                                              email_input = self.page.locator('input[data-testid="ocfEnterTextTextInput"]')
                                              if await email_input.is_visible(timeout=3000):
                                                                    print("[INFO] メールアドレス確認を入力中...")
                                                                    await email_input.fill(Config.X_EMAIL)
                                                                    await self.page.locator('text="次へ"').click()
                                                                    await self.page.wait_for_timeout(2000)
                            except Exception:
                                              pass

                            # パスワード入力
                            print("[INFO] パスワードを入力中...")
                            password_input = self.page.locator('input[type="password"]')
                            await password_input.wait_for(state="visible", timeout=10000)
                            await password_input.fill(Config.X_PASSWORD)
                            await self.page.locator('[data-testid="LoginForm_Login_Button"]').click()
                            await self.page.wait_for_timeout(3000)

                  # ログイン成功の確認
                            await self.page.wait_for_url("**/home", timeout=15000)
                            print("[INFO] ログインに成功しました")
                            return True

              except Exception as e:
                            print(f"[ERROR] ログインに失敗しました: {e}")
                            return False

          async def close(self) -> None:
                    """ブラウザを閉じる"""
                    if self.browser:
                                  await self.browser.close()
                              if self.playwright:
                                            await self.playwright.stop()
                                        print("[INFO] ブラウザを閉じました")
