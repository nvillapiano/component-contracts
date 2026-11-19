#!/usr/bin/env tsx
// STATUS: unreferenced, superseded. The documented command
// (`pnpm run generate-figma-components`) is not defined in package.json.
// Replaced by scripts/build-figma-component.ts (`pnpm run build:figma-component`).
// Kept tracked as reference. Delete when no longer needed.
/**
 * Generate Figma components from component contracts
 *
 * This script implements the cc-figma-tokens and cc-figma-component workflows
 * using the Figma MCP for use_figma integration.
 *
 * Usage:
 *   pnpm run generate-figma-components
 *
 * Requires:
 *   - .component-contracts file with FIGMA_ACCESS_TOKEN and FIGMA_FILE_KEY
 *   - Figma MCP configured and available
 */

import * as fs from "fs";
import * as path from "path";

// ─── Configuration ───────────────────────────────────────────────────────────

interface Config {
  FIGMA_ACCESS_TOKEN: string;
  FIGMA_FILE_KEY: string;
  TOKENS_DIR: string;
  CONTRACTS_DIR: string;
}

function loadConfig(): Config {
  const configPath = path.join(process.cwd(), ".component-contracts");

  if (!fs.existsSync(configPath)) {
    throw new Error(
      `Configuration file not found: ${configPath}\n` +
      `Please create .component-contracts with required values\n` +
      `See .component-contracts.example for reference`
    );
  }

  const content = fs.readFileSync(configPath, "utf-8");
  const config: Record<string, string> = {};

  for (const line of content.split("\n")) {
    const match = line.match(/^([A-Z_]+)=(.+)$/);
    if (match) {
      config[match[1]] = match[2].trim();
    }
  }

  const required = ["FIGMA_ACCESS_TOKEN", "FIGMA_FILE_KEY", "TOKENS_DIR", "CONTRACTS_DIR"];
  for (const key of required) {
    if (!config[key]) {
      throw new Error(`Missing ${key} in .component-contracts`);
    }
  }

  return config as Config;
}

// ─── Token Loading ──────────────────────────────────────────────────────────

interface TokenValue {
  $value: string;
  $type: string;
  $description?: string;
}

interface TokenFile {
  [key: string]: TokenValue | object;
}

function loadTokenFiles(tokensDir: string): { primitives: TokenFile; semantic: TokenFile } {
  const primitives: TokenFile = {};
  const semantic: TokenFile = {};

  // Load primitive tokens
  const primitiveDir = path.join(tokensDir, "primitive");
  if (fs.existsSync(primitiveDir)) {
    for (const file of fs.readdirSync(primitiveDir)) {
      if (file.endsWith(".tokens.json")) {
        const content = JSON.parse(
          fs.readFileSync(path.join(primitiveDir, file), "utf-8")
        );
        Object.assign(primitives, content);
      }
    }
  }

  // Load semantic tokens
  const semanticFile = path.join(tokensDir, "semantic", "semantic.tokens.json");
  if (fs.existsSync(semanticFile)) {
    Object.assign(semantic, JSON.parse(fs.readFileSync(semanticFile, "utf-8")));
  }

  return { primitives, semantic };
}

// ─── Figma Plugin Code Generation ────────────────────────────────────────────

function generateTokensPluginCode(
  primitives: TokenFile,
  semantic: TokenFile
): string {
  // This would be the plugin code to create variables
  // For now, return a placeholder that describes what needs to happen
  return `
// Generated plugin code for Figma token creation
// This would be executed via use_figma MCP

const figjson = figma.variables;

// Create Primitives collection
const primitivesCollection = figjson.createVariableCollection("Primitives");
const primitiveMode = primitivesCollection.modes[0];

// Create Semantic collection
const semanticCollection = figjson.createVariableCollection("Semantic");
const semanticMode = semanticCollection.modes[0];

// Note: Variable creation logic would be generated here
// based on the loaded token structure
`;
}

function generateComponentsPluginCode(
  contracts: Record<string, any>
): string {
  return `
// Generated plugin code for Figma component creation
// This would be executed via use_figma MCP

// Component generation logic based on contracts
// Each component would be created with:
// - Variant frames for each variant combination
// - Auto-layout constraints
// - Variable bindings to semantic tokens
`;
}

// ─── Main Workflow ──────────────────────────────────────────────────────────

async function main(): Promise<void> {
  try {
    console.log("Loading configuration...");
    const config = loadConfig();
    console.log(`✓ Figma file key: ${config.FIGMA_FILE_KEY}`);

    console.log("\nLoading token files...");
    const { primitives, semantic } = loadTokenFiles(config.TOKENS_DIR);
    console.log(`✓ Loaded ${Object.keys(primitives).length} primitive tokens`);
    console.log(`✓ Loaded ${Object.keys(semantic).length} semantic tokens`);

    console.log("\nLoading contracts...");
    const contractsDir = config.CONTRACTS_DIR;
    const contracts: Record<string, any> = {};

    if (fs.existsSync(contractsDir)) {
      for (const file of fs.readdirSync(contractsDir)) {
        if (file.endsWith(".contract.json")) {
          const contractName = file.replace(".contract.json", "");
          const contract = JSON.parse(
            fs.readFileSync(path.join(contractsDir, file), "utf-8")
          );
          contracts[contractName] = contract;
          console.log(`✓ Loaded ${contractName} contract`);
        }
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("READY TO GENERATE FIGMA COMPONENTS");
    console.log("=".repeat(60));
    console.log(`
File: ${config.FIGMA_FILE_KEY}
Tokens: ${Object.keys(primitives).length} primitives + ${Object.keys(semantic).length} semantic
Components: ${Object.keys(contracts).join(", ")}

Next step: Use figma MCP to run the plugin code
`);

    // Generate the plugin code that would be executed
    const tokensCode = generateTokensPluginCode(primitives, semantic);
    const componentsCode = generateComponentsPluginCode(contracts);

    console.log("Generated plugin code ready for use_figma MCP execution.");
    console.log("\nTo proceed, the following steps would be executed:");
    console.log("1. Create Primitives variable collection");
    console.log("2. Create Semantic variable collection");
    console.log("3. Create Button component set");
    console.log("4. Create Accordion component set");
    console.log("5. Bind all components to semantic tokens");

  } catch (error) {
    console.error(
      "Error:",
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
}

main();
