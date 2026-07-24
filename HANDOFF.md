# トピカ 引き継ぎメモ（新チャット用）

最終更新：2026-07-13 / 本番 https://topica-law.com （旧 topica.pages.dev は全ページ301転送）

新しいチャットを開いたら、まずこのファイルと `topica/CLAUDE.md` を読めば文脈を引き継げます。

---

## 1. これは何か

司法試験・予備試験（将来的には論述）を目指すユーザーのための法律学習サイト「トピカ」。
**1トピック＝1ページ**。各トピックに基礎編と（重要論点には）応用編。Astro 製の静的サイトを Cloudflare Pages で無料公開している。

- 本番URL：https://topica-law.com （独自ドメイン・2026-07-13移行。DNSはCloudflare、レジストラはお名前.com）
- 旧URL topica.pages.dev は `functions/_middleware.js` で301転送（プレビューデプロイ `<hash>.topica.pages.dev` は転送対象外）
- 正規オリジンの単一情報源：`src/lib/site.ts` の `SITE_URL`（変更時は astro.config.mjs / robots.txt / _middleware.js も）
- GitHubリポジトリ：`sotar0826/topica`（※GitHub連携の自動デプロイは未設定。デプロイは下記の手動コマンド）

---

## 2. 環境・運用（重要）

- プロジェクト：`C:\Users\sotar\Desktop\Claude Code\topica`
- Node.js は `C:\Program Files\nodejs` にあるが **セッションのPATHに入っていないことがある**。コマンドの前に必ず付ける：
  ```powershell
  $env:Path += ";C:\Program Files\nodejs"
  ```
- **ビルドとデプロイ（dev サーバーが起動していると `.astro` の EPERM でビルドが失敗するので、preview を止めてから実行）**：
  ```powershell
  $env:Path += ";C:\Program Files\nodejs"
  Set-Location "C:\Users\sotar\Desktop\Claude Code\topica"
  . .\.secrets.ps1   # CLOUDFLARE_API_TOKEN を読み込む（git管理外）
  npm run build
  npx wrangler pages deploy dist --project-name topica --branch main --commit-dirty=true
  ```
- Cloudflare APIトークンは **リポジトリ直下の `.secrets.ps1`（gitignore済み・コミット禁止）** に置いてある。トークンをこのファイルや他のMarkdownに直接書かないこと（GitHubのpush protectionでpushがブロックされる）。GitHub連携はブラウザOAuthが要るため使わず、wrangler 直アップロードで運用している。
- dev プレビュー：`preview_start`（launch.json の name は `topica-dev`、ポート4321）。`.claude/launch.json` は `cmd /c set PATH=...&& npm run dev --prefix topica` のラッパー。

---

## 3. サイト構造

- `src/data/curriculum.ts` — **全科目・全トピックの定義の中心**。ナビ・一覧・前後リンクの基準。`SUBJECTS` 配列（民法 `minpo` / 破産法 `hasan`）。トピック追加時はここを更新。
  - ヘルパー：`topicOrderOf(subjectSlug)` `findTopicOf` `prevNextOf` `findSubject`
- `src/content.config.ts` — コレクション定義：`minpo` / `hasan` / `column`
- `src/content/minpo/<slug>.md` — 民法 基礎編。応用編は `<slug>-ouyou.md`
- `src/content/hasan/<slug>.md` — 破産法（同じ命名規則）
- `src/content/column/<slug>.md` — コラム（frontmatter に `order`＝表示順、`part`＝所属編番号。民法トップの各編末尾に表示される）
- `src/pages/minpo/[slug].astro` `src/pages/hasan/[slug].astro` — トピックページ（前後ナビ・関連リンク・AI質問テンプレは自動生成）
- `src/pages/minpo/index.astro` `src/pages/hasan/index.astro` `src/pages/column/index.astro` — 各一覧
- `src/pages/index.astro` — トップ（`SUBJECTS` から科目カードを自動生成）
- `src/layouts/BaseLayout.astro` — ヘッダー（民法／破産法／コラム）・フッター
- `src/styles/global.css` — 白基調＋青アクセント。応用編は基礎編の枝として「10-1.」表示（`topic-branch` クラス、`└`）

