import type { Meta, StoryObj } from "@storybook/web-components";

const meta = {
  title: "Components/Button",
  tags: ["autodocs"],
  render: (args: any) => {
    const el = document.createElement("ds-button");
    Object.entries(args).forEach(([key, value]) => {
      if (value !== undefined && value !== false) {
        if (key === "iconStart" || key === "iconEnd") {
          // Skip icon slots in basic render
          return;
        }
        el.setAttribute(
          key.replace(/([A-Z])/g, "-$1").toLowerCase(),
          value === true ? "" : String(value)
        );
      }
    });
    return el;
  },
  argTypes: {
    label: { control: "text" },
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "destructive"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    iconOnly: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Primary variant
export const Primary: Story = {
  args: {
    label: "Continue",
    variant: "primary",
    size: "md",
  },
};

export const PrimarySmall: Story = {
  args: {
    label: "Continue",
    variant: "primary",
    size: "sm",
  },
};

export const PrimaryLarge: Story = {
  args: {
    label: "Continue",
    variant: "primary",
    size: "lg",
  },
};

// Secondary variant
export const Secondary: Story = {
  args: {
    label: "Cancel",
    variant: "secondary",
    size: "md",
  },
};

export const SecondarySmall: Story = {
  args: {
    label: "Cancel",
    variant: "secondary",
    size: "sm",
  },
};

export const SecondaryLarge: Story = {
  args: {
    label: "Cancel",
    variant: "secondary",
    size: "lg",
  },
};

// Ghost variant
export const Ghost: Story = {
  args: {
    label: "More options",
    variant: "ghost",
    size: "md",
  },
};

export const GhostSmall: Story = {
  args: {
    label: "More options",
    variant: "ghost",
    size: "sm",
  },
};

export const GhostLarge: Story = {
  args: {
    label: "More options",
    variant: "ghost",
    size: "lg",
  },
};

// Destructive variant
export const Destructive: Story = {
  args: {
    label: "Delete",
    variant: "destructive",
    size: "md",
  },
};

export const DestructiveSmall: Story = {
  args: {
    label: "Delete",
    variant: "destructive",
    size: "sm",
  },
};

export const DestructiveLarge: Story = {
  args: {
    label: "Delete",
    variant: "destructive",
    size: "lg",
  },
};

// States
export const Disabled: Story = {
  args: {
    label: "Disabled",
    variant: "primary",
    size: "md",
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    label: "Saving...",
    variant: "primary",
    size: "md",
    loading: true,
  },
};

export const FullWidth: Story = {
  args: {
    label: "Full width button",
    variant: "primary",
    size: "md",
    fullWidth: true,
  },
};

// All variants side-by-side
export const AllVariants: Story = {
  render: () => {
    const container = document.createElement("div");
    container.style.cssText = "display: flex; gap: var(--ds-space-md); flex-wrap: wrap;";

    const variants = ["primary", "secondary", "ghost", "destructive"];
    const sizes = ["sm", "md", "lg"];

    for (const variant of variants) {
      for (const size of sizes) {
        const button = document.createElement("ds-button");
        button.setAttribute("label", `${variant}`);
        button.setAttribute("variant", variant);
        button.setAttribute("size", size);
        container.appendChild(button);
      }
    }

    return container;
  },
};
