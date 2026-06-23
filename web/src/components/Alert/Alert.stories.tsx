import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./Alert";

const meta = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  args: { children: "スロット 1 の投稿が完了しました。" },
  argTypes: {
    tone: { control: "select", options: ["info", "success", "warning", "error"] },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = { args: { tone: "info", title: "お知らせ" } };
export const Success: Story = {
  args: { tone: "success", title: "投稿成功" },
};
export const Warning: Story = {
  args: {
    tone: "warning",
    title: "確認",
    children: "ログインセッションの有効期限が近づいています。",
  },
};
export const Error: Story = {
  args: {
    tone: "error",
    title: "投稿失敗",
    children: "ログインに失敗しました。認証情報を確認してください。",
  },
};
