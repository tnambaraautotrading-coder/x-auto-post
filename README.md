# x-auto-post

X (旧Twitter) への自動投稿ツール。X API を使用せず、ブラウザ自動化 (Playwright) を利用して投稿を自動化します。

## 機能

- X へのブラウザ自動ログイン（Cookie セッション管理）
- テキスト投稿の自動化
- 動画/画像（メディア）付き投稿の自動化
- Higgsfield MCP 連携による AI 動画生成（Claude Code から）
- 投稿スケジュール管理（cron 対応）
- GitHub Actions による定期自動実行
- 投稿ログの記録

## 必要環境

- Python 3.10+
- Playwright
- GitHub Actions（自動実行の場合）

## セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/tnambaraautotrading-coder/x-auto-post.git
cd x-auto-post
```

### 2. 依存パッケージのインストール

```bash
pip install -r requirements.txt
playwright install chromium
```

### 3. 環境変数の設定

`.env.example` をコピーして `.env` を作成し、X のログイン情報を設定してください。

```bash
cp .env.example .env
```

`.env` ファイルを編集:

```
X_USERNAME=あなたのユーザー名
X_PASSWORD=あなたのパスワード
X_EMAIL=登録メールアドレス
```

### 4. ローカルでの実行

```bash
# テキストのみ投稿
python src/main.py --message "投稿するテキスト"

# 動画/画像を添付して投稿
python src/main.py --message "投稿するテキスト" --media media/sample.mp4

# スケジュールスロットに沿って投稿（messages.json の media フィールドがあれば添付）
python src/main.py --slot 1
```

### 5. GitHub Actions での定期実行

リポジトリの Settings > Secrets and variables > Actions で以下のシークレットを設定してください:

- `X_USERNAME` : X のユーザー名
- `X_PASSWORD` : X のパスワード
- `X_EMAIL` : X に登録したメールアドレス

ワークフローはデフォルトで毎日 9:00 (JST) に実行されます。

`workflow_dispatch`（手動実行）では `message` / `slot` に加えて `media`（添付ファイルのパス）を指定できます。
GitHub Actions のランナーは clone した repo のファイルしか参照できないため、添付したい動画は事前に `media/` にコミットしておく必要があります。

## AI 動画工場（Higgsfield MCP 連携）

Claude Code と [Higgsfield](https://higgsfield.ai/) の MCP 連携を使うと、日本語で指示するだけで AI が動画を生成し、それを X に自動投稿する「AI 動画工場」を構築できます。Higgsfield は画像生成・動画生成・音声・翻訳を1箇所で扱えるプラットフォームで、Kling や Veo など他社の最新モデルも横断的に利用できます。

### 1. MCP の接続

本リポジトリには `.mcp.json` が含まれており、Higgsfield のホスト型 MCP サーバー（`https://mcp.higgsfield.ai/mcp`）が設定済みです。

```json
{
  "mcpServers": {
    "higgsfield": {
      "type": "http",
      "url": "https://mcp.higgsfield.ai/mcp"
    }
  }
}
```

ローカルの Claude Code でこのリポジトリを開くと自動的に認識されます。**初回に Higgsfield のツールを呼び出すと、ブラウザで OAuth 認証が開きます**（API キー不要）。Higgsfield アカウントでサインインすれば接続完了です。

> 注意: OAuth はローカルブラウザを利用するため、ブラウザのないクラウド環境（Claude Code on the web のサンドボックス等）では認証できません。動画生成はローカルの Claude Code で実行してください。

CLI から手動で追加する場合:

```bash
claude mcp add --transport http higgsfield https://mcp.higgsfield.ai/mcp
```

API キー方式（npm 版 `higgsfield-mcp`）を使う場合は [cloud.higgsfield.ai/api-keys](https://cloud.higgsfield.ai/api-keys) でキーを取得し、`HF_API_KEY` / `HF_SECRET` を設定してください。

### 2. 動画生成 → X 投稿の流れ

1. Claude Code に日本語で指示して動画を生成（例: 「マーケット解説のショート動画を作って」）
2. 生成された動画を `media/` ディレクトリに保存
3. 投稿に添付して実行

```bash
python src/main.py --message "本日のマーケット解説です📈" --media media/market.mp4
```

スケジュール投稿で添付する場合は、`posts/messages.json` の各スロットに `media` フィールド（リポジトリルートからの相対パス）を追加します。

```json
{
  "slot": 1,
  "time_jst": "09:00",
  "text": "おはようございます！本日のマーケット動画です。",
  "media": "media/morning.mp4"
}
```

## プロジェクト構成

```
x-auto-post/
├── .github/
│   └── workflows/
│       └── auto-post.yml       # GitHub Actions ワークフロー
├── src/
│   ├── main.py                 # メインスクリプト
│   ├── browser.py              # ブラウザ操作モジュール
│   ├── poster.py               # 投稿処理モジュール
│   └── config.py               # 設定管理
├── posts/
│   └── messages.json           # 投稿メッセージ一覧
├── media/                      # 投稿に添付する動画/画像
├── .mcp.json                   # Higgsfield MCP サーバー設定
├── .env.example                # 環境変数テンプレート
├── .gitignore                  # Git 除外設定
├── requirements.txt            # Python 依存パッケージ
└── README.md                   # このファイル
```

## 注意事項

- X の利用規約を遵守してください
- ログイン情報は `.env` ファイルに保管し、絶対に Git にコミットしないでください
- 過度な自動投稿はアカウント制限の原因となる場合があります
- 本ツールは教育・個人利用目的です

## ライセンス

MIT License
