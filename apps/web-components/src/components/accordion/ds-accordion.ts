/**
 * <ds-accordion> compound component — Web Component implementation of the Accordion contract.
 *
 * Contract: @ds/contracts/src/accordion.contract.json
 * Tokens:   @ds/tokens/css
 *
 * Four custom elements:
 *   <ds-accordion>           — root, owns open/close state
 *   <ds-accordion-item>      — single item wrapper, has a value
 *   <ds-accordion-trigger>   — button that toggles the item
 *   <ds-accordion-content>   — collapsible content region
 *
 * State coordination uses custom DOM events (ds-accordion-toggle)
 * that bubble up to the root, which then updates all items.
 * No framework, no shared module state — pure DOM.
 */

import { ChevronDown } from "lucide-static";

// ─── Styles ──────────────────────────────────────────────────────────────────

const accordionStyles = `
  :host {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-sm);
  }
`;

const itemStyles = `
  :host {
    display: block;
    border: var(--ds-border-width-sm) solid var(--ds-neutral-200);
    border-radius: var(--ds-radius-md);
    overflow: hidden;
    background-color: var(--ds-neutral-0);
  }
  :host([disabled]) {
    opacity: 0.5;
  }
`;

const triggerStyles = `
  :host {
    display: block;
    margin: 0;
  }
  button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ds-space-xs);
    width: 100%;
    padding: var(--ds-space-sm) var(--ds-space-md);
    background-color: inherit;
    border: 0;
    cursor: pointer;
    font-family: inherit;
    font-size: var(--ds-text-size-md);
    font-weight: var(--ds-weight-medium);
    color: var(--ds-neutral-900);
    text-align: left;
    outline: none;
    transition:
      background-color var(--ds-duration-fast) ease,
      color var(--ds-duration-fast) ease,
      box-shadow var(--ds-duration-fast) ease,
      transform var(--ds-duration-normal) var(--ds-easing-ease-out);
  }
  button:hover:not(:disabled) {
    background-color: var(--ds-neutral-50);
  }
  button:focus-visible {
    box-shadow:
      0 0 0 var(--ds-focus-ring-offset) var(--ds-surface-default),
      0 0 0 calc(var(--ds-focus-ring-offset) + var(--ds-focus-ring-width)) var(--ds-focus-default);
  }
  button:disabled {
    cursor: not-allowed;
  }
  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: 1em;
    block-size: 1em;
    flex-shrink: 0;
    transition:
      opacity var(--ds-duration-fast) ease,
      transform var(--ds-duration-normal) var(--ds-easing-ease-out);
    color: var(--ds-neutral-500);
  }
  :host([data-state="open"]) .icon {
    transform: rotate(180deg);
  }
`;

const contentStyles = `
  :host {
    display: block;
    overflow: hidden;
    color: var(--ds-neutral-800);
  }
  :host([data-state="closed"]) {
    max-height: 0;
    opacity: 0;
    transition:
      max-height var(--ds-duration-normal) var(--ds-easing-ease-out),
      opacity var(--ds-duration-normal) var(--ds-easing-ease-out);
  }
  :host([data-state="open"]) {
    max-height: 600px;
    opacity: 1;
    transition:
      max-height var(--ds-duration-normal) var(--ds-easing-ease-out),
      opacity var(--ds-duration-normal) var(--ds-easing-ease-out);
  }
  .inner {
    padding-inline: var(--ds-space-md);
    padding-block-end: var(--ds-space-sm);
    padding-block-start: var(--ds-space-xs);
    font-size: var(--ds-text-size-sm);
  }
`;

// ─── Helper ───────────────────────────────────────────────────────────────────

function adoptStyles(shadow: ShadowRoot, css: string) {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(css);
  shadow.adoptedStyleSheets = [sheet];
}

// ─── <ds-accordion-content> ──────────────────────────────────────────────────

export class DsAccordionContent extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    adoptStyles(this.shadow, contentStyles);
    const inner = document.createElement("div");
    inner.className = "inner";
    const slot = document.createElement("slot");
    inner.appendChild(slot);
    this.shadow.appendChild(inner);
  }

  setOpen(open: boolean) {
    this.setAttribute("data-state", open ? "open" : "closed");
    this.setAttribute("role", "region");
    if (!open) {
      this.setAttribute("hidden", "");
    } else {
      this.removeAttribute("hidden");
    }
  }
}

customElements.define("ds-accordion-content", DsAccordionContent);

// ─── <ds-accordion-trigger> ──────────────────────────────────────────────────

export class DsAccordionTrigger extends HTMLElement {
  private shadow: ShadowRoot;
  private button!: HTMLButtonElement;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    adoptStyles(this.shadow, triggerStyles);
  }

  connectedCallback() {
    this.render();
  }

  private render() {
    this.shadow.innerHTML = "";
    adoptStyles(this.shadow, triggerStyles);

    this.button = document.createElement("button");
    this.button.type = "button";

    const labelSlot = document.createElement("slot");
    this.button.appendChild(labelSlot);

    const icon = document.createElement("span");
    icon.className = "icon";
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = ChevronDown;
    this.button.appendChild(icon);

    this.button.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("ds-accordion-toggle", {
        bubbles: true,
        composed: true,
      }));
    });

    this.shadow.appendChild(this.button);
  }

  setOpen(open: boolean, disabled = false) {
    this.setAttribute("data-state", open ? "open" : "closed");
    if (this.button) {
      this.button.setAttribute("aria-expanded", open ? "true" : "false");
      this.button.disabled = disabled;
    }
  }

  setControlsId(id: string) {
    if (this.button) {
      this.button.setAttribute("aria-controls", id);
    }
  }
}

