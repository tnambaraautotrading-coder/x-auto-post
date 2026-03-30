# x-auto-post

X (旧Twitter) への自動投稿ツール。X API を使用せず、ブラウザ自動化 (Playwright) を利用して投稿を自動化します。

## 機能

- X へのブラウザ自動ログイン（Cookie セッション管理）
- テキスト投稿の自動化
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
python src/main.py --message "投稿するテキスト"
```

### 5. GitHub Actions での定期実行

リポジトリの Settings > Secrets and variables > Actions で以下のシークレットを設定してください:

- `X_USERNAME` : X のユーザー名
- `X_PASSWORD` : X のパスワード
- `X_EMAIL` : X に登録したメールアドレス

ワークフローはデフォルトで毎日 9:00 (JST) に実行されます。

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
