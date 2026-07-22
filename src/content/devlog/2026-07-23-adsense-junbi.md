---
title: AdSense審査用コードとads.txtを設置
date: 2026-07-23
tag: 運用
---

Google AdSense の審査準備としてコード側の対応を実施した。

- 全ページの head に AdSense スニペット（ca-pub-7356455610185406）を設置（BaseLayout で一元管理・IDを空にすれば出力停止）
- `public/ads.txt` を設置（google.com, DIRECT）
- 以後の手順: AdSense 管理画面からサイト追加済みの topica-law.com について審査をリクエストする（人間タスク）
