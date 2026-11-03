// 教養の読みものサイト「余白」（/yohaku/ 以下）の定義。
// トピカ本体とは別サイトとして扱う：トピカのナビ・トップ・検索・RSS・記事からは一切リンクしない。
// 記事は src/content/yohaku/<slug>.md。frontmatter の category は下の YOHAKU_CATEGORIES の slug。

/** サイト名（ヘッダー・title に使う）。変更はここだけでよい */
export const YOHAKU_SITE_NAME = "余白";
export const YOHAKU_TAGLINE = "気になっていたことを、腰を据えて調べるノート";
export const YOHAKU_BASE = "/yohaku";

/** 検索エンジンに公開するか（定義は sitemap と共有するため quality-gates.mjs 側） */
export { YOHAKU_INDEXABLE } from "./quality-gates.mjs";

export type YohakuCategory = { slug: string; name: string; description: string };

export const YOHAKU_CATEGORIES: YohakuCategory[] = [
  { slug: "rekishi", name: "歴史", description: "出来事の経緯と、それをどう説明するかをめぐる議論。" },
  { slug: "kagaku", name: "科学と技術", description: "仕組みを、比喩に頼りすぎずに理解する。" },
  { slug: "keizai", name: "経済と社会", description: "お金・制度・市場が、なぜそのような形をしているのか。" },
  { slug: "kurashi", name: "食と暮らし", description: "身近なものの背後にある歴史と科学。" },
  { slug: "bunka", name: "芸術と文化", description: "作品と様式が生まれた理由を、時代の側から読む。" },
];

export function findYohakuCategory(slug: string): YohakuCategory | undefined {
  return YOHAKU_CATEGORIES.find((c) => c.slug === slug);
}

/** 本文の文字数から、読了時間の目安（分）を出す。日本語はおよそ毎分500字で計算 */
export function readingMinutes(body: string): number {
  const chars = body.replace(/^---[\s\S]*?---/, "").replace(/[\s#>*|`\-]/g, "").length;
  return Math.max(1, Math.round(chars / 500));
}
