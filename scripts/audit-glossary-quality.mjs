import fs from "node:fs";
import path from "node:path";
import { INDEXABLE_YOUGO_SLUGS } from "../src/data/quality-gates.mjs";

const DIST = path.resolve("dist");
const SITEMAP = path.join(DIST, "sitemap-0.xml");
const MIN_VISIBLE_CHARS = 1_200;
const MIN_H2_COUNT = 3;

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
  console.error("[audit-glossary-quality] dist/sitemap-0.xml がありません。先にAstroをビルドしてください");
  process.exit(1);
}

const sitemap = fs.readFileSync(SITEMAP, "utf8");

for (const slug of INDEXABLE_YOUGO_SLUGS) {
  const file = path.join(DIST, "yougo", slug, "index.html");
  if (!fs.existsSync(file)) {
    errors.push(`${slug}: HTMLがありません`);
    continue;
  }

  const html = fs.readFileSync(file, "utf8");
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "";
  const visibleChars = textOf(main).length;
  const h2Count = (main.match(/<h2(?:\s|>)/gi) ?? []).length;
  const canonicalUrl = `https://topica-law.com/yougo/${slug}/`;

  if (/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html)) {
    errors.push(`${slug}: noindexが残っています`);
  }
  if (visibleChars < MIN_VISIBLE_CHARS) {
    errors.push(`${slug}: 可視本文が短すぎます（${visibleChars}字 / ${MIN_VISIBLE_CHARS}字以上）`);
  }
  if (h2Count < MIN_H2_COUNT) {
    errors.push(`${slug}: h2が不足しています（${h2Count}個 / ${MIN_H2_COUNT}個以上）`);
  }
  if (!html.includes(`<link rel="canonical" href="${canonicalUrl}">`)) {
    errors.push(`${slug}: canonicalが正しくありません`);
  }
  if (!html.includes('"@type":"DefinedTerm"')) {
    errors.push(`${slug}: DefinedTerm構造化データがありません`);
  }
  if (!/<article[^>]+data-pagefind-body/i.test(html)) {
    errors.push(`${slug}: Pagefind本文指定がありません`);
  }
  if (!html.includes("詳しく学べるトピック")) {
    errors.push(`${slug}: 関連トピック導線がありません`);
  }
  if (!html.includes("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js")) {
    errors.push(`${slug}: AdSenseコードがありません`);
  }
  if (!sitemap.includes(`<loc>${canonicalUrl}</loc>`)) {
    errors.push(`${slug}: サイトマップにありません`);
  }
}

if (errors.length) {
  console.error(`[audit-glossary-quality] ${errors.length}件の問題を検出`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `[audit-glossary-quality] ${INDEXABLE_YOUGO_SLUGS.length}ページを検査: 本文${MIN_VISIBLE_CHARS}字以上・h2 ${MIN_H2_COUNT}個以上・公開設定すべて正常`,
);
