import * as fs from 'fs';
import * as path from 'path';
import { Config } from './types.js';

/**
 * Load configuration from .component-contracts file
 */
export function loadConfig(configPath: string = '.component-contracts'): Config {
  const fullPath = path.isAbsolute(configPath) ? configPath : path.join(process.cwd(), configPath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(
      `Configuration file not found: ${fullPath}\n` +
      `Please create .component-contracts with required values.\n` +
      `See .component-contracts.example for reference.`
    );
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  const config: Record<string, string> = {};

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const match = trimmed.match(/^([A-Z_]+)=(.+)$/);
    if (match) {
      config[match[1]] = match[2].trim();
    }
  }

  const required = ['FIGMA_ACCESS_TOKEN', 'FIGMA_FILE_KEY', 'TOKENS_DIR', 'CONTRACTS_DIR'];
  const missing = required.filter(key => !config[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing configuration values: ${missing.join(', ')}\n` +
      `Update .component-contracts with all required fields.`
    );
  }

  return config as unknown as Config;
}

/**
 * Merge config from file and overrides
 */
export function mergeConfig(
  fileConfig: Config,
  overrides?: {
    accessToken?: string;
    fileKey?: string;
    tokensDir?: string;
    contractsDir?: string;
  }
): Config {
  return {
    FIGMA_ACCESS_TOKEN: overrides?.accessToken || fileConfig.FIGMA_ACCESS_TOKEN,
    FIGMA_FILE_KEY: overrides?.fileKey || fileConfig.FIGMA_FILE_KEY,
    TOKENS_DIR: overrides?.tokensDir || fileConfig.TOKENS_DIR,
    CONTRACTS_DIR: overrides?.contractsDir || fileConfig.CONTRACTS_DIR,
  };
}
