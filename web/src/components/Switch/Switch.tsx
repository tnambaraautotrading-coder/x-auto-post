import { useId } from "react";
import { cn } from "../../lib/cn";

export interface SwitchProps {
  /** オン/オフ状態。 */
  checked: boolean;
  /** 状態変更時のコールバック。 */
  onChange?: (checked: boolean) => void;
  /** ラベル。 */
  label?: string;
  /** 無効化。 */
  disabled?: boolean;
}

/** オン/オフのトグルスイッチ。スロットの有効・無効切替などに使う。 */
export function Switch({ checked, onChange, label, disabled }: SwitchProps) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={cn(
        "inline-flex items-center gap-sm text-body text-content-strong",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
      )}
    >
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          "relative inline-flex h-6 w-10 shrink-0 items-center rounded-pill transition-colors",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          checked ? "bg-accent" : "bg-line-strong",
        )}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 rounded-pill bg-surface-0 shadow transition-transform",
            checked ? "translate-x-[18px]" : "translate-x-[2px]",
          )}
        />
      </button>
      {label && <span>{label}</span>}
    </label>
  );
}
