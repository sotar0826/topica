# 用語集の検索入口化と判例回遊改善 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 20件の法律用語ページを独自価値のある検索入口として公開し、判例ページの関連記事を現在の判例に近いものへ改善する。

**Architecture:** 既存の `quality-gates.mjs` を唯一の公開判定元として用語ページにも拡張し、テンプレート・サイトマップ・Pagefind・広告の判定を同じ集合から導く。本文品質はビルド成果物を読む専用監査で固定し、判例の回遊候補は純粋関数に切り出して単体テストする。

**Tech Stack:** Astro 6.4.6、TypeScript、Node.js ESM、Markdown content collections、`@astrojs/sitemap`、Pagefind

**Spec:** `docs/SITE_IMPROVEMENTS.md` Phase 4（用語集の1用語1ページ化）および `docs/HANREI_RENEWAL_PLAN.md`

## Global Constraints

- 法律上の記述は既に一次資料照合済みの公開記事を土台とし、新しい条文番号・判例を加える場合は e-Gov または裁判所公式資料で確認する。
- 用語ページは、本文1,200字以上、`h2` 3個以上、関連トピック1件以上、DefinedTerm構造化データ、canonicalを公開条件とする。
- `noindex`、サイトマップ、Pagefind本文、AdSenseの公開判定は `INDEXABLE_YOUGO_SET` に統一する。
- 既存の破産法・判決全文・管理ページ・検索ページのnoindex方針は変更しない。
- サブエージェントは使わず、現行のmain上で小さなコミットに分けて実行する（ユーザーが継続実装・公開を事前承認済み）。

---

### Task 1: 用語ページ品質監査をREDにする

