// /quiz/ 横断一問一答（バッチUI-3）用の問題データを生成する。
// 全科目（民法・商法・民訴・憲法・刑法・刑訴・行政法。破産法はお蔵入りのため除外）の
// 記事Markdownから、確認問題の「<details><summary>【○×】…】</summary>」ブロックのみを
// 機械抽出し、src/data/quiz.json に書き出す。短答式（【短答式】）は対象外。
//
// 実行: node scripts/gen-quiz.mjs（`npm run build` / `npm run dev` の前段で自動実行される）
//
// 抽出対象のMarkdown構造（お手本: src/content/keiho/setto.md）:
//   <details>
//   <summary>【○×】〜問題文〜</summary>
//
//   **答え：○** または **答え：×**
//   〜解説文（複数行可）〜
//   </details>

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "src/content");
const OUT_PATH = path.join(ROOT, "src/data/quiz.json");

// 対象科目。破産法（hasan）はお蔵入りのため除外。
// src/data/curriculum.ts の SUBJECTS（公開科目）と同期させること。
const SUBJECTS = [
  { slug: "minpo", name: "民法" },
  { slug: "shoho", name: "商法・会社法" },
  { slug: "minso", name: "民事訴訟法" },
  { slug: "kenpo", name: "憲法" },
  { slug: "keiho", name: "刑法" },
  { slug: "keiso", name: "刑事訴訟法" },
  { slug: "gyosei", name: "行政法" },
];

/** ごく単純な frontmatter パーサ。title のみ取り出す（gen-hanrei-map.mjs と同方針）。 */
function extractTitle(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!m) return null;
  const line = m[1].split(/\r?\n/).find((l) => /^title:\s*/.test(l));
  if (!line) return null;
  const value = line
    .replace(/^title:\s*/, "")
    .trim()
    .replace(/^["']|["']$/g, "");
  return value || null;
}

// <details><summary>【○×】問題文</summary> 〜 **答え：○/×** 〜 解説 〜 </details>
// 表記ゆれに対応:
// - <details>と<summary>が改行なしで連続する記事がある（例: gyosei/*-ouyou.md）
// - 「**答え：×（補足）**」のように○/×の直後に注記が入り、閉じ**が数文字後にずれる記事がある
// - 解説が答えと同じ行に続く記事がある（例: 「**答え：○**　根拠法令の…」）
const DETAILS_RE =
  /<details>\s*<summary>\s*【○×】([\s\S]*?)<\/summary>\s*\*\*答え[:：]\s*([○×])[^\n]*?\*\*\s*([\s\S]*?)\s*<\/details>/g;

function main() {
  const questions = [];
  /** @type {{file: string, expected: number, matched: number}[]} */
  const mismatches = [];

  for (const subject of SUBJECTS) {
    const dir = path.join(CONTENT_DIR, subject.slug);
    if (!fs.existsSync(dir)) continue;
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md"))
      .sort();

    for (const file of files) {
      const full = path.join(dir, file);
      const text = fs.readFileSync(full, "utf-8");
      const topicSlug = file.replace(/\.md$/, "");
      const topicTitle = extractTitle(text) ?? topicSlug;

      const markerCount = (text.match(/【○×】/g) || []).length;
      let matchedInFile = 0;

      DETAILS_RE.lastIndex = 0;
      let match;
      while ((match = DETAILS_RE.exec(text)) !== null) {
        const question = match[1].trim();
        const answerMark = match[2];
        const explanation = match[3].trim();

        if (!question || !explanation || (answerMark !== "○" && answerMark !== "×")) {
          continue;
        }
        matchedInFile++;
        questions.push({
          question,
          answer: answerMark === "○",
          explanation,
          subject: subject.slug,
          subjectName: subject.name,
          topicSlug,
          topicTitle,
        });
      }

      if (matchedInFile !== markerCount) {
        mismatches.push({ file: `${subject.slug}/${file}`, expected: markerCount, matched: matchedInFile });
      }
    }
  }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(questions, null, 2) + "\n", "utf-8");

  console.log(`[gen-quiz] ${questions.length}問を抽出 → ${path.relative(ROOT, OUT_PATH)}`);
  if (mismatches.length > 0) {
    const totalExpected = mismatches.reduce((s, m) => s + m.expected, 0);
    const totalMatched = mismatches.reduce((s, m) => s + m.matched, 0);
    console.log(
      `[gen-quiz] 抽出失敗（形式崩れの疑い）: ${mismatches.length}ファイルで ${totalExpected - totalMatched}問をスキップ`
    );
    for (const m of mismatches) {
      console.log(`  - ${m.file}: 【○×】マーカー${m.expected}件中${m.matched}件のみ抽出`);
    }
  }
}

main();
