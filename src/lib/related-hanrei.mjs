/**
 * 日付順に並んだ判例から、現在の判例に近い候補を選ぶ。
 * 同じ距離なら先行判例を優先し、表示順は元の日付順に戻す。
 *
 * @template {{ id: string }} T
 * @param {readonly T[]} entries
 * @param {string} currentId
 * @param {number} [limit=5]
 * @returns {T[]}
 */
export function selectRelatedHanrei(entries, currentId, limit = 5) {
  const currentIndex = entries.findIndex((entry) => entry.id === currentId);
  const safeLimit = Math.max(0, Math.floor(limit));

  if (currentIndex < 0 || safeLimit === 0) return [];

  return entries
    .map((entry, index) => ({ entry, index }))
    .filter(({ index }) => index !== currentIndex)
    .sort((a, b) => {
      const distance = Math.abs(a.index - currentIndex) - Math.abs(b.index - currentIndex);
      return distance || a.index - b.index;
    })
    .slice(0, safeLimit)
    .sort((a, b) => a.index - b.index)
    .map(({ entry }) => entry);
}
