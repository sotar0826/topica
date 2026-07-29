import type { APIRoute } from "astro";
import { collectRecentItems } from "../lib/recent";

const SITE = "https://topica-law.com";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const GET: APIRoute = async () => {
  const items = await collectRecentItems();
  const latest = items.slice(0, 50);

  const body = latest
    .map(
      (i) => `    <item>
      <title>${esc(i.title)}</title>
      <link>${esc(SITE + i.path)}</link>
      <guid isPermaLink="true">${esc(SITE + i.path)}</guid>
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
