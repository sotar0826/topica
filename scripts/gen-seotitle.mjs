// seoTitle 一括生成スクリプト（Phase 2: titleタグ最適化）
// 使い方:
//   node scripts/gen-seotitle.mjs          … ドライラン（生成結果を一覧表示）
//   node scripts/gen-seotitle.mjs --write  … frontmatter に seoTitle を書き込む
//
// ルール（「｜トピカ」はテンプレート側で自動付加されるため含めない）:
//   基礎編: {title}とは？民法{N}条の要件をわかりやすく解説（民法・条数はdescriptionから抽出）
//           条数が取れない科目・記事は「意味・要件をわかりやすく解説」等に置換
//   応用編: {title}の判例・学説と論述のポイント
//   30字（全角）を大きく超える場合は短縮形にフォールバック
//   既に seoTitle がある記事・例外マップにある記事はそれを優先

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../src/content/", import.meta.url));
const WRITE = process.argv.includes("--write");

// 科目ごとの設定。hasan は noindex 中のため対象外
const SUBJECTS = {
  minpo: { law: "民法", basicNoArt: "とは？意味・要件をわかりやすく解説" },
  shoho: { law: null, basicNoArt: "とは？意味・要件をわかりやすく解説" },
  minso: { law: null, basicNoArt: "とは？意味・要件をわかりやすく解説" },
  kenpo: { law: null, basicNoArt: "とは？意味と判例をわかりやすく解説" },
};

// 「〜とは？」が不自然な記事、条数の自動抽出が代表条文とズレる記事の例外（slug → seoTitle）
const EXCEPTIONS = {
  "minpo/zentaizo": "民法の勉強法と全体像をわかりやすく解説",
  "minpo/muko-torikeshi": "無効と取消しの違いとは？民法121条をわかりやすく解説",
  "minpo/fuho-koi-tokushu": "使用者責任・共同不法行為とは？要件をわかりやすく解説",
  "minpo/sonota-keiyaku": "贈与・消費貸借・使用貸借・寄託とは？わかりやすく解説",
  "minpo/chintaishaku": "賃貸借とは？民法601条の要件をわかりやすく解説",
  "minpo/muken-dairi": "無権代理とは？民法113条の要件をわかりやすく解説",
  "minpo/hyoken-dairi": "表見代理とは？民法110条の要件をわかりやすく解説",
  "minpo/rentai-saimu": "連帯債務とは？民法436条の要件をわかりやすく解説",
  "minpo/teito-ken": "抵当権とは？民法369条の効力をわかりやすく解説",
  "minpo/sokuji-shutoku": "即時取得とは？民法192条の要件をわかりやすく解説",
  "minpo/sakidori-shichi": "先取特権・質権とは？意味・要件をわかりやすく解説",
  "shoho/shoho-zentaizo": "商法・会社法の勉強法と全体像をわかりやすく解説",
  "shoho/kabunushi-meibo": "株主名簿・基準日・名義書換とは？わかりやすく解説",
  "minso/minso-zentaizo": "民事訴訟法の勉強法と全体像をわかりやすく解説",
  "kenpo/kenpo-zentaizo": "憲法の勉強法と全体像をわかりやすく解説",
};

const len = (s) => [...s].length; // サロゲート対応の文字数

function makeSeoTitle(subject, slug, title, level, description) {
  const key = `${subject}/${slug}`;
  if (EXCEPTIONS[key]) return EXCEPTIONS[key];

  // 「（基礎）」「（177条）」等のカッコ書きだけ呼称から外す（半角閉じカッコ混在にも対応）。
  // 「（特殊類型）」のような区別に必要なカッコ書きは残す（重複タイトル防止）
  const base = title
    .replace(/（(基礎|\d+条[^）)]*)[）)]/g, "")
    .trim();
  const conf = SUBJECTS[subject];

  if (level === "advanced") {
    const t = `${base}の判例・学説と論述のポイント`;
    return len(t) <= 32 ? t : `${base}の判例と論述ポイント`;
  }

  // 基礎編: 条数の抽出（description の最初の「N条(のM)」）
  const m = conf.law ? description.match(/(\d+条(?:の\d+)?)/) : null;
  if (m) {
    const t = `${base}とは？${conf.law}${m[1]}の要件をわかりやすく解説`;
    if (len(t) <= 32) return t;
  }
  const t2 = `${base}${conf.basicNoArt}`;
  if (len(t2) <= 32) return t2;
  return `${base}とは？わかりやすく解説`;
}

let total = 0, written = 0, skipped = 0;
for (const subject of Object.keys(SUBJECTS)) {
  const dir = join(ROOT, subject);
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    total++;
    const path = join(dir, file);
    const src = readFileSync(path, "utf8");
    const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!fm) { console.log(`SKIP(no fm): ${subject}/${file}`); skipped++; continue; }
    if (/^seoTitle:/m.test(fm[1])) { skipped++; continue; }

    const title = fm[1].match(/^title:\s*(.+)$/m)?.[1]?.trim();
    const level = fm[1].match(/^level:\s*(\w+)/m)?.[1] ?? "basic";
    const description = fm[1].match(/^description:\s*(.+)$/m)?.[1] ?? "";
    if (!title) { console.log(`SKIP(no title): ${subject}/${file}`); skipped++; continue; }

    const slug = file.replace(/\.md$/, "");
    const seo = makeSeoTitle(subject, slug, title, level, description);
    console.log(`${String(len(seo)).padStart(2)}  ${subject}/${slug}\n    ${seo}`);

    if (WRITE) {
      const out = src.replace(/^(title:\s*.+)$/m, `$1\nseoTitle: ${seo}`);
      writeFileSync(path, out, "utf8");
      written++;
    }
  }
}
console.log(`\n${WRITE ? "written" : "dry-run"}: total=${total} skipped=${skipped}${WRITE ? ` written=${written}` : ""}`);
