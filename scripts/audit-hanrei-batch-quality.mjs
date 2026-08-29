import fs from "node:fs";
import path from "node:path";

const DIST = path.resolve("dist");
const SITEMAP = path.join(DIST, "sitemap-0.xml");
const MIN_VISIBLE_CHARS = 3_200;
const MIN_H2_COUNT = 8;
const CASES = [
  "apaman-shop-jiken-h22",
  "bulldog-source-jiken-h19",
  "golf-club-meisho-zokuyo-h16",
  "hikokai-kaisha-tokubetsu-ketsugi-h24",
  "iriai-ken-koyu-hitsuyo-s41",
  "juyo-zaisan-shobun-h6",
  "kansetsu-rieki-soran-s43",
  "kashidashi-ringisho-jiko-riyo-h11",
  "shinsetsu-bunkatsu-sagai-h24",
  "torishimariyaku-murishi-kashitsuke-s38",
  "torishimariyakukai-ketsugi-ketsu-s40",
  "yawata-seitetsu-seiji-kenkin-s45",
];

function textOf(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[^;]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const errors = [];
if (!fs.existsSync(SITEMAP)) {
  console.error("[audit-hanrei-batch-quality] dist/sitemap-0.xml がありません。先にAstroをビルドしてください");
  process.exit(1);
}
const sitemap = fs.readFileSync(SITEMAP, "utf8");

for (const slug of CASES) {
  const file = path.join(DIST, "hanrei", slug, "index.html");
  const canonicalUrl = `https://topica-law.com/hanrei/${slug}/`;
  if (!fs.existsSync(file)) {
    errors.push(`${slug}: HTMLがありません`);
    continue;
  }

  const html = fs.readFileSync(file, "utf8");
  const article = html.match(/<article[^>]*data-pagefind-body[^>]*>([\s\S]*?)<\/article>/i)?.[1] ?? "";
  const visibleText = textOf(article);
  const h2Count = (article.match(/<h2(?:\s|>)/gi) ?? []).length;

  if (/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html)) errors.push(`${slug}: noindexが残っています`);
  if (visibleText.length < MIN_VISIBLE_CHARS) {
    errors.push(`${slug}: 可視本文が短すぎます（${visibleText.length}字 / ${MIN_VISIBLE_CHARS}字以上）`);
  }
  if (h2Count < MIN_H2_COUNT) errors.push(`${slug}: h2が不足しています（${h2Count}個 / ${MIN_H2_COUNT}個以上）`);
  for (const heading of ["事実の概要", "判旨", "射程", "答案"]) {
    if (!visibleText.includes(heading)) errors.push(`${slug}: 「${heading}」の説明がありません`);
  }
  if (!html.includes(`<link rel="canonical" href="${canonicalUrl}">`)) errors.push(`${slug}: canonicalが正しくありません`);
  if (!html.includes('"@type":"Article"')) errors.push(`${slug}: Article構造化データがありません`);
  if (!html.includes("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js")) errors.push(`${slug}: AdSenseコードがありません`);
  if (!sitemap.includes(`<loc>${canonicalUrl}</loc>`)) errors.push(`${slug}: サイトマップにありません`);
}

if (errors.length) {
  console.error(`[audit-hanrei-batch-quality] ${errors.length}件の問題を検出`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `[audit-hanrei-batch-quality] ${CASES.length}ページを検査: 本文${MIN_VISIBLE_CHARS}字以上・h2 ${MIN_H2_COUNT}個以上・百選級構成・公開設定すべて正常`,
);
