import type { Meta, StoryObj } from "@storybook/react-vite";
import { PostCard } from "./PostCard";

const meta = {
  title: "x-auto-post/PostCard",
  component: PostCard,
  parameters: {
    docs: {
      description: {
        component: "A reusable visual card for previewing X post candidates before scheduling."
      }
    }
  }
} satisfies Meta<typeof PostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ExecutiveMemo: Story = {};

export const MarketSignal: Story = {
  args: {
    tone: "signal",
    headline: "伸びる会社ほど、撤退ラインを先に決めている",
    body: "勢いで進む時ほど、やめる基準を先に置く。これは弱気ではなく、次の勝負へ資金と人を残すための設計です。",
    metricLabel: "Experiment",
    metricValue: "Signal Post"
  }
};

export const Priority: Story = {
  args: {
    tone: "urgent",
    headline: "組織の詰まりは、売上より先に会議へ出る",
    body: "誰も反対しない会議ほど危ない。違和感が出ない組織は、現場の失敗を上へ届ける管が詰まっています。",
    metricLabel: "Action",
    metricValue: "Rewrite Candidate"
  }
};
