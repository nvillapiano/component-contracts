import type { Preview } from "@storybook/react";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@ds/tokens/css";
import "@ds/tokens/reset";
import "../src/styles/global.css";

const preview: Preview = {
  decorators: [
    (Story) => {
      // Force all Inter weights to load
      const el = document.getElementById("font-preloader") || document.createElement("div");
      el.id = "font-preloader";
      el.style.cssText = "position:absolute;opacity:0;pointer-events:none;font-family:Inter";
      el.innerHTML = `
      <span style="font-weight:400">.</span>
      <span style="font-weight:500">.</span>
      <span style="font-weight:600">.</span>
      <span style="font-weight:700">.</span>
    `;
      document.body.appendChild(el);
      return Story();
    },
  ],
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