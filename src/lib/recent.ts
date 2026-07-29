// 新着・更新コンテンツの収集ロジック。
// トップページの「新着・更新」セクション（src/pages/index.astro）と
// RSSフィード（src/pages/rss.xml.ts）の両方から利用する共通ヘルパー。
// 出力（件数・並び順）が変わるとRSSの内容にも影響するため、変更時は両方の見た目を確認すること。

import { getCollection } from "astro:content";

// 公開科目（破産法はお蔵入りのため除外）
export const SUBJECT_SLUGS = ["minpo", "shoho", "minso", "kenpo", "keiho", "keiso", "gyosei"] as const;

export const SUBJECT_NAMES: Record<string, string> = {
  minpo: "民法",
  shoho: "商法・会社法",
  minso: "民事訴訟法",
  kenpo: "憲法",
  keiho: "刑法",
  keiso: "刑事訴訟法",
  gyosei: "行政法",
};

export type RecentItem = {
  title: string;
  /** サイトルート基準の相対パス（例: "/minpo/zentaizo/"）。絶対URLへの変換は呼び出し側で行う */
  path: string;
  date: Date;
  description: string;
  category: string;
};

/** 全公開科目＋判例解説＋コラムを updated ?? published の降順で集める */
export async function collectRecentItems(): Promise<RecentItem[]> {
  const items: RecentItem[] = [];

  for (const slug of SUBJECT_SLUGS) {
    const entries = await getCollection(slug as "minpo");
    for (const e of entries) {
      const advanced = e.data.level === "advanced";
      items.push({
        title: `${e.data.title}${advanced ? "（応用編）" : ""}`,
        path: `/${slug}/${e.id}/`,
        date: e.data.updated ?? e.data.published ?? new Date(0),
        description: e.data.description,
        category: SUBJECT_NAMES[slug],
      });
    }
  }

  for (const e of await getCollection("hanrei")) {
    items.push({
      title: `${e.data.title}（${e.data.court}${e.data.decisionDate}）`,
      path: `/hanrei/${e.id}/`,
      date: e.data.updated ?? e.data.published ?? e.data.dateISO,
      description: e.data.description,
      category: "判例解説",
    });
  }

  for (const e of await getCollection("column")) {
    items.push({
      title: e.data.title,
      path: `/column/${e.id}/`,
      date: e.data.updated ?? e.data.published ?? new Date(0),
      description: e.data.description,
      category: "コラム",
    });
  }

  items.sort((a, b) => b.date.valueOf() - a.date.valueOf());
  return items;
}
