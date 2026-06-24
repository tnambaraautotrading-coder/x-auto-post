## How to build with this design system

This DS ships two components:

- **`PostCard`** — a dark-themed card for previewing X (Twitter) post candidates for the 南原竜樹 / x-auto-post brand. Content is bilingual: Japanese headline/body, Latin meta labels.
- **`SakurazakaDeck`** — a Claude Design canvas for the `桜坂の経営者` sponsor pitch deck. It includes a 16-slide overview and selected full-size slide views.

### Setup — no provider, dark surface required

There is **no theme provider and no context** to wrap. Load `styles.css` (it `@import`s the bundled component CSS and the Inter fonts) and `_ds_bundle.js`, then mount:

```jsx
const { PostCard } = window.XAutoPostDS;
ReactDOM.createRoot(document.getElementById('ds-root')).render(<PostCard tone="executive" />);
```

For the 桜坂 proposal deck:

```jsx
const { SakurazakaDeck } = window.XAutoPostDS;
ReactDOM.createRoot(document.getElementById('ds-root')).render(<SakurazakaDeck variant="deck" />);
```

`PostCard` is designed against a **dark charcoal background — `#0f1115`**. Place it on that surface (the page or its container), or it will float on the wrong backdrop. The card sets `color-scheme: dark` on `:root` and its own gradient/border/shadow; do not put it on a light surface.

### Styling idiom — props only, no classes, no tokens

This DS exposes **no utility classes and no design tokens** (`var(--*)`). The internal `.post-card__*` classes are implementation detail, not an API — never target or recreate them. You style `PostCard` **entirely through its props**, and you write your own layout glue (flex/grid, spacing) for everything *around* the card.

`PostCardProps` (all optional, all have sensible defaults):
`accountName`, `handle`, `headline`, `body`, `timestamp`, `metricLabel`, `metricValue`, `tone`.

`SakurazakaDeckProps`:
`variant`.

Use `variant="deck"` for the full 16-slide overview. Use these variants for full-size slide editing: `cover`, `problem`, `solution`, `visual`, `cast`, `record`, `format`, `audience`, `difference`, `revenue`, `benefit`, `roadmap`, `risk`, `ask`, `faq`, `closing`.

The one design-language lever is **`tone`**, which selects the accent treatment:
- `"executive"` → gold accent (`#e0b978`), badge reads **Executive Memo**
- `"signal"` → teal accent (`#5fb49c`), badge reads **Market Signal**
- `"urgent"` → coral accent (`#de6d5a`), badge reads **Priority**

Two composition facts that will trip you up if you don't know them:
- The **badge label is derived from `tone`**, not settable — there is no badge prop.
- The **avatar glyph is the fixed character `南`** in the component; `accountName`/`handle` set the name lines only, not the avatar.

### Where the truth lives

- `_ds_bundle.css` (reached via `styles.css`) — the real, compiled component styles.
- `components/x-auto-post/PostCard/PostCard.prompt.md` and `PostCard.d.ts` — usage examples and exact prop types. Read these before composing.
- `components/x-auto-post/SakurazakaDeck/SakurazakaDeck.prompt.md` and `SakurazakaDeck.d.ts` — available deck variants and usage examples.

### One idiomatic build

```jsx
const { PostCard } = window.XAutoPostDS;

function Board() {
  return (
    <div style={{ background: '#0f1115', minHeight: '100vh', display: 'grid', gap: 24, padding: 24, justifyItems: 'center' }}>
      <PostCard
        tone="signal"
        headline="伸びる会社ほど、撤退ラインを先に決めている"
        body="勢いで進む時ほど、やめる基準を先に置く。"
        metricLabel="Experiment"
        metricValue="Signal Post"
      />
    </div>
  );
}
```

The control (`PostCard`) is the library's; the dark board and grid are your own glue.
