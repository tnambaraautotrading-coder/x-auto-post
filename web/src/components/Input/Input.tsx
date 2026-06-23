import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** 入力欄の上に表示するラベル。 */
  label?: string;
  /** エラーメッセージ。指定すると枠が赤くなる。 */
  error?: string;
  /** 補助テキスト。 */
  hint?: string;
}

/** 1行テキスト入力。 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, id, className, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const describedBy = error
    ? `${inputId}-error`
    : hint
      ? `${inputId}-hint`
      : undefined;

  return (
    <div className="flex w-full flex-col gap-xs">
      {label && (
        <label
          htmlFor={inputId}
          className="text-caption font-medium text-content-strong"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "h-10 w-full rounded-md border bg-surface-0 px-md text-body text-content-strong",
          "placeholder:text-content-muted",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
          "disabled:cursor-not-allowed disabled:bg-surface-2 disabled:opacity-60",
          error ? "border-status-failed" : "border-line-strong",
          className,
        )}
        {...props}
      />
      {error ? (
        <span id={`${inputId}-error`} className="text-caption text-status-failed">
          {error}
        </span>
      ) : hint ? (
        <span id={`${inputId}-hint`} className="text-caption text-content-muted">
          {hint}
        </span>
      ) : null}
    </div>
  );
});
