import type { ComponentContract } from "@ds/schema";

import buttonJson from "./button.contract.json" with { type: "json" };
import textInputJson from "./text-input.contract.json" with { type: "json" };
import accordionJson from "./accordion.contract.json" with { type: "json" };

export const button = buttonJson as unknown as ComponentContract;
export const textInput = textInputJson as unknown as ComponentContract;
export const accordion = accordionJson as unknown as ComponentContract;

/** All contracts as a typed array. Add new imports above and include them here. */
export const allContracts: ComponentContract[] = [button, textInput, accordion];

/** Lookup by component ID. */
export const contractsById: Record<string, ComponentContract> = Object.fromEntries(
  allContracts.map((c) => [c.id, c])
);

export type { ComponentContract } from "@ds/schema";
