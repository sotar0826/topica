# CLAUDE.md

法律学習サイト「トピカ」。Astro + Content Collections。仕様の全体像は `C:\Users\sotar\Downloads\topica-spec.md` 参照。

## コマンド

```powershell
npm run dev    # 開発サーバー (localhost:4321)
npm run build  # ビルド
```

Node.js は `C:\Program Files\nodejs` にあるが、セッションのPATHに入っていないことがある（`$env:Path += ";C:\Program Files\nodejs"` を前置）。

## 構造

- `src/data/curriculum.ts` — 全51トピックの定義。ナビ・ツリー表示・前後リンクの基準。トピック追加時はここを更新
- `src/content/minpo/<slug>.md` — 基礎編。応用編は `<slug>-ouyou.md`
- `src/pages/minpo/[slug].astro` — トピックページのレイアウト（関連リンク・AIテンプレ・前後ナビは自動生成）

## コンテンツ執筆方針（ユーザー確認済み）

- **文体**：平易にしすぎない。将来目標が論述試験なので、法律的な言い回し・正確な法律用語を正面から使う。専門用語には初出時に簡潔な説明を添えるが、その後は専門用語をそのまま使う
  - 避ける例：「ダメ」「たまったものではない」のような口語に寄りすぎた表現
  - 良い例：「保護に値しない」「取引の安全を害する」「〜と解されている」のような論述で使える表現
- 効果・要件は条文の文言に即して正確に書く
- 判例は「最判平成○年○月○日」形式。不確かな判例は創作しない
- 現行民法（債権法改正後）準拠
- Markdownの強調 `**...**` は鉤括弧「」に隣接させると正しくパースされないことがある（全角約物の flanking 判定）。強調は約物を含めない範囲にかける
