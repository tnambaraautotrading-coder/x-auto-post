# design-sync メモ

手元の Claude Code で `/design-sync` を実行する際の補足。

## 実行場所
- **`web/` ディレクトリを起点に実行する**（`cd web` してから `/design-sync`）。
  デザインシステム本体は `web/` 配下にあり、`.storybook` も `web/.storybook` にある。
- `shape` は `config.json` で `storybook` を指定済み（検出ステップはスキップされる）。
- リポジトリ root から実行した場合は、`.storybook` の場所を聞かれたら
  `web/.storybook` と答える。

## Tailwind の purge について
- Tailwind は「content に出現したクラスだけ」を生成する（未使用クラスは削除される）。
- デザインエージェントが `conventions.md` の語彙を使っても確実に効くよう、
  `tailwind.config.ts` に semantic トークンクラスの `safelist` を追加済み。
- 新しいトークンクラスを語彙に足したときは、safelist のパターンも見直すこと。

## 認証
- claude.ai/code の Web 実行環境では `/design-login` が使えない（対話ターミナル不可）。
  そのため同期はローカルの Claude Code（デスクトップ/IDE 版）で行う。
