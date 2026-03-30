"""ブラウザ操作モジュール - Playwright を使用した X へのログイン処理"""
import os
import asyncio
from playwright.async_api import async_playwright
from src.config import Config

SCREENSHOT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "screenshots")


class XBrowser:
    """X (Twitter) のブラウザ操作を管理するクラス"""

    def __init__(self):
        self.browser = None
        self.context = None
        self.page = None
        self.playwright = None

    async def save_screenshot(self, name):
        """デバッグ用スクリーンショットを保存"""
        if not self.page:
            return
        os.makedirs(SCREENSHOT_DIR, exist_ok=True)
        path = os.path.join(SCREENSHOT_DIR, f"{name}.png")
        await self.page.screenshot(path=path, full_page=True)
        print(f"[DEBUG] スクリーンショット保存: {path}")

    async def launch(self):
        """ブラウザを起動"""
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(
            headless=Config.HEADLESS,
            slow_mo=Config.SLOW_MO,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--no-sandbox",
                "--disable-dev-shm-usage",
            ],
        )
        self.context = await self.browser.new_context(
            viewport={"width": 1280, "height": 720},
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/131.0.0.0 Safari/537.36"
            ),
            locale="ja-JP",
            timezone_id="Asia/Tokyo",
        )
        await self.context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        """)
        self.page = await self.context.new_page()
        self.page.set_default_timeout(Config.BROWSER_TIMEOUT)
        print("[INFO] ブラウザを起動しました")

    async def login(self):
        """X にログイン"""
        if not self.page:
            print("[ERROR] ブラウザが起動されていません")
            return False

        try:
            print("[INFO] X ログインページに移動中...")
            await self.page.goto(Config.X_LOGIN_URL, wait_until="load")
            await self.page.wait_for_timeout(5000)
            await self.save_screenshot("01_login_page")

            page_title = await self.page.title()
            page_url = self.page.url
            print(f"[DEBUG] ページタイトル: {page_title}")
            print(f"[DEBUG] 現在のURL: {page_url}")

            body_text = await self.page.inner_text("body")
            print(f"[DEBUG] ページテキスト(先頭500文字): {body_text[:500]}")

            all_elements = await self.page.query_selector_all("*")
            print(f"[DEBUG] ページ上の全要素数: {len(all_elements)}")

            frames = self.page.frames
            print(f"[DEBUG] フレーム数: {len(frames)}")
            for i, frame in enumerate(frames):
                print(f"[DEBUG]   frame[{i}]: {frame.url[:100]}")

            print("[INFO] ユーザー名入力欄を検索中...")
            username_input = None
            selectors = [
                'input[autocomplete="username"]',
                'input[name="text"]',
                'input[type="text"]',
                'input[data-testid="ocfEnterTextTextInput"]',
                'input',
            ]
            for sel in selectors:
                try:
                    loc = self.page.locator(sel)
                    count = await loc.count()
                    print(f"[DEBUG] セレクタ '{sel}': {count}件")
                    if count > 0:
                        if await loc.first.is_visible(timeout=3000):
                            username_input = loc.first
                            print(f"[DEBUG] ユーザー名入力欄を発見: {sel}")
                            break
                except Exception as ex:
                    print(f"[DEBUG] セレクタ '{sel}' でエラー: {ex}")

            if not username_input:
                await self.save_screenshot("02_username_not_found")
                html = await self.page.content()
                print(f"[DEBUG] HTML先頭2000文字:")
                print(html[:2000])
                print("[ERROR] ユーザー名入力欄が見つかりません")
                return False

            await username_input.fill(Config.X_USERNAME)
            await self.save_screenshot("03_username_filled")

            next_selectors = ['text="次へ"', 'text="Next"', '[role="button"]:has-text("次へ")', '[role="button"]:has-text("Next")']
            next_button = None
            for sel in next_selectors:
                try:
                    loc = self.page.locator(sel)
                    if await loc.count() > 0:
                        next_button = loc.first
                        break
                except Exception:
                    continue

            if next_button:
                await next_button.click()
            else:
                await username_input.press("Enter")

            await self.page.wait_for_timeout(3000)
            await self.save_screenshot("04_after_username")

            try:
                email_input = self.page.locator('input[data-testid="ocfEnterTextTextInput"]')
                if await email_input.is_visible(timeout=3000):
                    print("[INFO] メールアドレス確認を入力中...")
                    await email_input.fill(Config.X_EMAIL)
                    for sel in next_selectors:
                        try:
                            loc = self.page.locator(sel)
                            if await loc.count() > 0:
                                await loc.first.click()
                                break
                        except Exception:
                            continue
                    await self.page.wait_for_timeout(3000)
            except Exception:
                pass

            print("[INFO] パスワードを入力中...")
            password_input = self.page.locator('input[type="password"]')
            await password_input.wait_for(state="visible", timeout=10000)
            await password_input.fill(Config.X_PASSWORD)
            await self.save_screenshot("06_password_filled")

            login_selectors = ['[data-testid="LoginForm_Login_Button"]', 'text="ログイン"', 'text="Log in"']
            login_button = None
            for sel in login_selectors:
                try:
                    loc = self.page.locator(sel)
                    if await loc.count() > 0:
                        login_button = loc.first
                        break
                except Exception:
                    continue

            if login_button:
                await login_button.click()
            else:
                await password_input.press("Enter")

            await self.page.wait_for_timeout(5000)
            await self.save_screenshot("07_after_login")

            current_url = self.page.url
            print(f"[DEBUG] ログイン後のURL: {current_url}")
            if "home" in current_url:
                print("[INFO] ログインに成功しました")
                return True
            else:
                print(f"[WARN] ホームページにリダイレクトされませんでした: {current_url}")
                await self.save_screenshot("08_login_unexpected")
                return False

        except Exception as e:
            print(f"[ERROR] ログインに失敗しました: {e}")
            await self.save_screenshot("99_error")
            return False

    async def close(self):
        """ブラウザを閉じる"""
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()
        print("[INFO] ブラウザを閉じました")
