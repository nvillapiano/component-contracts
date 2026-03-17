import * as RadixAccordion from "@radix-ui/react-accordion";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { ChevronDown } from "lucide-react";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ReactNode,
} from "react";
import "./accordion.css";

// ─── Variants ────────────────────────────────────────────────────────────────
// Mirrors the state and structure defined in accordion.contract.json.

const accordionItemVariants = cva("ds-accordion__item", {
  variants: {
    disabled: {
      true: "ds-accordion__item--disabled",
    },
  },
});

const accordionTriggerVariants = cva("ds-accordion__trigger", {
  variants: {
    disabled: {
      true: "ds-accordion__trigger--disabled",
    },
  },
});

type AccordionItemVariantProps = VariantProps<typeof accordionItemVariants>;
type AccordionTriggerVariantProps = VariantProps<typeof accordionTriggerVariants>;

// ─── Types ───────────────────────────────────────────────────────────────────

type BaseAccordionProps = {
  /** Orientation for keyboard navigation. */
  orientation?: "vertical" | "horizontal";
  /** Disables all interaction with the accordion. */
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
};

type SingleAccordionProps = BaseAccordionProps & {
  type?: "single";
  /** When true in single mode, the open item can be collapsed so that no items are expanded. */
  collapsible?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

type MultipleAccordionProps = BaseAccordionProps & {
  type: "multiple";
  /** Not supported in multiple mode. */
  collapsible?: never;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

export type AccordionProps = (SingleAccordionProps | MultipleAccordionProps) &
  Omit<ComponentPropsWithoutRef<typeof RadixAccordion.Root>, "type" | "onValueChange" | "value" | "defaultValue" | "orientation" | "disabled">;

export type AccordionItemProps = ComponentPropsWithoutRef<typeof RadixAccordion.Item> &
  AccordionItemVariantProps;

export type AccordionTriggerProps = ComponentPropsWithoutRef<typeof RadixAccordion.Trigger> &
  AccordionTriggerVariantProps;

export type AccordionContentProps = ComponentPropsWithoutRef<typeof RadixAccordion.Content>;

// ─── Components ──────────────────────────────────────────────────────────────

export const Accordion = forwardRef<ElementRef<typeof RadixAccordion.Root>, AccordionProps>(
  (
    {
      type = "single",
      collapsible,
      value,
      defaultValue,
      onValueChange,
      disabled,
      orientation = "vertical",
      className,
      children,
      ...rest
    },
    ref
  ) => {
    return (
      <RadixAccordion.Root
        ref={ref}
        type={type}
        collapsible={type === "single" ? collapsible : undefined}
        value={value as never}
        defaultValue={defaultValue as never}
        onValueChange={onValueChange as never}
        disabled={disabled}
        orientation={orientation}
        className={clsx("ds-accordion", className)}
        {...rest}
      >
        {children}
      </RadixAccordion.Root>
    );
  }
);

Accordion.displayName = "Accordion";

export const AccordionItem = forwardRef<
  ElementRef<typeof RadixAccordion.Item>,
  AccordionItemProps
>(({ className, disabled, ...props }, ref) => {
  return (
    <RadixAccordion.Item
      ref={ref}
      className={accordionItemVariants({ disabled, className })}
      disabled={disabled}
      {...props}
    />
  );
});

AccordionItem.displayName = "AccordionItem";

export const AccordionTrigger = forwardRef<
  ElementRef<typeof RadixAccordion.Trigger>,
  AccordionTriggerProps
>(({ className, disabled, children, ...props }, ref) => {
  return (
    <RadixAccordion.Header className="ds-accordion__header">
      <RadixAccordion.Trigger
        ref={ref}
        className={accordionTriggerVariants({ disabled, className })}
        disabled={disabled}
        {...props}
      >
        <span className="ds-accordion__label">{children}</span>
        <span className="ds-accordion__icon" aria-hidden="true">
          <ChevronDown size={16} />
        </span>
      </RadixAccordion.Trigger>
    </RadixAccordion.Header>
  );
});

AccordionTrigger.displayName = "AccordionTrigger";

export const AccordionContent = forwardRef<
  ElementRef<typeof RadixAccordion.Content>,
  AccordionContentProps
>(({ className, children, ...props }, ref) => {
  return (
    <RadixAccordion.Content
      ref={ref}
      className={clsx("ds-accordion__content", className)}
      {...props}
    >
      <div className="ds-accordion__content-inner">{children}</div>
    </RadixAccordion.Content>
  );
});

AccordionContent.displayName = "AccordionContent";

