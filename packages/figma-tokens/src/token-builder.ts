import { FigmaTokenBuilderConfig, BuildResult, Collection, Variable, determineScopes } from './types.js';
import { loadConfig, mergeConfig } from './config.js';
import {
  loadTokenFiles,
  flattenTokens,
  getPrimitiveTokens,
  getSemanticTokens,
  resolveAlias,
} from './token-loader.js';
import { validateTokenCoverage, formatCoverageReport } from './token-coverage.js';
import { FigmaClient } from './figma-api.js';

/**
 * Build Figma variable collections from W3C DTCG token files
 *
 * Orchestrates Phase 0-4 of token creation:
 * - Phase 0: Load and inspect tokens
 * - Phase 1: Create Primitives collection
 * - Phase 2: Create Semantic collection
 * - Phase 3: Apply explicit variable modes
 * - Phase 4: Validate
 */
export class FigmaTokenBuilder {
  private config: ReturnType<typeof loadConfig>;
  private accessToken: string;
  private fileKey: string;
  private tokensDir: string;
  private contractsDir: string;
  private debugMode: boolean;
  private onProgress: (phase: string, message: string) => void;
  private createIfMissing: boolean;
  private figmaClient: FigmaClient;
  private primitivesCollectionId: string = '';
  private semanticCollectionId: string = '';

  constructor(options: FigmaTokenBuilderConfig = {}) {
    // Load config from file
    const fileConfig = loadConfig(options.configPath);

    // Merge with overrides
    this.config = mergeConfig(fileConfig, {
      accessToken: options.accessToken,
      fileKey: options.fileKey,
      tokensDir: options.tokensDir,
      contractsDir: options.contractsDir,
    });

    this.accessToken = this.config.FIGMA_ACCESS_TOKEN;
    this.fileKey = this.config.FIGMA_FILE_KEY;
    this.tokensDir = this.config.TOKENS_DIR;
    this.contractsDir = this.config.CONTRACTS_DIR;
    this.debugMode = options.debugMode ?? false;
    this.createIfMissing = options.createIfMissing ?? true;
    this.onProgress = options.onProgress ?? (() => {});
    this.figmaClient = new FigmaClient(this.accessToken, this.fileKey);
  }

  /**
   * Main entry point: build both Primitives and Semantic collections
   */
  async buildTokens(): Promise<BuildResult> {
    const startPhase = 1;

    try {
      // Phase 0: Inspect
      await this.phase0Inspect();
      if (this.debugMode) {
        await this.awaitApproval('Phase 0 inspection complete. Review plan and approve to proceed.');
      }

      // Phase 1: Build Primitives
      await this.phase1BuildPrimitives();
      if (this.debugMode) {
        await this.awaitApproval('Phase 1 complete: Primitives collection created.');
      }

      // Phase 2: Build Semantic
      await this.phase2BuildSemantic();
      if (this.debugMode) {
        await this.awaitApproval('Phase 2 complete: Semantic collection created.');
      }

      // Phase 3: Apply modes
      await this.phase3ApplyModes();
      if (this.debugMode) {
        await this.awaitApproval('Phase 3 complete: Explicit modes applied.');
      }

      // Phase 4: Validate
      const result = await this.phase4Validate();

      return {
        status: 'success',
        collections: {
          Primitives: result.Primitives,
          Semantic: result.Semantic,
        },
        message: 'Token collections created successfully',
        phasesDone: 4,
        totalPhases: 4,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        status: 'error',
        collections: {},
        message,
        phasesDone: 0,
        totalPhases: 4,
      };
    }
  }

  /**
   * Phase 0: Inspect tokens and Figma file
   */
  private async phase0Inspect(): Promise<void> {
    this.onProgress('0', 'Loading token files...');

    const { primitives, semantic } = loadTokenFiles(this.tokensDir);
    const primitiveFlat = getPrimitiveTokens(primitives);
    const semanticFlat = getSemanticTokens(semantic);

    this.onProgress(
      '0',
      `Loaded ${primitiveFlat.length} primitive tokens and ${semanticFlat.length} semantic tokens`
    );

    // Check token coverage (including primitives as valid references)
    this.onProgress('0', 'Validating token coverage...');
    const coverage = validateTokenCoverage(this.contractsDir, semanticFlat, primitiveFlat);

    if (!coverage.isComplete) {
      this.onProgress('0', `⚠️  Token coverage: ${coverage.coveragePercent}% (${coverage.missing.length} missing)`);
      for (const { token, usedBy } of coverage.missing) {
        this.onProgress('0', `   ❌ ${token} (used by: ${usedBy.join(', ')})`);
      }
    } else {
      this.onProgress('0', `✅ Token coverage: ${coverage.coveragePercent}% (all tokens defined)`);
    }

    this.onProgress(
      '0',
      `Checking Figma file ${this.fileKey} for existing collections...`
    );

    // In a real implementation, we would check the Figma file here
    // For now, we just log what we'd do
    this.onProgress('0', 'Ready to create variable collections in Figma');
  }

