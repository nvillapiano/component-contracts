import type { Preview } from "@storybook/web-components";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@ds/tokens/css";
import "@ds/tokens/reset";
import "@ds/web-components";

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
