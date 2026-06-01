import * as fs from 'fs';
import * as path from 'path';
import type { ComponentContract } from '@ds/schema';

/**
 * Load a single component contract
 */
export function loadContract(contractsDir: string, componentId: string): ComponentContract {
  const filePath = path.join(contractsDir, `${componentId}.contract.json`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Contract not found: ${filePath}`);
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as ComponentContract;
  } catch (error) {
    throw new Error(`Failed to parse contract ${componentId}: ${error}`);
  }
}

/**
 * Load all component contracts
 */
export function loadAllContracts(contractsDir: string): Record<string, ComponentContract> {
  const contracts: Record<string, ComponentContract> = {};

  if (!fs.existsSync(contractsDir)) {
    throw new Error(`Contracts directory not found: ${contractsDir}`);
  }

  for (const file of fs.readdirSync(contractsDir)) {
    if (file.endsWith('.contract.json')) {
      const componentId = file.replace('.contract.json', '');
      try {
        contracts[componentId] = loadContract(contractsDir, componentId);
      } catch (error) {
        console.error(`Failed to load contract ${componentId}:`, error);
      }
    }
  }

  return contracts;
}

/**
 * Validate a contract against expected structure
 */
export function validateContract(contract: ComponentContract): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!contract.id) errors.push('Missing required field: id');
  if (!contract.version) errors.push('Missing required field: version');
  if (!contract.displayName) errors.push('Missing required field: displayName');
  if (!contract.props) errors.push('Missing required field: props');

  // Contract tokens
  if (!contract.tokens) {
    warnings.push('No tokens defined in contract');
  } else {
    if (!contract.tokens.color) {
      warnings.push('No color tokens defined');
    }
    if (!contract.tokens.spacing) {
      warnings.push('No spacing tokens defined');
    }
  }

  // Props validation
  if (contract.props) {
    const propKeys = Object.keys(contract.props);
    if (propKeys.length === 0) {
      warnings.push('No component properties defined');
    }
  }

  // Composition validation
  if (!contract.composition) {
    warnings.push('No composition defined (slots)');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get contract token paths
 */
export function getContractTokenPaths(tokens: Record<string, Record<string, string>> | undefined): {
  category: string;
  key: string;
  value: string;
}[] {
  const paths: Array<{ category: string; key: string; value: string }> = [];

  if (!tokens) return paths;

  for (const [category, values] of Object.entries(tokens)) {
    for (const [key, value] of Object.entries(values)) {
      paths.push({ category, key, value: String(value) });
    }
  }

  return paths;
}