**Files:**
- Create: `scripts/audit-glossary-quality.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `dist/yougo/*/index.html`、`dist/sitemap-0.xml`
- Produces: 品質不足時に終了コード1、20ページすべて合格時に終了コード0を返すビルド監査

- [x] **Step 1: 失敗する監査を作成する**

  監査は個別用語ページ20件について、`noindex` がないこと、mainの可視本文が1,200字以上、`h2` が3個以上、canonical、DefinedTerm JSON-LD、`data-pagefind-body`、AdSense、サイトマップ収録を確認する。

- [x] **Step 2: REDを確認する**

  Run: `node scripts/audit-glossary-quality.mjs`

  Expected: 現行ページが `noindex`・サイトマップ除外・本文不足のため終了コード1。

- [x] **Step 3: ビルドチェーンに監査を追加する**

  `package.json` の `build` で `audit-public-quality.mjs` の後、Pagefindの前に実行する。

### Task 2: 用語ページの公開判定を一元化する

**Files:**
- Modify: `src/data/quality-gates.mjs`
- Modify: `src/pages/yougo/[slug].astro`
- Test: `scripts/audit-glossary-quality.mjs`

**Interfaces:**
- Produces: `INDEXABLE_YOUGO_SLUGS: string[]`、`INDEXABLE_YOUGO_SET: Set<string>`
- Consumes: Astroテンプレートと `shouldIncludeInSitemap(page)`

- [x] **Step 1: 20スラッグを品質ゲートに列挙する**

  `bensai`, `bukken`, `daisansha`, `enyo`, `fuho-koi`, `horitsu-koi`, `hosho`, `ishihyoji`, `jiko`, `kaijo`, `kashitsu-mukashitsu`, `muko-torikeshi`, `saiken-saimu`, `songai-baisho`, `sosai`, `taiko-yoken`, `teito-ken`, `toki`, `tsuinin`, `zeni-akui` を公開対象とする。

- [x] **Step 2: テンプレートを同じ集合へ接続する**

  `noindex={!isIndexable}`、`data-pagefind-body={isIndexable ? "" : undefined}` とし、未承認ページが将来追加されても自動公開しない。

- [x] **Step 3: サイトマップ判定を同じ集合へ接続する**

  個別用語ページの一律除外をやめ、スラッグが `INDEXABLE_YOUGO_SET` にある場合だけ含める。

### Task 3: 用語20ページを独立した解説記事へ拡充する

**Files:**
- Modify: `src/content/yougo/*.md`（20件）
- Test: `scripts/audit-glossary-quality.mjs`

**Interfaces:**
- Consumes: 各ファイルの既存frontmatterと既存の関連トピック
- Produces: 定義、条文上の位置、具体例、似た概念との違い、学習上の注意を持つMarkdown本文

- [x] **Step 1: 基本概念10件を拡充する**

  `horitsu-koi`, `ishihyoji`, `muko-torikeshi`, `kashitsu-mukashitsu`, `zeni-akui`, `daisansha`, `taiko-yoken`, `bukken`, `saiken-saimu`, `enyo` を1,200字以上・h2 3個以上にする。

- [x] **Step 2: 制度・救済概念10件を拡充する**

  `toki`, `tsuinin`, `jiko`, `bensai`, `sosai`, `hosho`, `teito-ken`, `kaijo`, `fuho-koi`, `songai-baisho` を同じ基準にする。

- [x] **Step 3: GREENを確認する**

  Run: `npm.cmd run build`

  Expected: 530ページをビルドし、公開品質監査・用語監査・Pagefindが終了コード0。Pagefindの対象が404ページから424ページへ増え、用語20ページがサイトマップと検索インデックスに加わる。

- [x] **Step 4: 用語集バッチをコミットする**

  Commit message: `用語集20件を検索公開`

### Task 4: 判例関連記事を近接候補へ改善する

**Files:**
- Create: `src/lib/related-hanrei.mjs`
- Create: `scripts/test-related-hanrei.mjs`
- Modify: `src/pages/hanrei/[slug].astro`

**Interfaces:**
- Produces: `selectRelatedHanrei(entries, currentId, limit = 5)`
- Consumes: 同一科目・日付昇順の判例エントリ

- [x] **Step 1: 失敗する単体テストを書く**

  20件のうち中央の判例を指定したとき、現在判例を除外し、前後から距離の近い5件を返すこと、先頭・末尾でも5件を返すこと、元配列を変更しないことを検証する。

- [x] **Step 2: REDを確認する**

  Run: `node scripts/test-related-hanrei.mjs`

  Expected: モジュール未実装で終了コード1。

- [x] **Step 3: 最小実装でGREENにする**

  現在位置を中心に必要数を含むウィンドウを切り出し、現在判例だけを除外する。テンプレートの `slice(0, 5)` をこの関数呼び出しへ置き換える。

- [x] **Step 4: 単体・全体検証を行う**

  Run: `node scripts/test-related-hanrei.mjs`

  Run: `npm.cmd run build`

  Expected: 単体テストと全ビルドが終了コード0。

- [x] **Step 5: 回遊改善をコミットする**

  Commit message: `判例の関連記事を近接順に改善`

### Task 5: 表示・公開・本番検証

**Files:**
- Modify: `docs/SESSION_NOTES.md`
- Modify: `docs/SITE_IMPROVEMENTS.md`

**Interfaces:**
- Produces: 本番で閲覧・検索可能な用語20ページと、改善された判例回遊

- [x] **Step 1: ローカルの差分と成果物を確認する**

  `git diff --check`、`git status --short`、代表5用語のHTML、代表3判例の関連記事を確認する。

- [x] **Step 2: モバイルとデスクトップを確認する**

  用語ページ・用語一覧・判例ページを375px幅と通常幅で確認し、横スクロール、見出し崩れ、リンク切れがないことを確かめる。

- [x] **Step 3: mainへpushしCloudflare Pagesへ公開する**

  既存の `.secrets.ps1` とWranglerデプロイ手順を使用する。

- [x] **Step 4: 本番を再検証する**

  代表用語ページのHTTP 200、index可能、canonical、DefinedTerm、AdSense、サイトマップ収録、判例ページの近接関連記事を確認する。

- [x] **Step 5: 引き継ぎ資料を更新して次バッチを選ぶ**

  実測結果と次の優先候補（検索入口となる学習ガイド追加、判例の科目別不足補完、ビルド警告整理）を記録する。
