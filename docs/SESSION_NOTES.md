# セッションノート

このファイルの使い方：
- **セッション開始時**：このファイルを読み、「次セッションで最初にやること」から着手する
- **セッション終了時**：今日のエントリを「直近セッションログ」の先頭に追記し、オープン事項を更新する
- 詳細なルールは `docs/ROADMAP.md` §5 を参照

---

## オープン事項（未解決・判断待ち）

- [ ] Claude Design / Canva 連携の実現性を確認する（§2.1 参照）
- [ ] Google Search Console の登録状況を確認する（未登録なら登録）。※`sitemap-index.xml` を配信済みになったので、登録後に送信する
- [ ] Google AdSense の申請タイミングを検討する（トラフィック次第）

---

## 直近セッションログ

### 2026-07-06 [Code] — 応用編の連続執筆（Tier 1完了・Tier 2進行中）

**フォーカス**: CONTENT_PLAN に沿った応用編の自走執筆（ユーザー包括承認済み・クレジット節約モード）

**完了（公開済み・全て一次資料照合のうえ執筆）**:
- Tier 1（第5編）全4本：`sozoku-shonin-ouyou`／`yuigon-ouyou`／`sozokunin-ouyou`／`iryubun-ouyou`
- Tier 2（第4編）3本：`fuho-koi-kiso-ouyou`（判例5）／`doji-riko-ouyou`（判例2）／`ukeoi-inin-ouyou`（判例2）
- 通算：応用編7本・照合済み判例19件・全件本番デプロイ済み

**決定事項・運用変更**:
- **節約モード**（2026-07-06 ユーザー指示）：プレビューサーバー検証を dist/ への grep 検証に置換（強調崩れ・details数・バッジ）。ビルド→コミット→push→デプロイを1コマンドに束ねる。ブラウザは判例検索のみに使用
- **DB未収載判例は不採用**を実践（建物所有権帰属・建替え費用の各判例は courts.go.jp で確認できず、執筆から除外）
- 民法が終わったら**商法**を開始（ユーザー指示。編・章構成は民法方式を基本に、開始時に構成案を提案する）

**同日追記（続き・全て公開済み）**:
- Tier 2 完了：`keiyaku-soron-ouyou`（判例2）
- Tier 3：`bensai-ouyou`（判例3）／`shutoku-jiko-ouyou`（判例2）
- コラム：`jiko-to-toki`（判例4）／`416-shatei`（判例1）。「相続と登記」コラムは sozokunin-ouyou のマトリクスで吸収済みのため**不要と判断**
- 本走行の通算：**応用編10本＋コラム2本・照合済み判例27件**・全て本番デプロイ済み

**同日追記2（民法 CONTENT_PLAN 完了）**:
- `sagi-kyohaku-ouyou` 公開（判例1・最判昭49.9.26）→ **民法のCONTENT_PLAN全項目消化**。民法は基礎編51＋応用編33＋コラム5の体制
- 本走行の最終集計：**応用編11本＋コラム2本を公開、照合済み判例28件**、強調崩れ2件を検出即修正

**商法の構成案（ユーザー確認待ち）**:
- **案A（法典順）**：商法総則→商行為→会社法→手形小切手
- **案B（会社法中心・推奨）**：試験・実務の出題比重（会社法が大半）に合わせ、会社法を主軸に6編構成：①会社法の全体像と設立 ②株式 ③機関 ④資金調達・計算 ⑤組織再編・解散 ⑥商法総則・商行為（圧縮して1編）。手形小切手は当面対象外（需要をみて追加）
- いずれも民法と同じ「基礎編＋重要論点に応用編」の二層・1トピック1ページ。承認後に curriculum.ts へ `shoho` を追加し CONTENT_PLAN に商法セクションを追記

**次セッションで最初にやること／持ち越し**:
1. 商法構成案のユーザー回答を確認 → curriculum.ts に `shoho` 追加・トピック定義 → 執筆開始（判例は最高裁DBで照合。会社法条文は e-Gov API v2 lawId=417AC0000000086）
2. Search Console：インデックス登録リクエスト（クォータ回復後）・新記事13本の登録・sitemapステータス確認
3. 判例照合の再現手順は本ファイル 2026-07-05 エントリの技術メモ参照

---

### 2026-07-05 [Code] — 執筆規約・図解テンプレ・CONTENT_PLAN・応用編1本目公開

**フォーカス**: 記事執筆の本格開始（Phase 1 → 承認 → Phase 2 → Phase 3 → Phase 4 を1本通した）

