// OGP画像（1200x630 PNG）をビルド時に生成するヘルパー。
// satori（HTML風のオブジェクトツリー→SVG）＋ @resvg/resvg-js（SVG→PNG）を使う。
// 日本語フォントは src/assets/fonts/ に同梱したサブセット済み Noto Sans JP を使う
// （ビルド時にネットワーク取得はしない）。フォントの取得元・再生成手順は
// scripts/gen-og-font-subset.py のコメントを参照。
//
// Noto Sans JP: SIL Open Font License 1.1
// https://github.com/google/fonts/blob/main/ofl/notosansjp/OFL.txt

import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs";
import path from "node:path";

// astro build はビルドスクリプト（Vite）がこのモジュールを dist/.prerender/ 配下に
// 再配置してバンドルするため、import.meta.url基準の相対パスではフォントファイルの
// 実体（src/assets/fonts/）にたどり着けない。`npm run build` はプロジェクトルートで
// 実行される前提のため、process.cwd() 基準の絶対パスで読む。
const fontDir = path.join(process.cwd(), "src/assets/fonts");
const fontRegular = fs.readFileSync(path.join(fontDir, "NotoSansJP-OGP-Regular.ttf"));
const fontBold = fs.readFileSync(path.join(fontDir, "NotoSansJP-OGP-Bold.ttf"));

const COLORS = {
  bg: "#ffffff",
  accent: "#2f6690",
  accentLight: "#e8f0f7",
  accentDark: "#234d6d",
  text: "#2b2b2b",
  textMuted: "#6b7280",
};

export interface OgImageOptions {
  /** 記事タイトル・科目名など、中央に大きく出す文言 */
  title: string;
  /** 科目名バッジ（例: 民法・判例解説・コラム） */
  subjectLabel?: string;
  /** 種別バッジ（例: 基礎編・応用編・科目トップ） */
  levelLabel?: string;
}

// 56pxの本文サイズ・1056px幅・3行想定でおおよそ収まる全角文字数の目安。
// 超える場合は末尾を省略記号にし、さらに万一はみ出た場合も line-clamp で3行に収める。
const TITLE_MAX_CHARS = 54;

function clampTitle(title: string): string {
  const trimmed = title.trim();
  return trimmed.length > TITLE_MAX_CHARS
    ? `${trimmed.slice(0, TITLE_MAX_CHARS - 1)}…`
    : trimmed;
}

export async function renderOgImage({
  title,
  subjectLabel,
  levelLabel,
}: OgImageOptions): Promise<Buffer> {
  const displayTitle = clampTitle(title);
  const badges = [subjectLabel, levelLabel].filter(
    (v): v is string => Boolean(v && v.length > 0)
  );

  const markup = {
    type: "div",
    props: {
      style: {
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: COLORS.bg,
        fontFamily: "Noto Sans JP",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              width: "100%",
              height: "14px",
              display: "flex",
              backgroundColor: COLORS.accent,
            },
          },
        },
        {
          type: "div",
          props: {
            style: {
              flex: 1,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "56px 72px 64px",
              boxSizing: "border-box",
            },
            children: [
              {
                type: "div",
                props: {
                  style: { display: "flex", alignItems: "baseline" },
                  children: [
                    {
                      type: "span",
                      props: {
                        style: {
                          fontSize: "34px",
                          fontWeight: 700,
                          color: COLORS.accent,
                        },
                        children: "トピカ",
                      },
                    },
                    {
                      type: "span",
                      props: {
                        style: {
                          fontSize: "20px",
                          color: COLORS.textMuted,
                          marginLeft: "14px",
                        },
                        children: "法律学習サイト",
                      },
                    },
                  ],
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flex: 1,
                    alignItems: "center",
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 3,
                          overflow: "hidden",
                          fontSize: "56px",
                          fontWeight: 700,
                          color: COLORS.text,
                          lineHeight: 1.5,
                          letterSpacing: "-0.01em",
                        },
                        children: displayTitle,
                      },
                    },
                  ],
                },
              },
              {
                type: "div",
                props: {
                  style: { display: "flex", gap: "16px" },
                  children: badges.map((label) => ({
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        padding: "10px 24px",
                        borderRadius: "999px",
                        backgroundColor: COLORS.accentLight,
                        color: COLORS.accentDark,
                        fontSize: "24px",
                        fontWeight: 700,
                      },
                      children: label,
                    },
                  })),
                },
              },
            ],
          },
        },
      ],
    },
  };

  const svg = await satori(markup as unknown as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Noto Sans JP", data: fontRegular, weight: 400, style: "normal" },
      { name: "Noto Sans JP", data: fontBold, weight: 700, style: "normal" },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  });
  return resvg.render().asPng();
}
