#!/usr/bin/env tsx
/**
 * Build Figma components from component contracts
 *
 * Usage:
 *   pnpm run build:figma-component --component=button
 *   pnpm run build:figma-component --component=accordion
 *   pnpm run build:figma-component --component=button --component=accordion
 *
 * Flags:
 *   --component=<name>    Component to build (can be used multiple times)
 *   --validate-only       Only validate, don't create components
 *   --debug              Stop between phases for approval
 *   --dev                Show stack traces on errors
 *
 * Configuration:
 *   Reads .component-contracts file for configuration
 */

import { FigmaComponentBuilder } from '../packages/figma-component/dist/index.js';

async function main(): Promise<void> {
  const isDev = process.argv.includes('--dev');
  const isDebug = process.argv.includes('--debug');
  const validateOnly = process.argv.includes('--validate-only');

  // Parse --component=name arguments
  const components: string[] = [];
  for (const arg of process.argv) {
    if (arg.startsWith('--component=')) {
      const component = arg.replace('--component=', '');
      if (component) components.push(component);
    }
  }

  if (components.length === 0) {
    console.error('❌ Error: No components specified\n');
    console.error('Usage: pnpm run build:figma-component --component=button\n');
    console.error('Example: pnpm run build:figma-component --component=button --component=accordion');
    process.exit(1);
  }

  console.log('🎨 Figma Component Builder\n');

  let successCount = 0;
  let errorCount = 0;

  for (const componentId of components) {
    try {
      console.log(`\n📦 Building ${componentId}...\n`);

      const builder = new FigmaComponentBuilder({
        validateOnly,
        debugMode: isDebug,
        onProgress: (phase, message) => {
          const phases = {
            '0': '🔍',
            '1': '📄',
            '2': '🎯',
            '3': '📊',
            '4': '🔗',
            '5': '⚙️',
            '6': '📝',
            '7': '✓',
            'validate': '🛡️',
          };
          const icon = phases[phase as keyof typeof phases] || '•';
          console.log(`${icon}  [Phase ${phase}] ${message}`);
        },
      });

      // Validate first
      console.log('Validating contract...');
      const validation = await builder.validateComponent(componentId);

      if (!validation.valid) {
        console.error(`\n❌ Validation failed!\n`);
        for (const err of validation.errors) {
          console.error(`   ❌ ${err}`);
        }
        errorCount++;
        continue;
      }

      if (validation.warnings.length > 0) {
        console.log(`\n⚠️  Warnings:\n`);
        for (const warn of validation.warnings) {
          console.log(`   ⚠️  ${warn}`);
        }
      }

      console.log('');

      if (validateOnly) {
        console.log(`✅ Validation passed for ${componentId}!`);
        successCount++;
        continue;
      }

      // Build component
      const result = await builder.buildComponent(componentId);

      if (result.status === 'success') {
        console.log(`\n✅ Success!\n`);
        console.log(`📊 Component Summary:`);
        console.log(`   Component: ${result.component}`);
        console.log(`   Component Sets: ${result.componentSets.length}`);
        for (const set of result.componentSets) {
          console.log(`     • ${set.name}: ${set.variantCount} variants`);
        }
        console.log(`   Tier 3 Tokens: ${result.tier3Tokens.length}`);
        if (result.generationNotes.length > 0) {
          console.log(`   Generation Notes: ${result.generationNotes.length}`);
          for (const note of result.generationNotes) {
            console.log(`     • ${note}`);
          }
        }
        successCount++;
      } else {
        console.error(`\n❌ Error!\n`);
        console.error(`   ${result.message}`);
        errorCount++;
      }
    } catch (error) {
      console.error(`\n❌ Unexpected error:\n`);
      if (error instanceof Error) {
        console.error(`   ${error.message}`);
        if (isDev) {
          console.error(`\n${error.stack}`);
        }
      } else {
        console.error(`   ${error}`);
      }
      errorCount++;
    }
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Summary: ${successCount} succeeded, ${errorCount} failed`);
  console.log(`${'='.repeat(60)}\n`);

  if (errorCount > 0) {
    process.exit(1);
  } else {
    console.log('✨ All components generated successfully!');
    process.exit(0);
  }
}

main();
