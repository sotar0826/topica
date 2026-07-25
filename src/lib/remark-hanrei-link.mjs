// 判例名の自動リンク化（バッチUI-2）。
// 本文テキスト中の「最大判平成29年3月15日」等の日付表記と、判例の通称
// （「クロロホルム事件」等）を検出し、対応する /hanrei/<slug>/ へのリンクに変換する。
//
// 対応表（src/data/hanrei-map.json）は scripts/gen-hanrei-map.mjs がビルド前に
// 生成する（package.json の "build" スクリプトに組み込み済み）。このプラグイン
// はその JSON をモジュール読み込み時に同期的に読み込むだけで、判例コレクション
// 自体には触れない（remarkプラグインからContent Collectionsを直接読むのは
// タイミング上できないため）。
//
// 誤リンク防止のための設計:
//   - 対応表の生成時点で、同一日付に複数の判例ページがある場合はその日付を
//     byDate から除外済み（scripts/gen-hanrei-map.mjs 参照）。
//   - 見出し・既存リンク・コードブロック/インラインコードの中は変換しない
//     （findAndReplace の ignore オプション）。
//   - 通称と日付表記を単一の正規表現・単一パスでツリーの出現順に処理することで、
//     「同一ページ内の同一判例は初出のみリンク」を document 順で正しく担保する
//     （通称パスと日付パスを別々の findAndReplace 呼び出しにすると、出現順が
//     ずれて後方の一致が先にリンクされてしまう可能性があるため、あえて1本の
//     正規表現に統合している）。
//   - 判例ページ自身（hanreiコレクション）では、そのページのslugへの自己リンクを
//     生成しない。

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { findAndReplace } from "mdast-util-find-and-replace";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MAP_PATH = path.resolve(__dirname, "../data/hanrei-map.json");

let mapData = { byDate: {}, byTitle: {} };
try {
  mapData = JSON.parse(fs.readFileSync(MAP_PATH, "utf-8"));
} catch {
  // ビルド前段（`node scripts/gen-hanrei-map.mjs`）が未実行だと生成されていない。
  // その場合はリンク化を行わないだけでビルド自体は壊さない。
  console.warn(
    "[remark-hanrei-link] src/data/hanrei-map.json が見つかりません。`node scripts/gen-hanrei-map.mjs` を先に実行してください（npm run build には組み込み済み）。"
  );
}

const byDate = mapData.byDate ?? {};
const byTitle = mapData.byTitle ?? {};

// 元号 → その元号1年目の西暦（西暦 = eraStart + 元号年 - 1）
const ERA_START = {
  明治: 1868,
  大正: 1912,
  昭和: 1926,
  平成: 1989,
  令和: 2019,
  明: 1868,
  大: 1912,
  昭: 1926,
  平: 1989,
  令: 2019,
};

// 変換の対象外にするノード種別
const IGNORE_TYPES = ["heading", "link", "linkReference", "code", "inlineCode"];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * このファイル自身が hanrei コレクションの記事であれば、そのslugを返す
 * （自己リンク除外のため）。それ以外の記事なら null。
 */
function selfHanreiSlug(file) {
  const p = String(file?.path ?? file?.history?.[0] ?? "").replace(/\\/g, "/");
  const m = p.match(/\/src\/content\/hanrei\/([^/]+)\.md$/);
  return m ? m[1] : null;
}

export default function remarkHanreiLink() {
  const titleKeys = Object.keys(byTitle);
  const hasTitles = titleKeys.length > 0;
  const hasDates = Object.keys(byDate).length > 0;

  return (tree, file) => {
    if (!hasTitles && !hasDates) return;

    const selfSlug = selfHanreiSlug(file);
    const linked = new Set();

    // 通称は長い文字列を優先してマッチさせる（短い通称が長い通称の部分文字列に
    // なるケースを想定した保険。現状の対応表では起きないが安全側に倒す）。
    const sortedTitles = [...titleKeys].sort((a, b) => b.length - a.length);
    const titleAlt = hasTitles ? sortedTitles.map(escapeRegExp).join("|") : "(?!)";

    // 単一の正規表現に「通称」と「裁判所種別＋元号＋年月日」の2系統を
    // 統合する（document順を保つため。詳細はファイル冒頭のコメント参照）。
    //   group1: 通称の一致文字列
    //   group2: 裁判所種別（最大判/最判/最決）
    //   group3: 元号（フル or 略字）
    //   group4: 年（数字）
    //   group5,6: 月日（フル表記「○月○日」）
    //   group7,8: 月日（ドット略記「○.○」）
    const pattern = `(${titleAlt})|(最大判|最判|最決)(明治|大正|昭和|平成|令和|明|大|昭|平|令)(\\d{1,2})(?:年(\\d{1,2})月(\\d{1,2})日|\\.(\\d{1,2})\\.(\\d{1,2}))`;
    const regex = new RegExp(pattern, "g");

    function toLinkNode(slug, text) {
      linked.add(slug);
      return {
        type: "link",
        url: `/hanrei/${slug}/`,
        title: null,
        children: [{ type: "text", value: text }],
      };
    }

    findAndReplace(
      tree,
      [
        [
          regex,
          (fullMatch, titleGroup, courtPrefix, era, yearStr, m1, d1, m2, d2) => {
            // 通称マッチ
            if (titleGroup !== undefined) {
              const slug = byTitle[titleGroup];
              if (!slug || slug === selfSlug || linked.has(slug)) return false;
              return toLinkNode(slug, fullMatch);
            }

            // 日付マッチ
            const eraStart = ERA_START[era];
            if (!eraStart) return false;
            const year = parseInt(yearStr, 10);
            const month = parseInt(m1 ?? m2, 10);
            const day = parseInt(d1 ?? d2, 10);
            if (!month || !day || month > 12 || day > 31) return false;
            const westernYear = eraStart + year - 1;
            const iso = `${westernYear}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const slug = byDate[iso];
            if (!slug || slug === selfSlug || linked.has(slug)) return false;
            return toLinkNode(slug, fullMatch);
          },
        ],
      ],
      { ignore: IGNORE_TYPES }
    );
  };
}
