import type { Meta, StoryObj } from "@storybook/react";
import { expect, within, userEvent } from "@storybook/test";
import { Button } from "./button";
import { button as buttonContract } from "@ds/contracts";

// ─── Meta ─────────────────────────────────────────────────────────────────────
// Contract metadata drives the docs page — description, do/dont, related components
// are all sourced from the contract, never written by hand here.

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          buttonContract.description ?? "",
          "",
          "### Usage",
          buttonContract.usage?.summary ?? "",
          "",
          "**Do**",
          (buttonContract.usage?.do ?? []).map((d) => `- ${d}`).join("\n"),
          "",
          "**Don't**",
          (buttonContract.usage?.dont ?? []).map((d) => `- ${d}`).join("\n"),
          "",
          `**Contract version:** ${buttonContract.version ?? "—"} · **Status:** ${buttonContract.status ?? "—"}`,
        ].join("\n"),
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: buttonContract.props.variant.values,
      description: buttonContract.props.variant.description,
    },
    size: {
      control: "select",
      options: buttonContract.props.size.values,
      description: buttonContract.props.size.description,
    },
    label: {
      control: "text",
      description: buttonContract.props.label.description,
    },
    loading: {
      control: "boolean",
      description: buttonContract.props.loading.description,
    },
    disabled: {
      control: "boolean",
    },
    iconOnly: {
      control: "boolean",
      description: buttonContract.props.iconOnly.description,
    },
    fullWidth: {
      control: "boolean",
      description: buttonContract.props.fullWidth.description,
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stories — mirror contract variants 1:1 ──────────────────────────────────

export const Primary: Story = {
  args: {
    variant: "primary",
    size: "md",
    label: "Continue",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Continue" });
    await expect(button).toBeInTheDocument();
    await expect(button).not.toBeDisabled();
    await userEvent.click(button);
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    size: "md",
    label: "Cancel",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    size: "md",
    label: "More options",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    size: "md",
    label: "Delete",
  },
  parameters: {
    docs: {
      description: {
        story: "For irreversible actions. Always pair with a confirmation step.",
      },
    },
  },
};

export const Loading: Story = {
  args: {
    variant: "primary",
    size: "md",
    label: "Saving",
    loading: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute("aria-busy", "true");
  },
};

export const Disabled: Story = {
  args: {
    variant: "primary",
    size: "md",
    label: "Continue",
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Continue" });
    await expect(button).toBeDisabled();
  },
};

export const IconOnly: Story = {
  args: {
    variant: "ghost",
    size: "md",
    iconOnly: true,
    label: "Close",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Label becomes aria-label when iconOnly is true
    const button = canvas.getByRole("button", { name: "Close" });
    await expect(button).toBeInTheDocument();
  },
};

export const FullWidth: Story = {
  args: {
    variant: "primary",
    size: "md",
    label: "Get started",
    fullWidth: true,
  },
};

// ─── Size scale ───────────────────────────────────────────────────────────────

export const SizeScale: Story = {
  args: {
    label: "Medium",
    variant: "primary",
    size: "md",
  },
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <Button variant="primary" size="sm" label="Small" />
      <Button variant="primary" size="md" label="Medium" />
      <Button variant="primary" size="lg" label="Large" />
    </div>
  ),
};

// ─── All variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  args: {
    label: "Primary",
    variant: "primary",
    size: "md",
  },
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <Button variant="primary"     label="Primary" />
      <Button variant="secondary"   label="Secondary" />
      <Button variant="ghost"       label="Ghost" />
      <Button variant="destructive" label="Destructive" />
    </div>
  ),
};
