#!/usr/bin/env node
/**
 * Contract Validator
 *
 * Validates every .contract.json file against the JSON Schema.
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

  const valid = validate(data);
  if (valid) {
    console.log(`✓ ${file}`);
    passed++;
  } else {
    console.error(`✗ ${file}`);
    for (const err of validate.errors ?? []) {
      console.error(`    ${err.instancePath || "(root)"} ${err.message}`);
    }
    failed++;
  }
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
