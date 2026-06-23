import type { Meta, StoryObj } from "@storybook/react";
import { PostCard } from "./PostCard";

const meta = {
  title: "Components/PostCard",
  component: PostCard,
  tags: ["autodocs"],
  args: {
    slot: 1,
    timeJst: "09:00",
    text: "おはようございます！南原たつきです。今日もマーケット情報をお届けします！",
    status: "scheduled",
  },
  argTypes: {
    status: {
      control: "select",
      options: ["scheduled", "posted", "failed", "draft"],
    },
    trend: { control: "select", options: ["up", "down", "flat", undefined] },
  },
} satisfies Meta<typeof PostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scheduled: Story = {};

export const Posted: Story = {
  args: {
    slot: 7,
    timeJst: "21:00",
    status: "posted",
    text: "NY市場の動向です。今夜の注目指標とトレンドをチェックします。",
    trend: "up",
    indicator: "ダウ平均 +0.8%",
  },
};

export const Failed: Story = {
  args: {
    slot: 4,
    timeJst: "15:00",
    status: "failed",
    text: "午後のマーケット情報です。東京市場の引け後の動きに注目です。",
    trend: "down",
    indicator: "日経平均 -1.2%",
  },
};