**完了**:
- `docs/ARTICLE_GUIDE.md` を収蔵（Chat作成分。AI質問セクション設置指示2箇所を削除済みの現状に合わせ修正、試験名の扱いを追記）。CLAUDE.md 執筆方針の冒頭から誘導
- `docs/DIAGRAM_TEMPLATES.md` 新設：Design 3案から案①横並びフラットを採用しサイト配色に調整。Markdown直貼り用SVGテンプレ＋記入例
- `docs/CONTENT_PLAN.md` 新設（Phase 1 完了）：応用編候補11本＋コラム3本を優先度付きで整理。ユーザー承認済みの優先順は Tier1=第5編応用編
- **応用編1本目「相続の承認・放棄・遺産分割」公開**（`sozoku-shonin-ouyou`）：
  - Phase 2: 条文7本（915/921/938/939/909/899の2/424）を e-Gov API v2 現行版で、判例5件を裁判所サイトで照合（民集出典・裁判要旨まで取得）
  - Phase 3-4: 執筆→英単語チェック→ビルド→プレビューDOM検証（バッジ・SVG・related・前後ナビ・強調崩れなし）→デプロイ
  - curriculum.ts の sozoku-shonin を hasAdvanced: true に

**技術メモ（一次資料照合の再現手順）**:
- 条文: e-Gov API v2 `https://laws.e-gov.go.jp/api/2/law_data/129AC0000000089`（民法全文JSON）から対象条を抽出
- 判例: 裁判所の新検索は `courts.go.jp/hanrei/search2/index.html?courtCaseType=1&filter[judgeDateMode]=1&filter[judgeGengoFrom]=昭和&filter[judgeYearFrom]=NN&filter[judgeMonthFrom]=N&filter[judgeDayFrom]=NN#searched` のGET URLで直接検索可（SPA・要ブラウザ）。詳細ページは静的 `courts.go.jp/hanrei/{id}/detail2/index.html` で curl 可。旧 `/app/hanrei_jp/detail2?id=` は死んでいる

**次セッションで最初にやること／持ち越し**:
1. CONTENT_PLAN Tier1 の2本目「遺言（応用）」の骨子作成→承認→執筆（同じ手順）
2. Search Console：インデックス登録リクエスト再試行（クォータ回復後）。新記事もリクエスト対象に
3. 記事本文中の試験名言及（column2本・minpo2本）の扱いをユーザーに確認（未回答）

---

### 2026-07-05 [Code] — 破産法お蔵入り・用語集・文言刷新・Lighthouse

**フォーカス**: SEO残タスク（用語集・Lighthouse）＋破産法アーカイブ＋サイト文言の方針転換

**完了**:
- **破産法をお蔵入り**：`curriculum.ts` に `archived` フラグを新設（`PUBLIC_SUBJECTS` で公開科目を絞る）。トップ・ヘッダーナビ・sitemapから除外、全ページ noindex。ページは削除せず保持し、管理ダッシュボードの「🗄 保管庫」カードからのみ導線（復活手順もカードに記載）
- **用語集を新設**（`/yougo/`）：基本20語（意思表示・対抗要件・善意悪意など）を短い定義＋関連トピックリンク付きで掲載。ヘッダーナビは「民法・コラム・用語集」に
- **試験名の撤去**：トップ・About・コラム・minpo一覧・バッジ等のUI文言から「司法試験」「予備試験」を撤去。デフォルト meta description も「法律を体系的に学べるオンライン学習サイト…」に変更。応用編バッジは「応用編（発展）」。**記事本文中の言及（4記事）は対象外のまま**（要否は未判断）
- **パッチノート運用開始**：devlog 3本追記（07-04 SEO実装／07-05 Search Console・広告準備／07-05 本変更）。CLAUDE.md に「サイト運用ルール」節を新設（パッチノート必須・試験名/AI色の扱い・手動デプロイ手順）
- **Lighthouse計測（本番）**：トップ＝Performance 100 / A11y 100 / BP 100 / SEO 100。記事（sakugo）＝93 / 100 / 100 / 100。修正を要する指摘なし（Perf減点はヘッドレス計測のラボ変動レベル）
- デプロイ・本番確認済み（112ページ。/yougo/ 200・トップから hasan 消滅・sitemap から hasan 消滅・hasan noindex）

