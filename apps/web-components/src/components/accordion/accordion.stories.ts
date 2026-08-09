import type { Meta, StoryObj } from "@storybook/web-components";

const meta = {
  title: "Components/Accordion",
  tags: ["autodocs"],
  render: (args: any) => {
    const container = document.createElement("div");
    const accordion = document.createElement("ds-accordion");

    if (args.type) accordion.setAttribute("type", args.type);
    if (args.collapsible) accordion.setAttribute("collapsible", "");
    if (args.defaultValue) accordion.setAttribute("default-value", args.defaultValue);
    if (args.disabled) accordion.setAttribute("disabled", "");

    // Create items
    const itemCount = args.itemCount || 3;
    for (let i = 1; i <= itemCount; i++) {
      const item = document.createElement("ds-accordion-item");
      item.setAttribute("value", `item-${i}`);

      const trigger = document.createElement("ds-accordion-trigger");
      trigger.textContent = `Section ${i}`;

      const content = document.createElement("ds-accordion-content");
      content.textContent = `Content for section ${i}. This is a sample accordion content that demonstrates the expandable/collapsible behavior.`;

      item.appendChild(trigger);
      item.appendChild(content);
      accordion.appendChild(item);
    }

    container.appendChild(accordion);
    return container;
  },
  argTypes: {
    type: {
      control: "select",
      options: ["single", "multiple"],
    },
    collapsible: { control: "boolean" },
    defaultValue: { control: "text" },
    disabled: { control: "boolean" },
    itemCount: { control: { type: "number", min: 1, max: 5 } },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Single - collapsible (default)
export const SingleCollapsible: Story = {
  args: {
    type: "single",
    collapsible: true,
    itemCount: 3,
  },
};

// Single - non-collapsible
export const SingleNonCollapsible: Story = {
  args: {
    type: "single",
    collapsible: false,
    itemCount: 3,
  },
};

// Multiple
export const Multiple: Story = {
  args: {
    type: "multiple",
    itemCount: 3,
  },
};

// With default value
export const WithDefaultValue: Story = {
  args: {
    type: "single",
    collapsible: true,
    defaultValue: "item-2",
    itemCount: 3,
  },
};

// Disabled
export const Disabled: Story = {
  args: {
    type: "single",
    disabled: true,
    itemCount: 2,
  },
};

// Multiple items
export const ManyItems: Story = {
  args: {
    type: "multiple",
    collapsible: true,
    itemCount: 5,
  },
};

// Compact form (small items)
export const Compact: Story = {
  args: {
    type: "single",
    collapsible: true,
    itemCount: 3,
  },
  render: (args) => {
    const container = document.createElement("div");
    container.style.cssText = "max-width: 400px;";

    const accordion = document.createElement("ds-accordion");
    if (args.type) accordion.setAttribute("type", args.type);
    if (args.collapsible) accordion.setAttribute("collapsible", "");

    for (let i = 1; i <= (args.itemCount || 3); i++) {
      const item = document.createElement("ds-accordion-item");
      item.setAttribute("value", `item-${i}`);

      const trigger = document.createElement("ds-accordion-trigger");
      trigger.textContent = `Item ${i}`;

      const content = document.createElement("ds-accordion-content");
      content.textContent = `Quick content ${i}.`;

      item.appendChild(trigger);
      item.appendChild(content);
      accordion.appendChild(item);
    }

    container.appendChild(accordion);
    return container;
  },
};

// All variants
export const AllTypes: Story = {
  render: () => {
    const container = document.createElement("div");
    container.style.cssText = "display: flex; flex-direction: column; gap: var(--ds-space-lg);";

    // Single - collapsible
    const section1 = document.createElement("div");
    const label1 = document.createElement("h3");
    label1.textContent = "Single (Collapsible)";
    label1.style.cssText = "margin: 0 0 var(--ds-space-sm) 0; font-size: var(--ds-text-size-md);";
    section1.appendChild(label1);

    const accordion1 = document.createElement("ds-accordion");
    accordion1.setAttribute("type", "single");
    accordion1.setAttribute("collapsible", "");
    for (let i = 1; i <= 2; i++) {
      const item = document.createElement("ds-accordion-item");
      item.setAttribute("value", `single-${i}`);
      const trigger = document.createElement("ds-accordion-trigger");
      trigger.textContent = `Section ${i}`;
      const content = document.createElement("ds-accordion-content");
      content.textContent = `Content ${i}`;
      item.appendChild(trigger);
      item.appendChild(content);
      accordion1.appendChild(item);
    }
    section1.appendChild(accordion1);
    container.appendChild(section1);

    // Multiple
    const section2 = document.createElement("div");
    const label2 = document.createElement("h3");
    label2.textContent = "Multiple";
    label2.style.cssText = "margin: 0 0 var(--ds-space-sm) 0; font-size: var(--ds-text-size-md);";
    section2.appendChild(label2);

    const accordion2 = document.createElement("ds-accordion");
    accordion2.setAttribute("type", "multiple");
    for (let i = 1; i <= 2; i++) {
      const item = document.createElement("ds-accordion-item");
      item.setAttribute("value", `multiple-${i}`);
      const trigger = document.createElement("ds-accordion-trigger");
      trigger.textContent = `Section ${i}`;
      const content = document.createElement("ds-accordion-content");
      content.textContent = `Content ${i}`;
      item.appendChild(trigger);
      item.appendChild(content);
      accordion2.appendChild(item);
    }
    section2.appendChild(accordion2);
    container.appendChild(section2);

    return container;
  },
};
