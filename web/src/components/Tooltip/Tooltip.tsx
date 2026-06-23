import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export type TooltipPlacement = "top" | "bottom";

export interface TooltipProps {
  /** ツールチップに表示する文言。 */
  content: string;
  /** 表示位置。 */
  placement?: TooltipPlacement;
  /** ホバー対象。 */
  children: ReactNode;
}

/** ホバー/フォーカスで補足説明を表示するツールチップ（CSS のみ）。 */
export function Tooltip({ content, placement = "top", children }: TooltipProps) {
  return (
    <span className="group relative inline-flex">
      <span tabIndex={0} className="inline-flex outline-none">
        {children}
      </span>
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-sm bg-surface-inverse px-sm py-xs text-caption text-content-inverse opacity-0 shadow-card transition-opacity",
          "group-hover:opacity-100 group-focus-within:opacity-100",
          placement === "top" ? "bottom-full mb-xs" : "top-full mt-xs",
        )}
      >
        {content}
      </span>
    </span>
  );
}
