---
title: 行政書士サイトの骨組みを追加（/gyoseishoshi/）
date: 2026-10-15
tag: 機能
---

行政書士試験の学習サイト「行政書士ノート」の骨組みを `/gyoseishoshi/` に追加しました。トピカとは別サイトとして扱い、トピカのヘッダー・トップ・検索・RSSからはリンクしていません（専用レイアウト `ShoshiLayout.astro`）。

トップ（試験の構成・科目一覧）と6科目（基礎法学・憲法・行政法・民法・商法・会社法・基礎知識）の単元一覧ページを作成しました。記事は `src/content/gyoseishoshi/<科目>/<単元>.md` を置くと自動でページ化されます。

記事がそろうまでは全ページ noindex・サイトマップ除外・広告なしです（`quality-gates.mjs` の `SHOSHI_INDEXABLE` を true にすると公開）。
