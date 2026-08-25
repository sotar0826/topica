import assert from "node:assert/strict";
import { selectRelatedHanrei } from "../src/lib/related-hanrei.mjs";

const entries = Array.from({ length: 20 }, (_, index) => ({ id: `case-${index}` }));
const snapshot = entries.map((entry) => entry.id);

assert.deepEqual(
  selectRelatedHanrei(entries, "case-10", 5).map((entry) => entry.id),
  ["case-7", "case-8", "case-9", "case-11", "case-12"],
  "中央では現在判例の前後から近い5件を返す",
);
assert.deepEqual(
  selectRelatedHanrei(entries, "case-0", 5).map((entry) => entry.id),
  ["case-1", "case-2", "case-3", "case-4", "case-5"],
  "先頭でも後続5件を返す",
);
assert.deepEqual(
  selectRelatedHanrei(entries, "case-19", 5).map((entry) => entry.id),
  ["case-14", "case-15", "case-16", "case-17", "case-18"],
  "末尾でも先行5件を返す",
);
assert.deepEqual(
  selectRelatedHanrei(entries.slice(0, 3), "case-1", 5).map((entry) => entry.id),
  ["case-0", "case-2"],
  "候補が上限未満なら存在する判例だけを返す",
);
assert.deepEqual(selectRelatedHanrei(entries, "missing", 5), [], "現在判例がなければ空配列を返す");
assert.deepEqual(entries.map((entry) => entry.id), snapshot, "元配列を変更しない");

console.log("[test-related-hanrei] 近接判例の選択: 6項目すべて正常");
