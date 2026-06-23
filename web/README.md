# @x-auto-post/ui

`x-auto-post` の投稿管理 UI **コンポーネントライブラリ（デザインシステム）**。
React + TypeScript + Vite + Tailwind CSS + Storybook で構成されています。

将来 Claude Code の `/design-sync` で claude.ai/design に取り込めるよう、
Storybook（storybook shape）とデザイントークンを備えています。

## セットアップ

```bash
cd web
npm install
```

## スクリプト

| コマンド | 内容 |
|---|---|
| `npm run dev` | デモダッシュボードを開発サーバーで起動 |
| `npm run build` | 型チェック + 本番ビルド |
| `npm run storybook` | Storybook を起動（http://localhost:6006） |
| `npm run build-storybook` | Storybook を静的ビルド |
| `npm run lint` | 型チェックのみ |

## 構成

```
web/
├── src/
│   ├── styles/
│   │   ├── tokens.css        # デザイントークン（色・余白・タイポ）の真実の源
│   │   └── global.css        # Tailwind ディレクティブ + トークン読込
│   ├── lib/cn.ts             # クラス名結合ユーティリティ
│   ├── components/
│   │   ├── Button/           # 基本ボタン（primary/secondary/ghost/danger）
│   │   ├── Badge/            # 投稿ステータスのバッジ
│   │   ├── Avatar/           # ユーザー/ブランドのアバター
│   │   ├── PostCard/         # マーケットレポート投稿カード
│   │   └── ScheduleTable/    # 投稿スケジュール一覧
│   ├── App.tsx               # デモダッシュボード
│   └── index.ts              # ライブラリのエントリポイント
├── tailwind.config.ts        # デザイントークンの semantic 名を列挙したプリセット
└── .storybook/               # Storybook 設定
```

## デザイントークン

色・余白・角丸・タイポグラフィは `src/styles/tokens.css` の CSS 変数が真実の源です。
Tailwind の semantic クラス（`bg-surface-1`, `text-content-strong`, `text-market-up`,
`bg-status-posted` など）はこれらの変数を参照するため、トークンを変更すれば
全コンポーネントに反映されます。
