// OGP画像の静的生成エンドポイント。
// URL例: /og/minpo/keiyaku.png, /og/hanrei/gps-sosa-jiken.png, /og/minpo/index.png（科目トップ）
// 各ページテンプレートは BaseLayout に image={`/og/<この形式のパス>.png`} を渡す。
// 判決全文ページ（/hanrei/<slug>/zenbun/）はnoindexのため対象外。破産法はお蔵入り
// （noindex）のため対象外。
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { renderOgImage } from "../../lib/og-image";
import { PUBLIC_SUBJECTS } from "../../data/curriculum";

export const prerender = true;

// PUBLIC_SUBJECTS の slug ↔ Content Collection 名は一致している
// （minpo, shoho, minso, kenpo, keiho, keiso, gyosei）。hasan は archived のため除外済み。
type SubjectCollection = "minpo" | "shoho" | "minso" | "kenpo" | "keiho" | "keiso" | "gyosei";

interface PathEntry {
  slug: string;
  title: string;
  subjectLabel?: string;
  levelLabel?: string;
}

export async function getStaticPaths() {
  // 緊急時の避難弁: 環境変数 SKIP_OG=1 でOGP画像の生成を丸ごとスキップする
  // （生成が極端に遅い・satori/resvgがビルド環境で動かない等の場合）。
  // スキップ時は各ページの image={`/og/....png`} が指す画像が存在せず404になるが、
  // OGP画像はサイトの必須機能ではないためビルド自体は継続できる。
  if (process.env.SKIP_OG === "1") {
    return [];
  }

  const entries: PathEntry[] = [];

  // 科目トップページ
  for (const subject of PUBLIC_SUBJECTS) {
    entries.push({
      slug: `${subject.slug}/index`,
      title: subject.name,
      levelLabel: "科目トップ",
    });
  }

  // 各科目の記事（基礎編・応用編）
  for (const subject of PUBLIC_SUBJECTS) {
    const collection = await getCollection(subject.slug as SubjectCollection);
    for (const item of collection) {
      const isAdvanced = item.data.level === "advanced";
      entries.push({
        slug: `${subject.slug}/${item.id}`,
        title: `${item.data.title}${isAdvanced ? "（応用編）" : ""}`,
        subjectLabel: subject.name,
        levelLabel: isAdvanced ? "応用編" : "基礎編",
      });
    }
  }

  // 判例解説
  const hanreiEntries = await getCollection("hanrei");
  for (const item of hanreiEntries) {
    entries.push({
      slug: `hanrei/${item.id}`,
      title: `${item.data.title}（${item.data.court}${item.data.decisionDate}）`,
      subjectLabel: "判例解説",
    });
  }

  // コラム
  const columnEntries = await getCollection("column");
  for (const item of columnEntries) {
    entries.push({
      slug: `column/${item.id}`,
      title: item.data.title,
      levelLabel: "コラム",
    });
  }

  return entries.map((entry) => ({
    params: { slug: entry.slug },
    props: entry,
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { title, subjectLabel, levelLabel } = props as PathEntry;
  const png = await renderOgImage({ title, subjectLabel, levelLabel });
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
