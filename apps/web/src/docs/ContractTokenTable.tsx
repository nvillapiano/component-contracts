import type { ComponentContract } from "@ds/schema";
import tokens from "@ds/tokens/json";
import { Subheading } from "@storybook/blocks";
import "./ContractTokenTable.css";

// Temporary debug logging to inspect the resolved token JSON at runtime.
// eslint-disable-next-line no-console
console.log("ContractTokenTable tokens JSON", tokens);

export interface ContractTokenTableProps {
  tokens: ComponentContract["tokens"];
}

function resolveToken(path: string): string {
  const parts = path.split(".");
  let current: unknown = tokens;

  for (const part of parts) {
    if (typeof current !== "object" || current === null) return path;
    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === "string" ? current : path;
}

function isColorValue(value: string): boolean {
  const trimmed = value.trim().toLowerCase();
  return (
    trimmed.startsWith("#") ||
    trimmed.startsWith("rgb(") ||
    trimmed.startsWith("rgba(") ||
    trimmed.startsWith("hsl(") ||
    trimmed.startsWith("hsla(")
  );
}

export const ContractTokenTable = ({ tokens: contractTokens }: ContractTokenTableProps) => {
  if (!contractTokens) return null;

  const categories = Object.entries(contractTokens);
  if (categories.length === 0) return null;

  const rows = categories
    .sort(([a], [b]) => a.localeCompare(b))
    .flatMap(([category, roles]) => {
      if (!roles || typeof roles !== "object") return [];
      return Object.entries(roles as Record<string, string>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([role, path]) => {
          const resolved = resolveToken(path);
          const unresolved = resolved === path;
          const showColorSwatch = isColorValue(resolved);

          return { category, role, path, resolved, unresolved, showColorSwatch };
        });
    });

  if (rows.length === 0) return null;

  return (
    <div className="ds-contract-token-table">
      <Subheading>Tokens</Subheading>
      <table className="ds-contract-token-table__table">
        <thead>
          <tr>
            <th scope="col">Category</th>
            <th scope="col">Role</th>
            <th scope="col">Token path</th>
            <th scope="col">Resolved value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const isFirstInCategory =
              index === 0 || row.category !== rows[index - 1].category;

            return (
              <tr key={`${row.category}-${row.role}`}>
                <td className="ds-contract-token-table__category">
                  {isFirstInCategory
                    ? row.category.charAt(0).toUpperCase() + row.category.slice(1)
                    : ""}
                </td>
                <td className="ds-contract-token-table__role">{row.role}</td>
                <td className="ds-contract-token-table__path">{row.path}</td>
                <td>
                  <div
                    className={
                      "ds-contract-token-table__value" +
                      (row.unresolved ? " ds-contract-token-table__value--unresolved" : "")
                    }
                  >
                    {row.showColorSwatch && (
                      <span
                        className="ds-contract-token-table__swatch"
                        aria-hidden="true"
                        style={{ backgroundColor: row.resolved }}
                      />
                    )}
                    <span>{row.resolved}</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