customElements.define("ds-accordion-trigger", DsAccordionTrigger);

// ─── <ds-accordion-item> ─────────────────────────────────────────────────────

export class DsAccordionItem extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    adoptStyles(this.shadow, itemStyles);
    const slot = document.createElement("slot");
    this.shadow.appendChild(slot);
  }

  connectedCallback() {
    // Wire up trigger → content ARIA relationship
    const trigger = this.querySelector("ds-accordion-trigger");
    const content = this.querySelector("ds-accordion-content");
    if (trigger && content) {
      const contentId = `ds-accordion-content-${Math.random().toString(36).slice(2, 8)}`;
      content.id = contentId;
      (trigger as DsAccordionTrigger).setControlsId(contentId);
    }
    this.setOpen(false);
  }

  get value(): string {
    return this.getAttribute("value") ?? "";
  }

  get isDisabled(): boolean {
    return this.hasAttribute("disabled");
  }

  setOpen(open: boolean) {
    this.setAttribute("data-state", open ? "open" : "closed");
    const trigger = this.querySelector("ds-accordion-trigger") as DsAccordionTrigger | null;
    const content = this.querySelector("ds-accordion-content") as DsAccordionContent | null;
    trigger?.setOpen(open, this.isDisabled);
    content?.setOpen(open);
  }
}

customElements.define("ds-accordion-item", DsAccordionItem);

// ─── <ds-accordion> ───────────────────────────────────────────────────────────

export class DsAccordion extends HTMLElement {
  private shadow: ShadowRoot;
  private openValues = new Set<string>();

  static observedAttributes = ["type", "collapsible", "disabled"];

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    adoptStyles(this.shadow, accordionStyles);
    const slot = document.createElement("slot");
    this.shadow.appendChild(slot);
  }

  connectedCallback() {
    this.addEventListener("ds-accordion-toggle", this.handleToggle);
    this.addEventListener("keydown", this.handleKeydown);

    // Apply initial open state from default-value attribute
    const defaultValue = this.getAttribute("default-value");
    if (defaultValue) {
      defaultValue.split(",").forEach(v => this.openValues.add(v.trim()));
    }
    this.syncItems();
  }

  disconnectedCallback() {
    this.removeEventListener("ds-accordion-toggle", this.handleToggle);
    this.removeEventListener("keydown", this.handleKeydown);
  }

  get type(): "single" | "multiple" {
    return this.getAttribute("type") === "multiple" ? "multiple" : "single";
  }

  get collapsible(): boolean {
    return this.hasAttribute("collapsible");
  }

  get isDisabled(): boolean {
    return this.hasAttribute("disabled");
  }

  private get items(): DsAccordionItem[] {
    return Array.from(this.querySelectorAll("ds-accordion-item")) as DsAccordionItem[];
  }

  private handleToggle = (e: Event) => {
    if (this.isDisabled) return;

    const item = (e.target as Element).closest("ds-accordion-item") as DsAccordionItem | null;
    if (!item || item.isDisabled) return;

    const value = item.value;
    const isOpen = this.openValues.has(value);

    if (this.type === "single") {
      if (isOpen) {
        if (this.collapsible) this.openValues.clear();
      } else {
        this.openValues.clear();
        this.openValues.add(value);
      }
    } else {
      if (isOpen) {
        this.openValues.delete(value);
      } else {
        this.openValues.add(value);
      }
    }

    this.syncItems();
    this.dispatchEvent(new CustomEvent("ds-value-change", {
      detail: { value: Array.from(this.openValues) },
      bubbles: true,
    }));
  };

  private handleKeydown = (e: KeyboardEvent) => {
    const triggers = this.items
      .filter(item => !item.isDisabled)
      .map(item => item.querySelector("ds-accordion-trigger") as DsAccordionTrigger);

    const active = document.activeElement?.shadowRoot?.activeElement;
    const currentIndex = triggers.findIndex(t => {
      const btn = t.shadowRoot?.querySelector("button");
      return btn === active;
    });

    if (currentIndex === -1) return;

    let nextIndex = currentIndex;

    switch (e.key) {
      case "ArrowDown": nextIndex = (currentIndex + 1) % triggers.length; break;
      case "ArrowUp": nextIndex = (currentIndex - 1 + triggers.length) % triggers.length; break;
      case "Home": nextIndex = 0; break;
      case "End": nextIndex = triggers.length - 1; break;
      default: return;
    }

    e.preventDefault();
    const nextBtn = triggers[nextIndex]?.shadowRoot?.querySelector("button") as HTMLButtonElement | null;
    nextBtn?.focus();
  };

  private syncItems() {
    this.items.forEach(item => {
      item.setOpen(this.openValues.has(item.value));
    });
  }
}

customElements.define("ds-accordion", DsAccordion);
