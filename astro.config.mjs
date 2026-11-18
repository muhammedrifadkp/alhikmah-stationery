// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://alhikmah-stationery.vercel.app',
  build: { inlineStylesheets: 'always' },
  compressHTML: true,
});
