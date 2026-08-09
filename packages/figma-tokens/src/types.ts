/**
 * Configuration for FigmaTokenBuilder
 */
export interface FigmaTokenBuilderConfig {
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
  /** Whether to create collections if missing (default: true) */
  createIfMissing?: boolean;
  /** Whether to stop between phases for debugging (default: false) */
  debugMode?: boolean;
  /** Progress callback */
  onProgress?: (phase: string, message: string) => void;
}

/**
 * W3C DTCG token value
 */
export interface TokenValue {
  $value: string | number;
  $type: string;
  $description?: string;
}

/**
 * Flattened token (path -> value)
 */
export interface FlatToken {
  path: string;
  value: string | number;
  type: string;
  description?: string;
}

/**
 * Figma variable metadata
 */
export interface Variable {
  id: string;
  name: string;
  path: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'color';
  scopes: VariableScope[];
  codeScopes?: CodeScope[];
}

/**
 * Figma variable scope
 */
export type VariableScope =
  | 'FRAME_FILL'
  | 'SHAPE_FILL'
  | 'TEXT_FILL'
  | 'STROKE_COLOR'
  | 'GAP'
  | 'STROKE_WIDTH'
  | 'CORNER_RADIUS'
  | 'FONT_SIZE'
  | 'FONT_WEIGHT'
  | 'LINE_HEIGHT';

/**
 * Figma code scope
 */
export interface CodeScope {
  language: 'WEB' | 'ANDROID' | 'iOS';
  syntax: string;
}

/**
 * Figma variable collection
 */
export interface Collection {
  id: string;
  name: string;
  modeCount: number;
  variableCount: number;
  variables: Variable[];
}

/**
 * Build result summary
 */
export interface BuildResult {
  status: 'success' | 'error';
  collections: {
    Primitives?: Collection;
    Semantic?: Collection;
  };
  message: string;
  phasesDone: number;
  totalPhases: number;
}

/**
 * Token scope assignment rules (from SKILL.md)
 */
export const SCOPE_RULES: Record<string, VariableScope[]> = {
  'color.background': ['FRAME_FILL', 'SHAPE_FILL'],
  'color.text': ['TEXT_FILL'],
  'color.border': ['STROKE_COLOR'],
  'color.stroke': ['STROKE_COLOR'],
  'color.focus': ['FRAME_FILL', 'SHAPE_FILL', 'STROKE_COLOR'],
  'spacing': ['GAP'],
  'space': ['GAP'],
  'gap': ['GAP'],
  'padding': ['GAP'],
  'border.width': ['STROKE_WIDTH'],
  'radius': ['CORNER_RADIUS'],
  'border.radius': ['CORNER_RADIUS'],
  'typography.size': ['FONT_SIZE'],
  'typography.weight': ['FONT_WEIGHT'],
  'typography.lineHeight': ['LINE_HEIGHT'],
  'fontsize': ['FONT_SIZE'],
  'fontweight': ['FONT_WEIGHT'],
  'lineheight': ['LINE_HEIGHT'],
};

/**
 * Determine scopes for a token based on its path and type
 */
export function determineScopes(path: string, type: string): VariableScope[] {
  // Special case: primitives are hidden (no scopes)
  if (path.startsWith('color/') && !path.includes('focus')) {
    // Check the path prefix
    for (const [prefix, scopes] of Object.entries(SCOPE_RULES)) {
      if (path.toLowerCase().includes(prefix.replace('.', '/'))) {
        return scopes;
      }
    }
  }

  // Check each rule
  for (const [prefix, scopes] of Object.entries(SCOPE_RULES)) {
    if (path.toLowerCase().includes(prefix.toLowerCase())) {
      return scopes;
    }
  }

  // Default: no scopes (hidden)
  return [];
}

/**
 * Configuration loaded from .component-contracts file
 */
export interface Config {
  FIGMA_ACCESS_TOKEN: string;
  FIGMA_FILE_KEY: string;
  TOKENS_DIR: string;
  CONTRACTS_DIR: string;
}
