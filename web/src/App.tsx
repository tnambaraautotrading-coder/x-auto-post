import { Button } from "./components/Button";
import { PostCard } from "./components/PostCard";
import { ScheduleTable, type ScheduleSlot } from "./components/ScheduleTable";

const slots: ScheduleSlot[] = [
  { slot: 1, timeJst: "09:00", text: "おはようございます！南原たつきです。今日もマーケット情報をお届けします！", status: "posted" },
  { slot: 2, timeJst: "11:00", text: "午前のマーケット動向をチェック中です。", status: "posted" },
  { slot: 3, timeJst: "13:00", text: "お昼の市場レポートです。午前中の値動きを振り返ります。", status: "scheduled" },
  { slot: 4, timeJst: "15:00", text: "午後のマーケット情報です。東京市場の引け後の動きに注目です。", status: "scheduled" },
];

/** 投稿管理ダッシュボードのデモ画面。コンポーネントの組み合わせ例。 */
export function App() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-xl p-xl">
      <header className="flex items-center justify-between">
        <h1 className="text-display font-bold text-content-strong">
          投稿管理ダッシュボード
        </h1>
        <Button>新規投稿</Button>
      </header>

      <section className="flex flex-col gap-md">
        <h2 className="text-title font-semibold text-content-strong">本日の予定</h2>
        <ScheduleTable slots={slots} />
      </section>

      <section className="flex flex-col gap-md">
        <h2 className="text-title font-semibold text-content-strong">プレビュー</h2>
        <PostCard
          slot={7}
          timeJst="21:00"
          status="scheduled"
          text="NY市場の動向です。今夜の注目指標とトレンドをチェックします。"
          trend="up"
          indicator="ダウ平均 +0.8%"
        />
      </section>
    </main>
  );
}
