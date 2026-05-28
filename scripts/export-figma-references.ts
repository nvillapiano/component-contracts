#!/usr/bin/env tsx
/**
 * Export Figma component frames as PNG images for visual reference in Storybook
 *
 * Usage:
 *   pnpm run export-figma-references
 *
 * Requires:
 *   - .component-contracts file with FIGMA_ACCESS_TOKEN and FIGMA_FILE_KEY
 */

import * as fs from "fs";
import * as path from "path";

// Use native fetch available in Node 18+

// ─── Config ──────────────────────────────────────────────────────────────────

interface Config {
  FIGMA_ACCESS_TOKEN: string;
  FIGMA_FILE_KEY: string;
}

function loadConfig(): Config {
  const configPath = path.join(process.cwd(), ".component-contracts");

  if (!fs.existsSync(configPath)) {
    throw new Error(
      `Configuration file not found: ${configPath}\n` +
      `Please create .component-contracts with FIGMA_ACCESS_TOKEN and FIGMA_FILE_KEY\n` +
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

  if (!config.FIGMA_ACCESS_TOKEN || !config.FIGMA_FILE_KEY) {
    throw new Error(
      "Missing FIGMA_ACCESS_TOKEN or FIGMA_FILE_KEY in .component-contracts"
    );
  }

  return config as Config;
}

// ─── Figma API ───────────────────────────────────────────────────────────────

async function getFigmaFile(
  fileKey: string,
  token: string
): Promise<Record<string, any>> {
  const url = `https://api.figma.com/v1/files/${fileKey}`;

  const response = await fetch(url, {
    headers: { "X-Figma-Token": token },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Figma file: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<Record<string, any>>;
}

interface NodeExportOptions {
  fileKey: string;
  nodeIds: string[];
  token: string;
  scale?: number;
  format?: "PNG" | "SVG" | "PDF";
}

async function exportNodes(options: NodeExportOptions): Promise<string[]> {
  const {
    fileKey,
    nodeIds,
    token,
    scale = 2,
    format = "PNG",
  } = options;

  const url = new URL(`https://api.figma.com/v1/images/${fileKey}`);
  url.searchParams.set("ids", nodeIds.join(","));
  url.searchParams.set("scale", scale.toString());
  url.searchParams.set("format", format.toLowerCase());

  const response = await fetch(url.toString(), {
    headers: { "X-Figma-Token": token },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to export nodes: ${response.status} ${response.statusText}`
    );
  }

  const data = (await response.json()) as {
    images: Record<string, string | null>;
  };
  return Object.values(data.images).filter(
    (url) => url !== null
  ) as string[];
}

// ─── Node discovery ──────────────────────────────────────────────────────────

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
}

function findComponentFrames(
  nodes: FigmaNode[],
  componentName: string
): FigmaNode[] {
  const frames: FigmaNode[] = [];

  function traverse(node: FigmaNode) {
    if (
      node.type === "FRAME" &&
      node.name.includes(componentName)
    ) {
      frames.push(node);
    }

    if (node.children) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }

  for (const node of nodes) {
    traverse(node);
  }

  return frames;
}

// ─── Export logic ────────────────────────────────────────────────────────────

async function downloadImage(url: string, filepath: string): Promise<void> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();
  fs.writeFileSync(filepath, Buffer.from(buffer));
  console.log(`  ✓ ${path.relative(process.cwd(), filepath)}`);
}

interface ComponentExport {
  name: string;
  nodeIds: string[];
  outputDir: string;
}

async function exportComponentReferences(
  components: ComponentExport[],
  config: Config
): Promise<void> {
  console.log("Fetching Figma file structure...");
  const figmaFile = await getFigmaFile(config.FIGMA_FILE_KEY, config.FIGMA_ACCESS_TOKEN);

  const fileDocument = figmaFile.document as FigmaNode;
  const pages = (fileDocument.children || []) as FigmaNode[];

  for (const component of components) {
    console.log(`\nExporting ${component.name} frames...`);

    // Find all frames for this component
    const frames = findComponentFrames(
      pages,
      component.name
    );

    if (frames.length === 0) {
      console.warn(`  ⚠ No frames found for ${component.name}`);
      continue;
    }

    // Export frames as images
    const nodeIds = frames.map((f) => f.id);
    console.log(`  Found ${nodeIds.length} frame(s), exporting...`);

    const imageUrls = await exportNodes({
      fileKey: config.FIGMA_FILE_KEY,
      nodeIds,
      token: config.FIGMA_ACCESS_TOKEN,
      scale: 2,
      format: "PNG",
    });

    // Download and save images
    fs.mkdirSync(component.outputDir, { recursive: true });

    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i];
      const url = imageUrls[i];

      if (!url) {
        console.warn(`  ⚠ No URL for frame: ${frame.name}`);
        continue;
      }

      const sanitizedName = frame.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      const filepath = path.join(
        component.outputDir,
        `${sanitizedName}.png`
      );

      await downloadImage(url, filepath);
    }
  }

  console.log("\n✓ Export complete!");
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  try {
    const config = loadConfig();

    const components: ComponentExport[] = [
      {
        name: "Button",
        nodeIds: [], // Populated by findComponentFrames
        outputDir: path.join(
          process.cwd(),
          "apps/web/public/figma-references"
        ),
      },
      {
        name: "Accordion",
        nodeIds: [], // Populated by findComponentFrames
        outputDir: path.join(
          process.cwd(),
          "apps/web-components/public/figma-references"
        ),
      },
    ];

    await exportComponentReferences(components, config);
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
