# LIGHT_TASKS.md — 下位モデル（Haiku/Sonnet）向けタスク置き場

クレジット節約のため、高性能モデルを要しない機械的タスクをここに貯める。
ユーザーがモデルを切り替えた新セッションで「docs/LIGHT_TASKS.md のタスクをやって」と指示すれば着手できるよう、自己完結で書く。

## 実行時の共通ルール

- 開始時に `docs/SESSION_NOTES.md` の直近エントリを読む
- デプロイ手順: `npm run build` → `git add -A && git commit && git push` → トークンを `.secrets.ps1` から読み `npx wrangler pages deploy dist --project-name topica --branch main --commit-dirty=true`（Node.js は PATH に `C:\Program Files\nodejs` を追加）
- **法律コンテンツの新規執筆はしない**（照合・整形・確認のみ）

## タスク一覧

### 1. Search Console インデックス登録リクエスト（ブラウザ操作・判断力不要）
- Chrome で https://search.google.com/search-console/inspect?resource_id=https%3A%2F%2Ftopica.pages.dev%2F を開く
- 上部の検査バーに下記URLを1本ずつ入れ、「インデックス登録をリクエスト」を押す（1日のクォータ〔10件前後〕に達したら翌日へ持ち越し）
- 優先順: `/shoho/` `/shoho/shoho-zentaizo/` `/shoho/kaisha-hojinkaku/` `/yougo/` `/minpo/sozoku-shonin-ouyou/` `/minpo/yuigon-ouyou/` `/minpo/fuho-koi-kiso-ouyou/` `/column/jiko-to-toki/` 以下、新しい記事から順に
- あわせて「サイトマップ」画面で sitemap-index.xml のステータスが「成功しました」に変わったか確認し、結果を SESSION_NOTES に追記

### 2. 判例照合パックの事前作成（次の編の下ごしらえ）
- `py scripts/hanrei.py search <元号> <年> <月> <日>` → 候補の id を特定 → `py scripts/hanrei.py get <id>` の出力を `docs/hanrei-packs/<トピック名>.txt` に保存する
- 対象は CONTENT_PLAN の商法セクションに書かれた「次のトピック」の判例候補
- **注意**: 出力の保存のみ。記事本文への引用・要約はしない（上位モデルの執筆時に使う）

### 3. サイト全体のリンク切れチェック
- `dist/` 内の全HTMLから `href="/..."` を抽出し、対応する `dist/.../index.html` が存在するか機械照合するスクリプトを書いて実行
- 切れがあれば SESSION_NOTES に列挙（修正は上位モデルに委ねる）

### 4. 用語集の語彙追加（機械的抽出）
- `src/pages/yougo.astro` の TERMS にない頻出用語（既存記事の太字から抽出）を候補リストアップし、SESSION_NOTES に提案として追記（定義文の執筆はしない）

## 完了報告

タスクを終えたら、この一覧から該当項目を「済（日付）」にし、SESSION_NOTES の直近エントリに1行で結果を書く。
