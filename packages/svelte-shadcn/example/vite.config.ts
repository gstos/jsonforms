import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [svelte(), tailwindcss()],
  resolve: {
    // Point at the workspace source so `pnpm dev` works without first running
    // `pnpm build` on @jsonforms/examples. The package's main/module fields
    // resolve to lib/, which is empty until built.
    alias: {
      '@jsonforms/examples': fileURLToPath(
        new URL('../../examples/src/index.ts', import.meta.url),
      ),
    },
  },
});
