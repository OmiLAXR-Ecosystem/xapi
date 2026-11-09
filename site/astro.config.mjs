import { defineConfig } from "astro/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Where the site is served. In CI these come from actions/configure-pages, so a
// custom domain (CNAME) only changes the environment, not the code.
const site = process.env.SITE_URL || "https://omilaxr-ecosystem.github.io";
const base = process.env.BASE_PATH || "/xapi";

// Must match INDEX_PLACEHOLDER in src/lib/definitions.ts.
const INDEX_PLACEHOLDER = "__index__";

/** Renames pages built as "__index__.html" to "index.html" (see pageParam()). */
function restoreIndexPages() {
  return {
    name: "restore-index-pages",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        const root = path.join(fileURLToPath(dir), "definitions");
        for (const file of await fs.readdir(root, { recursive: true })) {
          if (path.basename(file) === `${INDEX_PLACEHOLDER}.html`) {
            await fs.rename(path.join(root, file), path.join(root, path.dirname(file), "index.html"));
          }
        }
      },
    },
  };
}

export default defineConfig({
  site,
  base,
  // "<id>.html" instead of "<id>/index.html": GitHub Pages then serves
  // /definitions/<id> without a redirect to a trailing slash.
  build: { format: "file" },
  trailingSlash: "never",
  integrations: [restoreIndexPages()],
});
