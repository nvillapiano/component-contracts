import type { ComponentContract } from "@component-contracts/schema";

import buttonJson from "./json/button.contract.json" assert { type: "json" };
import textInputJson from "./json/text-input.contract.json" assert { type: "json" };

export const button = buttonJson as unknown as ComponentContract;
export const textInput = textInputJson as unknown as ComponentContract;

/** All contracts as a typed array. Add new imports above and include them here. */
export const allContracts: ComponentContract[] = [button, textInput];

/** Lookup by component ID. */
export const contractsById: Record<string, ComponentContract> = Object.fromEntries(
  allContracts.map((c) => [c.id, c])
);

export type { ComponentContract } from "@component-contracts/schema";
