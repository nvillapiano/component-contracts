export { FigmaTokenBuilder } from './token-builder.js';
export { FigmaTokenBuilderConfig, BuildResult, Collection, Variable } from './types.js';
export { loadConfig, mergeConfig } from './config.js';
export { loadTokenFiles, flattenTokens, getSemanticTokens, getPrimitiveTokens } from './token-loader.js';
export { validateTokenCoverage, formatCoverageReport } from './token-coverage.js';
export { FigmaClient } from './figma-api.js';

// Re-export types
export type { ComponentContract } from '@ds/schema';
export type { Config } from './types.js';
export type { CoverageReport } from './token-coverage.js';
export type { FigmaVariable, FigmaVariableCollection } from './figma-api.js';
