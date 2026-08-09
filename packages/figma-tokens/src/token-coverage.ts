import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import type { ComponentContract } from '@ds/schema';
import type { FlatToken } from './types.js';

export interface CoverageReport {
  totalContracts: number;
  totalSemanticTokens: number;
  missing: Array<{
    token: string;
    usedBy: string[];
  }>;
  unused: Array<{
    token: string;
  }>;
  coveragePercent: number;
  isComplete: boolean;
}

/**
 * Validate that all semantic tokens referenced by contracts exist
 */
export function validateTokenCoverage(
  contractsDir: string,
  semanticTokens: FlatToken[],
  primitiveTokens: FlatToken[] = []
): CoverageReport {
  // Load all contracts
  const contracts = loadAllContracts(contractsDir);
  // Include both semantic AND primitive tokens as valid references
  const allTokens = [...semanticTokens, ...primitiveTokens];
  const availableTokens = new Set(allTokens.map((t) => t.path));

  // Extract all semantic token references from contracts
  const tokenReferences = new Map<string, string[]>();

  for (const contract of contracts) {
    const referencedTokens = extractTokenReferences(contract);
    for (const tokenPath of referencedTokens) {
      if (!tokenReferences.has(tokenPath)) {
        tokenReferences.set(tokenPath, []);
      }
      tokenReferences.get(tokenPath)!.push(contract.id);
    }
  }

  // Find missing tokens
  const missing: Array<{ token: string; usedBy: string[] }> = [];
  for (const [token, usedBy] of tokenReferences.entries()) {
    if (!availableTokens.has(token)) {
      missing.push({ token, usedBy });
    }
  }

  // Find unused tokens
  const unused: Array<{ token: string }> = [];
  for (const token of availableTokens) {
    if (!tokenReferences.has(token)) {
      unused.push({ token });
    }
  }

  // Calculate coverage
  const referencedCount = tokenReferences.size;
  const totalTokens = semanticTokens.length;
  const coveragePercent =
    totalTokens > 0 ? Math.round((referencedCount / totalTokens) * 100) : 0;

  return {
    totalContracts: contracts.length,
    totalSemanticTokens: totalTokens,
    missing,
    unused,
    coveragePercent,
    isComplete: missing.length === 0,
  };
}

/**
 * Load all contracts from directory
 */
function loadAllContracts(contractsDir: string): ComponentContract[] {
  const contracts: ComponentContract[] = [];

  try {
    const files = readdirSync(contractsDir);
    for (const file of files) {
      if (file.endsWith('.contract.json')) {
        const path = join(contractsDir, file);
        try {
          const content = readFileSync(path, 'utf-8');
          const contract = JSON.parse(content) as ComponentContract;
          contracts.push(contract);
        } catch (error) {
          // Skip invalid contract files
        }
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
  }

  return contracts;
}

/**
 * Extract all semantic token references from a contract
 * All contract token values must be token references (contain dots like "brand.500")
 * Literal CSS values are not permitted
 */
function extractTokenReferences(contract: ComponentContract): string[] {
  const tokens = new Set<string>();

  if (!contract.tokens) {
    return Array.from(tokens);
  }

  // Extract from all token values
  for (const values of Object.values(contract.tokens)) {
    for (const value of Object.values(values)) {
      const strValue = String(value);
      const tokenPath = strValue.replace(/\./g, '/');
      tokens.add(tokenPath);
    }
  }

  return Array.from(tokens);
}

/**
 * Format coverage report for display
 */
export function formatCoverageReport(report: CoverageReport): string {
  const lines: string[] = [];

  lines.push('📊 Token Coverage Report\n');
  lines.push(`   Contracts: ${report.totalContracts}`);
  lines.push(`   Semantic Tokens: ${report.totalSemanticTokens}`);
  lines.push(`   Coverage: ${report.coveragePercent}%\n`);

  if (report.missing.length > 0) {
    lines.push(`❌ Missing Tokens (${report.missing.length}):`);
    for (const { token, usedBy } of report.missing) {
      lines.push(`   • ${token} (used by: ${usedBy.join(', ')})`);
    }
    lines.push('');
  } else {
    lines.push('✅ All referenced tokens exist\n');
  }

  if (report.unused.length > 0) {
    lines.push(`⚠️  Unused Tokens (${report.unused.length}):`);
    for (const { token } of report.unused.slice(0, 10)) {
      lines.push(`   • ${token}`);
    }
    if (report.unused.length > 10) {
      lines.push(`   ... and ${report.unused.length - 10} more`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
