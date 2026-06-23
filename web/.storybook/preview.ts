import type { Preview } from "@storybook/react";
import "../src/styles/global.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "surface-1",
      values: [
        { name: "surface-0", value: "#ffffff" },
        { name: "surface-1", value: "#f6f8fb" },
        { name: "brand", value: "#0b1f3a" },
      ],
    },
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
  },
};

export default preview;
