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
| 第1弾 | gps-sosa-jiken / chloroform-jiken / shakti-jiken / gofurikomi-sagi-jiken / winny-jiken | 🔄 進行中 |
| 第2弾 | 憲法A・平成の判例＋刑訴A（下記） | 未着手 |
| 第3弾以降 | 下記の優先順 | 未着手 |

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

## 別枠：行政法判例の新規収録（未着手）

行政法33記事で照合済みの判例が判例解説に未収録。以下は追加候補（`docs/CONTENT_PLAN.md` 行政法セクションに id あり）：
処分性（大田区ごみ焼却場・病院開設中止勧告・土地区画整理事業計画・保育所廃止条例）／原告適格（主婦連ジュース・小田急大法廷・もんじゅ）／裁量（伊方原発・個人タクシー・マクリーン＝既収録）／国賠1条（筑豊じん肺）／国賠2条（高知落石・大東水害）／損失補償（河川附近地制限令）／行政指導（品川マンション・武蔵野マンション）／理由提示（一級建築士）。
リニューアルと並行せず、既存50件の増強が一巡した後、または別バッチとして実施する。
