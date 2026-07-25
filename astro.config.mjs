// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkHanreiLink from './src/lib/remark-hanrei-link.mjs';

// https://astro.build/config
export default defineConfig({
  // Cloudflare Pages デプロイ後の本番URL。独自ドメイン移行時に変更する。
  site: 'https://topica-law.com',
  integrations: [
    sitemap({
      // 管理ページ（非公開）・アーカイブ済み科目（破産法）・判決全文ページ（裁判所サイト等と
      // 同一テキストで独自性がなくnoindexにしているため）はサイトマップから除外する。
      filter: (page) => !page.includes('/kanri-') && !page.includes('/hasan/') && !page.includes('/zenbun/'),
    }),
  ],
  markdown: {
    // 判例名の自動リンク化（本文中の「最大判平成29年3月15日」等の日付表記・
    // 通称を /hanrei/<slug>/ へのリンクに変換）。対応表は
    // scripts/gen-hanrei-map.mjs が npm run build の前段で生成する。
    remarkPlugins: [remarkHanreiLink],
  },
});
