#!/usr/bin/env node
/**
 * Component Contracts MCP Server
 *
 * Exposes the contracts registry to MCP-capable clients (Cursor, Claude Desktop).
 *
 * Dev:  pnpm --filter @ds/mcp-server dev
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import type { ComponentContract } from "@ds/schema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PROJECT_ROOT = process.env.COMPONENT_CONTRACTS_ROOT || process.cwd();
const CONTRACTS_DIR = process.env.CONTRACTS_DIR
  ? path.resolve(PROJECT_ROOT, process.env.CONTRACTS_DIR)
  : path.resolve(__dirname, "../../contracts/src");

// ─── Helpers ─────────────────────────────────────────────────────────────────

function loadContract(id: string): ComponentContract | null {
  const filePath = path.join(CONTRACTS_DIR, `${id}.contract.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as ComponentContract;
  } catch {
    return null;
  }
}

function loadAll(): ComponentContract[] {
  if (!fs.existsSync(CONTRACTS_DIR)) return [];
  return fs
    .readdirSync(CONTRACTS_DIR)
    .filter((f) => f.endsWith(".contract.json"))
    .flatMap((f) => {
      try {
        return [JSON.parse(fs.readFileSync(path.join(CONTRACTS_DIR, f), "utf-8")) as ComponentContract];
      } catch {
        return [];
      }
    });
}

function saveContract(contract: ComponentContract): void {
  const filePath = path.join(CONTRACTS_DIR, `${contract.id}.contract.json`);
  fs.writeFileSync(filePath, JSON.stringify(contract, null, 2), "utf-8");
}

function deepMerge(
  target: Record<string, unknown>,
  patch: Record<string, unknown>
): Record<string, unknown> {
  const result = { ...target };
  for (const [key, value] of Object.entries(patch)) {
    if (
      typeof value === "object" && value !== null && !Array.isArray(value) &&
      typeof result[key] === "object" && result[key] !== null && !Array.isArray(result[key])
    ) {
      result[key] = deepMerge(result[key] as Record<string, unknown>, value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }
  return result;
}

function bumpSemver(version: string, bump: "patch" | "minor" | "major"): string {
  const [major, minor, patch] = version.split(".").map(Number);
  if (bump === "major") return `${major + 1}.0.0`;
  if (bump === "minor") return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

function structuralDiff(
  a: Record<string, unknown>,
  b: Record<string, unknown>,
  prefix = ""
): string[] {
  const changes: string[] = [];
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const key of keys) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (!(key in a)) {
      changes.push(`+ ADDED   ${fullKey}`);
    } else if (!(key in b)) {
      changes.push(`- REMOVED ${fullKey}`);
    } else if (
      typeof a[key] === "object" && a[key] !== null && !Array.isArray(a[key]) &&
      typeof b[key] === "object" && b[key] !== null && !Array.isArray(b[key])
    ) {
      changes.push(...structuralDiff(
        a[key] as Record<string, unknown>,
        b[key] as Record<string, unknown>,
        fullKey
      ));
    } else if (JSON.stringify(a[key]) !== JSON.stringify(b[key])) {
      changes.push(`~ CHANGED ${fullKey}: ${JSON.stringify(a[key])} → ${JSON.stringify(b[key])}`);
    }
  }
  return changes;
}

// ─── CLI Execution ───────────────────────────────────────────────────────────

function runCommand(
  command: string,
  args: string[],
  cwd: string = PROJECT_ROOT,
  timeoutMs: number = 30000
): Promise<{ stdout: string; stderr: string; code: number }> {
  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";
    let resolved = false;

    const proc = spawn(command, args, { cwd, stdio: ["pipe", "pipe", "pipe"] });

    // Set timeout to prevent hung processes
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        proc.kill();
        resolve({ stdout, stderr: `Command timeout after ${timeoutMs}ms`, code: 1 });
      }
    }, timeoutMs);

    proc.stdout?.on("data", (data) => {
      stdout += data.toString();
    });

    proc.stderr?.on("data", (data) => {
      stderr += data.toString();
    });

    proc.on("close", (code) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        resolve({ stdout, stderr, code: code ?? 1 });
      }
    });

    proc.on("error", (err) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        resolve({ stdout, stderr: err.message, code: 1 });
      }
    });
  });
}

// ─── Token File Reading ──────────────────────────────────────────────────────

function readTokenFile(tier: "primitive" | "semantic" | "component", name: string): Record<string, unknown> | null {
  const tokensDir = path.join(PROJECT_ROOT, "packages/tokens/src");
  let filePath: string;

  if (tier === "component") {
    filePath = path.join(tokensDir, "component", `${name}.tokens.json`);
  } else {
    filePath = path.join(tokensDir, tier, `${name}.tokens.json`);
  }

  if (!fs.existsSync(filePath)) return null;

  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function listTokenFiles(tier: "primitive" | "semantic" | "component"): string[] {
  const tokensDir = path.join(PROJECT_ROOT, "packages/tokens/src");
  const tierDir = tier === "component" ? path.join(tokensDir, "component") : path.join(tokensDir, tier);

  if (!fs.existsSync(tierDir)) return [];

  return fs
    .readdirSync(tierDir)
    .filter((f) => f.endsWith(".tokens.json"))
    .map((f) => f.replace(".tokens.json", ""));
}

// ─── Server ──────────────────────────────────────────────────────────────────

const server = new McpServer({
  name: "component-contracts",
  version: "1.0.0",
});

server.tool(
  "get_contract",
  "Retrieve the full contract for a component by its ID.",
  { id: z.string().describe("Component ID, e.g. 'button' or 'text-input'") },
  async ({ id }) => {
    const contract = loadContract(id);
    if (!contract) {
      return { content: [{ type: "text", text: `No contract found for: "${id}"` }], isError: true };
    }
    return { content: [{ type: "text", text: JSON.stringify(contract, null, 2) }] };
  }
);

server.tool(
  "list_contracts",
  "List all component contracts with optional filtering by status, platform, or token.",
  {
    status: z.enum(["draft", "alpha", "beta", "stable", "deprecated", "removed"]).optional(),
    platform: z.enum(["web", "ios", "android", "macos", "windows"]).optional(),
    token: z.string().optional().describe("Token path to search for, e.g. 'brand.500'"),
  },
  async ({ status, platform, token }) => {
    let all = loadAll();
    if (status) all = all.filter((c) => c.status === status);
    if (platform) all = all.filter((c) => c.platforms.includes(platform));
    if (token) all = all.filter((c) => JSON.stringify(c.tokens ?? {}).includes(token));

    const summaries = all.map(({ id, displayName, version, status, platforms, description }) => ({
      id, displayName, version, status, platforms, description,
    }));

    return {
      content: [{
        type: "text",
        text: summaries.length === 0
          ? "No contracts match the given filters."
          : JSON.stringify(summaries, null, 2),
      }],
    };
  }
);

server.tool(
  "update_contract",
  "Apply a partial patch to a contract. Deep-merges and writes to disk. Optionally bumps SemVer and appends a changelog entry.",
  {
    id: z.string(),
    patch: z.record(z.unknown()).describe("Partial contract fields to merge"),
    bumpVersion: z.enum(["patch", "minor", "major"]).optional(),
    changelogEntry: z.array(z.string()).optional(),
  },
  async ({ id, patch, bumpVersion, changelogEntry }) => {
    const existing = loadContract(id);
    if (!existing) {
      return { content: [{ type: "text", text: `No contract found for: "${id}"` }], isError: true };
    }

    let updated = deepMerge(
      existing as unknown as Record<string, unknown>,
      patch as Record<string, unknown>
    ) as unknown as ComponentContract;

    if (bumpVersion) {
      updated.version = bumpSemver(updated.version, bumpVersion);
    }

    if (changelogEntry?.length) {
      updated.changelog = [
        { version: updated.version, date: new Date().toISOString().split("T")[0], changes: changelogEntry },
        ...(updated.changelog ?? []),
      ];
    }

    saveContract(updated);

    const diff = structuralDiff(
      existing as unknown as Record<string, unknown>,
      updated as unknown as Record<string, unknown>
    );

    return {
      content: [{
        type: "text",
        text: `Updated "${id}" → v${updated.version}\n\nDiff:\n${diff.join("\n") || "(no structural changes)"}`,
      }],
    };
  }
);

server.tool(
  "diff_contract",
  "Show changelog entries for a component, optionally from a specific version.",
  {
    id: z.string(),
    fromVersion: z.string().optional(),
  },
  async ({ id, fromVersion }) => {
    const contract = loadContract(id);
    if (!contract) {
      return { content: [{ type: "text", text: `No contract found for: "${id}"` }], isError: true };
    }
    const changelog = contract.changelog ?? [];
    const relevant = fromVersion
      ? changelog.filter((e) => e.version >= fromVersion)
      : changelog.slice(0, 3);

    return {
      content: [{
        type: "text",
        text: relevant.length === 0
          ? "No changelog entries found."
          : `Changelog for "${id}":\n\n${JSON.stringify(relevant, null, 2)}`,
      }],
    };
  }
);

server.tool(
  "find_by_token",
  "Find all components referencing a design token. Use for blast-radius analysis before renaming or removing a token.",
  { token: z.string().describe("Token path, e.g. 'brand.500' or 'space.md'") },
  async ({ token }) => {
    const matches = loadAll()
      .filter((c) => JSON.stringify(c.tokens ?? {}).includes(token))
      .map(({ id, displayName, version }) => ({ id, displayName, version }));

    return {
      content: [{
        type: "text",
        text: matches.length === 0
          ? `No components reference token "${token}".`
          : `Components referencing "${token}":\n\n${JSON.stringify(matches, null, 2)}`,
      }],
    };
  }
);

server.tool(
  "get_platform_context",
  "Get a contract pre-filtered for a specific platform. Strips unsupported props, surfaces native names. Use as context for platform-specific code generation.",
  {
    id: z.string(),
    platform: z.enum(["web", "ios", "android", "macos", "windows"]),
  },
  async ({ id, platform }) => {
    const contract = loadContract(id);
    if (!contract) {
      return { content: [{ type: "text", text: `No contract found for: "${id}"` }], isError: true };
    }
    if (!contract.platforms.includes(platform)) {
      return {
        content: [{
          type: "text",
          text: `"${id}" does not target "${platform}". Supported: ${contract.platforms.join(", ")}`,
        }],
        isError: true,
      };
    }

    const filteredProps: Record<string, unknown> = {};
    for (const [name, def] of Object.entries(contract.props)) {
      const override = def.platforms?.[platform];
      if (override?.supported === false) continue;
      const { platforms: _p, ...rest } = def;
      filteredProps[name] = {
        ...rest,
        ...(override?.nativeName ? { nativeName: override.nativeName } : {}),
        ...(override?.notes ? { platformNote: override.notes } : {}),
      };
    }

    const context = {
      id: contract.id,
      version: contract.version,
      displayName: contract.displayName,
      description: contract.description,
      platform,
      platformNote: contract.platformNotes?.[platform] ?? null,
      tokens: contract.tokens,
      props: filteredProps,
      variants: contract.variants,
      states: contract.states,
      behavior: contract.behavior,
      accessibility: contract.accessibility,
      usage: contract.usage,
    };

    return { content: [{ type: "text", text: JSON.stringify(context, null, 2) }] };
  }
);

server.tool(
  "read_token_file",
  "Read a token file from the token architecture (primitive, semantic, or component).",
  {
    tier: z.enum(["primitive", "semantic", "component"]).describe("Token tier"),
    name: z.string().describe("Token file name (without .tokens.json extension)"),
  },
  async ({ tier, name }) => {
    const tokens = readTokenFile(tier, name);
    if (!tokens) {
      return {
        content: [{ type: "text", text: `No token file found: ${tier}/${name}.tokens.json` }],
        isError: true,
      };
    }
    return { content: [{ type: "text", text: JSON.stringify(tokens, null, 2) }] };
  }
);

server.tool(
  "list_token_files",
  "List all available token files in a tier.",
  {
    tier: z.enum(["primitive", "semantic", "component"]).describe("Token tier to list"),
  },
  async ({ tier }) => {
    const files = listTokenFiles(tier);
    return {
      content: [{
        type: "text",
        text: files.length === 0
          ? `No token files in ${tier} tier`
          : `${tier} tier token files:\n${files.map((f) => `  - ${f}`).join("\n")}`,
      }],
    };
  }
);

server.tool(
  "validate_contract",
  "Validate a contract against the JSON schema and token references.",
  { id: z.string().describe("Component ID") },
  async ({ id }) => {
    const { stdout, stderr, code } = await runCommand("pnpm", ["validate"], PROJECT_ROOT);

    // Extract validation result for this specific contract
    const lines = stdout.split("\n");
    const contractLine = lines.find((l) => l.includes(`${id}.contract.json`));

    if (!contractLine) {
      return {
        content: [{ type: "text", text: `Contract "${id}" not found or validation inconclusive.\n\nFull output:\n${stdout}` }],
        isError: true,
      };
    }

    const passed = contractLine.includes("✓");
    return {
      content: [{
        type: "text",
        text: passed
          ? `✓ Contract "${id}" passed validation`
          : `✗ Contract "${id}" failed validation\n\n${stderr || stdout}`,
      }],
      isError: !passed,
    };
  }
);

server.tool(
  "build_tokens",
  "Build Figma variable collections (Primitives and Semantic) from token files. Requires .component-contracts with Figma credentials.",
  {},
  async () => {
    const { stdout, stderr, code } = await runCommand(
      "pnpm",
      ["run", "build:figma-tokens"],
      PROJECT_ROOT
    );

    const success = code === 0;
    const output = success ? stdout : stderr || stdout;

    return {
      content: [{
        type: "text",
        text: success
          ? `✓ Token build succeeded\n\n${output}`
          : `✗ Token build failed\n\n${output}`,
      }],
      isError: !success,
    };
  }
);

server.tool(
  "build_component",
  "Build a Figma component set from a contract. Requires .component-contracts with Figma credentials.",
  { id: z.string().describe("Component ID (e.g., 'button', 'accordion')") },
  async ({ id }) => {
    const { stdout, stderr, code } = await runCommand(
      "pnpm",
      ["run", "build:figma-component", `--component=${id}`],
      PROJECT_ROOT
    );

    const success = code === 0;
    const output = success ? stdout : stderr || stdout;

    return {
      content: [{
        type: "text",
        text: success
          ? `✓ Component "${id}" build succeeded\n\n${output}`
          : `✗ Component "${id}" build failed\n\n${output}`,
      }],
      isError: !success,
    };
  }
);

// ─── Start ────────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("[component-contracts] MCP server running");