### 非公開の管理ページ（本人のみ）
- URL：`/kanri-m70231sok5rp/`（推測されにくいパス。ナビ非掲載・どこからもリンクしない・`noindex,nofollow`・robots.txt にも書かない）
- 実体：`src/pages/kanri-m70231sok5rp.astro`。**PV表示**＋コンテンツ件数の自動集計＋やることリスト＋パッチノート
- **パッチノート**＝`devlog` コレクション。`src/content/devlog/YYYY-MM-DD-xxx.md`（frontmatter：`title`/`date`/任意 `tag`）を足すと新しい順に表示。公開ルートは無い
- ※URLが唯一の鍵。秘密に保つこと

#### アクセス解析（Web Analytics）— 設定済み
- 全公開ページにビーコン挿入：`BaseLayout.astro` の `CF_ANALYTICS_TOKEN = "c7cd2df2924841e28234f03cdd033f9e"`（＝Web Analytics の site tag）
- **管理ページ内に日別PV・記事別PVを表示**：`functions/api/stats.js`（Cloudflare Pages Function）が GraphQL Analytics API（`rumPageloadEventsAdaptiveGroups`）を叩いてJSONを返し、管理ページがfetchして描画
  - PV＝`count`、訪問＝`sum.visits`。記事パスは `pathTitle` 表で日本語タイトルに変換
  - 期間切替（7/14/30日）あり。`?days=` で指定
- **APIトークンはPagesの秘密**として保持：`CF_ANALYTICS_API_TOKEN`（Account Analytics: **Read** 権限のトークン）。設定/更新は：
  ```powershell
  "（トークン値）" | npx wrangler pages secret put CF_ANALYTICS_API_TOKEN --project-name topica
  ```
  ※PowerShellパイプは末尾改行が混入しうるが、関数側で `.trim()` 済み
- account tag / site tag は秘密でないため `functions/api/stats.js` 冒頭に定数で直書き
- **注意**：`functions/` を含めるので、デプロイは従来どおり `npx wrangler pages deploy dist`（cwd=プロジェクト直下）で関数も自動取り込み（"Uploading Functions bundle" が出ればOK）
- ローカル `npm run dev` では関数が動かず `/api/stats` は404になり、管理ページのPV欄は「取得に失敗」と出る（本番でのみ動作）。これは正常

### ナビの仕様（ユーザー要望で実装済み）
- 一覧では応用編を基礎編の下に枝（`10` の下に `10-1`）でぶら下げ表示
- 前後リンクは**基礎編の整数ナンバリングが軸**。基礎編ページには中央に「応用編へ」、応用編ページには「基礎編に戻る」の枝ジャンプを表示
- コラムは各編の一番下にまとめて配置

---

## 4. 執筆方針（`topica/CLAUDE.md` に詳細。ユーザー確認済み）

- **文体**：平易にしすぎず、法律的な言い回し・正確な法律用語を正面から使う（将来目標が論述試験）。口語は避ける。
- **二層構造の補足**：論述調で取りづらい所に「💡 **かみくだくと**：…」。
- **端的な要約**：トピック冒頭と難所の節末に「> **端的にいうと**：…」の一行要約。
- **要件・効果の明示**：制度トピックは「### 要件」「### 効果」を見出し／表で構造化。要件は番号付き。論述の規範定立に直結させる（最重要・ユーザー要望）。
- **フォローのコールアウト**：初学者がつまずく所に「⚠️ **つまずきやすい**：」、頻出箇所に「🎯 **試験で狙われる**：」。1ページ2〜3個まで。
- **判例**：「最判平成○年○月○日」形式。**不確かな判例は創作しない**。原文に確信がなければ「要旨」と明記して要約。
- 現行民法（債権法・相続法・物権法・親族法の各改正後）準拠。
- 各トピック末尾に確認問題（○×・短答式・事例。`<details><summary>` の折りたたみ）。

