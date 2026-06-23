import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export type AlertTone = "info" | "success" | "warning" | "error";

export interface AlertProps {
  /** 種別。色とアイコンを決める。 */
  tone?: AlertTone;
  /** 見出し。 */
  title?: string;
  children: ReactNode;
}

const toneStyle: Record<
  AlertTone,
  { className: string; icon: string }
> = {
  info: { className: "border-status-scheduled bg-status-scheduled/10", icon: "ℹ" },
  success: { className: "border-status-posted bg-status-posted/10", icon: "✓" },
  warning: { className: "border-market-flat bg-market-flat/10", icon: "!" },
  error: { className: "border-status-failed bg-status-failed/10", icon: "✕" },
};

/** 状態通知のバナー（投稿成功・失敗など）。 */
export function Alert({ tone = "info", title, children }: AlertProps) {
  const { className, icon } = toneStyle[tone];
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex w-full items-start gap-sm rounded-md border-l-4 p-md text-body text-content-strong",
        className,
      )}
    >
      <span className="mt-0.5 font-bold" aria-hidden>
        {icon}
      </span>
      <div className="flex flex-col gap-xs">
        {title && <span className="font-semibold">{title}</span>}
        <span className="text-content">{children}</span>
      </div>
    </div>
  );
}
