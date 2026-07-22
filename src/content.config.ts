import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// 1トピック = 1 Markdownファイル。
// ファイル名がURLスラッグになる（応用編は `<基礎編slug>-ouyou.md`）。
const minpo = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/minpo" }),
  schema: z.object({
    title: z.string(),
    /** basic = 基礎編 / advanced = 応用編 */
    level: z.enum(["basic", "advanced"]).default("basic"),
    /** 3行以内の要約（一覧・meta description に使用） */
    description: z.string(),
    /** 検索結果向けの<title>（「｜トピカ」は自動付加）。未指定なら title をそのまま使う */
    seoTitle: z.string().optional(),
    /** 前提知識となる既習トピックのスラッグ */
    related: z.array(z.string()).default([]),
    /** 初回公開日（JSON-LD の datePublished 用・任意） */
    published: z.coerce.date().optional(),
    /** 最終更新日（記事下部の表示・JSON-LD の dateModified 用・任意） */
    updated: z.coerce.date().optional(),
    /** 準拠条文の版（例：「令和2年改正対応」・任意） */
    lawVersion: z.string().optional(),
  }),
});

// 破産法。構造は minpo と同じ（1トピック=1ファイル、応用編は -ouyou.md）
const hasan = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/hasan" }),
  schema: z.object({
    title: z.string(),
    level: z.enum(["basic", "advanced"]).default("basic"),
    description: z.string(),
    /** 検索結果向けの<title>（「｜トピカ」は自動付加）。未指定なら title をそのまま使う */
    seoTitle: z.string().optional(),
    related: z.array(z.string()).default([]),
    published: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
    lawVersion: z.string().optional(),
  }),
});

// 商法・会社法。構造は minpo と同じ（1トピック=1ファイル、応用編は -ouyou.md）
const shoho = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/shoho" }),
  schema: z.object({
    title: z.string(),
    level: z.enum(["basic", "advanced"]).default("basic"),
    description: z.string(),
    /** 検索結果向けの<title>（「｜トピカ」は自動付加）。未指定なら title をそのまま使う */
    seoTitle: z.string().optional(),
    related: z.array(z.string()).default([]),
    published: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
    lawVersion: z.string().optional(),
  }),
});

// 民事訴訟法。構造は minpo と同じ（1トピック=1ファイル、応用編は -ouyou.md）
const minso = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/minso" }),
  schema: z.object({
    title: z.string(),
    level: z.enum(["basic", "advanced"]).default("basic"),
    description: z.string(),
    /** 検索結果向けの<title>（「｜トピカ」は自動付加）。未指定なら title をそのまま使う */
    seoTitle: z.string().optional(),
    related: z.array(z.string()).default([]),
    published: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
    lawVersion: z.string().optional(),
  }),
});

// 憲法。構造は minpo と同じ（1トピック=1ファイル、応用編は -ouyou.md）
const kenpo = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/kenpo" }),
  schema: z.object({
    title: z.string(),
    level: z.enum(["basic", "advanced"]).default("basic"),
    description: z.string(),
    /** 検索結果向けの<title>（「｜トピカ」は自動付加）。未指定なら title をそのまま使う */
    seoTitle: z.string().optional(),
    related: z.array(z.string()).default([]),
    published: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
    lawVersion: z.string().optional(),
  }),
});

// 刑法。構造は minpo と同じ（1トピック=1ファイル、応用編は -ouyou.md）
const keiho = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/keiho" }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().optional(),
    level: z.enum(["basic", "advanced"]).default("basic"),
    description: z.string(),
    related: z.array(z.string()).default([]),
    published: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
    lawVersion: z.string().optional(),
  }),
});

// 刑事訴訟法。構造は minpo と同じ（1トピック=1ファイル、応用編は -ouyou.md）
const keiso = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/keiso" }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().optional(),
    level: z.enum(["basic", "advanced"]).default("basic"),
    description: z.string(),
    related: z.array(z.string()).default([]),
    published: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
    lawVersion: z.string().optional(),
  }),
});

// 行政法。構造は minpo と同じ（1トピック=1ファイル、応用編は -ouyou.md）
const gyosei = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/gyosei" }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().optional(),
    level: z.enum(["basic", "advanced"]).default("basic"),
    description: z.string(),
    related: z.array(z.string()).default([]),
    published: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
    lawVersion: z.string().optional(),
  }),
});

// 判例解説：1判例=1ページ。「最判平○.○.○」「{論点} 判例」検索の受け皿。
// 収録判例は courts.go.jp で事件番号・出典・裁判要旨まで照合済みのもののみ
const hanrei = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/hanrei" }),
  schema: z.object({
    /** 通称（例：「GPS捜査事件」）。通称がなければ「最判昭和53年9月7日」形式 */
    title: z.string(),
    seoTitle: z.string().optional(),
    /** 例：最高裁大法廷、最高裁第二小法廷 */
    court: z.string(),
    /** 表示用の裁判年月日（例：平成29年3月15日） */
    decisionDate: z.string(),
    /** ソート用のISO日付 */
    dateISO: z.coerce.date(),
    /** 出典（例：刑集71巻3号13頁） */
    citation: z.string(),
    /** 事件番号（例：平成28年（あ）第442号）任意 */
    caseNumber: z.string().optional(),
    /** 科目slug: minpo | shoho | minso | kenpo | keiho | keiso */
    subject: z.string(),
    /** 関連トピック（"keiso/kyosei-shobun" 形式・基礎編slugで指定） */
    topics: z.array(z.string()).default([]),
    /** 関連条文の表示用文字列（例：「刑訴法197条1項」） */
    articles: z.array(z.string()).default([]),
    description: z.string(),
    published: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
  }),
});

// コラム：単元から独立した司法試験レベルの読み物（横断テーマ・重要判例の深掘りなど）
const column = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/column" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** 検索結果向けの<title>（「｜トピカ」は自動付加）。未指定なら title をそのまま使う */
    seoTitle: z.string().optional(),
    /** 一覧での表示順（小さいほど上） */
    order: z.number().default(99),
    /** 所属する編の番号（民法トップで各編の末尾に表示される） */
    part: z.number().optional(),
    /** 関連トピックのスラッグ（minpo コレクション） */
    related: z.array(z.string()).default([]),
    /** 初回公開日（JSON-LD の datePublished 用・任意） */
    published: z.coerce.date().optional(),
    /** 最終更新日（記事下部の表示・JSON-LD の dateModified 用・任意） */
    updated: z.coerce.date().optional(),
  }),
});

// 開発ログ／パッチノート（非公開・自分用メモ）。
// 1エントリ=1ファイル。管理ページでのみ表示し、ナビ・サイトマップには出さない。
const devlog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/devlog" }),
  schema: z.object({
    /** 見出し（例：「破産法 全編公開」） */
    title: z.string(),
    /** 日付。新しい順に並べる基準 */
    date: z.coerce.date(),
    /** 区分タグ（例：機能 / コンテンツ / 修正） */
    tag: z.string().optional(),
  }),
});

export const collections = { minpo, hasan, shoho, minso, kenpo, keiho, keiso, gyosei, hanrei, column, devlog };
