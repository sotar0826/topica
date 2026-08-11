// コンテンツの frontmatter から sitemap 用の最終更新日を生成する。
// ビルド日時を一律に lastmod とするのではなく、published / updated が
// 明示されたページだけに正確な日付を付ける。

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_ROOT = path.join(ROOT, "src/content");
const OUT_PATH = path.join(ROOT, "src/data/sitemap-dates.mjs");
const COLLECTIONS = [
  "minpo",
  "shoho",
  "minso",
  "kenpo",
  "keiho",
  "keiso",
  "gyosei",
  "hanrei",
  "column",
];
// Markdown frontmatterを持たない固定ページ。本文・構造を実際に変更した日だけ更新する。
const STATIC_PAGE_DATES = {
  "/": "2026-08-11",
  "/about/": "2026-08-01",
  "/contact/": "2026-08-05",
  "/disclaimer/": "2026-08-05",
  "/privacy/": "2026-08-05",
  "/minpo/": "2026-08-05",
  "/shoho/": "2026-08-05",
  "/minso/": "2026-08-05",
  "/kenpo/": "2026-08-05",
  "/keiho/": "2026-08-05",
  "/keiso/": "2026-08-05",
  "/gyosei/": "2026-08-11",
  "/hanrei/": "2026-08-11",
};

function frontmatterDate(text, key) {
  const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)?.[1] ?? "";
  return frontmatter.match(new RegExp(`^${key}:\\s*["']?(\\d{4}-\\d{2}-\\d{2})`, "m"))?.[1];
}

function latest(dates) {
  return dates.filter(Boolean).sort().at(-1);
}

const dates = {};
const collectionDates = new Map();

for (const collection of COLLECTIONS) {
  const dir = path.join(CONTENT_ROOT, collection);
  if (!fs.existsSync(dir)) continue;

  const found = [];
  for (const file of fs.readdirSync(dir).filter((name) => name.endsWith(".md")).sort()) {
    const text = fs.readFileSync(path.join(dir, file), "utf8");
    const date = frontmatterDate(text, "updated") ?? frontmatterDate(text, "published");
    if (!date) continue;

    const slug = file.replace(/\.md$/, "");
    dates[`/${collection}/${slug}/`] = date;
    found.push(date);
  }
  collectionDates.set(collection, found);

  const indexDate = latest(found);
  if (indexDate) dates[`/${collection}/`] = indexDate;
}

const allDates = [...collectionDates.values()].flat();
const siteDate = latest(allDates);
if (siteDate) dates["/"] = siteDate;
Object.assign(dates, STATIC_PAGE_DATES);

const output = `// scripts/gen-sitemap-dates.mjs により自動生成。手動編集しない。\nexport const SITEMAP_DATES = ${JSON.stringify(dates, null, 2)};\n`;
fs.writeFileSync(OUT_PATH, output, "utf8");
console.log(`[gen-sitemap-dates] ${Object.keys(dates).length} URL の lastmod を生成 → ${path.relative(ROOT, OUT_PATH)}`);
