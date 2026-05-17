/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'contracts',   // contract file changes
        'tokens',      // token file changes
        'schema',      // JSON Schema / TypeScript types
        'mcp',         // MCP server
        'figma',       // Figma skills and generation
        'web',         // React web implementation
        'web-components', // Web Components implementation
        'ios',         // iOS implementation
        'android',     // Android implementation
        'validator',   // contract validator app
        'docs',        // documentation
        'ci',          // CI/CD workflows
        'deps',        // dependency updates
        'release',     // release commits
      ],
    ],
    'scope-case': [2, 'always', 'kebab-case'],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 200],
  },
};
