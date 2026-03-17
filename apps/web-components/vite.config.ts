import { defineConfig } from "vite";
import { resolve } from "path";
import fs from "fs";
import path from "path";

export default defineConfig({
  // Serve from package root, not demo/
  root: ".",

  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "DSWebComponents",
      formats: ["es"],
      fileName: "index",
    },
    outDir: "dist",
    emptyOutDir: true,
  },

  plugins: [
    {
      name: "serve-tokens-css",
      configureServer(server) {
        server.middlewares.use("/tokens.css", (_req, res) => {
          const tokensPath = path.resolve(
            __dirname,
            "../../packages/tokens/dist/css/tokens.css"
          );
          res.setHeader("Content-Type", "text/css");
          res.end(fs.readFileSync(tokensPath, "utf-8"));
        });
        server.middlewares.use("/fonts.css", (_req, res) => {
          const fontsPath = path.resolve(
            __dirname,
            "../../packages/tokens/dist/css/fonts.css"
          );
          res.setHeader("Content-Type", "text/css");
          res.end(fs.readFileSync(fontsPath, "utf-8"));
        });
        server.middlewares.use("/reset.css", (_req, res) => {
          const resetPath = path.resolve(
            __dirname,
            "../../packages/tokens/dist/css/reset.css"
          );
          res.setHeader("Content-Type", "text/css");
          res.end(fs.readFileSync(resetPath, "utf-8"));
        });
      },
    },
  ],
});