**決定事項**:
- 破産法は削除ではなくアーカイブ（`archived: true` 方式）。復活はフラグを外す＋noindex解除＋sitemap filter 戻し
- サイトUI文言に試験名（司法試験・予備試験）を出さない。記事本文の学習上の言及は可（CLAUDE.md 明文化）

**次セッションで最初にやること／持ち越し**:
1. Search Console：sitemapステータス確認＋インデックス登録リクエスト再試行（クォータで今日は不可。明日以降にブラウザで実行）
2. 記事本文中の試験名言及（column2本・minpo2本）を撤去するか、ユーザーに要確認
3. AdSense：トラフィックが付いたら申請（ユーザー作業）。承認後に広告コード＋ads.txt 設置

---

### 2026-07-05 [Code] — 広告掲載準備＋トークンローテーション完了

**フォーカス**: AdSense審査に向けた下準備、Cloudflare APIトークンの更新

**完了**:
- **Cloudflare APIトークンのローテーション完了**：ユーザーがダッシュボードで Roll → `.secrets.ps1` を新トークンに更新。API検証（同ID `c79f7718...`・active）とデプロイ実行の両方で動作確認済み。デプロイ用トークンはダッシュボードの「Edit Cloudflare Workers」（Analytics トークンは別物・アクセス解析用）
- **お問い合わせページ新設**（`/contact/`）：ユーザー作成のGoogleフォームへリンク。法律相談不可の注意書き付き。フッターに「お問い合わせ」リンク追加
- **プライバシーポリシー更新**：フォーム設置・Cloudflare Web Analytics（Cookie不使用）・AdSense前提の広告配信とCookieの記載・Google広告設定へのリンクを追加（最終更新日 2026-07-05）
- **About更新**：「運営について」（個人運営・誤り指摘の導線）を追加
- 本番反映・確認済み（111ページ）

**AdSense申請に向けた残り**:
- 申請はトラフィックが付いてから（Search Consoleにデータが出始めた頃）が通りやすい。申請自体はユーザー作業
- 承認後：AdSenseコードの設置と `public/ads.txt` の作成（pub-ID が必要）

**次セッションで最初にやること／持ち越し**:
1. Search Console：sitemapステータス確認＋インデックス登録リクエスト再試行（クォータ回復後）
2. SEO残り：用語集ページ（指示書#6）／Lighthouse仕上げ（#7）
3. 記事の `updated`/`published` は今後記事を触るたびに付ける運用（一括バックフィルはしない＝実公開日と git 日付が不一致のため）

---

### 2026-07-05 [Code] — AI質問セクションの削除（AI色を薄くする方針）

**フォーカス**: サイトからAI関連UIを撤去

**完了**:
- 記事テンプレート3種（minpo/hasan/column の `[slug].astro`）から「🤖 このページについてAIに質問する」セクション・テンプレ生成・コピー用スクリプトを削除
- トップの「AIと一緒に学ぶ」、About の「AIに質問する」言及、`.ask-ai` CSS一式を削除。CLAUDE.md の構造説明も更新
- ビルド・プレビューでDOM検証（ask-ai消滅・前後ナビ維持・コンソールエラーなし）→ デプロイ → 本番でも削除を確認

**決定事項**:
- **サイトのAI色は薄くしていく**（ユーザー方針 2026-07-05）。今後のUI・文言でもAI連携を前面に出さない

**次の実装テーマ（ユーザー指示）**: SEO対策の残り＋広告掲載の準備。記事拡充は別途進行中

---

### 2026-07-05 [Code] — Google Search Console 所有権確認

**フォーカス**: Search Console の所有権確認（Chatの指示書ベース、ファイル取得はユーザー・配置はCode）

**完了**:
- ユーザーがSearch Consoleから取得したファイル方式の確認ファイル（`googlec8f8a152e88811da.html`）を `public/` に配置しデプロイ → **失敗**：Cloudflare Pagesが `.html` 拡張子URLを拡張子なしパスへ308リダイレクトする仕様のため、Googleの「検証ファイルはリダイレクトしないこと」という要件に抵触
- **HTMLタグ方式に切り替え**：ファイル名のトークン（`c8f8a152e88811da`）はファイル方式・タグ方式で共通のため、Search Consoleに戻らず `<meta name="google-site-verification" content="c8f8a152e88811da">` を `BaseLayout.astro` の `<head>` に追加。本番で200・リダイレクトなしを確認
- 旧 `public/googlec8f8a152e88811da.html` は残置（害はないが今後は不要。所有権確認が通ったら削除して良い）

