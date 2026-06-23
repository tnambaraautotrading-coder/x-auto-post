import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** 入力欄の上に表示するラベル。 */
  label?: string;
  /** エラーメッセージ。指定すると枠が赤くなる。 */
  error?: string;
  /** 補助テキスト。 */
  hint?: string;
}

/** 複数行テキスト入力。投稿本文の編集に使う。 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, hint, id, className, rows = 4, ...props }, ref) {
    const autoId = useId();
    const fieldId = id ?? autoId;
    const describedBy = error
      ? `${fieldId}-error`
      : hint
        ? `${fieldId}-hint`
        : undefined;

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
        <textarea
          ref={ref}
          id={fieldId}
          rows={rows}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "w-full resize-y rounded-md border bg-surface-0 px-md py-sm text-body leading-relaxed text-content-strong",
            "placeholder:text-content-muted",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
            "disabled:cursor-not-allowed disabled:bg-surface-2 disabled:opacity-60",
            error ? "border-status-failed" : "border-line-strong",
            className,
          )}
          {...props}
        />
        {error ? (
          <span id={`${fieldId}-error`} className="text-caption text-status-failed">
            {error}
          </span>
        ) : hint ? (
          <span id={`${fieldId}-hint`} className="text-caption text-content-muted">
            {hint}
          </span>
        ) : null}
      </div>
    );
  },
);
