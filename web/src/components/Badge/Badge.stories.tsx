import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: { status: "scheduled" },
  argTypes: {
    status: {
      control: "select",
      options: ["scheduled", "posted", "failed", "draft"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scheduled: Story = { args: { status: "scheduled" } };
export const Posted: Story = { args: { status: "posted" } };
export const Failed: Story = { args: { status: "failed" } };
export const Draft: Story = { args: { status: "draft" } };

export const All: Story = {
  render: () => (
    <div className="flex gap-sm">
      <Badge status="scheduled" />
      <Badge status="posted" />
      <Badge status="failed" />
      <Badge status="draft" />
    </div>
  ),
};
