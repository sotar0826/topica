# 判例解説 全面リニューアル計画（2026-07-26）

ユーザー方針（2026-07-26）：**判例記事はすべてパイロット品質（本文4000〜5500字）にする**。
情報が不足している知名度の低い判例は後回しにする。

## 品質基準（パイロット＝お手本）

`src/content/hanrei/haishinteki-akuisha-h18.md`（時効取得と背信的悪意者・本文5170字）が基準。構成：

1. **事実の概要**（1000字前後・判決文と原審認定から当事者記号で具体的に）
2. **訴訟の経過**（下級審の判断と争点の絞られ方）
3. **判旨**（結論＋規範。全文照合できた場合のみ `<details>` で原文引用）
4. **解説**（h3で3〜4節。先例との関係・理論的位置づけ・射程・その後の影響）
5. **🖋 答案・論述での使い方**（必須。規範として引く部分／あてはめで効く事実／射程の限界／対比すべき判例）
6. **関連判例・関連トピック**

判決全文が取得できたものは `courtsId` を frontmatter に入れ、全文ページ（`/hanrei/<slug>/zenbun/`・noindex）を併設する。
文字化けで全文が読めない判例は判旨を「裁判要旨」として書き、引用体裁は使わない（`docs/HANDOFF_AI.md` §3-2）。

## 進行状況

| 弾 | 対象 | 状態 |
|---|---|---|
| パイロット | haishinteki-akuisha-h18 | ✅ 完了（5170字） |
| 第1弾 | gps-sosa-jiken / chloroform-jiken / shakti-jiken / gofurikomi-sagi-jiken / winny-jiken | ✅ 完了（2026-07-24） |
| 第2弾 | hichakushutsushi-iken-kettei / sorachibuto-jinja-jiken / kokusekiho-iken-hanketsu / zaigai-senkyoken-hanketsu / sekken-shitei-h11 | ✅ 完了（2026-07-29） |
| 第3弾 | ehime-tamagushiryo-jiken / shinrinho-iken-hanketsu / hoppo-journal-jiken / tsu-jichinsai-jiken / yakujiho-iken-hanketsu | ✅ 完了（2026-07-29。5件とも全文照合成功） |
| 第4弾 | mclean-jiken / mitsubishi-jushi-jiken / kyoto-fugakuren-jiken / yukan-wakayama-jiken / nerima-jiken | ✅ 完了（2026-07-29。5件とも全文照合成功。練馬事件は少数意見も精読） |
| 追加改善 | rumbar-jiken / anzen-hairyo-gimu-s50 / hojinkaku-hinin-s44 / shiratori-kettei / 94jo2ko-ruisui-s45 | ✅ 完了（2026-08-01。5件とも全文照合成功） |
| 第5弾 | hakusanmaru-jiken / yakuin-sekinin-daisansha-s44 / swat-jiken / osaka-nanko-jiken / osaka-kakuseizai-jiken | ✅ 完了（2026-08-02。白山丸は既改稿、残り4件を全文照合） |
| 追加改善2 | yonago-ginko-jiken | ✅ 完了（2026-08-02。全文照合成功） |
| 最終弾 | 未改稿だった18件すべて | ✅ 完了（2026-08-04。17件全文照合、1件裁判要旨照合） |
| 行政法第1弾 | 病院開設中止勧告／小田急線高架化／武蔵野市教育施設負担金／一級建築士免許取消／高知落石 | ✅ 完了（2026-08-11。3件全文照合・全文ページ生成、2件裁判要旨照合） |
| 行政法第2弾 | 伊方原発／個人タクシー／国道43号線／河川附近地制限令／課税処分と信義則 | ✅ 完了（2026-08-11。4件全文照合・全文ページ生成、1件裁判要旨照合） |

### 判決全文ページの生成状況（2026-08-02時点）

