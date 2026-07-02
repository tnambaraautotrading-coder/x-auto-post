import type { Config } from "tailwindcss";

/**
 * Tailwind プリセット — デザイントークンの semantic 名を列挙する。
 * 値はすべて src/styles/tokens.css の CSS 変数を参照するため、
 * トークンを変えれば全コンポーネントに反映される。
 */
const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}", "./.storybook/**/*.{ts,tsx}"],
  // デザインエージェントが conventions.md の語彙を使ってもクラスが削除されないよう、
  // semantic トークンクラスを safelist で常に生成する。
  safelist: [
    {
      pattern:
        /^(bg|text|border)-(surface|content|brand|accent|line|status|market)(-[a-z0-9]+)?$/,
      variants: ["hover", "focus-visible"],
    },
    { pattern: /^rounded-(sm|md|lg|pill)$/ },
    { pattern: /^(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap)-(xs|sm|md|lg|xl|2xl)$/ },
    { pattern: /^text-(caption|body|title|display)$/ },
    { pattern: /^shadow-card$/ },
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "var(--color-brand)",
          strong: "var(--color-brand-strong)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          strong: "var(--color-accent-strong)",
        },
        surface: {
          0: "var(--color-surface-0)",
          1: "var(--color-surface-1)",
          2: "var(--color-surface-2)",
          inverse: "var(--color-surface-inverse)",
        },
        content: {
          strong: "var(--color-text-strong)",
          DEFAULT: "var(--color-text)",
          muted: "var(--color-text-muted)",
          inverse: "var(--color-text-inverse)",
        },
        line: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)",
        },
        market: {
          up: "var(--color-up)",
          down: "var(--color-down)",
          flat: "var(--color-flat)",
        },
        status: {
          scheduled: "var(--color-status-scheduled)",
          posted: "var(--color-status-posted)",
          failed: "var(--color-status-failed)",
          draft: "var(--color-status-draft)",
        },
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        pill: "var(--radius-pill)",
      },
      spacing: {
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
      },
      fontFamily: {
        sans: "var(--font-sans)",
      },
      fontSize: {
        caption: "var(--font-size-caption)",
        body: "var(--font-size-body)",
        title: "var(--font-size-title)",
        display: "var(--font-size-display)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
      },
    },
  },
  plugins: [],
};

export default config;
