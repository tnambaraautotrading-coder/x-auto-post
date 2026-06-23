import type { Meta, StoryObj } from "@storybook/react";
import { ScheduleTable } from "./ScheduleTable";

const meta = {
  title: "Components/ScheduleTable",
  component: ScheduleTable,
  tags: ["autodocs"],
} satisfies Meta<typeof ScheduleTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    slots: [
      {
        slot: 1,
        timeJst: "09:00",
        text: "おはようございます！南原たつきです。今日もマーケット情報をお届けします！",
        status: "posted",
      },
      {
        slot: 2,
        timeJst: "11:00",
        text: "午前のマーケット動向をチェック中です。",
        status: "posted",
      },
      {
        slot: 3,
        timeJst: "13:00",
        text: "お昼の市場レポートです。午前中の値動きを振り返ります。",
        status: "scheduled",
      },
      {
        slot: 4,
        timeJst: "15:00",
        text: "午後のマーケット情報です。東京市場の引け後の動きに注目です。",
        status: "scheduled",
      },
      {
        slot: 5,
        timeJst: "17:00",
        text: "夕方のマーケットまとめです。本日の注目ポイントを整理します。",
        status: "failed",
      },
    ],
  },
};
