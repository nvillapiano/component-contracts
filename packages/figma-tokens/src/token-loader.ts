import * as fs from 'fs';
import * as path from 'path';
import { TokenValue, FlatToken } from './types.js';

/**
 * Load all W3C DTCG token files from a directory
 */
export function loadTokenFiles(tokensDir: string): {
  primitives: Record<string, unknown>;
  semantic: Record<string, unknown>;
} {
  const primitives: Record<string, unknown> = {};
  const semantic: Record<string, unknown> = {};

  // Load primitive tokens
  const primitiveDir = path.join(tokensDir, 'primitive');
  if (fs.existsSync(primitiveDir)) {
    for (const file of fs.readdirSync(primitiveDir)) {
      if (file.endsWith('.tokens.json')) {
        const filePath = path.join(primitiveDir, file);
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        Object.assign(primitives, content);
      }
    }
  }

  // Load semantic tokens
  const semanticFile = path.join(tokensDir, 'semantic', 'semantic.tokens.json');
  if (fs.existsSync(semanticFile)) {
    const content = JSON.parse(fs.readFileSync(semanticFile, 'utf-8'));
    Object.assign(semantic, content);
  }

  return { primitives, semantic };
}

/**
 * Flatten nested token object into path -> value pairs
 */
export function flattenTokens(
  tokens: Record<string, unknown>,
  prefix = ''
): FlatToken[] {
  const flat: FlatToken[] = [];

  for (const [key, value] of Object.entries(tokens)) {
    const path = prefix ? `${prefix}/${key}` : key;

    if (isTokenValue(value)) {
      flat.push({
        path,
        value: value.$value,
        type: value.$type,
        description: value.$description,
      });
    } else if (typeof value === 'object' && value !== null) {
      flat.push(...flattenTokens(value as Record<string, unknown>, path));
    }
  }

  return flat;
}

/**
 * Check if value is a W3C DTCG token
 */
function isTokenValue(value: unknown): value is TokenValue {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return '$value' in obj && '$type' in obj;
}

/**
 * Resolve token aliases (e.g., {color.blue.500} -> the actual value)
 */
export function resolveAlias(
  aliasPath: string,
  allTokens: Record<string, unknown>
): string | null {
  // Remove {braces} if present
  const cleanPath = aliasPath.replace(/^{|}$/g, '');

  // Navigate the token tree
  const parts = cleanPath.split('.');
  let current: unknown = allTokens;

  for (const part of parts) {
    if (typeof current !== 'object' || current === null) {
      return null;
    }
    current = (current as Record<string, unknown>)[part];
  }

  // If it's a token, return the $value
  if (isTokenValue(current)) {
    return String(current.$value);
  }

  return null;
}

/**
 * Get all primitive tokens as a flat list
 */
export function getPrimitiveTokens(primitives: Record<string, unknown>): FlatToken[] {
  return flattenTokens(primitives);
}

/**
 * Get all semantic tokens as a flat list
 */
export function getSemanticTokens(semantic: Record<string, unknown>): FlatToken[] {
  return flattenTokens(semantic);
}

/**
 * Validate that all semantic token values reference existing primitives
 */
export function validateSemanticTokens(
  semantic: FlatToken[],
  primitives: FlatToken[]
): { valid: boolean; missing: string[] } {
  const primitivePaths = new Set(primitives.map(t => t.path));
  const missing: string[] = [];

  for (const token of semantic) {
    const resolved = resolveAlias(String(token.value), { dummy: 'value' });
    // This is a simplified check - full validation would require the actual token tree
    if (String(token.value).includes('{') && !primitivePaths.has(resolved || '')) {
      const cleanRef = String(token.value).replace(/^{|}$/g, '');
      if (!primitivePaths.has(cleanRef)) {
        missing.push(`${token.path} references ${token.value} which doesn't exist`);
      }
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}
