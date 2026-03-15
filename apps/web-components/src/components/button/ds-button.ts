/**
 * <ds-button> — Web Component implementation of the Button contract.
 *
 * Contract: @ds/contracts/src/button.contract.json
 * Tokens:   @ds/tokens/css
 *
 * No framework. No library. Pure custom element.
 * Consumes the same contract and token CSS custom properties as the React implementation.
 */

// ─── Types (mirrored from contract props) ────────────────────────────────────

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

// ─── Styles ──────────────────────────────────────────────────────────────────
// Inlined so the component is self-contained.
// All values reference CSS custom properties from @ds/tokens.
// The host page must import @ds/tokens/css for these to resolve.

const styles = `
  :host {
    display: inline-block;
  }

  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--ds-space-xs);
    white-space: nowrap;
    border-radius: var(--ds-radius-md);
    border: var(--ds-border-width-sm) solid transparent;
    cursor: pointer;
    font-family: inherit;
    font-size: var(--ds-textSize-sm);
    font-weight: var(--ds-weight-semibold);
    letter-spacing: var(--ds-tracking-wide);
    line-height: 1;
    text-decoration: none;
    transition:
      background-color var(--ds-duration-fast) ease,
      border-color var(--ds-duration-fast) ease,
      color var(--ds-duration-fast) ease,
      opacity var(--ds-duration-fast) ease,
      box-shadow var(--ds-duration-fast) ease;
    outline: none;
  }

  button:focus-visible {
    box-shadow:
      0 0 0 var(--ds-focus-ringOffset) var(--ds-surface-default),
      0 0 0 calc(var(--ds-focus-ringOffset) + var(--ds-focus-ringWidth)) var(--ds-focus-default);
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  /* Sizes */
  button.size-sm { padding: var(--ds-space-xs) var(--ds-space-sm); font-size: var(--ds-textSize-xs); }
  button.size-md { padding: var(--ds-space-sm) var(--ds-space-md); }
  button.size-lg { padding: var(--ds-space-md) var(--ds-space-lg); font-size: var(--ds-textSize-md); }

  /* Variants */
  button.variant-primary {
    background-color: var(--ds-brand-500);
    color: var(--ds-neutral-0);
    border-color: var(--ds-brand-500);
  }
  button.variant-primary:hover:not(:disabled) {
    background-color: var(--ds-brand-600);
    border-color: var(--ds-brand-600);
  }
  button.variant-primary:active:not(:disabled) {
    background-color: var(--ds-brand-700);
    border-color: var(--ds-brand-700);
  }

  button.variant-secondary {
    background-color: transparent;
    color: var(--ds-brand-500);
    border-color: var(--ds-brand-500);
  }
  button.variant-secondary:hover:not(:disabled) { background-color: var(--ds-neutral-50); }
  button.variant-secondary:active:not(:disabled) { background-color: var(--ds-neutral-100); }

  button.variant-ghost {
    background-color: transparent;
    color: var(--ds-brand-500);
    border-color: transparent;
  }
  button.variant-ghost:hover:not(:disabled) { background-color: var(--ds-neutral-50); }
  button.variant-ghost:active:not(:disabled) { background-color: var(--ds-neutral-100); }

  button.variant-destructive {
    background-color: var(--ds-error-500);
    color: var(--ds-neutral-0);
    border-color: var(--ds-error-500);
  }
  button.variant-destructive:hover:not(:disabled) {
    background-color: var(--ds-error-600);
    border-color: var(--ds-error-600);
  }

  /* Modifiers */
  button.full-width { width: 100%; }
  button.icon-only.size-sm { width: 28px; height: 28px; padding: 0; }
  button.icon-only.size-md { width: 36px; height: 36px; padding: 0; }
  button.icon-only.size-lg { width: 44px; height: 44px; padding: 0; }

  /* Loading spinner */
  .spinner {
    display: inline-block;
    width: 1em;
    height: 1em;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin var(--ds-duration-slow) linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// ─── Custom Element ───────────────────────────────────────────────────────────

export class DsButton extends HTMLElement {
  static observedAttributes = [
    "label",
    "variant",
    "size",
    "disabled",
    "loading",
    "icon-only",
    "full-width",
  ];

  private shadow: ShadowRoot;
  private button: HTMLButtonElement;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });

    // Inject styles
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(styles);
    this.shadow.adoptedStyleSheets = [sheet];

    // Create button
    this.button = document.createElement("button");
    this.button.type = "button";
    this.shadow.appendChild(this.button);
  }

  connectedCallback() {
    this.render();
    this.button.addEventListener("click", this.handleClick);
  }

  disconnectedCallback() {
    this.button.removeEventListener("click", this.handleClick);
  }

  attributeChangedCallback() {
    this.render();
  }

  private handleClick = (e: MouseEvent) => {
    if (this.isDisabled || this.isLoading) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    this.dispatchEvent(new CustomEvent("ds-press", { bubbles: true, composed: true }));
  };

  // ─── Getters ───────────────────────────────────────────────────────────────

  get label(): string { return this.getAttribute("label") ?? "Button"; }
  get variant(): ButtonVariant {
    const v = this.getAttribute("variant") as ButtonVariant;
    return ["primary", "secondary", "ghost", "destructive"].includes(v) ? v : "primary";
  }
  get size(): ButtonSize {
    const s = this.getAttribute("size") as ButtonSize;
    return ["sm", "md", "lg"].includes(s) ? s : "md";
  }
  get isDisabled(): boolean { return this.hasAttribute("disabled"); }
  get isLoading(): boolean { return this.hasAttribute("loading"); }
  get isIconOnly(): boolean { return this.hasAttribute("icon-only"); }
  get isFullWidth(): boolean { return this.hasAttribute("full-width"); }

  // ─── Render ────────────────────────────────────────────────────────────────

  private render() {
    const btn = this.button;

    // Classes
    btn.className = [
      `variant-${this.variant}`,
      `size-${this.size}`,
      this.isIconOnly ? "icon-only" : "",
      this.isFullWidth ? "full-width" : "",
    ].filter(Boolean).join(" ");

    // Disabled / loading state
    btn.disabled = this.isDisabled || this.isLoading;
    btn.setAttribute("aria-busy", this.isLoading ? "true" : "false");

    // Accessible label
    if (this.isIconOnly) {
      btn.setAttribute("aria-label", this.label);
    } else {
      btn.removeAttribute("aria-label");
    }

    // Content
    if (this.isLoading) {
      btn.innerHTML = `<span class="spinner" aria-hidden="true"></span>`;
    } else if (this.isIconOnly) {
      // Slot for icon content
      btn.innerHTML = `<slot></slot>`;
    } else {
      btn.innerHTML = `<slot name="icon-start"></slot><span>${this.label}</span><slot name="icon-end"></slot>`;
    }
  }
}

customElements.define("ds-button", DsButton);
