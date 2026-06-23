import { cn } from "../../lib/cn";
import { Avatar } from "../Avatar/Avatar";
import { Badge, type PostStatus } from "../Badge/Badge";

export type MarketTrend = "up" | "down" | "flat";

export interface PostCardProps {
  /** スロット番号 (1-8)。 */
  slot: number;
  /** 投稿予定時刻 (JST 表記, 例 "09:00")。 */
  timeJst: string;
  /** 投稿本文。 */
  text: string;
  /** 投稿ステータス。 */
  status?: PostStatus;
  /** 投稿者の表示名。 */
  authorName?: string;
  /** 市場の方向。指標バッジの色に反映。 */
  trend?: MarketTrend;
  /** 指標ラベル（例 "日経平均 +1.2%"）。 */
  indicator?: string;
}

const trendStyle: Record<MarketTrend, { className: string; arrow: string }> = {
  up: { className: "text-market-up", arrow: "▲" },
  down: { className: "text-market-down", arrow: "▼" },
  flat: { className: "text-market-flat", arrow: "—" },
};

/**
 * マーケットレポート投稿カード。
 * 1件の予約投稿（スロット）をブランド統一された見た目で表示する。
 */
export function PostCard({
  slot,
  timeJst,
  text,
  status = "scheduled",
  authorName = "南原たつき",
  trend,
  indicator,
}: PostCardProps) {
  return (
    <article className="flex w-full max-w-md flex-col gap-md rounded-lg border border-line bg-surface-0 p-lg shadow-card">
      <header className="flex items-center justify-between gap-sm">
        <div className="flex items-center gap-sm">
          <Avatar name={authorName} size="md" />
          <div className="flex flex-col">
            <span className="text-body font-semibold text-content-strong">
              {authorName}
            </span>
            <span className="text-caption text-content-muted">
              スロット {slot} ・ {timeJst} JST
            </span>
          </div>
        </div>
        <Badge status={status} />
      </header>

      <p className="text-body leading-relaxed text-content">{text}</p>

      {indicator && trend && (
        <footer className="flex items-center gap-xs border-t border-line pt-md">
          <span className={cn("text-body font-semibold", trendStyle[trend].className)}>
            {trendStyle[trend].arrow} {indicator}
          </span>
        </footer>
      )}
    </article>
  );
}
