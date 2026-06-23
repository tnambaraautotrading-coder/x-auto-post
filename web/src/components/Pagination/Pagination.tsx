import { cn } from "../../lib/cn";

export interface PaginationProps {
  /** 現在のページ（1始まり）。 */
  page: number;
  /** 総ページ数。 */
  totalPages: number;
  /** ページ変更時のコールバック。 */
  onChange: (page: number) => void;
}

/** ページ送り。投稿履歴の一覧などに使う。 */
export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <nav
      aria-label="ページ送り"
      className="flex items-center justify-center gap-sm"
    >
      <button
        type="button"
        disabled={!canPrev}
        onClick={() => onChange(page - 1)}
        className={cn(
          "h-8 rounded-md border border-line-strong px-md text-caption text-content-strong",
          "hover:bg-surface-1 disabled:cursor-not-allowed disabled:opacity-40",
        )}
      >
        前へ
      </button>
      <span className="text-caption text-content-muted">
        {page} / {totalPages}
      </span>
      <button
        type="button"
        disabled={!canNext}
        onClick={() => onChange(page + 1)}
        className={cn(
          "h-8 rounded-md border border-line-strong px-md text-caption text-content-strong",
          "hover:bg-surface-1 disabled:cursor-not-allowed disabled:opacity-40",
        )}
      >
        次へ
      </button>
    </nav>
  );
}
