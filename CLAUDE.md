# CLAUDE.md

このファイルは、このリポジトリで作業する AI アシスタント（Claude Code など）向けの
ガイドです。コードベースの構造・開発ワークフロー・規約をまとめています。

> **言語**: このリポジトリは日本語で運用されています（`.claude/settings.json` に
> `"language": "japanese"`）。コメント・コミットメッセージ・ドキュメント・ユーザーへの
> 応答はすべて日本語で書いてください。技術用語やコード識別子は原語のままにします。

## プロジェクト概要

`x-auto-post` は **2 つの独立した部分から成るモノレポ**です。両者は疎結合で、共有ビルドは
ありません。

| 部分 | 場所 | 技術 | 役割 |
|---|---|---|---|
| **投稿バックエンド** | ルート / `src/` | Python 3.10+ / Playwright | X (旧 Twitter) へブラウザ自動化で自動投稿する CLI + GitHub Actions |
| **UI デザインシステム** | `web/` | React 18 / TypeScript / Vite / Tailwind / Storybook | 投稿管理 UI のコンポーネントライブラリ（`@x-auto-post/ui`） |

ブランド設定: マーケット情報を発信する「**南原たつき**」名義のアカウント。UI・投稿文面は
この世界観（紺ベース + 上昇=緑 / 下落=赤）に沿います。

作業対象がどちらの部分かを最初に見極めてください。`src/`・`posts/`・
`.github/workflows/` は Python 側、`web/` 配下は UI 側です。

---

## Python バックエンド（X 自動投稿）

X API を使わず、Playwright で実ブラウザを操作してログイン・投稿します。

### 主要コマンド

```bash
# セットアップ
pip install -r requirements.txt
playwright install chromium

# スケジュールスロットに応じて投稿（現在時刻から自動判定）
python src/main.py

# スロット番号を明示（1-8）
python src/main.py --slot 3

# 任意メッセージを直接投稿
python src/main.py --message "投稿するテキスト"
```

実行前に `.env`（`.env.example` をコピー）へ X の認証情報を設定する必要があります。

### アーキテクチャ

エントリは `src/main.py` の `run()`（`asyncio.run` で起動）。処理の流れ:

```
main.py (CLI 解析・オーケストレーション)
  ├─ config.py    Config.validate() で必須環境変数を検証
  ├─ poster.py    get_scheduled_message(slot) で投稿文を決定
  └─ browser.py   XBrowser.launch() → login() → poster.post_message(page, text)
```

| ファイル | 責務 |
|---|---|
| `src/main.py` | CLI (`argparse`) の解析、全体のオーケストレーション、エラー時 `sys.exit(1)` |
| `src/config.py` | `Config` クラス。`python-dotenv` で `.env` を読み込み、クラス属性として公開。`validate()` で `X_USERNAME` / `X_PASSWORD` の存在を確認 |
| `src/browser.py` | `XBrowser` クラス。Playwright の起動、anti-detection 設定、X へのログインフロー（ユーザー名 → メール確認 → パスワード）、デバッグ用スクリーンショット |
| `src/poster.py` | `SCHEDULE_SLOTS`（スロット番号 → JST 時刻）、`load_messages()`（`posts/messages.json` 読込）、`get_scheduled_message()`、`post_message()`（投稿の DOM 操作） |
| `posts/messages.json` | 投稿文の定義。`schedule` 配列に `slot` / `time_utc` / `time_jst` / `text` を持つ |

### 設定（環境変数）

`.env` または GitHub Actions Secrets で設定します（`src/config.py` 参照）。

| 変数 | 既定 | 説明 |
|---|---|---|
| `X_USERNAME` | （必須） | X のユーザー名 |
| `X_PASSWORD` | （必須） | X のパスワード |
| `X_EMAIL` | - | ログイン時のメール確認画面で使用 |
| `POSTS_PER_DAY` | `8` | 1 日の投稿数 |
| `HEADLESS` | `true` | ヘッドレス実行の可否 |
| `SLOW_MO` | `100` | Playwright の操作間ウェイト (ms) |
| `BROWSER_TIMEOUT` | `30000` | ブラウザ操作のデフォルトタイムアウト (ms) |

### スケジュールと自動実行

- 投稿スロットは **1 日 8 回**。`poster.py` の `SCHEDULE_SLOTS` が真実の源（JST 09/11/13/15/17/19/21/23 時）。
- `.github/workflows/auto-post.yml` が cron で自動実行（**UTC 0/2/4/6/8/10/12/14 時 = JST の各スロット時刻**）。`workflow_dispatch` で `message` / `slot` を渡して手動実行も可能。
- ワークフローは `continue-on-error: true` で失敗しても落ちず、`screenshots/` 配下のデバッグ画像を artifact としてアップロードします（保持 7 日）。
- **スロット時刻を変更するときは、`SCHEDULE_SLOTS`・`messages.json`・`auto-post.yml` の cron の 3 箇所を必ず揃えて更新すること**（UTC ⇄ JST は 9 時間差）。

### Python のコード規約

- コメント・docstring はすべて日本語。
- ログは `print()` で `[INFO]` / `[DEBUG]` / `[WARN]` / `[ERROR]` / `[SUCCESS]` の接頭辞付き。
- ブラウザ操作は `async`/`await`。X の DOM は変わりやすいため、`browser.py` は複数のセレクタ候補を順に試す防御的な作りになっている（この方針を踏襲すること）。
- テストフレームワークは未導入。動作確認はローカルで `HEADLESS=false` にしてスクリーンショットで確認する。

