# 複数AIの並行作業ルール（2026-07-24）

Claude Code / Codex / その他エージェントが**同時に同じリポジトリで作業する**ことがあるため、
衝突（gitコンフリクト・同一ファイルの上書き）を防ぐための取り決め。**作業を始める前に必ず読むこと。**

## 1. 担当領域の分離（同時に走らせるならこの単位で分ける）

| 領域 | 主な触るファイル | 備考 |
|---|---|---|
| **A. 記事執筆** | `src/content/<科目>/*.md`、`src/content/devlog/`、`docs/CONTENT_PLAN.md` | 科目単位で分ければ複数エージェント可 |
| **B. 判例解説** | `src/content/hanrei/*.md` | 記事執筆とは独立 |
| **C. 仕組み・UI** | `src/layouts/`、`src/pages/**/*.astro`、`src/styles/`、`public/*.js`、`astro.config.mjs`、`src/content.config.ts`、`src/lib/`、`scripts/` | **1エージェントのみ**。記事mdは触らない |
| **D. カリキュラム定義** | `src/data/curriculum.ts` | 新科目・新トピック追加時のみ。触る前に他が作業中でないか確認 |

**原則: AとC（記事とUI）は同時可。CとCは同時不可。**

## 2. git運用（全エージェント共通・必須）

```bash
git pull --rebase origin main   # 作業開始時
# ...作業...
git pull --rebase origin main   # コミット直前にもう一度
git add -A && git commit -m "..." && git push origin main
```

- **`git reset --hard` / `git checkout -- .` / force push は禁止**（他エージェントの成果を消す）
- コンフリクトが出たら、消さずに内容を読んで統合する。判断できなければ作業を止めてユーザーに報告
- コミットは細かく刻む（1記事ごと・1機能ごと）。長時間コミットせずに抱えない

## 3. 共有ドキュメントの書き込み

`docs/SESSION_NOTES.md` は全エージェントが追記するため衝突しやすい。

- 追記は**「直近セッションログ」の先頭に1エントリだけ**。既存エントリを編集・削除しない
- エントリ冒頭に**担当を明記**する: `【Codex・…】` `【Claude・…】`
- `docs/CONTENT_PLAN.md` は科目セクション単位で追記（他科目の記述に触らない）
- `docs/UI_PLAN_2026-07-23.md` のステータス表は、自分が完了させたバッチの行だけ更新

## 4. デプロイの排他

`npm run build` → `wrangler pages deploy` は**同時実行しない**（distを共有しているため互いのビルド結果を混ぜてしまう）。

- デプロイ前に `git pull --rebase` して**他エージェントの成果も含めた状態でビルド**する（結果的に相手の分も公開されるのは問題ない）
- デプロイ後は本番URLで自分の変更を200確認する

## 5. 現在の進行状況（2026-07-24時点）

- 六法＋行政法の基礎編・応用編は**すべて公開済み**（行政法33本を含む）
- 判例解説50件公開済み。UI改善は UI-1（ナビ/ダークモード/目次/印刷）完了、UI-2〜4は `docs/UI_PLAN_2026-07-23.md` 参照
- 次の大きな仕様: 判例解説の百選級増強（`docs/HANDOFF_AI.md` §10）、資格別コース構想（`docs/IDEAS_2026-07-23-quality-vision.md` §3・着手はまだ先）
