import { cn } from "../../lib/cn";

export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps {
  size?: SpinnerSize;
  /** スクリーンリーダー向けのラベル。 */
  label?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-9 w-9 border-[3px]",
};

/** 読み込み中インジケータ。 */
export function Spinner({ size = "md", label = "読み込み中" }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        "inline-block animate-spin rounded-pill border-line-strong border-t-accent",
        sizeClasses[size],
      )}
    />
  );
}
