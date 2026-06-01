/**
 * Figma REST API client for variable and component operations
 *
 * Handles:
 * - Variable collection creation and management
 * - Variable creation and semantic aliasing
 * - Explicit variable mode application
 * - Error handling and rate limiting
 */

export interface FigmaVariable {
  id: string;
  name: string;
  resolvedType: string;
  value?: string | number | boolean;
  valuesByMode?: Record<string, string>;
  aliasTo?: string;
}

export interface FigmaVariableCollection {
  id: string;
  name: string;
  modes: Array<{ modeId: string; name: string }>;
  variables: FigmaVariable[];
}

/**
 * Figma API client
 */
export class FigmaClient {
  private baseUrl = 'https://api.figma.com/v1';
  private accessToken: string;
  private fileKey: string;

  constructor(accessToken: string, fileKey: string) {
    this.accessToken = accessToken;
    this.fileKey = fileKey;
  }

  /**
   * Make authenticated request to Figma API
   */
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    body?: unknown
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    const response = await fetch(url, {
      method,
      headers: {
        'X-Figma-Token': this.accessToken,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Figma API error ${response.status}: ${response.statusText}\n${errorBody}`
      );
    }

    return response.json() as Promise<T>;
  }

  /**
   * Get existing variable collections
   */
  async getVariableCollections(): Promise<FigmaVariableCollection[]> {
    const data = await this.request<{
      collections: Array<{
        id: string;
        name: string;
        modes: Array<{ modeId: string; name: string }>;
      }>;
    }>('GET', `/files/${this.fileKey}/variables/collections`);

    return data.collections.map((c) => ({
      ...c,
      variables: [],
    }));
  }

  /**
   * Create a new variable collection
   */
  async createVariableCollection(name: string): Promise<string> {
    const data = await this.request<{ collectionId: string }>(
      'POST',
      `/files/${this.fileKey}/variables/collections`,
      { name }
    );

    return data.collectionId;
  }

  /**
   * Create variables in a collection
   */
  async createVariables(
    collectionId: string,
    variables: Array<{
      name: string;
      type: string;
      value: string | number | boolean;
    }>
  ): Promise<Array<{ id: string; name: string }>> {
    const data = await this.request<{
      variables: Array<{ id: string; name: string }>;
    }>('POST', `/files/${this.fileKey}/variables`, {
      variables: variables.map((v) => ({
        name: v.name,
        collectionId,
        resolvedType: v.type,
        value: v.value,
      })),
    });

    return data.variables;
  }

  /**
   * Create semantic aliases (variables referencing other variables)
   */
  async createAliases(
    collectionId: string,
    aliases: Array<{
      name: string;
      type: string;
      aliasTo: string;
    }>
  ): Promise<Array<{ id: string; name: string }>> {
    const data = await this.request<{
      variables: Array<{ id: string; name: string }>;
    }>('POST', `/files/${this.fileKey}/variables`, {
      variables: aliases.map((a) => ({
        name: a.name,
        collectionId,
        resolvedType: a.type,
        valuesByMode: {
          [collectionId]: {
            type: 'VARIABLE_ALIAS',
            id: a.aliasTo,
          },
        },
      })),
    });

    return data.variables;
  }

  /**
   * Apply explicit variable mode to all nodes in file
   */
  async applyExplicitVariableMode(collectionId: string, modeId: string): Promise<void> {
    await this.request(
      'POST',
      `/files/${this.fileKey}/variables/setExplicitVariableMode`,
      {
        collectionId,
        modeId,
      }
    );
  }

  /**
   * Get all nodes in file (for binding variables)
   */
  async getNodes(): Promise<Array<{ id: string; name: string }>> {
    const data = await this.request<{
      document: {
        children?: Array<{ id: string; name: string; children?: unknown[] }>;
      };
    }>('GET', `/files/${this.fileKey}?depth=2`);

    const nodes: Array<{ id: string; name: string }> = [];

    const traverse = (node: unknown) => {
      if (typeof node === 'object' && node !== null) {
        const n = node as { id?: string; name?: string; children?: unknown[] };
        if (n.id && n.name) {
          nodes.push({ id: n.id, name: n.name });
        }
        if (n.children) {
          n.children.forEach(traverse);
        }
      }
    };

    if (data.document.children) {
      data.document.children.forEach(traverse);
    }

    return nodes;
  }

  /**
   * Bind variable to a node's fill property
   */
  async bindVariableToNode(
    nodeId: string,
    variableId: string,
    property: 'fills' | 'strokes' | 'text' = 'fills'
  ): Promise<void> {
    await this.request('POST', `/files/${this.fileKey}/nodes/${nodeId}/variable_bindings`, {
      variableBindings: {
        [property]: [
          {
            variableId,
          },
        ],
      },
    });
  }
}
