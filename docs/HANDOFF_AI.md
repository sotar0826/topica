# HANDOFF_AI.md — AIエージェント向け完全引き継ぎ書

作成: 2026-07-23（Claude Fable 5 監督セッション）／最終更新: 2026-08-01（Codex）
対象: このプロジェクトを引き継ぐあらゆるAIエージェント（Claude / Codex / Qwen Code / その他CLI型エージェント）。
**新しいセッションを始めるAIは、まずこのファイルを読み、次に「§2 必読ファイル」を読むこと。**

---

## §1 プロジェクトの現状（2026-08-01時点）

法律学習サイト「トピカ」 https://topica-law.com/（Astro + Content Collections、Cloudflare Pages）。

- **六法すべての基礎編＋応用編が完成済み**。記事数: 民法84・商法45・憲法45・民訴38・刑法50・刑訴31・コラム5＝**298記事**＋**判例解説50件**（/hanrei/）
- **行政法は基礎編19本＋応用編14本＝計33本を完成・公開済み**。行政法の基礎、行政作用、行政手続・情報、行政争訟、国家補償まで全6編を収録
- 破産法はお蔵入り（archived: true・ページは保持・noindex）
- SEO基盤実装済み: 独自ドメイン・301・canonical/OGPメタ/JSON-LD/sitemap/robots・seoTitle全記事・Pagefind検索・読了記録・判例相互リンク
- **AdSenseは2026-08-01に「有用性の低いコンテンツ」で不承認となり、品質改善後、同日にユーザーが再審査を申請済み**。百選級の詳細版判例27件を一覧・新着・sitemap・検索対象とし、旧簡易判例23件と簡易用語20件はURLを維持したままnoindex化。noindex／検索／クイズ等では広告コードを停止し、トップの目的別導線とAboutの内容を拡充済み。審査結果を待ちながら旧簡易判例の改稿を継続する
- Search Console: 所有権確認済み・sitemap送信済み。新規ドメイン取得直後のためインデックスはこれから（検索流入の立ち上がりは3〜6ヶ月想定）
- 最優先の残タスクは旧簡易判例23件の詳細版化。その後に用語個別ページを拡充する。その他の改善提案は docs/IMPROVEMENT_PROPOSAL_2026-07-22.md を参照

## §2 必読ファイル（この順で）

1. `topica/CLAUDE.md` — サイト運用ルール（Claude以外のAIもここのルールに従う）
2. `docs/SESSION_NOTES.md` — 直近の進捗ログ（先頭が最新。**セッション終了時に必ず追記**）
3. `docs/ARTICLE_GUIDE.md` — 執筆規約（一次資料主義・記事構造・チェックリスト）
4. `docs/CONTENT_PLAN.md` — 全科目の進捗＋**照合済み判例台帳**（事件番号・出典・裁判例検索id）。最重要資産
5. `docs/IMPROVEMENT_PROPOSAL_2026-07-22.md` — SEO/収益化の残施策

## §3 絶対ルール（違反厳禁）

1. **判例のハルシネーション絶対禁止**。照合できない判例は一切書かない。全判例を courts.go.jp（裁判例検索）で事件番号・出典・裁判要旨まで照合してから使う。過去に他AIが架空判例を生成した事故があり、ユーザーの最重要関心事項
2. **判決文の引用体裁は全文PDF照合済みの場合のみ**。照合できなければ「裁判要旨」と明記した要約にとどめる。古いPDFは特殊フォント（Adobe-Japan1/90msp-RKSJ-H）で文字化けするものがあり、その場合は要旨の範囲で書く
3. **条文は必ずe-Gov APIの現行JSONで照合**（拘禁刑改正・IT化改正等で条番号/文言が変わっている。記憶で書かない）
4. **書籍・文献からの直接引用は、原本テキストを所持していない限り禁止**（引用の捏造はハルシネーションと同罪）。学説は「〜と解する見解が有力である」等の要約・言及にとどめる
5. UI・メタ情報に試験名（司法試験・予備試験）を出さない／AI色を出さない
6. デプロイを伴う変更は必ず `src/content/devlog/YYYY-MM-DD-<slug>.md` にパッチノート追加
7. Markdown強調 `**...**` を「」（）等の全角約物に隣接させない（パースが崩れる。特に強調の直後に全角括弧を置かない）
8. 本文への英単語混入禁止（GPS・DNA・PDF等の確立略語は可）。具体例は淡々と書き、刑事系は残虐な詳細を書かない
9. `.secrets.ps1` をコミットしない。トークンをコマンドライン引数に直書きしない（grepで読み込む）

