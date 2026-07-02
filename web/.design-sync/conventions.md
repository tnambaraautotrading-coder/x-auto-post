# x-auto-post UI — 利用規約（デザインエージェント向け）

このデザインシステムは **Tailwind プリセット方式**です。すべての色・余白・タイポは
`src/styles/tokens.css` の CSS 変数を真実の源とし、`tailwind.config.ts` が semantic な
ユーティリティクラス名としてそれを公開しています。下に挙げる **実在する語彙だけ**を使い、
生の 16 進カラーや任意の px 値を新たに書かないでください。

## セットアップ

コンポーネントは素の React で、Provider/Context は不要です。唯一の前提は
**バンドルされたスタイルシート（`styles.css`、`tokens.css` を `@import`）が読み込まれていること**。
これにより CSS 変数が解決され、色・余白・角丸が正しく適用されます。読み込まれていないと
無スタイルになります。

## スタイリングの語彙（この DS の実クラス）

レイアウトや余白の調整は、必ず次のトークンクラスで行ってください。

- **面（背景）**: `bg-surface-0` `bg-surface-1` `bg-surface-2` `bg-surface-inverse` `bg-brand` `bg-accent`
- **文字色**: `text-content-strong` `text-content`（既定）`text-content-muted` `text-content-inverse` `text-accent`
- **市場の方向**: `text-market-up`（上昇/緑）`text-market-down`（下落/赤）`text-market-flat`
- **投稿ステータス色**: `text-status-scheduled` `text-status-posted` `text-status-failed` `text-status-draft`
  （淡い面は `bg-status-posted/10` のように `/10` 透過で使う）
- **罫線**: `border-line` `border-line-strong`
- **角丸**: `rounded-sm` `rounded-md` `rounded-lg` `rounded-pill`
- **余白/間隔**（4px グリッド）: `xs sm md lg xl 2xl` を `p-* px-* py-* m-* gap-*` で
  （例 `p-lg` `px-md` `py-sm` `gap-sm` `gap-md`）
- **文字サイズ**: `text-caption` `text-body` `text-title` `text-display`
- **影**: `shadow-card`

色は赤(#000)のような直値で書かず、必ず上記クラスを使ってください。

## 真実の源（読むべきファイル）

- `src/styles/tokens.css` — 全トークンの定義（変更すると全体に波及）
- `tailwind.config.ts` — トークンを semantic クラスにマップした一覧
- `components/<group>/<Name>/` — 各コンポーネントの Props と使用例

## コンポーネント

Button / Badge / Avatar / PostCard / ScheduleTable / Input / Textarea / Select /
Switch / Alert / Modal / Card / Spinner / Tabs / Tooltip / Pagination / EmptyState。
画面はこれらを組み合わせて構成し、独自の生 UI を再発明しないでください。

## 組み立ての例

```tsx
<Card title="本日の予定">
  <div className="flex flex-col gap-md">
    <PostCard
      slot={1}
      timeJst="09:00"
      status="scheduled"
      text="おはようございます！今日もマーケット情報をお届けします。"
      trend="up"
      indicator="日経平均 +1.2%"
    />
    <div className="flex justify-end gap-sm">
      <Button variant="secondary">下書き保存</Button>
      <Button>投稿する</Button>
    </div>
  </div>
</Card>
```

コントロールはライブラリのコンポーネント、その周りのレイアウト glue は上のトークン
クラスで——これがこの DS の標準的な書き方です。
