---
title: Search Console 登録・広告掲載準備・AI色の縮小
date: 2026-07-05
tag: 運用
---

- **Google Search Console 登録完了**。所有権確認はHTMLタグ方式（Cloudflare Pages が `.html` 直アクセスを308リダイレクトするためファイル方式は不可）。`sitemap-index.xml` 送信済み。インデックス登録リクエストはクォータ回復後に再試行
- **広告掲載準備**：お問い合わせページ（Googleフォーム）を新設しフッターに追加。プライバシーポリシーを広告配信・Cookie・アクセス解析の記載に更新。About に運営者情報を追加
- **AI質問セクションを全ページから削除**（AI色を薄くする方針）。トップ・Aboutの AI 言及も削除
- Cloudflare APIトークンをローテーションし、リポジトリ外（`.secrets.ps1`）へ退避
