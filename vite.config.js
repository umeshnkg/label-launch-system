import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readdirSync, existsSync } from 'node:fs';

// Every releases/<slug>/index.html is a page. Run `npm run gen` to regenerate
// the case-study pages from src/releases.js before building.
const releasesDir = resolve(import.meta.dirname, 'releases');
const releasePages = {};
if (existsSync(releasesDir)) {
  for (const slug of readdirSync(releasesDir)) {
    const file = resolve(releasesDir, slug, 'index.html');
    if (existsSync(file)) releasePages[`release-${slug}`] = file;
  }
}

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        ...releasePages,
      },
    },
  },
});
