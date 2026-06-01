#!/usr/bin/env node
/**
 * Contract Validator
 *
 * 1. Validates every .contract.json file against the JSON Schema.
 * 2. Checks that every token path referenced in a contract exists
 *    in packages/tokens/dist/json/tokens.json.
 *
 * Exits with code 1 if any contract fails — designed for CI.
 *
 * Usage: pnpm validate
 */

import _Ajv from "ajv";
import _addFormats from "ajv-formats";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTRACTS_DIR = path.resolve(__dirname, "../../../packages/contracts/src");
const SCHEMA_PATH = path.resolve(__dirname, "../../../packages/schema/schema.json");
const TOKENS_PATH = path.resolve(__dirname, "../../../packages/tokens/dist/json/tokens.json");

// ─── Token path resolver ──────────────────────────────────────────────────────

function loadTokens(): Record<string, unknown> | null {
  if (!fs.existsSync(TOKENS_PATH)) return null;
  try {
    return JSON.parse(fs.readFileSync(TOKENS_PATH, "utf-8"));
  } catch {
    return null;
  }
}

function tokenPathExists(tokens: Record<string, unknown>, dotPath: string): boolean {
  const parts = dotPath.split(".");
  let cur: unknown = tokens;
  for (const part of parts) {
    if (typeof cur !== "object" || cur === null || !(part in (cur as Record<string, unknown>))) {
      return false;
    }
    cur = (cur as Record<string, unknown>)[part];
  }
  return true;
}

/** Collect every leaf string value from a contract's tokens block. */
function collectTokenRefs(obj: unknown, category = ""): Array<{ category: string; ref: string }> {
  if (typeof obj === "string") return [{ category, ref: obj }];
  if (typeof obj !== "object" || obj === null) return [];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    collectTokenRefs(v, category || k)
  );
}

type ValidateFn = ((data: unknown) => boolean) & { errors?: Array<{ instancePath?: string; message?: string }> };
const AjvClass = (typeof _Ajv === "function" ? _Ajv : (_Ajv as unknown as { default: typeof _Ajv }).default) as unknown as new (opts?: { allErrors?: boolean }) => { compile: (schema: unknown) => ValidateFn };
const addFormatsFn = (typeof _addFormats === "function" ? _addFormats : (_addFormats as unknown as { default: (ajv: unknown) => void }).default) as unknown as (ajv: unknown) => void;

const ajv = new AjvClass({ allErrors: true });
addFormatsFn(ajv);

const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, "utf-8"));
const validate = ajv.compile(schema);

const files = fs
  .readdirSync(CONTRACTS_DIR)
  .filter((f) => f.endsWith(".contract.json"));

if (files.length === 0) {
  console.log("No contracts found.");
  process.exit(0);
}

const builtTokens = loadTokens();
if (!builtTokens) {
  console.warn("⚠ packages/tokens/dist/json/tokens.json not found — skipping token path checks.");
  console.warn("  Run `pnpm tokens:build` first to enable full validation.\n");
}

let passed = 0;
let failed = 0;

for (const file of files) {
  const filePath = path.join(CONTRACTS_DIR, file);
  let data: unknown;

  try {
    data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (e) {
    console.error(`✗ ${file} — JSON parse error: ${e}`);
    failed++;
    continue;
  }

  const schemaErrors: string[] = [];
  const tokenErrors: string[] = [];

  // 1. Schema validation
  if (!validate(data)) {
    for (const err of validate.errors ?? []) {
      schemaErrors.push(`  schema  ${err.instancePath || "(root)"} ${err.message}`);
    }
  }

  // 2. Token path validation
  if (builtTokens) {
    const contract = data as { tokens?: unknown };
    if (contract.tokens) {
      for (const { category, ref } of collectTokenRefs(contract.tokens)) {
        // Only validate token references (contain dots like "brand.500")
        // Skip literal CSS values (e.g., "6px", "100ms", "ease-out")
        if (ref.includes(".")) {
          if (!tokenPathExists(builtTokens, ref)) {
            tokenErrors.push(`  tokens  [${category}] "${ref}" not found in @ds/tokens`);
          }
        }
      }
    }
  }

  const allErrors = [...schemaErrors, ...tokenErrors];
  if (allErrors.length === 0) {
    console.log(`✓ ${file}`);
    passed++;
  } else {
    console.error(`✗ ${file}`);
    for (const err of allErrors) console.error(err);
    failed++;
  }
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
