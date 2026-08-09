/**
 * Configuration for FigmaComponentBuilder
 */
export interface FigmaComponentBuilderConfig {
  /** Path to .component-contracts config file */
  configPath?: string;
  /** Figma access token (overrides config file) */
  accessToken?: string;
  /** Figma file key (overrides config file) */
  fileKey?: string;
  /** Root directory of token files (overrides config file) */
  tokensDir?: string;
  /** Root directory of contract files (overrides config file) */
  contractsDir?: string;
  /** Whether to validate only without creating (default: false) */
  validateOnly?: boolean;
  /** Whether to stop between phases for debugging (default: false) */
  debugMode?: boolean;
  /** Progress callback */
  onProgress?: (phase: string, message: string) => void;
}

/**
 * Tier 3 (component-scoped) token
 */
export interface Tier3Token {
  /** Full token name: --ds-{componentId}-{role}-{qualifier} */
  name: string;
  /** Semantic variable reference: brand/500 */
  semanticAlias: string;
  /** Figma variable ID to bind to */
  variableId?: string;
  /** Contract path: color.background.primary */
  contractPath: string;
  /** Derived role: fill, text, border, etc. */
  role: string;
  /** Derived qualifier: brand, neutral, etc. */
  qualifier: string;
  /** CSS variable name: --ds-button-fill-brand */
  cssVariable: string;
}

/**
 * Component variant information
 */
export interface ComponentVariant {
  /** Primary variant value: Primary, Secondary, etc. */
  variant: string;
  /** Size value: Small, Medium, Large */
  size: string;
  /** State value: Default, Hover, Focus, etc. */
  state: string;
  /** Component set name: Button/Primary */
  componentSetName: string;
  /** Variant property string: Size=Small, State=Default */
  variantProps: string;
  /** Token overrides for this variant */
  tokenOverrides: Record<string, string>;
}

/**
 * Component build result
 */
export interface ComponentBuildResult {
  status: 'success' | 'error' | 'validation_only';
  component: string;
  componentSets: Array<{
    name: string;
    variantCount: number;
    id?: string;
  }>;
  tier3Tokens: Tier3Token[];
  generationNotes: string[];
  message: string;
  phasesDone: number;
  totalPhases: number;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  missing: {
    semanticVariables: string[];
    contractPaths: string[];
  };
}
