import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./Textarea";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  args: {
    label: "投稿本文",
    placeholder: "マーケット情報を入力…",
    defaultValue:
      "お昼の市場レポートです。午前中の値動きを振り返ります。",
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithHint: Story = {
  args: { hint: "改行で複数行に対応します" },
};
export const WithError: Story = {
  args: { defaultValue: "", error: "本文は必須です" },
};