---

## Web デザインシステム（`web/`）

`@x-auto-post/ui`。投稿管理 UI のコンポーネントライブラリ。将来 Claude Code の
`/design-sync` で claude.ai/design に取り込めるよう Storybook 形式で構成されています。
**主たるビューアは Storybook**、`App.tsx` は組み合わせ例のデモです。

### 主要コマンド

すべて `web/` ディレクトリで実行します。

```bash
cd web
npm install

npm run storybook        # Storybook を起動（http://localhost:6006）※コンポーネント確認の主手段
npm run dev              # デモダッシュボードを開発サーバーで起動
npm run build            # 型チェック (tsc --noEmit) + 本番ビルド
npm run lint             # 型チェックのみ（= tsc --noEmit）
npm run build-storybook  # Storybook を静的ビルド
```

テストランナーは未導入。品質チェックは **`npm run lint`（型チェック）** が基本です。

### デザイントークン方式（最重要規約）

このデザインシステムは **Tailwind プリセット方式**です。真実の源は
`web/src/styles/tokens.css` の CSS 変数で、`tailwind.config.ts` がそれを semantic な
ユーティリティクラスとして公開しています。

- **生の 16 進カラーや任意の px 値を新たに書かないこと。** 必ず既存のトークンクラスを使う。
- 語彙の一覧は `web/.design-sync/conventions.md` にまとまっています。主なもの:
  - 面: `bg-surface-0/1/2/inverse` `bg-brand` `bg-accent`
  - 文字: `text-content-strong` `text-content`（既定）`text-content-muted` `text-content-inverse`
  - 市場方向: `text-market-up` `text-market-down` `text-market-flat`
  - 投稿ステータス: `text-status-scheduled/posted/failed/draft`（淡い面は `bg-status-posted/10` のように `/10` 透過）
  - 余白（4px グリッド）: `xs sm md lg xl 2xl` を `p-* m-* gap-*` で
  - 角丸: `rounded-sm/md/lg/pill` / 文字サイズ: `text-caption/body/title/display` / 影: `shadow-card`
- トークンを変えれば全コンポーネントに波及します。新しいトークンクラスを増やしたら、
  `tailwind.config.ts` の `safelist` パターン（purge 対策）も見直すこと。

### コンポーネントの構造

各コンポーネントは `web/src/components/<Name>/` に **3 点セット**で置きます。

```
components/Button/
  ├─ Button.tsx          # 実装（Props に日本語 JSDoc）
  ├─ Button.stories.tsx  # Storybook ストーリー（title: "Components/Button"）
  └─ index.ts            # 名前付き export（コンポーネント + 型）
```

既存の 17 コンポーネント: Button / Badge / Avatar / PostCard / ScheduleTable / Input /
Textarea / Select / Switch / Alert / Modal / Card / Spinner / Tabs / Tooltip /
Pagination / EmptyState。すべて `web/src/index.ts` から re-export されています。

**コンポーネントを新規追加する手順**:
1. `components/<Name>/<Name>.tsx` を実装（既存の `Button.tsx` を雛形に）。
2. クラス結合は `cn()`（`web/src/lib/cn.ts`、clsx ラッパー）を使う。
3. Props は TypeScript の `interface` で定義し、各項目に日本語 JSDoc を付ける。バリアントは `Record<Variant, string>` でクラスをマップする（`Button.tsx` 参照）。
4. `<Name>.stories.tsx` を追加（`title: "Components/<Name>"`, `tags: ["autodocs"]`）。
5. `index.ts` で export し、`web/src/index.ts` に re-export の 1 行を追加。

### Web のコード規約

- コメント・JSDoc はすべて日本語。
- TypeScript は `strict` かつ `noUnusedLocals` / `noUnusedParameters` 有効（未使用変数はビルドエラー）。
- Provider / Context は使わない素の React。前提はバンドルされたスタイルシート（`global.css` が `tokens.css` を `@import`）が読み込まれていること。
- レイアウトの glue はトークンクラスで、コントロール自体は既存コンポーネントで組む。生 UI を再発明しない。

### `/design-sync` について

- `web/` を起点に実行します（`cd web`）。`shape` は `.design-sync/config.json` で `storybook` 指定済み。
- Web 実行環境（claude.ai/code）では `/design-login` が使えないため、同期は**ローカルの Claude Code**（デスクトップ/IDE 版）で行います。詳細は `web/.design-sync/NOTES.md`。

---

## Git ワークフローと注意点

### ブランチ運用

- 機能開発は `claude/...` 系のフィーチャーブランチで行い、`main` へは PR 経由でマージします。
- `main` へ直接プッシュしないこと。

### セキュリティ上の必須事項

- **X の認証情報を絶対にコミットしない。** `.env` は `.gitignore` 済み。認証情報は `.env`（ローカル）と GitHub Actions Secrets（CI）にのみ置く。
- `session_data/` `cookies/` `*.pkl` `secrets/` `*.pem` `*.key` も `.gitignore` 済み。
- X の利用規約を遵守し、過度な自動投稿を避ける（本ツールは教育・個人利用目的）。

### 権限設定

`.claude/settings.json` に Claude Code の許可コマンド（`python *` / `pip install *` /
`playwright *` / 各種 `git *` / `ls *` など）が定義されています。ここに無いコマンドは
実行時に確認が入ります。
