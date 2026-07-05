# DIAGRAM_TEMPLATES.md — 記事用図解テンプレート

最終更新: 2026-07-05
出典: Claude Design で作成した3案（`三者関係図.dc.html`）のうち**案①横並びフラット**を採用し、サイト配色に調整したもの。

## 使い方・ルール（ARTICLE_GUIDE.md §8 と対応）

- 記事は Markdown なので、**SVGを本文に直接貼り付ける**（コンポーネント化は不可。既存の `sakugo.md` と同方式）
- 三者関係（A→B→C）が登場する論点では三者関係図を原則入れる
- 図は1記事3点まで。図で説明できることを長文で重複説明しない
- **必ず `role="img"` と `aria-label` を付ける**（アクセシビリティ。Lighthouse 100点維持のため）
- 配色は CSS 変数と同値のハードコード：枠 `#2f6690` / 塗り `#e8f0f7` / 見出し文字 `#234d6d` / 本文文字 `#2b2b2b` / 善意バッジ `#dff1e6`+`#2f7a51` / 悪意バッジ `#fde8e8`+`#b91c1c`

## テンプレート：三者関係図（横並び・A→B→C）

プレースホルダー（`{...}`）を置き換えて使う。バッジ・ラベルは不要なら削除。

```html
<svg viewBox="0 0 800 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="{図の説明}">
  <defs>
    <marker id="{一意のID}" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#2f6690"/>
    </marker>
  </defs>

  <!-- A -->
  <rect x="30" y="70" width="140" height="70" rx="8" fill="#e8f0f7" stroke="#2f6690" stroke-width="2"/>
  <text x="100" y="100" text-anchor="middle" font-size="16" font-weight="700" fill="#234d6d">A</text>
  <text x="100" y="122" text-anchor="middle" font-size="12" fill="#2b2b2b">{Aの立場}</text>

  <!-- B -->
  <rect x="330" y="70" width="140" height="70" rx="8" fill="#e8f0f7" stroke="#2f6690" stroke-width="2"/>
  <text x="400" y="100" text-anchor="middle" font-size="16" font-weight="700" fill="#234d6d">B</text>
  <text x="400" y="122" text-anchor="middle" font-size="12" fill="#2b2b2b">{Bの立場}</text>

  <!-- C -->
  <rect x="630" y="70" width="140" height="70" rx="8" fill="#e8f0f7" stroke="#2f6690" stroke-width="2"/>
  <text x="700" y="100" text-anchor="middle" font-size="16" font-weight="700" fill="#234d6d">C</text>
  <text x="700" y="122" text-anchor="middle" font-size="12" fill="#2b2b2b">{Cの立場}</text>

  <!-- Cの主観バッジ（不要なら削除。悪意なら fill="#fde8e8" / 文字 "#b91c1c"） -->
  <rect x="678" y="34" width="64" height="24" rx="12" fill="#dff1e6"/>
  <text x="710" y="50" text-anchor="middle" font-size="11" font-weight="700" fill="#2f7a51">善意</text>

  <!-- 矢印 A→B -->
  <line x1="170" y1="105" x2="325" y2="105" stroke="#2f6690" stroke-width="2.5" marker-end="url(#{一意のID})"/>
  <text x="248" y="90" text-anchor="middle" font-size="13" font-weight="700" fill="#234d6d">{行為1}</text>

  <!-- 矢印 B→C -->
  <line x1="470" y1="105" x2="625" y2="105" stroke="#2f6690" stroke-width="2.5" marker-end="url(#{一意のID})"/>
  <text x="548" y="90" text-anchor="middle" font-size="13" font-weight="700" fill="#234d6d">{行為2}</text>
</svg>
```

### 注意

- `marker id` はページ内で一意にする（同一記事に複数の図を置くと ID が衝突して矢印が消える）
- 下部に補足文を置く場合は `viewBox` の高さを 280〜300 に広げ、`y=200` 前後に `<text>` を追加
- 対抗関係を示す場合は A と C を両矢印（`marker-start` + `marker-end`）で結び、線を `stroke-dasharray="6 4"` の点線にする

## 記入例（虚偽表示・94条2項）

```html
<svg viewBox="0 0 800 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="虚偽表示の三者関係。AがBに仮装譲渡し、BがCに売却した場面">
  <defs>
    <marker id="ah-94" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#2f6690"/>
    </marker>
  </defs>
  <rect x="30" y="70" width="140" height="70" rx="8" fill="#e8f0f7" stroke="#2f6690" stroke-width="2"/>
  <text x="100" y="100" text-anchor="middle" font-size="16" font-weight="700" fill="#234d6d">A</text>
  <text x="100" y="122" text-anchor="middle" font-size="12" fill="#2b2b2b">真の権利者</text>
  <rect x="330" y="70" width="140" height="70" rx="8" fill="#e8f0f7" stroke="#2f6690" stroke-width="2"/>
  <text x="400" y="100" text-anchor="middle" font-size="16" font-weight="700" fill="#234d6d">B</text>
  <text x="400" y="122" text-anchor="middle" font-size="12" fill="#2b2b2b">虚偽の名義人</text>
  <rect x="630" y="70" width="140" height="70" rx="8" fill="#e8f0f7" stroke="#2f6690" stroke-width="2"/>
  <text x="700" y="100" text-anchor="middle" font-size="16" font-weight="700" fill="#234d6d">C</text>
  <text x="700" y="122" text-anchor="middle" font-size="12" fill="#2b2b2b">第三者</text>
  <rect x="678" y="34" width="64" height="24" rx="12" fill="#dff1e6"/>
  <text x="710" y="50" text-anchor="middle" font-size="11" font-weight="700" fill="#2f7a51">善意</text>
  <line x1="170" y1="105" x2="325" y2="105" stroke="#2f6690" stroke-width="2.5" marker-end="url(#ah-94)"/>
  <text x="248" y="90" text-anchor="middle" font-size="13" font-weight="700" fill="#234d6d">仮装譲渡</text>
  <line x1="470" y1="105" x2="625" y2="105" stroke="#2f6690" stroke-width="2.5" marker-end="url(#ah-94)"/>
  <text x="548" y="90" text-anchor="middle" font-size="13" font-weight="700" fill="#234d6d">売買</text>
</svg>
```

## 今後追加予定のテンプレート（ARTICLE_GUIDE §8 の残り3種）

- 時系列図（「取消し前後」「対抗の前後」など時間軸が争点の論点用）
- 対比表（錯誤vs詐欺 等の制度比較。まずはMarkdown表で代替可）
- フローチャート（要件の条件分岐用）
