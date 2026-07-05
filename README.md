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

## YouTube 分析ツール (youtube_analysis/)

YouTube Data API v3 でチャンネルやキーワードの動画データを収集し、「伸びている動画の傾向」を統計分析して Markdown レポートを生成するツールです。`ANTHROPIC_API_KEY` を設定すると、Claude が分析結果をもとに所見・タイトル案10本・改善アクションを追記します。

### 分析内容

- 再生数・1日あたり再生数・エンゲージメント率のサマリー
- 伸びている動画 TOP10（1日あたり再生数順）
- 動画の長さ別 / 投稿曜日別 / 投稿時間帯別パフォーマンス
- タイトル分析（上位25% vs 下位25% の特徴比較、特徴的キーワード抽出）
- データから導ける示唆の自動生成

### セットアップ

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) で APIキーを作成し、「YouTube Data API v3」を有効化（無料枠: 10,000ユニット/日）
2. `.env` に `YOUTUBE_API_KEY` を設定

### 使い方

```bash
# チャンネルを分析（@ハンドル / チャンネルID / URL）
python -m youtube_analysis --channel @チャンネル名

# キーワードで検索して分析
python -m youtube_analysis --search "AI 副業"

# API キーなしで動作確認（サンプルデータ）
python -m youtube_analysis --demo

# 分析結果を JSON でも保存（Claude Code に読ませて追加分析する場合に便利）
python -m youtube_analysis --channel @チャンネル名 --json

# 分析結果を踏まえた動画台本を生成（ANTHROPIC_API_KEY 必須）
python -m youtube_analysis --channel @チャンネル名 --script "動画タイトル"
```

レポートは `reports/youtube/` に出力されます。

### テスト

```bash
python -m unittest discover tests -v
```

### GitHub Actions での定期実行

`.github/workflows/youtube-analysis.yml` が毎週月曜 9:00 (JST) に実行されます。

- Secrets: `YOUTUBE_API_KEY`（必須）、`ANTHROPIC_API_KEY`（任意）
- Variables: `YT_TARGET_CHANNEL`（定期実行で分析するチャンネル）
- 手動実行（workflow_dispatch）ではチャンネル・キーワードを都度指定可能
- レポートは Actions の Artifacts からダウンロードできます

## プロジェクト構成

```
x-auto-post/
├── .github/
│   └── workflows/
│       ├── auto-post.yml       # X 自動投稿ワークフロー
│       └── youtube-analysis.yml # YouTube 分析ワークフロー
├── src/
│   ├── main.py                 # メインスクリプト
│   ├── browser.py              # ブラウザ操作モジュール
│   ├── poster.py               # 投稿処理モジュール
│   └── config.py               # 設定管理
├── youtube_analysis/
│   ├── __main__.py             # CLI エントリポイント
│   ├── config.py               # 設定管理
│   ├── fetch.py                # YouTube Data API クライアント
│   ├── analyze.py              # 統計分析
│   ├── report.py               # Markdown レポート生成
│   ├── claude_insights.py      # Claude による所見生成（任意）
│   └── sample_data.json        # デモ用サンプルデータ
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
