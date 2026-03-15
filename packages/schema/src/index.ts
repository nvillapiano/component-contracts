export * from "./types.js";

// Re-export schema JSON for tools that need it at runtime
import schema from "../schema.json" assert { type: "json" };
export { schema };