## §4 照合ツールの使い方（すべてリポジトリの scripts/ にある）

### 判例照合（courts.go.jp）
```bash
py scripts/hanrei.py search 平成 29 3 15     # 日付検索 → [id] 事件名 の一覧
py scripts/hanrei.py get 86600               # idの詳細（事件番号・法廷・出典・裁判要旨）
py scripts/search_kw.py "検索語"             # キーワード全文検索（俗称・特徴フレーズで探す）
py scripts/search_kw_date.py ...             # 日付＋キーワード複合
py scripts/dl_pdf2.py <id>                   # 判決全文PDFのダウンロード
py scripts/pdf_fix.py <pdf>                  # pypdf抽出＋cp932再デコード（文字化け修復）
```
**既知の罠**（必ず対処すること）:
- `search` の結果は**idと事件番号の対応がずれることがある**。必ず候補の全idを `get` で開いて突き合わせる
- 同日付に原審・無関係事件が並ぶ。事件名と要旨で判別する
- 全文PDFが特殊フォントで文字化けする判例がある → 要旨の範囲で書く（§3-2）

### 条文照合（e-Gov API v2）
```bash
curl -s "https://laws.e-gov.go.jp/api/2/law_data/<lawId>" -o <保存先>.json
py scripts/get_article3.py <json> 197 319    # 指定条文の現行文言を抽出
```
lawId一覧: 民法=129AC0000000089／会社法=417AC0000000086／商法典=132AC0000000048／手形法=307AC0000000020／小切手法=308AC0000000057／民訴法=408AC0000000109／憲法=321CONSTITUTION／裁判所法=322AC0000000059／刑法=140AC0000000045／**刑訴法=323AC0000000131**／警職法=323AC0000000136／裁判員法=416AC0000000063／盗犯等防止法=305AC0000000009
法令検索: `https://laws.e-gov.go.jp/api/2/laws?law_title=<URLエンコード名>&law_type=Act`

## §5 ビルド・デプロイ（1コマンド）

```bash
export PATH="$PATH:/c/Program Files/nodejs" && cd "C:/Users/sotar/Desktop/Claude Code/topica" && \
npm run build 2>&1 | tail -1 && \
git add -A && git commit -m "<日本語メッセージ>" && git push origin main && \
export CLOUDFLARE_API_TOKEN=$(grep -oE 'cfut_[A-Za-z0-9]+' .secrets.ps1) && \
npx wrangler pages deploy dist --project-name topica --branch main --commit-dirty=true 2>&1 | tail -1 && \
curl -s -o /dev/null -w "prod:%{http_code}" https://topica-law.com/<確認したいパス>/
```
- デプロイはpush連動ではなく**手動**（wrangler）。buildにはPagefindのインデックス生成が含まれる
- PowerShellで作業する場合はPATH追加を `$env:Path += ";C:\Program Files\nodejs"` に読み替える

## §6 検収チェック（記事公開のたびに実施）

```bash
# 強調パース崩れ（0であること）
grep -c '\*\*' dist/<科目>/<slug>/index.html
# 英単語混入（ヒットなしであること）
grep -nE "\b(too|the|and|of|right|court|exist|even|connect|vs)\b" src/content/<科目>/<slug>.md
# 本番疎通
curl -s -o /dev/null -w '%{http_code}' https://topica-law.com/<科目>/<slug>/
# 確認問題の数（details 4以上）
grep -c '<details>' dist/<科目>/<slug>/index.html
```

## §7 記事の形式

