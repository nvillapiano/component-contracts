#!/usr/bin/env tsx
// STATUS: unreferenced, superseded. Not called by package.json or CI.
// Replaced by scripts/build-figma-tokens.ts and scripts/build-figma-component.ts,
// which drive packages/figma-tokens and packages/figma-component.
// Kept tracked as reference for the original cc-figma-tokens / cc-figma-component
// workflow. Delete when no longer needed.
/**
 * Figma Component Generation Script
 * 
 * Implements cc-figma-tokens and cc-figma-component workflows
 * Requires Figma MCP (use_figma) to be available
 */

import * as fs from "fs";
import * as path from "path";

// Load config
const configPath = path.join(process.cwd(), ".component-contracts");
const configContent = fs.readFileSync(configPath, "utf-8");
const config: Record<string, string> = {};
for (const line of configContent.split("\n")) {
  const match = line.match(/^([A-Z_]+)=(.+)$/);
  if (match) {
    config[match[1]] = match[2].trim();
  }
}

const FIGMA_FILE_KEY = config.FIGMA_FILE_KEY;
const TOKENS_DIR = config.TOKENS_DIR;
const CONTRACTS_DIR = config.CONTRACTS_DIR;

console.log(`\n📦 Figma Component Generator\n`);
console.log(`File: ${FIGMA_FILE_KEY}`);
console.log(`Tokens: ${TOKENS_DIR}`);
console.log(`Contracts: ${CONTRACTS_DIR}\n`);

// Load tokens
function loadTokens() {
  const tokens: Record<string, any> = {};
  
  // Primitives
  const primitiveDir = path.join(TOKENS_DIR, "primitive");
  if (fs.existsSync(primitiveDir)) {
    for (const file of fs.readdirSync(primitiveDir)) {
      if (file.endsWith(".tokens.json")) {
        const content = JSON.parse(fs.readFileSync(path.join(primitiveDir, file), "utf-8"));
        tokens.primitives = { ...tokens.primitives, ...content };
      }
    }
  }
  
  // Semantic
  const semanticFile = path.join(TOKENS_DIR, "semantic", "semantic.tokens.json");
  if (fs.existsSync(semanticFile)) {
    tokens.semantic = JSON.parse(fs.readFileSync(semanticFile, "utf-8"));
  }
  
  return tokens;
}

const tokens = loadTokens();
console.log(`✓ Loaded tokens\n`);

// Load contracts
function loadContracts() {
  const contracts: Record<string, any> = {};
  if (fs.existsSync(CONTRACTS_DIR)) {
    for (const file of fs.readdirSync(CONTRACTS_DIR)) {
      if (file.endsWith(".contract.json")) {
        const name = file.replace(".contract.json", "");
        contracts[name] = JSON.parse(fs.readFileSync(path.join(CONTRACTS_DIR, file), "utf-8"));
      }
    }
  }
  return contracts;
}

const contracts = loadContracts();
console.log(`✓ Loaded contracts: ${Object.keys(contracts).join(", ")}\n`);

// Print workflow
console.log("📋 Workflow:\n");
console.log("1️⃣  Create Primitives variable collection");
console.log("2️⃣  Create Semantic variable collection");
console.log("3️⃣  Create Button component");
console.log("4️⃣  Create Accordion component\n");

console.log(`⏭️  Ready for figma MCP execution`);
console.log(`\nUse 'use_figma' tool with skillNames: ["cc-figma-tokens", "cc-figma-component"]\n`);

export { tokens, contracts, FIGMA_FILE_KEY };
