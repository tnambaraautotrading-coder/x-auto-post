import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface CardProps {
  /** ヘッダーに表示するタイトル。 */
  title?: string;
  /** ヘッダー右側のアクション領域。 */
  action?: ReactNode;
  /** フッター領域。 */
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** 汎用カードコンテナ。任意の内容をブランド統一された面に収める。 */
export function Card({ title, action, footer, children, className }: CardProps) {
  return (
    <section
      className={cn(
        "flex w-full flex-col rounded-lg border border-line bg-surface-0 shadow-card",
        className,
      )}
    >
      {(title || action) && (
        <header className="flex items-center justify-between gap-sm border-b border-line px-lg py-md">
          {title && (
            <h3 className="text-title font-semibold text-content-strong">
              {title}
            </h3>
          )}
          {action}
        </header>
      )}
      <div className="px-lg py-md text-body text-content">{children}</div>
      {footer && (
        <footer className="border-t border-line px-lg py-md">{footer}</footer>
      )}
    </section>
  );
}
