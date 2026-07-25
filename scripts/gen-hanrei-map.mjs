// 判例名の自動リンク化（バッチUI-2）用の対応表を生成する。
// src/content/hanrei/*.md の frontmatter から
//   decisionDate（dateISOに正規化） → slug
//   title（通称） → slug
// の対応表を作り、src/data/hanrei-map.json に書き出す。
//
// remarkプラグイン（src/lib/remark-hanrei-link.mjs）はビルド時にこのJSONを
// 同期的に読み込んで本文中の判例表記をリンク化する。誤リンクを避けるため、
// 同一日付に複数の判例ページが存在する場合はその日付をリンク対象から除外する
// （ambiguousDates に記録するのみで byDate には入れない）。
//
// 実行: node scripts/gen-hanrei-map.mjs（`npm run build` の前段で自動実行される）

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const HANREI_DIR = path.join(ROOT, "src/content/hanrei");
const OUT_PATH = path.join(ROOT, "src/data/hanrei-map.json");

/**
 * ごく単純な frontmatter パーサ。
 * このコレクションの frontmatter はスカラー値（`key: value`）と
 * 配列（`key:` に続けて `  - item` の行）のみで構成されているため、
 * フルスペックのYAMLパーサは使わず必要な項目だけを取り出す。
 */
function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!m) return {};
  const lines = m[1].split(/\r?\n/);
  const data = {};
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const scalarMatch = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!scalarMatch) continue;
    const [, key, rest] = scalarMatch;
    if (rest.trim() === "") {
      // 配列の可能性: 続く行が "  - " で始まる間、集める
      const items = [];
      let j = i + 1;
      while (j < lines.length && /^\s+-\s+/.test(lines[j])) {
        items.push(lines[j].replace(/^\s+-\s+/, "").trim());
        j++;
      }
      data[key] = items;
      i = j - 1;
    } else {
      data[key] = rest.trim();
    }
  }
  return data;
}

function main() {
  const files = fs
    .readdirSync(HANREI_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();

  /** @type {{slug: string, title: string, decisionDate: string, dateISO: string}[]} */
  const entries = [];

  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const text = fs.readFileSync(path.join(HANREI_DIR, file), "utf-8");
    const fm = parseFrontmatter(text);
    if (!fm.title || !fm.dateISO) {
      console.warn(`[gen-hanrei-map] frontmatterが不足: ${file}`);
      continue;
    }
    entries.push({
      slug,
      title: String(fm.title),
      decisionDate: String(fm.decisionDate ?? ""),
      dateISO: String(fm.dateISO),
    });
  }

  // dateISO ごとにグルーピングし、1件しかない日付だけを byDate に採用する。
  // 同日に複数の判例ページがある場合は、日付表記だけでは事件を一意に
  // 特定できないため、その日付表記からのリンクは行わない（通称のみで対応）。
  const byDateCandidates = new Map();
  for (const e of entries) {
    const list = byDateCandidates.get(e.dateISO) ?? [];
    list.push(e.slug);
    byDateCandidates.set(e.dateISO, list);
  }

  const byDate = {};
  const ambiguousDates = [];
  for (const [dateISO, slugs] of byDateCandidates.entries()) {
    if (slugs.length === 1) {
      byDate[dateISO] = slugs[0];
    } else {
      ambiguousDates.push(dateISO);
    }
  }

  // title（通称）→ slug。同一タイトルが複数ページに存在する事態は想定していないが、
  // 万一重複した場合はそのタイトルをリンク対象から除外する（安全側に倒す）。
  const byTitleCandidates = new Map();
  for (const e of entries) {
    if (!e.title || e.title.length < 3) continue; // 極端に短いタイトルは誤爆しやすいので除外
    const list = byTitleCandidates.get(e.title) ?? [];
    list.push(e.slug);
    byTitleCandidates.set(e.title, list);
  }
  const byTitle = {};
  for (const [title, slugs] of byTitleCandidates.entries()) {
    if (slugs.length === 1) byTitle[title] = slugs[0];
  }

  const output = {
    generatedAt: new Date().toISOString(),
    count: entries.length,
    byDate,
    byTitle,
    ambiguousDates,
  };

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2) + "\n", "utf-8");
  console.log(
    `[gen-hanrei-map] ${entries.length}件から byDate=${Object.keys(byDate).length} / byTitle=${Object.keys(byTitle).length} を生成 → ${path.relative(ROOT, OUT_PATH)}`
  );
  if (ambiguousDates.length > 0) {
    console.log(`[gen-hanrei-map] 日付が重複しリンク対象から除外: ${ambiguousDates.join(", ")}`);
  }
}

main();