**学び（他プロジェクトにも応用可）**:
- **Cloudflare Pages は静的 `.html` ファイルへの直アクセスを拡張子なしURLへ308リダイレクトする**。ファイル内容の完全一致だけでなくURLのリダイレクトなし到達性が必要な検証（Google Search Console等）はこの挙動でファイル方式が使えない。HTMLタグ方式（レイアウトの`<head>`に埋め込み）の方がCloudflare Pagesでは確実

**同日追記（所有権確認後の作業）**:
- ユーザーが Search Console で「確認」→ **所有権確認完了**
- Code から Chrome 操作で **sitemap-index.xml を送信済み**。送信直後のステータスは「取得できませんでした」だが、これは初回取得前の典型表示（最終読み込み日時が空）。サイトマップ自体は200で配信確認済みなのでサイト側の問題ではない。1〜2日後に再確認
- トップページのインデックス登録リクエストを試行 → **「1日の割り当て量を超えています」で拒否**（新規プロパティ直後にありがち）。明日以降に再試行する
- `public/googlec8f8a152e88811da.html` は**残置と決定**（どの確認方式で通ったか不明確なため削除しない。定期再確認で未確認に戻るリスクを回避。害はない）

**次セッションで最初にやること／持ち越し**:
1. Search Console：sitemap のステータスが「成功しました」に変わったか確認（1〜2日後）
2. Search Console：インデックス登録リクエストを再試行（トップ＋/minpo/＋/hasan/＋代表記事数本。クォータ回復後）
3. Cloudflare APIトークンのローテーション（前回セッションからの持ち越し・未実施）

---

### 2026-07-05 [Code] — SEO実装のコミット・push・本番デプロイ

**フォーカス**: 前日実装分＋未コミットの全コンテンツをコミットし本番反映

**完了**:
- 未コミット全変更（115ファイル：SEO実装＋破産法26・コラム3・民法多数・functions/ 等）を1コミットにまとめた（`afc6a1b`）
- **セキュリティ対応**：push が GitHub push protection にブロックされた。原因は `HANDOFF.md` に Cloudflare APIトークンが平文で記載されていたこと。トークンを `.secrets.ps1`（gitignore済み）へ退避し、HANDOFF.md §2 を「`. .\.secrets.ps1` で読み込む」手順に修正、コミットを amend して push 成功（トークンは履歴に残っていない）
- `wrangler pages deploy` で本番デプロイ。本番URLで robots.txt（200）・sitemap-index.xml（200）・canonical・OGP・twitter:card・JSON-LD（Article/BreadcrumbList）・ogp-default.png（200）を確認済み

**決定事項**:
- APIトークン等の秘密情報は `.secrets.ps1` に置き、Markdownやコミットに直接書かない

**次セッションで最初にやること／持ち越し**:
1. **推奨**：Cloudflare APIトークンのローテーション（平文でリポジトリ内に置かれていた期間があるため。ダッシュボード → My Profile → API Tokens）。ローテ後は `.secrets.ps1` を更新
2. Google Search Console 登録＋ sitemap-index.xml 送信、リッチリザルトテスト・OGP確認ツールでの外部検証
3. `updated`/`published`/`lawVersion` の他記事への展開判断（現状 sakugo.md のみ）
4. Low優先度：用語集ページ／Lighthouse 仕上げ

---

### 2026-07-04 [Code] — SEOメタ情報の実装（Chat指示書ベース）

**フォーカス**: `topica_code_tasks.md`（Chatで作成した改修指示書）の High／Medium 優先度を実装

**完了（High）**:
- **OGP / Twitter Card**：`BaseLayout.astro` にページ単位の `og:title/description/url/type/site_name/locale/image` と `twitter:card=summary_large_image` ほかを出力。`ogType` prop で記事は `article`、それ以外は `website`
- **canonical**：`BaseLayout` で `Astro.url` + `Astro.site` から絶対URLを生成して出力
- **デフォルトOGP画像**：`public/ogp-default.png`（1200x630・ブランド青／PILで生成）。`image` prop で差し替え可能な設計
- **robots.txt**：`public/robots.txt` を新規作成（`Sitemap: .../sitemap-index.xml`）
- **sitemap**：`@astrojs/sitemap` を導入（`astro.config.mjs`）。管理ページ `/kanri-*` は `filter` で除外。出力は `sitemap-index.xml` → `sitemap-0.xml`

