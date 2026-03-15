import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import "./button.css";

// ─── Variants ────────────────────────────────────────────────────────────────
// Mirrors the variant/size props defined in button.contract.json exactly.

const buttonVariants = cva("ds-button", {
  variants: {
    variant: {
      primary:     "ds-button--primary",
      secondary:   "ds-button--secondary",
      ghost:       "ds-button--ghost",
      destructive: "ds-button--destructive",
    },
    size: {
      sm: "ds-button--sm",
      md: "ds-button--md",
      lg: "ds-button--lg",
    },
    iconOnly: {
      true: "ds-button--icon-only",
    },
    fullWidth: {
      true: "ds-button--full-width",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Visible button text. Also used as accessible label when iconOnly is true. */
  label: string;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  /** Replaces label with a loading spinner and prevents interaction. */
  loading?: boolean;
  /** Renders as a square icon button. Label becomes the aria-label. */
  iconOnly?: boolean;
  /** Stretches the button to fill its container. */
  fullWidth?: boolean;
  /** Icon rendered before the label. Pass an SVG element or icon component. */
  iconStart?: React.ReactNode;
  /** Icon rendered after the label. */
  iconEnd?: React.ReactNode;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      label,
      variant,
      size,
      loading = false,
      iconOnly = false,
      fullWidth = false,
      iconStart,
      iconEnd,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={clsx(
          buttonVariants({ variant, size, iconOnly, fullWidth }),
          className
        )}
        disabled={isDisabled}
        aria-label={iconOnly ? label : undefined}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <span className="ds-button__spinner" aria-hidden="true" />
        ) : (
          <>
            {iconStart && (
              <span className="ds-button__icon ds-button__icon--start" aria-hidden="true">
                {iconStart}
              </span>
            )}
            {!iconOnly && <span className="ds-button__label">{label}</span>}
            {iconEnd && (
              <span className="ds-button__icon ds-button__icon--end" aria-hidden="true">
                {iconEnd}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
