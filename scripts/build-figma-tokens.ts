#!/usr/bin/env tsx
/**
 * Build Figma token collections from W3C DTCG token files
 *
 * Usage:
 *   pnpm run build:figma-tokens
 *
 * Configuration:
 *   Reads .component-contracts file for FIGMA_ACCESS_TOKEN, FIGMA_FILE_KEY, etc.
 */

import { FigmaTokenBuilder } from '../packages/figma-tokens/dist/index.js';

async function main(): Promise<void> {
  const isDev = process.argv.includes('--dev');
  const isDebug = process.argv.includes('--debug');

  console.log('🔧 Figma Token Builder\n');

  try {
    console.log('📋 Building token collections...\n');

    const builder = new FigmaTokenBuilder({
      debugMode: isDebug,
      onProgress: (phase, message) => {
        const phases = { '0': '🔍', '1': '🎨', '2': '🌈', '3': '📌', '4': '✓' };
        const icon = phases[phase as keyof typeof phases] || '•';
        console.log(`${icon}  [Phase ${phase}] ${message}`);
      },
    });

    // Get token summary
    const summary = await builder.getTokenSummary();
    console.log(`\n📊 Token Summary:`);
    console.log(`   Primitives: ${summary.primitiveCount} tokens`);
    console.log(`   Semantic: ${summary.semanticCount} tokens`);
    console.log(`   Categories: ${Object.entries(summary.categories).map(([k, v]) => `${k}(${v})`).join(', ')}\n`);

    // Build tokens
    const result = await builder.buildTokens();

    if (result.status === 'success') {
      console.log('✅ Success!\n');
      console.log('📦 Collections created:');
      if (result.collections.Primitives) {
        console.log(`   • Primitives: ${result.collections.Primitives.variableCount} variables`);
      }
      if (result.collections.Semantic) {
        console.log(`   • Semantic: ${result.collections.Semantic.variableCount} variables`);
      }
      console.log('\n✨ Tokens are ready for component generation!');
      console.log('   Run: pnpm run build:figma-component --component=button');
      process.exit(0);
    } else {
      console.error('❌ Error!\n');
      console.error(`   ${result.message}`);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Unexpected error:\n');
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
