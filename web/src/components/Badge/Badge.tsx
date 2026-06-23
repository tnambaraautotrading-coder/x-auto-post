import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export type PostStatus = "scheduled" | "posted" | "failed" | "draft";

export interface BadgeProps {
  /** 投稿ステータス。色と既定ラベルを決める。 */
  status: PostStatus;
  /** ラベルを上書きしたい場合に指定。 */
  children?: ReactNode;
}

const statusStyle: Record<PostStatus, { label: string; className: string }> = {
  scheduled: {
    label: "予約済み",
    className: "bg-status-scheduled/10 text-status-scheduled",
  },
  posted: {
    label: "投稿済み",
    className: "bg-status-posted/10 text-status-posted",
  },
  failed: { label: "失敗", className: "bg-status-failed/10 text-status-failed" },
  draft: { label: "下書き", className: "bg-status-draft/10 text-status-draft" },
};

/** 投稿ステータスを表すバッジ。 */
export function Badge({ status, children }: BadgeProps) {
  const { label, className } = statusStyle[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-md py-xs text-caption font-medium",
        className,
      )}
    >
      <span
        className="mr-xs inline-block h-1.5 w-1.5 rounded-pill bg-current"
        aria-hidden
      />
      {children ?? label}
    </span>
  );
}