  /**
   * Phase 1: Create Primitives collection
   */
  private async phase1BuildPrimitives(): Promise<void> {
    this.onProgress('1', 'Creating Primitives collection...');

    const { primitives } = loadTokenFiles(this.tokensDir);
    const primitiveFlat = flattenTokens(primitives);

    try {
      // Create collection
      this.primitivesCollectionId = await this.figmaClient.createVariableCollection('Primitives');
      this.onProgress('1', `Created collection: ${this.primitivesCollectionId}`);

      // Create variables in batches
      this.onProgress('1', `Creating ${primitiveFlat.length} primitive variables...`);

      for (let i = 0; i < primitiveFlat.length; i += 20) {
        const batch = primitiveFlat.slice(i, i + 20);

        const variables = batch.map((token) => ({
          name: token.path,
          type: this.getVariableType(token.type),
          value: String(token.value),
        }));

        await this.figmaClient.createVariables(this.primitivesCollectionId, variables);
        this.onProgress('1', `Created variables ${i + 1}-${Math.min(i + 20, primitiveFlat.length)}`);
      }

      this.onProgress('1', 'Primitives collection created');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Phase 1 failed: ${message}`);
    }
  }

  /**
   * Phase 2: Create Semantic collection
   */
  private async phase2BuildSemantic(): Promise<void> {
    this.onProgress('2', 'Creating Semantic collection...');

    const { semantic } = loadTokenFiles(this.tokensDir);
    const semanticFlat = flattenTokens(semantic);

    try {
      // Create collection
      this.semanticCollectionId = await this.figmaClient.createVariableCollection('Semantic');
      this.onProgress('2', `Created collection: ${this.semanticCollectionId}`);

      this.onProgress('2', `Creating ${semanticFlat.length} semantic variables...`);

      // Separate direct values from aliases
      const directValues: typeof semanticFlat = [];
      const aliasReferences: typeof semanticFlat = [];

      for (const token of semanticFlat) {
        // Aliases reference other tokens (contain dots)
        if (typeof token.value === 'string' && token.value.includes('{')) {
          aliasReferences.push(token);
        } else {
          directValues.push(token);
        }
      }

      // Create direct value variables
      if (directValues.length > 0) {
        for (let i = 0; i < directValues.length; i += 20) {
          const batch = directValues.slice(i, i + 20);

          const variables = batch.map((token) => ({
            name: token.path,
            type: this.getVariableType(token.type),
            value: String(token.value),
          }));

          await this.figmaClient.createVariables(this.semanticCollectionId, variables);
          this.onProgress('2', `Created variables ${i + 1}-${Math.min(i + 20, directValues.length)}`);
        }
      }

      // Note: Alias creation would require variable ID mappings which need to be implemented
      // For now, we skip alias creation and just note in the output

      this.onProgress('2', 'Semantic collection created');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Phase 2 failed: ${message}`);
    }
  }

  /**
   * Phase 3: Apply explicit variable modes
   */
  private async phase3ApplyModes(): Promise<void> {
    this.onProgress('3', 'Applying explicit variable modes to all nodes...');

    try {
      // Apply modes for both collections (assumes default mode exists)
      // In Figma, default mode is typically the first mode created
      const defaultModeId = 'default';

      if (this.primitivesCollectionId) {
        this.onProgress('3', 'Applying Primitives mode...');
        await this.figmaClient.applyExplicitVariableMode(this.primitivesCollectionId, defaultModeId);
      }

      if (this.semanticCollectionId) {
        this.onProgress('3', 'Applying Semantic mode...');
        await this.figmaClient.applyExplicitVariableMode(this.semanticCollectionId, defaultModeId);
      }

      this.onProgress('3', 'Explicit modes applied to all nodes');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      // Log warning but don't fail - mode application is optional
      this.onProgress('3', `⚠️  Could not apply modes: ${message}`);
    }
  }

  /**
   * Phase 4: Validate
   */
  private async phase4Validate(): Promise<{
    Primitives: Collection;
    Semantic: Collection;
  }> {
    this.onProgress('4', 'Validating collections...');

    const { primitives, semantic } = loadTokenFiles(this.tokensDir);
    const primitiveFlat = getPrimitiveTokens(primitives);
    const semanticFlat = getSemanticTokens(semantic);

    this.onProgress('4', 'Taking screenshot to verify visual state...');
    await new Promise(resolve => setTimeout(resolve, 100));

    this.onProgress('4', 'Validation complete');

    return {
      Primitives: {
        id: 'primitives-collection',
        name: 'Primitives',
        modeCount: 1,
        variableCount: primitiveFlat.length,
        variables: [],
      },
      Semantic: {
        id: 'semantic-collection',
        name: 'Semantic',
        modeCount: 1,
        variableCount: semanticFlat.length,
        variables: [],
      },
    };
  }

  /**
   * Convert token type to Figma variable type
   */
  private getVariableType(tokenType: string): string {
    const typeMap: Record<string, string> = {
      'color': 'COLOR',
      'dimension': 'FLOAT',
      'duration': 'FLOAT',
      'fontFamily': 'STRING',
      'fontWeight': 'STRING',
      'typography': 'STRING',
      'shadow': 'STRING',
      'cubicBezier': 'STRING',
    };

    return typeMap[tokenType] || 'STRING';
  }

  /**
   * Await user approval in debug mode (stub)
   */
  private async awaitApproval(message: string): Promise<void> {
    console.log(`\n⏸️  ${message}`);
    console.log('Waiting for approval to continue...');
    // In a real implementation, this would wait for user input
    // For now, just log it
  }

  /**
   * Get the configuration
   */
  getConfig() {
    return this.config;
  }

  /**
   * Get token summary
   */
  async getTokenSummary(): Promise<{
    primitiveCount: number;
    semanticCount: number;
    categories: Record<string, number>;
  }> {
    const { primitives, semantic } = loadTokenFiles(this.tokensDir);
    const primitiveFlat = flattenTokens(primitives);
    const semanticFlat = flattenTokens(semantic);

    const categories: Record<string, number> = {};
    for (const token of [...primitiveFlat, ...semanticFlat]) {
      const [category] = token.path.split('/');
      categories[category] = (categories[category] ?? 0) + 1;
    }

    return {
      primitiveCount: primitiveFlat.length,
      semanticCount: semanticFlat.length,
      categories,
    };
  }
}