### 破産法の方針（`topica/CLAUDE.md` 末尾＋メモリ参照）
- **実務家（申立代理人）向け**の高度な内容。初学者向けではない。
- 各トピックに「📋 **実務チェックリスト**」、【事例】形式の確認問題。
- 管財運用は**東京地裁基準＋地域差の注記**。

### Markdown の注意（既知のハマりどころ）
- 強調 `**...**` を鉤括弧「」に隣接させるとパースが崩れることがある（全角約物の flanking 判定）。約物を含めない範囲に強調をかける。
- **執筆中に英単語が日本語の途中に紛れ込む癖がある**（"too"→「も」、"debtor"→「債務者」等）。書いたら `Grep` で `\b(too|debtor|contract|occupancy|...)\b` を走らせて潰すこと。今回分は対処済み。

---

## 5. 現在の進捗

### 民法（`minpo`）— **全5編 完成・公開済み**
| 編 | 基礎 | 応用 |
|---|---|---|
| 第1編 総則 | 15 | 4（虚偽表示・錯誤・無権代理・表見代理・消滅時効） |
| 第2編 物権 | 12 | 6（不動産物権変動・即時取得・共有・抵当権・法定地上権・譲渡担保） |
| 第3編 債権総論 | 8 | 5（債務不履行・債権者代位・詐害行為・保証・債権譲渡・相殺） |
| 第4編 債権各論 | 10 | 5（解除・売買・賃貸借・不当利得・不法行為特殊類型） |
| 第5編 親族・相続 | 6 | 0 |
- ※総則の要件効果が重要な既存トピック（心裡留保・虚偽表示・錯誤・詐欺強迫・代理基礎・無権代理・表見代理・制限行為能力・消滅時効）は要件効果セクションを後から追加済み。

### 破産法（`hasan`）— **全5編 完成・公開済み**（基礎19＋応用7）
申立代理人の時系列構成。総論／自然人の自己破産／法人の自己破産／手続の進行／周辺論点。

### コラム（`column`）— 3本公開済み
1. `94-2-110-ruisui`（94条2項類推と110条・帰責性のグラデーション、part:1）
2. `nichijo-kaji-110`（日常家事債務と110条、part:1）
3. `shinrai-hogo-map`（信頼保護の見取り図・横断、part:2）

### 行政法（`gyosei`）— **基礎編7/19本 公開済み**
第1編2本・第2編4本に加え、第3編1本目 `gyosei-rippo`（行政立法——法規命令・行政規則）まで公開済み（2026-07-24）。次は `gyosei-shido-keikaku`。

### 公開ファイル数
- minpo 73 / hasan 26 / column 3（+ about/privacy/disclaimer 等の固定ページ）

---

## 6. 次にやれること（未着手・アイデア）

- **民法の応用編の追加**：第5編 親族・相続にはまだ応用編がない（嫡出推定・遺産分割・遺留分など論点豊富）。第4編で応用編未作成のもの（契約総論・同時履行・請負委任・その他典型契約・不法行為基礎）も追加余地。
- **新科目**：ユーザーは科目追加に前向き。`SUBJECTS` に足してページを2つ（index と [slug]）作ればよい（破産法追加時の手順がそのまま使える）。憲法・民訴・会社法など。
- **コラムの増設**：ユーザーから「コラムを増やしてくれていい」と明言あり。横断テーマ・重要判例の深掘りを随時。
- **GitHub自動デプロイ連携**（現状は手動 wrangler）。
- **iPhone でのリモート操作**：Claude Code 設定で「デフォルトでリモートコントロールを有効にする」はオン済み。新しいローカルセッションを開けば claude.ai/code から接続できるはず（デスクトップアプリでは `/resume` 不可、サイドバーの Recents から再開する）。

---

## 7. メモリ（`~/.claude/.../memory/`）

- `topica-writing-style.md` — 執筆方針（feedback）
- `topica-hasanho-plan.md` — 破産法の計画（project、現在は完成済みに更新済み）
- これらは新セッションでも自動で読み込まれる。
