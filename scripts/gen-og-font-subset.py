"""OGP画像生成（satori）用の日本語フォントサブセットを再生成するスクリプト。

背景:
  - OGP画像は src/pages/og/[...slug].png.ts でビルド時に satori + @resvg/resvg-js を使って
    1200x630のPNGを生成する。satoriはシステムフォントを使えないため、フォントデータを
    自前で読み込む必要がある（ビルド時にネットワーク取得はしない方針）。
  - 日本語フルセットの Noto Sans JP は可変フォントで約9.6MBあり、そのままリポジトリに
    同梱するには大きすぎるため、サイト内で実際に使われる文字だけに絞ったサブセットを
    作成し src/assets/fonts/ に同梱している。

フォント取得元（このスクリプトを再実行する場合に再ダウンロードする）:
  https://raw.githubusercontent.com/google/fonts/main/ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf
  ライセンス: SIL Open Font License 1.1（再配布可）
  https://github.com/google/fonts/blob/main/ofl/notosansjp/OFL.txt

再生成が必要になるタイミング:
  - 新しい記事タイトル・科目名・用語などに、現行サブセットに含まれない漢字が使われた場合
    （satoriでの描画時にその文字だけ欠落する＝豆腐化ではなく何も表示されない）
  - ひらがな・カタカナ・CJK基本記号・句読点は全域を含めているため、通常の日本語文であれば
    漢字以外で欠落することはない

使い方（要 Python + fontTools + PyYAML。事前に `pip install fonttools pyyaml` ）:
  1. 可変フォントをダウンロード:
     curl -L -o /tmp/NotoSansJP-var.ttf "https://raw.githubusercontent.com/google/fonts/main/ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf"
  2. Regular(400)/Bold(700) の静的インスタンスを書き出す:
     py -m fontTools varLib.instancer -o /tmp/NotoSansJP-Regular-full.ttf /tmp/NotoSansJP-var.ttf wght=400
     py -m fontTools varLib.instancer -o /tmp/NotoSansJP-Bold-full.ttf /tmp/NotoSansJP-var.ttf wght=700
  3. このスクリプトを実行して必要文字の一覧（corpus）を作る:
     py scripts/gen-og-font-subset.py --corpus-only /tmp/corpus.txt
  4. サブセット化:
     py -m fontTools subset /tmp/NotoSansJP-Regular-full.ttf --text-file=/tmp/corpus.txt \
        --output-file=src/assets/fonts/NotoSansJP-OGP-Regular.ttf --glyph-names --symbol-cmap --legacy-cmap
     py -m fontTools subset /tmp/NotoSansJP-Bold-full.ttf --text-file=/tmp/corpus.txt \
        --output-file=src/assets/fonts/NotoSansJP-OGP-Bold.ttf --glyph-names --symbol-cmap --legacy-cmap

このスクリプト自体は「必要文字一覧（corpus）」の生成のみを行う（フォントのダウンロード・
インスタンス化・サブセット化は上記コマンドを手動で実行する。CI/ビルド時には実行しない）。
"""

import re
import glob
import sys
import os
import argparse
import yaml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

CONTENT_DIRS = ["minpo", "shoho", "minso", "kenpo", "keiho", "keiso", "gyosei", "hanrei", "column", "yougo"]

FIXED_STRINGS = [
    "トピカ", "法律学習サイト", "基礎編", "応用編（発展）", "応用編", "判例解説",
    "コラム（発展）", "コラム", "民法", "商法・会社法", "商法", "会社法", "憲法",
    "刑法", "刑事訴訟法", "刑訴", "民事訴訟法", "民訴", "行政法", "破産法",
    "用語集", "科目トップ",
]


def add(chars, s):
    if s:
        for ch in str(s):
            chars.add(ch)


def build_corpus():
    chars = set()

    for d in CONTENT_DIRS:
        pattern = os.path.join(ROOT, "src", "content", d, "**", "*.md")
        for path in glob.glob(pattern, recursive=True):
            with open(path, encoding="utf-8") as f:
                text = f.read()
            m = re.match(r"^---\n(.*?)\n---\n", text, re.DOTALL)
            if not m:
                continue
            try:
                fm = yaml.safe_load(m.group(1))
            except Exception as e:
                print("YAML parse fail", path, e, file=sys.stderr)
                continue
            if not isinstance(fm, dict):
                continue
            add(chars, fm.get("title"))
            add(chars, fm.get("seoTitle"))
            add(chars, fm.get("term"))
            add(chars, fm.get("court"))
            add(chars, fm.get("decisionDate"))

    curriculum_path = os.path.join(ROOT, "src", "data", "curriculum.ts")
    with open(curriculum_path, encoding="utf-8") as f:
        curtext = f.read()
    for m in re.finditer(r'"([^"]*[぀-ヿ一-鿿][^"]*)"', curtext):
        add(chars, m.group(1))

    for s in FIXED_STRINGS:
        add(chars, s)

    for i in range(0x20, 0x7F):  # ASCII基本
        chars.add(chr(i))
    for i in range(0x3041, 0x3097):  # ひらがな全域
        chars.add(chr(i))
    for i in range(0x30A1, 0x30FB):  # カタカナ全域
        chars.add(chr(i))
    chars.add(chr(0x30FC))  # 長音符ー
    for i in range(0x3000, 0x3040):  # CJK記号と句読点
        chars.add(chr(i))

    chars.discard("\n")
    return chars


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--corpus-only", metavar="OUTFILE", required=True,
                         help="必要文字一覧の書き出し先パス")
    args = parser.parse_args()

    corpus = build_corpus()
    with open(args.corpus_only, "w", encoding="utf-8") as f:
        f.write("".join(sorted(corpus)))
    print(f"unique chars: {len(corpus)} -> {args.corpus_only}")
