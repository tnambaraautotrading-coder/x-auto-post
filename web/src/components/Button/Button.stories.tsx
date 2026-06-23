import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "投稿する" },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "danger"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: "primary" } };
export const Secondary: Story = {
  args: { variant: "secondary", children: "下書き保存" },
};
export const Ghost: Story = { args: { variant: "ghost", children: "キャンセル" } };
export const Danger: Story = { args: { variant: "danger", children: "削除" } };

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-md">
      <Button {...args} size="sm">
        小
      </Button>
      <Button {...args} size="md">
        中
      </Button>
      <Button {...args} size="lg">
        大
      </Button>
    </div>
  ),
};
