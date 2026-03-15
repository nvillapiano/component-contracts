import type { Preview } from "@storybook/react";
import "@ds/tokens/css";

const preview: Preview = {
  parameters: {
    docs: {
      toc: true,
    },
    a11y: {
      config: {
        rules: [
          { id: "color-contrast", enabled: true },
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /date$/i,
      },
      expanded: true,
    },
  },
};

export default preview;