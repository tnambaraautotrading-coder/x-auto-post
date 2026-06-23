import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./Tooltip";
import { Button } from "../Button/Button";

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  args: { content: "このスロットを今すぐ投稿します", placement: "top", children: null },
  argTypes: { placement: { control: "select", options: ["top", "bottom"] } },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="p-2xl">
      <Tooltip {...args}>
        <Button size="sm">今すぐ投稿</Button>
      </Tooltip>
    </div>
  ),
};