**完了（Medium）**:
- **JSON-LD**：`src/lib/jsonld.ts` にヘルパー（`articleLd` / `breadcrumbLd` / `abs` / `ymd`）を作成。minpo・hasan・column の記事に `Article` + `BreadcrumbList`、トップに `WebSite` を埋め込み。※FAQPage は Google ガイドライン適合リスク（○×問題は本来のFAQでない）を避けて**あえて未実装**
- **更新日・準拠条文の版**：`content.config.ts` に `published` / `updated` / `lawVersion`（いずれも任意）を追加。記事下部に「最終更新: YYYY-MM-DD ・ 〈版〉」を表示（`.page-meta`）。`updated` は JSON-LD `dateModified` と連動
- サンプルとして `sakugo.md` にのみ実データ（git作成日 2026-06-12・令和2年債権法改正対応）を投入して動作確認済み

**検証**:
- `npm run build` 成功（110ページ）。`dist/` で canonical・OGP・JSON-LD・robots・sitemap（admin除外）・page-metaの出力を grep 確認。dev プレビューで `.page-meta` の表示も確認。console エラーなし

**決定事項**:
- FAQPage 構造化データは当面見送り（ガイドラインリスク回避）
- 日付は捏造しない。`updated`/`published` は各記事で個別に入れる方針（一括バックフィルは未実施）

**次セッションで最初にやること／持ち越し**:
1. **未コミット**：本セッションの変更はまだコミットしていない（ユーザー判断待ち）。デプロイは Cloudflare Pages に push で反映
2. `updated`/`published`/`lawVersion` を他記事へ展開するか判断（git日付からの一括投入も可能）
3. Low優先度：用語集ページ（#6）／Lighthouse 仕上げ（#7）は未着手
4. デプロイ後、Google リッチリザルトテスト・OGP確認ツール・`/robots.txt`・`/sitemap-index.xml` を本番URLで確認

---

### 2026-06-28 [Code] — 共有フォルダ運用の確立

**フォーカス**: セッション間コンテキスト共有の仕組みづくり

**完了**:
- `docs/README.md` を新規作成（共有フォルダの入口・振り分けルール・セッション種別ごとの注意）
- `CLAUDE.md` 冒頭に「開始時に `docs/README.md` を読む」誘導を追加（＝全 Code セッションへの強制力）
- 情報源の優先順位（一次資料→学術→実名専門家→避けるべき）と絶対原則を `ROADMAP.md` §1.2 に反映済み

**決定事項**:
- `docs/` を「セッション間の生きた共有フォルダ」と位置づける。`docs/README.md` が唯一の入口
- 役割分担：`SESSION_NOTES.md`（毎回更新のログ）／`ROADMAP.md`（計画）／`HANDOFF.md`（恒久仕様、リポジトリ直下に据え置き）
- 原則：1つの事実は1箇所／決定は追記・状況は上書き／作業とノート更新をセットにする
- Chat（通常チャット）はローカルファイル不可のため、決定は後続 Code セッションで書き戻す

**次セッションで最初にやること**:
1. `docs/CONTENT_PLAN.md` を作成する（ROADMAP Phase 1：未着手トピックの優先度付きリスト）
2. OGP タグ + sitemap.xml の実装（高優先度・小工数）
3. 上記どちらを先に進めるかユーザーに確認する

---

### 2026-06-28 [Code]

**フォーカス**: ロードマップ・セッション運用ドキュメントの立案

**完了**:
- `HANDOFF.md` と全ソースを読み込み、プロジェクト全体を把握
- `docs/ROADMAP.md` を新規作成（記事ワークフロー・外見拡充・UI改善・SEO・Claude運用の5論点を網羅）
- `docs/SESSION_NOTES.md` を新規作成（本ファイル）
- 実装・執筆への着手はなし（計画フェーズのみ）

**決定事項**:
- 記事作成は「項目分け → 構成設計 → 執筆 → レビュー」の4フェーズ制で進める
- HANDOFF.md は安定参照、SESSION_NOTES.md はローリングログとして役割を分担する
- 条文確認は e-Gov、判例確認は裁判所ウェブサイトを一次資料とし、Phase 2 で必ず確認してからスタブ作成する

**未完了・持ち越し**:
- なし（計画立案の回のため）

**次セッションで最初にやること**:
1. `docs/CONTENT_PLAN.md` を作成する（Phase 1 実施：未着手トピックを洗い出し、優先度付きリストを作る）
2. OGP タグと sitemap.xml の実装（高優先度かつ工数が小さい）
3. 上記どちらを先に進めるかユーザーに確認する
