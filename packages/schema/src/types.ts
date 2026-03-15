// Auto-generated from schema.json via `pnpm types:generate`
// You can also edit this manually and skip generation if you prefer.

export type Platform = "web" | "ios" | "android" | "macos" | "windows";

export type ComponentStatus =
  | "draft"
  | "alpha"
  | "beta"
  | "stable"
  | "deprecated"
  | "removed";

export type PropType =
  | "string"
  | "boolean"
  | "number"
  | "integer"
  | "enum"
  | "object"
  | "array"
  | "function"
  | "ref";

export type StateType =
  | "default"
  | "hover"
  | "focus"
  | "active"
  | "disabled"
  | "loading"
  | "error"
  | "success"
  | "empty";

export interface PlatformPropOverride {
  supported?: boolean;
  nativeName?: string;
  notes?: string;
}

export interface PropDefinition {
  type: PropType;
  description?: string;
  required?: boolean;
  default?: unknown;
  /** Required when type === 'enum' */
  values?: string[];
  /** Required when type === 'ref' — component ID this prop accepts */
  ref?: string;
  /** Required when type === 'array' */
  itemType?: string;
  tokenMapped?: boolean;
  platforms?: Partial<Record<Platform, PlatformPropOverride>>;
}

export interface ComponentVariant {
  id: string;
  displayName: string;
  description?: string;
  props: Record<string, unknown>;
}

export interface KeyboardShortcut {
  key: string;
  action: string;
}

export interface ComponentBehavior {
  focusable?: boolean;
  pressable?: boolean;
  scrollable?: boolean;
  draggable?: boolean;
  dismissable?: boolean;
  keyboardShortcuts?: KeyboardShortcut[];
}

export interface ComponentAccessibility {
  role?: string;
  labelSource?: "prop" | "slot" | "aria-label" | "aria-labelledby" | "native";
  requiredAria?: string[];
  focusManagement?: "none" | "self" | "trap" | "restore";
  wcagLevel?: "A" | "AA" | "AAA";
}

export interface SlotDefinition {
  description?: string;
  required?: boolean;
  allowedComponents?: string[];
}

export interface ComponentComposition {
  slots?: Record<string, SlotDefinition>;
  allowedParents?: string[];
  forbiddenParents?: string[];
}

export interface ComponentUsage {
  summary?: string;
  do?: string[];
  dont?: string[];
  relatedComponents?: string[];
}

export interface TokenGroup {
  [role: string]: string;
}

export interface ComponentTokens {
  color?: TokenGroup;
  typography?: TokenGroup;
  spacing?: TokenGroup;
  border?: TokenGroup;
  shadow?: TokenGroup;
  motion?: TokenGroup;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export interface ComponentDeprecation {
  reason: string;
  replacedBy: string;
  removeAfterVersion?: string;
}

export interface ComponentContract {
  id: string;
  version: string;
  displayName: string;
  description?: string;
  status: ComponentStatus;
  deprecation?: ComponentDeprecation;
  platforms: Platform[];
  tokens?: ComponentTokens;
  props: Record<string, PropDefinition>;
  variants?: ComponentVariant[];
  states?: StateType[];
  behavior?: ComponentBehavior;
  accessibility?: ComponentAccessibility;
  composition?: ComponentComposition;
  usage?: ComponentUsage;
  platformNotes?: Partial<Record<Platform, string>>;
  changelog?: ChangelogEntry[];
}
