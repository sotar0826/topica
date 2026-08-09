import fs from "node:fs";
import path from "node:path";

const DIST = path.resolve("dist");
const unfinishedPhrases = ["順次追加します", "順次追加予定です", "準備中"];
const htmlFiles = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name.endsWith(".html")) htmlFiles.push(file);
  }
}

function textOf(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[^;]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function meta(html, name) {
  return (
    html.match(new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["']([^"']*)`, "i"))?.[1] ??
    html.match(new RegExp(`<meta\\s+content=["']([^"']*)["']\\s+name=["']${name}["']`, "i"))?.[1] ??
    ""
  );
}

walk(DIST);

const errors = [];
const titles = new Map();
const descriptions = new Map();

for (const file of htmlFiles) {
  const rel = path.relative(DIST, file).replaceAll("\\", "/");
  const html = fs.readFileSync(file, "utf8");

  // Search Console の所有権確認ファイルは、Google指定の本文そのものなので監査対象外。
  if (rel.startsWith("google") && !html.includes("<html")) continue;

  const visibleText = textOf(html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "");
  for (const phrase of unfinishedPhrases) {
    if (visibleText.includes(phrase)) errors.push(`${rel}: 公開面に「${phrase}」が残っています`);
  }

  const noindex = /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html);
  const hasAdsense = html.includes("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js");
  if (noindex && hasAdsense) errors.push(`${rel}: noindexページでAdSenseコードを読み込んでいます`);
  if (noindex) continue;

  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "";
  const description = meta(html, "description");
  const canonical = /<link\s+rel=["']canonical["']\s+href=["'][^"']+/i.test(html);

  if (!title) errors.push(`${rel}: titleがありません`);
  if (!description) errors.push(`${rel}: meta descriptionがありません`);
  if (!canonical) errors.push(`${rel}: canonicalがありません`);
  if (visibleText.length < 150) errors.push(`${rel}: 公開本文が極端に短い状態です（${visibleText.length}字）`);

  if (title) titles.set(title, [...(titles.get(title) ?? []), rel]);
  if (description) descriptions.set(description, [...(descriptions.get(description) ?? []), rel]);
}

for (const [title, pages] of titles) {
  if (pages.length > 1) errors.push(`title重複「${title}」: ${pages.join(", ")}`);
}
for (const [description, pages] of descriptions) {
  if (pages.length > 1) errors.push(`description重複「${description}」: ${pages.join(", ")}`);
}

if (errors.length) {
  console.error(`[audit-public-quality] ${errors.length}件の問題を検出`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`[audit-public-quality] ${htmlFiles.length} HTMLを検査: 問題なし`);
