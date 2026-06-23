import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "../Button/Button";
import { Textarea } from "../Textarea/Textarea";

const meta = {
  title: "Components/Modal",
  component: Modal,
  tags: ["autodocs"],
  args: {
    open: true,
    title: "投稿を編集",
    onClose: () => {},
    children: "ここに投稿編集フォームが入ります。",
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "ここに投稿編集フォームが入ります。",
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>編集を開く</Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                キャンセル
              </Button>
              <Button onClick={() => setOpen(false)}>保存</Button>
            </>
          }
        >
          <Textarea
            label="投稿本文"
            defaultValue="お昼の市場レポートです。午前中の値動きを振り返ります。"
          />
        </Modal>
      </>
    );
  },
};
