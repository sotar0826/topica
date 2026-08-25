import fs from "node:fs";
import path from "node:path";

const DIST = path.resolve("dist");
const SITEMAP = path.join(DIST, "sitemap-0.xml");
const MIN_VISIBLE_CHARS = 2_500;
const MIN_H2_COUNT = 6;
const MIN_INTERNAL_LINKS = 8;
const MIN_QUESTIONS = 2;
const GUIDES = ["law-answer-writing-guide", "statute-reading-guide"];

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
  console.error("[audit-learning-guides] dist/sitemap-0.xml がありません。先にAstroをビルドしてください");
  process.exit(1);
}

const sitemap = fs.readFileSync(SITEMAP, "utf8");

for (const slug of GUIDES) {
  const file = path.join(DIST, "column", slug, "index.html");
  const canonicalUrl = `https://topica-law.com/column/${slug}/`;
  if (!fs.existsSync(file)) {
    errors.push(`${slug}: HTMLがありません`);
    continue;
  }

  const html = fs.readFileSync(file, "utf8");
  const article = html.match(/<article[^>]*data-pagefind-body[^>]*>([\s\S]*?)<\/article>/i)?.[1] ?? "";
  const visibleChars = textOf(article).length;
  const h2Count = (article.match(/<h2(?:\s|>)/gi) ?? []).length;
  const internalLinks = new Set(
    [...article.matchAll(/<a\s+[^>]*href=["']\/(?!\/|column\/(?:law-answer-writing-guide|statute-reading-guide)\/)[^"'#?]+/gi)]
      .map((match) => match[0]),
  ).size;
  const questions = (article.match(/<details(?:\s|>)/gi) ?? []).length;

  if (/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html)) {
    errors.push(`${slug}: noindexが残っています`);
  }
  if (visibleChars < MIN_VISIBLE_CHARS) {
    errors.push(`${slug}: 可視本文が短すぎます（${visibleChars}字 / ${MIN_VISIBLE_CHARS}字以上）`);
  }
  if (h2Count < MIN_H2_COUNT) errors.push(`${slug}: h2が不足しています（${h2Count}個）`);
  if (internalLinks < MIN_INTERNAL_LINKS) {
    errors.push(`${slug}: 内部リンクが不足しています（${internalLinks}本 / ${MIN_INTERNAL_LINKS}本以上）`);
  }
  if (questions < MIN_QUESTIONS) errors.push(`${slug}: 確認問題が不足しています（${questions}問）`);
  if (!html.includes(`<link rel="canonical" href="${canonicalUrl}">`)) {
    errors.push(`${slug}: canonicalが正しくありません`);
  }
  if (!html.includes('"@type":"Article"')) errors.push(`${slug}: Article構造化データがありません`);
  if (!html.includes("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js")) {
    errors.push(`${slug}: AdSenseコードがありません`);
  }
  if (!sitemap.includes(`<loc>${canonicalUrl}</loc>`)) errors.push(`${slug}: サイトマップにありません`);
}

if (errors.length) {
  console.error(`[audit-learning-guides] ${errors.length}件の問題を検出`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `[audit-learning-guides] ${GUIDES.length}ページを検査: 本文${MIN_VISIBLE_CHARS}字以上・h2 ${MIN_H2_COUNT}個以上・内部リンク${MIN_INTERNAL_LINKS}本以上・公開設定すべて正常`,
);
