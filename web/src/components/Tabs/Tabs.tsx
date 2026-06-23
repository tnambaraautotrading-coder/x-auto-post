import { cn } from "../../lib/cn";

export interface TabItem {
  /** タブの識別子。 */
  value: string;
  /** タブのラベル。 */
  label: string;
}

export interface TabsProps {
  /** タブの一覧。 */
  items: TabItem[];
  /** 現在選択中のタブ value。 */
  value: string;
  /** タブ切替時のコールバック。 */
  onChange: (value: string) => void;
}

/** タブナビゲーション。 */
export function Tabs({ items, value, onChange }: TabsProps) {
  return (
    <div role="tablist" className="flex gap-xs border-b border-line">
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={cn(
              "-mb-px border-b-2 px-lg py-md text-body font-medium transition-colors",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              active
                ? "border-accent text-accent"
                : "border-transparent text-content-muted hover:text-content-strong",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