- **基礎編**（お手本: `src/content/keiho/setto.md`）: frontmatter（title/seoTitle/level: basic/description/related/published/updated/lawVersion）→「このページで学ぶこと」→「> **端的にいうと**」→制度の趣旨→解説→具体例→よくある勘違い→確認問題（○×3＋短答1・details必須）
- **応用編**（お手本: `src/content/keiho/sagi-ouyou.md`）: `<slug>-ouyou.md`・level: advanced・「重要判例（事案→判旨→分析）→理論の整理→論述対策→よくある勘違い→確認問題」
- **判例解説**（お手本: `src/content/hanrei/gps-sosa-jiken.md`）: `src/content/hanrei/<slug>.md`。スキーマは `src/content.config.ts` の hanrei コレクション参照。topicsに基礎編slug（"keiho/setto" 形式）を入れると記事側に「⚖️ 関連する判例解説」ボックスが自動で出る
- 新トピックを追加する場合は `src/data/curriculum.ts` の該当CURRICULUMを更新（ナビ・一覧・前後リンクの基準）
- コールアウト: 💡かみくだくと／⚠️つまずきやすい／🎯試験で狙われる（1ページ2〜3個まで）

## §8 制作体制（このプロジェクトの回し方）

Claudeでは「親=監督（設計・検収・デプロイ確認）／子ワーカー=執筆（Sonnet・バックグラウンド）」の分業で回してきた。**エージェントのサブタスク機能がないプラットフォームでは、同じ内容を1セッション内で逐次実行すればよい**（1記事ずつ: 照合→執筆→ビルド→検収→コミット→デプロイ。4〜6記事で1バッチが安全）。重要なのは体制ではなく次のループ:

**照合してから書く → ビルドして検収する → docsを更新する（CONTENT_PLANの台帳・SESSION_NOTES）→ こまめにコミット**

中断リカバリ: 再開時に `git status` で未コミット分を回収し、`docs/SESSION_NOTES.md` 先頭で状況把握。

## §9 バックログ（優先順）

1. **判例解説の百選級増強**（ユーザー構想・仕様は§10）
2. **A-3 用語集の1用語1ページ化**（/yougo/{slug}/・「〜とは」ロングテール。現在は yougo.astro 内のTERMS配列）
3. **B系UX**: OGP画像自動生成（satori/resvg）→ /quiz/ 横断一問一答（全記事の確認問題1,200問が素材）→ 追従目次・ダークモード・用語ツールチップ
4. **運用**: AdSense再審査結果への対応／Search Consoleの週次確認（noindex・新sitemap反映、カバレッジ増、CTR低いページのseoTitle改善）／旧簡易判例23件と簡易用語20件の拡充

## §10 判例解説「百選級」増強の仕様（ユーザー承認済みの方向性・未着手）

> 2026-07-23追記: ユーザーから判例百選の実物見本の提示があり、目指す水準を確認済み。
> ①事実の概要だけで1000字近いボリューム ②解説は「論議の情況→本判決の位置づけ→学説・関連判例の整理」の高密度な構成 ③末尾に参考文献欄。
> 差別化として「**直線的に答案構成に役立つ**」ことを最優先し、§10本文の「答案・論述での使い方」セクションを必ず置く。
> 参考文献欄は原本非所持のため当面「関連判例・関連トピック」で代替（§3-4の引用禁止ルール優先）。

- 目標: 1判例あたり現行600〜1200字 → **判例百選に近いボリューム（事実の概要だけで1000字弱＋質の高い解説）**。1判例=実質2ページ分
- 構成案: 事実の概要（当事者関係・経緯を丁寧に）→ 訴訟の経過（下級審の判断）→ 判旨（全文PDF照合済みなら判決文引用体裁）→ 解説（判例の位置づけ・先例との関係・学説の状況・射程・その後の判例への影響）→ 関連判例・関連トピック
- **判決全文の掲載は法的に可**（著作権法13条3号により判決に著作権はない）。実装は「解説ページとは別の全文ページ（/hanrei/<slug>/zenbun/）」か「courts.go.jp のPDFへの直リンク」を推奨。全文テキスト化は特殊フォントPDFで不可能な判例があるため、できる範囲で
- **文献引用の可否**: 法的には著作権法32条の引用（公表著作物・主従関係・明瞭区別・出所明示・必要最小限）で可能。**ただし原本テキストを所持していないAIが書籍から「引用」することは捏造になるため禁止**（§3-4）。ユーザーが該当ページの原文を提供した場合のみ、32条の要件を満たす形で引用可。それまでは学説の紹介は要約＋文献名の参照表記（例:「（佐久間・総則）」のような略記はせず、一般的な言及にとどめる）で対応
- 増強は既存50件の改稿＋新規追加の両方。台帳（CONTENT_PLAN）の照合済み判例から優先度の高いものを選ぶ