現在47件で `/hanrei/<slug>/zenbun/` を生成済み。2026-08-04に17件を追加し、全50解説の詳細版化が完了した。全文未生成は特殊フォント等で正常抽出できなかった3件のみ：
haishinteki-akuisha-h18（id 52426）／gps-sosa-jiken（id 86600）／chloroform-jiken（id 50059）／shakti-jiken（id 50057）／gofurikomi-sagi-jiken（id 50004）／winny-jiken（id 81846）／hichakushutsushi-iken-kettei（id 83520）／zaigai-senkyoken-hanketsu（id 52338）／sekken-shitei-h11（id 52506）／ehime-tamagushiryo-jiken（id 54777）／shinrinho-iken-hanketsu（id 55203）／hoppo-journal-jiken（id 52665）／tsu-jichinsai-jiken（id 54189）／yakujiho-iken-hanketsu（id 51936）／mclean-jiken（id 53255）／mitsubishi-jushi-jiken（id 51931）／kyoto-fugakuren-jiken（id 51765）／yukan-wakayama-jiken（id 50801）／nerima-jiken（id 51311）／hakusanmaru-jiken（id 56982）／rumbar-jiken（id 54204）／anzen-hairyo-gimu-s50（id 52111）／hojinkaku-hinin-s44（id 55117）／shiratori-kettei（id 51033）／94jo2ko-ruisui-s45（id 54141）／yakuin-sekinin-daisansha-s44（id 51871）／swat-jiken（id 50048）／osaka-nanko-jiken（id 50373）／osaka-kakuseizai-jiken（id 51125）／yonago-ginko-jiken（id 50201）。
第2弾のうち sorachibuto-jinja-jiken（id 38347）・kokusekiho-iken-hanketsu（id 36415）は特殊フォントPDFで文字化けしたため全文ページ未生成（判例解説ページには裁判所ウェブサイトへの直リンクが自動表示される）。
第3弾・第4弾は事前の想定（昭和判例は文字化けしやすい）に反し、pypdfの警告（一部フォントの未対応）は出たもののcp932再デコードでいずれも日本語文字比率・置換文字比率ともにクリーンな抽出に成功し、全件で全文ページを生成できた。

## バッチ割り（1バッチ5件・優先順）

**第2弾（平成の大法廷判決・全文取得しやすい）**
`hichakushutsushi-iken-kettei`（非嫡出子相続分違憲決定・平25）／`sorachibuto-jinja-jiken`（空知太神社・平22）／`kokusekiho-iken-hanketsu`（国籍法違憲・平20）／`zaigai-senkyoken-hanketsu`（在外国民選挙権・平17）／`sekken-shitei-h11`（接見指定大法廷・平11）

**第3弾（昭和後期〜平成初期の憲法A）**
`ehime-tamagushiryo-jiken`（愛媛玉串料・平9）／`shinrinho-iken-hanketsu`（森林法違憲・昭62）／`hoppo-journal-jiken`（北方ジャーナル・昭61）／`tsu-jichinsai-jiken`（津地鎮祭・昭52）／`yakujiho-iken-hanketsu`（薬事法違憲・昭50）

**第4弾（憲法A残り＋刑法A）**
`mclean-jiken`（マクリーン・昭53）／`mitsubishi-jushi-jiken`（三菱樹脂・昭48）／`kyoto-fugakuren-jiken`（京都府学連・昭44）／`yukan-wakayama-jiken`（夕刊和歌山時事・昭44）／`nerima-jiken`（練馬・昭33）

**第5弾（刑訴A・商法A＋主要B）**
`hakusanmaru-jiken`（白山丸・昭37）／`yakuin-sekinin-daisansha-s44`（取締役の対第三者責任大法廷・昭44）／`swat-jiken`（スワット・平15）／`osaka-nanko-jiken`（大阪南港・平2）／`osaka-kakuseizai-jiken`（大阪覚せい剤・昭53）

**第6弾（主要B）**
`yonago-ginko-jiken`（米子銀行強盗・昭53）／`shiratori-kettei`（白鳥決定・昭50）／`anzen-hairyo-gimu-s50`（安全配慮義務・昭50）／`rumbar-jiken`（ルンバール・昭50）／`416jo-ruisui-s48`（416条類推・昭48）

