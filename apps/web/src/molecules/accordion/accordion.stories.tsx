import type { Meta, StoryObj } from "@storybook/react";
import { Title, Description, Primary, Controls, Stories } from "@storybook/blocks";
import { expect, userEvent, within } from "@storybook/test";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./accordion";
import { accordion as accordionContract } from "@ds/contracts";
import { ContractTokenTable } from "../../docs/ContractTokenTable";

type Story = StoryObj<typeof Accordion>;

const meta: Meta<typeof Accordion> = {
  title: "Molecules/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          accordionContract.description ?? "",
          "",
          "### Usage",
          accordionContract.usage?.summary ?? "",
          "",
          "**Do**",
          (accordionContract.usage?.do ?? []).map((d: string) => `- ${d}`).join("\n"),
          "",
          "**Don't**",
          (accordionContract.usage?.dont ?? []).map((d: string) => `- ${d}`).join("\n"),
          "",
          `**Contract version:** ${accordionContract.version ?? "—"} · **Status:** ${accordionContract.status ?? "—"}`,
        ].join("\n"),
      },
      page: () => (
        <>
          <Title />
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <ContractTokenTable tokens={accordionContract.tokens} />
        </>
      ),
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: accordionContract.props.type.values,
      description: accordionContract.props.type.description,
    },
    collapsible: {
      control: "boolean",
      description: accordionContract.props.collapsible.description,
    },
    orientation: {
      control: "inline-radio",
      options: accordionContract.props.orientation.values,
      description: accordionContract.props.orientation.description,
    },
    disabled: {
      control: "boolean",
      description: accordionContract.props.disabled.description,
    },
  },
};

export default meta;

const ExampleItems = () => (
  <>
    <AccordionItem value="item-1">
      <AccordionTrigger>Section one</AccordionTrigger>
      <AccordionContent>
        Content for section one. Keep this concise and scannable.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-2">
      <AccordionTrigger>Section two</AccordionTrigger>
      <AccordionContent>
        Content for section two. Use accordions for related, optional detail.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-3">
      <AccordionTrigger>Section three</AccordionTrigger>
      <AccordionContent>
        Content for section three. Prefer short paragraphs over long blocks of text.
      </AccordionContent>
    </AccordionItem>
  </>
);

const focusAndToggleFirstItem = async (
  canvasElement: HTMLElement,
  initiallyExpanded: boolean
) => {
  const canvas = within(canvasElement);
  const firstTrigger = canvas.getByRole("button", { name: /section one/i });

  await expect(firstTrigger).toBeInTheDocument();

  // Initial state should match the story's defaultValue configuration.
  await expect(firstTrigger).toHaveAttribute(
    "aria-expanded",
    initiallyExpanded ? "true" : "false"
  );

  // Tab to focus the first trigger
  await userEvent.tab();
  await expect(firstTrigger).toHaveFocus();

  // Toggle with Enter
  await userEvent.keyboard("{Enter}");
  await expect(firstTrigger).toHaveAttribute(
    "aria-expanded",
    initiallyExpanded ? "false" : "true"
  );

  // Toggle with Space
  await userEvent.keyboard(" ");
  await expect(firstTrigger).toHaveAttribute(
    "aria-expanded",
    initiallyExpanded ? "true" : "false"
  );
};

export const SingleNonCollapsible: Story = {
  name: "Single, Non-collapsible",
  args: {
    type: "single",
    collapsible: false,
    defaultValue: "item-1",
    orientation: "vertical",
  },
  render: (args) => (
    <Accordion {...args}>
      <ExampleItems />
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstTrigger = canvas.getByRole("button", { name: /section one/i });
    const secondTrigger = canvas.getByRole("button", { name: /section two/i });

    // Starts with item-1 expanded because defaultValue includes "item-1"
    await expect(firstTrigger).toHaveAttribute("aria-expanded", "true");
    await expect(secondTrigger).toHaveAttribute("aria-expanded", "false");

    // In non-collapsible single mode, clicking item-2 moves expansion from item-1 to item-2
    await userEvent.click(secondTrigger);
    await expect(firstTrigger).toHaveAttribute("aria-expanded", "false");
    await expect(secondTrigger).toHaveAttribute("aria-expanded", "true");
  },
};

export const SingleCollapsible: Story = {
  name: "Single, Collapsible",
  args: {
    type: "single",
    collapsible: true,
    defaultValue: "item-1",
    orientation: "vertical",
  },
  render: (args) => (
    <Accordion {...args}>
      <ExampleItems />
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    await focusAndToggleFirstItem(canvasElement, true);
  },
};

export const Multiple: Story = {
  name: "Multiple",
  args: {
    type: "multiple",
    defaultValue: ["item-1", "item-2"],
    orientation: "vertical",
  },
  render: (args) => (
    <Accordion {...args}>
      <ExampleItems />
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstTrigger = canvas.getByRole("button", { name: /section one/i });
    const secondTrigger = canvas.getByRole("button", { name: /section two/i });

    await expect(firstTrigger).toBeInTheDocument();
    await expect(secondTrigger).toBeInTheDocument();

    // First and second items should start expanded based on defaultValue.
    await expect(firstTrigger).toHaveAttribute("aria-expanded", "true");
    await expect(secondTrigger).toHaveAttribute("aria-expanded", "true");

    // Toggle second item closed, then open again.
    await userEvent.tab();
    await expect(firstTrigger).toHaveFocus();
    await userEvent.tab();
    await expect(secondTrigger).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(secondTrigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.keyboard("{Enter}");
    await expect(secondTrigger).toHaveAttribute("aria-expanded", "true");
  },
};

export const Disabled: Story = {
  name: "Disabled",
  args: {
    type: "single",
    collapsible: true,
    orientation: "vertical",
    disabled: true,
  },
  render: (args) => (
    <Accordion {...args}>
      <ExampleItems />
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstTrigger = canvas.getByRole("button", { name: /section one/i });
    await expect(firstTrigger).toHaveAttribute("data-disabled", "");
  },
};

export const AllCollapsed: Story = {
  name: "All Collapsed",
  args: {
    type: "single",
    collapsible: true,
    orientation: "vertical",
  },
  render: (args) => (
    <Accordion {...args}>
      <ExampleItems />
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstTrigger = canvas.getByRole("button", { name: /section one/i });
    await expect(firstTrigger).toHaveAttribute("aria-expanded", "false");
  },
};

export const WithIconInTrigger: Story = {
  name: "With Icon in Trigger",
  args: {
    type: "multiple",
    orientation: "vertical",
  },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <span role="img" aria-hidden="true" style={{ marginRight: 4 }}>
            ℹ️
          </span>
          Account settings
        </AccordionTrigger>
        <AccordionContent>
          Use accordions to hide optional or advanced settings that are not needed by most users.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Billing details</AccordionTrigger>
        <AccordionContent>
          Keep billing preferences and invoices grouped in a single accordion to reduce noise.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstTrigger = canvas.getByRole("button", { name: /account settings/i });

    await expect(firstTrigger).toBeInTheDocument();

    await userEvent.tab();
    await expect(firstTrigger).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    await expect(firstTrigger).toHaveAttribute("aria-expanded", "true");

    await userEvent.keyboard(" ");
    await expect(firstTrigger).toHaveAttribute("aria-expanded", "false");
  },
};

