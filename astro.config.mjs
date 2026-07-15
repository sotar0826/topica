// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Cloudflare Pages デプロイ後の本番URL。独自ドメイン移行時に変更する。
  site: 'https://topica-law.com',
  integrations: [
    sitemap({
      // 管理ページ（非公開）とアーカイブ済み科目（破産法）はサイトマップから除外する。
      filter: (page) => !page.includes('/kanri-') && !page.includes('/hasan/'),
    }),
  ],
});