## §10.1 判決全文ページの運用（2026-07-26実装）

- `/hanrei/<slug>/zenbun/` に判決全文をそのまま掲載するページがある（著作権法13条3号により判決に著作権はない）。実装は `src/pages/hanrei/[slug]/zenbun.astro`、データは `src/content/zenbun/<hanrei-slug>.md`（`zenbun` コレクション。frontmatter: `hanreiSlug`/`courtsId`/`sourceUrl`/`fetchedAt`）
- **取得手順**: `py scripts/fetch-zenbun.py <courtsId> <hanrei-slug>` を実行するだけで、PDFダウンロード→テキスト抽出→cp932文字化け修復→段落整形→Markdown生成まで自動で行う。成功したら該当 `src/content/hanrei/<slug>.md` の frontmatter に `courtsId: "<id>"` を追加すること（判例解説ページ側の導線表示に必要）
- **文字化け時は必ず中止**: 日本語文字比率が低い、またはU+FFFDが多いPDFは「文字化けのため中止」と表示してファイルを作らない（exit code 2）。この場合は全文ページを作らず、判例解説ページには `courtsId` があれば裁判所ウェブサイトへの直リンクだけを出す（自動でそうなる）
- **noindex必須・sitemap除外必須**: 裁判所サイト等と同一テキストで独自性のないページのため。`BaseLayout` の `noindex` prop と、`astro.config.mjs` の sitemap `filter` の `!page.includes('/zenbun/')` の両方で担保している。新しいページ種別を追加する際にこの2点を壊さないよう注意
- **導線**: 判例解説ページ（`src/pages/hanrei/[slug].astro`）側は、zenbunエントリの有無で「📄 判決全文を読む」or 裁判所サイトへのリンクを出し分ける。**Astroの罠**: `zenbunEntry ? (A) : (courtsDetailUrl && (B))` という三項演算子の入れ子で書くと、else側のJSXがビルド後のHTMLに出力されない現象が発生した（原因未特定）。`{zenbunEntry && (A)}` と `{cond && (B)}` の2つの独立した条件ブロックに分ければ正しく描画される。同様のパターンを書く際は必ずdist出力を実際に確認すること
- **残り約49件への展開**: `docs/CONTENT_PLAN.md` の判例台帳からcourtsIdが分かっている判例について1件ずつ `fetch-zenbun.py` を実行し、文字化けしたものはスキップ（要旨のみで維持）、成功したものは `courtsId` をfrontmatterに追加してビルド確認→まとめてコミット、を4〜6件/バッチで回す

## §11 プラットフォーム移行時の注意

- このリポジトリはGitHub（sotar0826/topica）にあり、コード・docs・台帳がすべて入っているので**リポジトリをcloneできる環境ならどのAIでも継続可能**
- Claude固有のもの: なし（scratchpadにあった照合スクリプトは scripts/ に移設済み）
- 環境前提: Windows・Python 3（`py`コマンド。requests/pypdf は `pip install`）・Node.js（`C:\Program Files\nodejs`）・wrangler（npx経由）・git
- Qwen Code / Codex 等での運用: §8のとおり逐次実行に読み替え。**日本語の法律文書の文体維持と照合手順の遵守が品質の生命線**なので、最初の1記事はお手本記事との突き合わせレビューをしてから量産に入ること
- セッション終了時は必ず SESSION_NOTES.md 更新→コミット→push（これが唯一の引き継ぎチャネル）
