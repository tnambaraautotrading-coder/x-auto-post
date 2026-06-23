import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  /** ラベル。 */
  label?: string;
  /** 選択肢。 */
  options: SelectOption[];
  /** エラーメッセージ。 */
  error?: string;
}

/** ドロップダウン選択（ネイティブ select ベース）。 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, error, id, className, ...props },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;

  return (
    <div className="flex w-full flex-col gap-xs">
      {label && (
        <label
          htmlFor={fieldId}
          className="text-caption font-medium text-content-strong"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={fieldId}
          aria-invalid={error ? true : undefined}
          className={cn(
            "h-10 w-full appearance-none rounded-md border bg-surface-0 pl-md pr-2xl text-body text-content-strong",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
            "disabled:cursor-not-allowed disabled:bg-surface-2 disabled:opacity-60",
            error ? "border-status-failed" : "border-line-strong",
            className,
          )}
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute inset-y-0 right-md flex items-center text-content-muted"
          aria-hidden
        >
          ▾
        </span>
      </div>
      {error && <span className="text-caption text-status-failed">{error}</span>}
    </div>
  );
});
