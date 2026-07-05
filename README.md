# x-auto-post

X (旧Twitter) への自動投稿ツール。X API を使用せず、ブラウザ自動化 (Playwright) を利用して投稿を自動化します。

## 機能

- X へのブラウザ自動ログイン（Cookie セッション管理）
- テキスト投稿の自動化
- 投稿スケジュール管理（cron 対応）
- GitHub Actions による定期自動実行
- 投稿ログの記録
- YouTube 新着動画の自動告知（RSS フィード利用、API キー不要）

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
python src/main.py --message "投稿するテキスト"
```

### 5. GitHub Actions での定期実行

リポジトリの Settings > Secrets and variables > Actions で以下のシークレットを設定してください:

- `X_USERNAME` : X のユーザー名
- `X_PASSWORD` : X のパスワード
- `X_EMAIL` : X に登録したメールアドレス

ワークフローはデフォルトで毎日 9:00 (JST) に実行されます。

## YouTube 新着動画の自動告知

自分の YouTube チャンネルに新しい動画が公開されたら、自動で X に告知を投稿できます。YouTube の公式 RSS フィードを利用するため、YouTube Data API のキーは不要です。

### 設定

1. `.env`（ローカル）またはリポジトリの Settings > Secrets and variables > Actions > Variables（GitHub Actions）に `YOUTUBE_CHANNEL_ID` を設定します。チャンネル ID は `UC` で始まる文字列で、YouTube Studio の「設定 > チャンネル > 詳細設定」で確認できます。
2. 必要に応じて以下の環境変数で挙動を調整できます:
   - `YOUTUBE_LOOKBACK_HOURS` : この時間以内に公開された動画のみ告知対象（デフォルト: 24）
   - `YOUTUBE_POST_TEMPLATE` : 告知文テンプレート。`{title}` と `{url}` が動画タイトルと URL に置換されます

### ローカルでの実行

```bash
python src/main.py --youtube
```

新着動画がなければ何も投稿せずに終了します。告知済みの動画 ID は `posts/youtube_state.json` に記録され、二重投稿を防ぎます。

### GitHub Actions での自動実行

`.github/workflows/youtube-post.yml` が毎時 15 分に新着動画をチェックし、新着があれば X に告知を投稿します。投稿後は告知済み状態ファイルを自動でコミットします。

## プロジェクト構成

```
x-auto-post/
├── .github/
│   └── workflows/
│       ├── auto-post.yml       # GitHub Actions ワークフロー（予約投稿）
│       └── youtube-post.yml    # GitHub Actions ワークフロー（YouTube 告知）
├── src/
│   ├── main.py                 # メインスクリプト
│   ├── browser.py              # ブラウザ操作モジュール
│   ├── poster.py               # 投稿処理モジュール
│   ├── youtube.py              # YouTube 連携モジュール
│   └── config.py               # 設定管理
├── posts/
│   ├── messages.json           # 投稿メッセージ一覧
│   └── youtube_state.json      # YouTube 告知済み動画の記録
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