**第7弾（民法の定番B・C）**
`shutoku-jiko-toki-s41`（時効完成前の第三者・昭41）／`kyodo-sozoku-toki-s38`（共同相続と登記・昭38）／`hotei-chijoken-s36`（法定地上権・昭36）／`94jo2ko-ruisui-s45`（94条2項類推・昭45）／`sokuji-shutoku-s35`（占有改定と即時取得・昭35）

**第8弾（商法・民訴の定番C）**
`hojinkaku-hinin-s44`（法人格否認・昭44）／`naitagashi-sekinin-s41`（名板貸し・昭41）／`kabunushi-sokai-sairyo-kikyaku-s30`（裁量棄却・昭30）／`shinkabu-hakko-koka-h9`（新株発行の通知欠缺・平9）／`ichibu-seikyu-kihanryoku-s37`（明示的一部請求・昭37）

**第9弾（通称なしだが論点は重要）**
`soin-henko-yohi-h13`（訴因変更の要否・平13）／`kyosei-shobun-igi-s51`（強制処分の意義・昭51）／`shokei-kyodo-seihan-h24`（承継的共同正犯・平24）／`ryoteki-kajo-boei-h20`（量的過剰防衛・平20）／`chintaishaku-shinrai-kankei-s28`（無断転貸と信頼関係破壊・昭28）

**第10弾（情報が少ない・最後に回す）**
`benron-shugi-ihan-s41`（弁論主義違反）／`kansetsu-jijitsu-jihaku-s41`（間接事実の自白）／`yuigon-muko-kakunin-s47`（遺言無効確認の訴え）／`daii-ken-ishakin-s58`（慰謝料請求権と債権者代位）
→ 通称がなく参考資料も乏しい。**判決全文が取得できるかを最初に確認**し、取得できなければ現行の要旨中心の記述を維持して増強を見送る（無理に膨らませない）

## 運用ルール（各バッチのワーカーへ）

1. バッチの最初に**全5件の判決全文PDFの取得可否をまとめて確認**する。文字化けするものは判旨を要旨ベースにし、その分「解説」と「答案・論述での使い方」を厚くする
2. 事件番号・出典・裁判要旨は必ず `py scripts/hanrei.py get <id>` で再確認（記憶で書かない）
3. `courtsId` を frontmatter に追加し、`updated` を実行日に。既存の title/seoTitle/rank/topics/articles は維持
4. 全文が取得できた判例は `py scripts/fetch-zenbun.py <courtsId> <slug>` で全文ページも作る
5. 検収：本文4000字以上／`grep -c '\*\*' dist/hanrei/<slug>/index.html` が0／英単語混入なし／本番200
6. 完了時に本ファイルの進行状況表と `docs/SESSION_NOTES.md` を更新

## 別枠：行政法判例の新規収録（第1弾完了）

行政法33記事で照合済みの判例から、2026-08-11に主要5件を新規収録した。追加済み：処分性（病院開設中止勧告）／原告適格（小田急大法廷）／国賠2条（高知落石）／行政指導（武蔵野市教育施設負担金）／理由提示（一級建築士）。病院・武蔵野・高知は判決全文も正常抽出し、noindexの全文ページを併設。小田急・一級建築士は裁判所PDFが特殊フォントで文字化けしたため、裁判所公式の判示事項・裁判要旨に基づき解説し、判決文引用はしていない。

2026-08-11の第2弾で、裁量（伊方原発・個人タクシー）、国賠2条（国道43号線）、損失補償（河川附近地制限令）、一般原則（課税処分と信義則）を追加した。次回候補は、処分性（大田区ごみ焼却場・土地区画整理事業計画・保育所廃止条例）、原告適格（主婦連ジュース・もんじゅ）、国賠1条（筑豊じん肺）、国賠2条（大東水害）。
