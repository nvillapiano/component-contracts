import type { ComponentContract } from '@ds/schema';
import { Tier3Token } from './types.js';

/**
 * Role translation from contract category to Figma role
 */
const ROLE_MAP: Record<string, string> = {
  'color.background': 'fill',
  'color.text': 'text',
  'color.border': 'border',
  'color.stroke': 'border',
  'color.focus': 'focus',
  'spacing': 'spacing',
  'space': 'spacing',
  'gap': 'spacing',
  'padding': 'spacing',
  'typography': 'typography',
  'border.radius': 'border',
  'border.width': 'border',
  'motion': 'transition',
};

/**
 * Derive component-scoped Tier 3 tokens from contract
 */
export function deriveTier3Tokens(
  contract: ComponentContract
): Tier3Token[] {
  const tokens: Tier3Token[] = [];

  if (!contract.tokens) {
    return tokens;
  }

  const componentId = contract.id.toLowerCase();

  // Process each token category
  for (const [category, values] of Object.entries(contract.tokens)) {
    for (const [key, semanticAlias] of Object.entries(values)) {
      const contractPath = `${category}.${key}`;
      const role = determineRole(category, key);
      const qualifier = deriveQualifier(String(semanticAlias));
      const name = `--ds-${componentId}-${role}-${qualifier}`;
      const cssVariable = name;

      tokens.push({
        name,
        semanticAlias: String(semanticAlias),
        contractPath,
        role,
        qualifier,
        cssVariable,
      });
    }
  }

  return tokens;
}

/**
 * Determine the Figma role from category and key
 */
function determineRole(category: string, key: string): string {
  const path = `${category}.${key}`;

  // Check exact matches first
  for (const [rule, role] of Object.entries(ROLE_MAP)) {
    if (path.startsWith(rule)) {
      return role;
    }
  }

  // Fallback based on category
  switch (category) {
    case 'color':
      return 'fill';
    case 'spacing':
    case 'space':
    case 'gap':
    case 'padding':
      return 'spacing';
    case 'typography':
      return 'typography';
    case 'border':
      return 'border';
    case 'motion':
      return 'transition';
    default:
      return 'token';
  }
}

/**
 * Derive qualifier from semantic alias value
 * e.g., "brand.500" -> "brand", "neutral.900.hover" -> "neutral-900-hover"
 */
function deriveQualifier(semanticAlias: string): string {
  // Remove dots and replace with dashes, drop trailing numbers
  const parts = semanticAlias.split('.');
  if (parts.length === 0) return 'unknown';

  // First part is the semantic role (brand, neutral, space, etc.)
  let qualifier = parts[0];

  // Add additional parts but drop numeric scales
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    // Skip numeric parts like "500", "600"
    if (!/^\d+$/.test(part)) {
      qualifier += `-${part}`;
    }
  }

  return qualifier;
}

/**
 * Get missing semantic variables
 */
export function getMissingSemanticVariables(
  tokens: Tier3Token[],
  availableVariables: Set<string>
): string[] {
  const missing: string[] = [];

  for (const token of tokens) {
    const varName = token.semanticAlias.replace(/\./g, '/');
    if (!availableVariables.has(varName)) {
      missing.push(`${token.contractPath} → ${varName}`);
    }
  }

  return missing;
}

/**
 * Build variant matrix for component
 */
export interface Variant {
  variant: string;
  size: string;
  state: string;
}

export function buildVariantMatrix(
  contract: ComponentContract
): Variant[] {
  const variants: Variant[] = [];

  if (!contract.props) return variants;

  // Find the primary variant prop (usually 'variant')
  const variantProp = contract.props['variant'];
  if (!variantProp || variantProp.type !== 'enum') {
    return variants;
  }

  const sizeProp = contract.props['size'];
  const sizesAvailable = sizeProp?.type === 'enum' ? (sizeProp.values || []) : ['md'];

  const statesAvailable = contract.states || ['default'];

  // Create matrix
  for (const variantValue of (variantProp.values || [])) {
    for (const size of sizesAvailable) {
      for (const state of statesAvailable) {
        variants.push({
          variant: String(variantValue),
          size: String(size),
          state: String(state),
        });
      }
    }
  }

  return variants;
}

/**
 * Get token overrides for specific state
 */
export function getStateTokenOverrides(
  tokens: Tier3Token[],
  state: string
): Record<string, string> {
  const overrides: Record<string, string> = {};

  for (const token of tokens) {
    // State-specific colors change on specific states
    if (state !== 'default' && token.contractPath.includes(state)) {
      overrides[token.cssVariable] = token.semanticAlias;
    }
  }

  return overrides;
}
