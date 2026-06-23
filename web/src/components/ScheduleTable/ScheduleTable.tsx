import { Badge, type PostStatus } from "../Badge/Badge";

export interface ScheduleSlot {
  slot: number;
  timeJst: string;
  text: string;
  status: PostStatus;
}

export interface ScheduleTableProps {
  /** 表示する投稿スロットの配列。 */
  slots: ScheduleSlot[];
  /** 行クリック時のハンドラ。 */
  onSelect?: (slot: ScheduleSlot) => void;
}

/** 1日の投稿スケジュール（複数スロット）を一覧表示するテーブル。 */
export function ScheduleTable({ slots, onSelect }: ScheduleTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-line bg-surface-0 shadow-card">
      <table className="w-full border-collapse text-body">
        <thead>
          <tr className="border-b border-line bg-surface-1 text-left text-caption text-content-muted">
            <th className="px-lg py-md font-medium">時刻 (JST)</th>
            <th className="px-lg py-md font-medium">本文</th>
            <th className="px-lg py-md font-medium">状態</th>
          </tr>
        </thead>
        <tbody>
          {slots.map((s) => (
            <tr
              key={s.slot}
              onClick={() => onSelect?.(s)}
              className="cursor-pointer border-b border-line last:border-b-0 transition-colors hover:bg-surface-1"
            >
              <td className="whitespace-nowrap px-lg py-md font-semibold text-content-strong">
                {s.timeJst}
              </td>
              <td className="px-lg py-md text-content">
                <span className="line-clamp-1">{s.text}</span>
              </td>
              <td className="px-lg py-md">
                <Badge status={s.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
