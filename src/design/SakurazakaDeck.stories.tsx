import type { Meta, StoryObj } from "@storybook/react-vite";
import { SakurazakaDeck } from "./SakurazakaDeck";

const meta = {
  title: "x-auto-post/SakurazakaDeck",
  component: SakurazakaDeck,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "charcoal"
    },
    docs: {
      description: {
        component: "Claude Design canvas for the 桜坂の経営者 sponsor pitch deck."
      }
    }
  },
  args: {
    variant: "deck"
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "deck",
        "cover",
        "problem",
        "solution",
        "visual",
        "cast",
        "record",
        "format",
        "audience",
        "difference",
        "revenue",
        "benefit",
        "roadmap",
        "risk",
        "ask",
        "faq",
        "closing"
      ]
    }
  }
} satisfies Meta<typeof SakurazakaDeck>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FullDeck: Story = {};

export const Cover: Story = {
  args: {
    variant: "cover"
  }
};

export const SponsorPitch: Story = {
  args: {
    variant: "benefit"
  }
};

export const Roadmap: Story = {
  args: {
    variant: "roadmap"
  }
};
