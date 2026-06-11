// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Cloudflare Pages デプロイ後の本番URL。独自ドメイン移行時に変更する。
  site: 'https://topica.pages.dev',
});
