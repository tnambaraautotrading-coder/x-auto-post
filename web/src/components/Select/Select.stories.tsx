import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";

const meta = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  args: {
    label: "投稿スロット",
    options: [
      { value: "1", label: "スロット 1 ・ 09:00" },
      { value: "2", label: "スロット 2 ・ 11:00" },
      { value: "3", label: "スロット 3 ・ 13:00" },
      { value: "4", label: "スロット 4 ・ 15:00" },
    ],
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithError: Story = {
  args: { error: "スロットを選択してください" },
};
