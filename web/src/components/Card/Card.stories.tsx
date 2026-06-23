import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";
import { Button } from "../Button/Button";
import { Badge } from "../Badge/Badge";

const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  args: {
    title: "本日のサマリー",
    children: "投稿予定 8 件 / 投稿済み 5 件 / 失敗 0 件。",
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActionAndFooter: Story = {
  args: {
    action: <Badge status="posted" />,
    footer: <Button size="sm">詳細を見る</Button>,
  },
};
