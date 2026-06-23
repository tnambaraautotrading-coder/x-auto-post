import type { ReactNode } from "react";

export interface EmptyStateProps {
  /** 見出し。 */
  title: string;
  /** 補足説明。 */
  description?: string;
  /** アイコンや絵文字。 */
  icon?: ReactNode;
  /** アクションボタンなど。 */
  action?: ReactNode;
}

/** データが無いときのプレースホルダ。 */
export function EmptyState({
  title,
  description,
  icon = "📭",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-sm rounded-lg border border-dashed border-line-strong bg-surface-1 p-2xl text-center">
      <div className="text-display" aria-hidden>
        {icon}
      </div>
      <p className="text-title font-semibold text-content-strong">{title}</p>
      {description && (
        <p className="max-w-sm text-body text-content-muted">{description}</p>
      )}
      {action && <div className="mt-sm">{action}</div>}
    </div>
  );
}
