import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Button } from "../Button/Button";

export interface ModalProps {
  /** 開閉状態。 */
  open: boolean;
  /** 閉じる要求（オーバーレイクリック・閉じるボタン）。 */
  onClose: () => void;
  /** タイトル。 */
  title: string;
  children: ReactNode;
  /** フッターのアクション領域。未指定なら「閉じる」ボタンのみ。 */
  footer?: ReactNode;
}

/** モーダルダイアログ。投稿の編集フォームなどに使う。 */
export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-strong/50 p-lg"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "flex w-full max-w-lg flex-col gap-lg rounded-lg bg-surface-0 p-xl shadow-card",
        )}
      >
        <header className="flex items-center justify-between gap-sm">
          <h2 className="text-title font-semibold text-content-strong">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="rounded-sm px-sm text-content-muted hover:bg-surface-2"
          >
            ✕
          </button>
        </header>

        <div className="text-body text-content">{children}</div>

        <footer className="flex justify-end gap-sm">
          {footer ?? (
            <Button variant="secondary" onClick={onClose}>
              閉じる
            </Button>
          )}
        </footer>
      </div>
    </div>
  );
}
