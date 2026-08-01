// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkHanreiLink from './src/lib/remark-hanrei-link.mjs';
import { shouldIncludeInSitemap } from './src/data/quality-gates.mjs';

// https://astro.build/config
export default defineConfig({
  // Cloudflare Pages デプロイ後の本番URL。独自ドメイン移行時に変更する。
  site: 'https://topica-law.com',
  integrations: [
    sitemap({
      // noindex対象と、内容の拡充が完了していない簡易ページはサイトマップから除外する。
      filter: shouldIncludeInSitemap,
    }),
  ],
  markdown: {
    // 判例名の自動リンク化（本文中の「最大判平成29年3月15日」等の日付表記・
    // 通称を /hanrei/<slug>/ へのリンクに変換）。対応表は
    // scripts/gen-hanrei-map.mjs が npm run build の前段で生成する。
    remarkPlugins: [remarkHanreiLink],
  },
});
