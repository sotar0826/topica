// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Cloudflare Pages デプロイ後の本番URL。独自ドメイン移行時に変更する。
  site: 'https://topica.pages.dev',
  integrations: [
    sitemap({
      // 管理ページ（非公開）はサイトマップから除外する。
      filter: (page) => !page.includes('/kanri-'),
    }),
  ],
});
