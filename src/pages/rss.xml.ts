import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

// 公開科目（破産法はお蔵入りのため除外）
const SUBJECT_SLUGS = ["minpo", "shoho", "minso", "kenpo", "keiho", "keiso", "gyosei"] as const;
const SUBJECT_NAMES: Record<string, string> = {
  minpo: "民法",
  shoho: "商法・会社法",
  minso: "民事訴訟法",
  kenpo: "憲法",
  keiho: "刑法",
  keiso: "刑事訴訟法",
  gyosei: "行政法",
};

const SITE = "https://topica-law.com";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type Item = { title: string; url: string; date: Date; description: string; category: string };

export const GET: APIRoute = async () => {
  const items: Item[] = [];

  for (const slug of SUBJECT_SLUGS) {
    const entries = await getCollection(slug as "minpo");
    for (const e of entries) {
      const advanced = e.data.level === "advanced";
      items.push({
        title: `${e.data.title}${advanced ? "（応用編）" : ""}`,
        url: `${SITE}/${slug}/${e.id}/`,
        date: e.data.updated ?? e.data.published ?? new Date(0),
        description: e.data.description,
        category: SUBJECT_NAMES[slug],
      });
    }
  }

  for (const e of await getCollection("hanrei")) {
    items.push({
      title: `${e.data.title}（${e.data.court}${e.data.decisionDate}）`,
      url: `${SITE}/hanrei/${e.id}/`,
      date: e.data.updated ?? e.data.published ?? e.data.dateISO,
      description: e.data.description,
      category: "判例解説",
    });
  }

  for (const e of await getCollection("column")) {
    items.push({
      title: e.data.title,
      url: `${SITE}/column/${e.id}/`,
      date: e.data.updated ?? e.data.published ?? new Date(0),
      description: e.data.description,
      category: "コラム",
    });
  }

  items.sort((a, b) => b.date.valueOf() - a.date.valueOf());
  const latest = items.slice(0, 50);

  const body = latest
    .map(
      (i) => `    <item>
      <title>${esc(i.title)}</title>
      <link>${esc(i.url)}</link>
      <guid isPermaLink="true">${esc(i.url)}</guid>
      <category>${esc(i.category)}</category>
      <pubDate>${i.date.toUTCString()}</pubDate>
      <description>${esc(i.description)}</description>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>トピカ｜法律学習サイト</title>
    <link>${SITE}/</link>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
    <description>法律を体系的に学べるオンライン学習サイト。新しく公開・更新したトピックと判例解説をお届けします。</description>
    <language>ja</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${body}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
};
