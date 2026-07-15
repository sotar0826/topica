// 構造化データ（JSON-LD）を組み立てるヘルパー。
// 各ページテンプレートで生成し、BaseLayout の jsonLd prop に渡す。

import { SITE_URL as SITE } from "./site";

/** Date を YYYY-MM-DD 形式（ISO日付部分）にする */
export const ymd = (d: Date): string => d.toISOString().slice(0, 10);

/** サイトルート基準のパスを絶対URLにする */
export const abs = (path: string): string => new URL(path, SITE).href;

/** 記事ページ用の Article 構造化データ */
export function articleLd(opts: {
  title: string;
  description: string;
  url: string;
  published?: Date;
  updated?: Date;
}): Record<string, any> {
  const ld: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    inLanguage: "ja",
    mainEntityOfPage: opts.url,
    author: { "@type": "Organization", name: "トピカ", url: SITE },
    publisher: {
      "@type": "Organization",
      name: "トピカ",
      logo: { "@type": "ImageObject", url: `${SITE}/ogp-default.png` },
    },
  };
  if (opts.published) ld.datePublished = ymd(opts.published);
  const modified = opts.updated ?? opts.published;
  if (modified) ld.dateModified = ymd(modified);
  return ld;
}

/** パンくず用の BreadcrumbList 構造化データ。url を持たない項目は item を省略する */
export function breadcrumbLd(
  items: { name: string; url?: string }[]
): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      ...(it.url ? { item: it.url } : {}),
    })),
  };
}
