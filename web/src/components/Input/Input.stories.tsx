import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  args: { label: "投稿テキスト", placeholder: "本文を入力" },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithHint: Story = {
  args: { hint: "280 文字まで入力できます" },
};
export const WithError: Story = {
  args: { value: "", error: "本文は必須です" },
};
export const Disabled: Story = {
  args: { value: "編集できません", disabled: true },
};
