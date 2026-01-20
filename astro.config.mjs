import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Output static HTML files for best performance
  output: 'static',
  // Build to dist folder
  outDir: './dist',
  // Set the site URL for production
  site: 'https://xjenni.github.io/BGMI_SYNAPSE',
  // Set the base path for GitHub Pages deployment
  base: '/BGMI_SYNAPSE',
  // Configure the dev server
  server: {
    port: 4321,
    host: true
  },
  // Disable view transitions for simpler navigation
  prefetch: false
});
