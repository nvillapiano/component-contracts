#!/usr/bin/env tsx
/**
 * Validate token coverage: ensures all tokens referenced by contracts exist
 *
 * Usage:
 *   pnpm run validate:token-coverage
 *   pnpm run validate:token-coverage --fail-on-missing
 *
 * Flags:
 *   --fail-on-missing   Exit with code 1 if any tokens are missing (for CI)
 *   --fail-on-unused    Exit with code 1 if any tokens are unused (for cleanup)
 *   --dev              Show detailed output
 */

import { loadTokenFiles, getSemanticTokens, validateTokenCoverage, formatCoverageReport } from '../packages/figma-tokens/dist/index.js';
import { loadConfig } from '../packages/figma-tokens/dist/config.js';

async function main(): Promise<void> {
  const isDev = process.argv.includes('--dev');
  const failOnMissing = process.argv.includes('--fail-on-missing');
  const failOnUnused = process.argv.includes('--fail-on-unused');

  try {
    // Load configuration
    const config = loadConfig();

    // Load semantic tokens
    const { semantic } = loadTokenFiles(config.TOKENS_DIR);
    const semanticFlat = getSemanticTokens(semantic);

    // Validate coverage
    const report = validateTokenCoverage(config.CONTRACTS_DIR, semanticFlat);

    // Print report
    console.log(formatCoverageReport(report));

    // Determine exit code
    let exitCode = 0;

    if (report.missing.length > 0 && failOnMissing) {
      exitCode = 1;
    }

    if (report.unused.length > 0 && failOnUnused) {
      exitCode = 1;
    }

    if (exitCode === 0) {
      console.log('✅ Token coverage validation passed!');
    } else {
      if (report.missing.length > 0) {
        console.error('\n❌ Validation failed: Missing tokens found');
      }
      if (report.unused.length > 0) {
        console.error('\n⚠️  Validation failed: Unused tokens found');
      }
    }

    process.exit(exitCode);
  } catch (error) {
    console.error('❌ Validation error:\n');
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
      if (isDev) {
        console.error(`\n${error.stack}`);
      }
    } else {
      console.error(`   ${error}`);
    }
    process.exit(1);
  }
}

main();
