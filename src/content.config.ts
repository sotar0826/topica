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
    /** 前提知識となる既習トピックのスラッグ */
    related: z.array(z.string()).default([]),
  }),
});

export const collections = { minpo };
