# -*- coding: utf-8 -*-
"""判決全文PDFを取得し、src/content/zenbun/<hanrei-slug>.md を生成する。

使い方:
  py scripts/fetch-zenbun.py <courtsId> <hanrei-slug>

処理:
  1. 裁判所ウェブサイト（裁判例検索）の判決全文PDFをダウンロード
     （scripts/dl_pdf2.py と同じ detail2 ページから href="*.pdf" を拾う方式）
  2. pypdf でテキスト抽出し、cp932 再デコードで文字化けを修復
     （scripts/pdf_fix.py と同じロジック）
  3. ページ番号行の除去・不要な空白の整理・行の折り返しを段落単位へ結合
  4. 日本語文字比率 / 置換文字(U+FFFD)比率から文字化けを検出し、
     文字化けと判定した場合はファイルを作らずに中止する
  5. frontmatter 付きの Markdown を src/content/zenbun/<hanrei-slug>.md に書き出す

既知の罠（docs/HANDOFF_AI.md §4 と同じ）:
  - 古い判例PDFは特殊フォント（Adobe-Japan1 / 90ms-RKSJ-H 等）で
    テキスト抽出そのものが破綻することがある → 本スクリプトが検出して中止する
  - detail2 ページのPDFリンクが複数ある場合は最初の *.pdf を採用する
    （通常は判決全文PDFが1本のみ）
"""
import datetime
import http.cookiejar
import os
import re
import sys
import tempfile
import urllib.parse
import urllib.request

import pypdf

UA = {"User-Agent": "Mozilla/5.0"}

_jar = http.cookiejar.CookieJar()
_opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(_jar))


def fetch_bytes(url: str) -> bytes:
    req = urllib.request.Request(url, headers=UA)
    return _opener.open(req).read()


def download_pdf(courts_id: str) -> tuple[str, bytes]:
    """detail2ページからPDFのURLを見つけてダウンロードする。戻り値: (pdf_url, pdf_bytes)"""
    detail_url = f"https://www.courts.go.jp/hanrei/{courts_id}/detail2/index.html"
    html = fetch_bytes(detail_url).decode("utf-8", errors="ignore")
    hrefs = re.findall(r'href="([^"]*\.pdf)"', html)
    if not hrefs:
        raise RuntimeError(f"detail2ページにPDFリンクが見つからない: {detail_url}")
    pdf_url = urllib.parse.urljoin(detail_url, hrefs[0])
    data = fetch_bytes(pdf_url)
    return pdf_url, data


def cp932_refix(raw: str) -> str:
    """pypdf抽出テキストのcp932再エンコードを修復する（scripts/pdf_fix.py と同じロジック）。"""
    out = []
    buf = bytearray()
    for ch in raw:
        cp = ord(ch)
        if cp < 0x100:
            buf.append(cp)
        else:
            if buf:
                try:
                    out.append(bytes(buf).decode("cp932", errors="replace"))
                except Exception:
                    out.append(bytes(buf).decode("cp932", errors="ignore"))
                buf = bytearray()
            out.append(ch)
    if buf:
        try:
            out.append(bytes(buf).decode("cp932", errors="replace"))
        except Exception:
            out.append(bytes(buf).decode("cp932", errors="ignore"))
    return "".join(out)


PAGE_NUM_RE = re.compile(r"^[-‐－ー]\s*\d+\s*[-‐－ー]$")
HEADING_TOKENS = {"主文", "理由", "事実及び理由", "別紙", "別表", "判決", "決定"}
# 内部の連続空白（半角/全角スペース2つ以上）は視覚的な字間調整なので削除する
MULTI_WS_RE = re.compile(r"[ 　]{2,}")
SENTENCE_END_RE = re.compile(r"[。」』）]$")


def clean_and_paragraph(raw: str) -> str:
    """ページ番号除去・折り返し結合・段落整理を行い、段落=空行区切りのテキストを返す。"""
    lines = raw.split("\n")
    stripped = []
    for line in lines:
        s = line.strip(" 　\t\r")
        if not s:
            continue
        if PAGE_NUM_RE.match(s):
            continue
        s = MULTI_WS_RE.sub("", s)
        stripped.append(s)

    paragraphs: list[str] = []
    buf = ""
    for s in stripped:
        if not buf:
            buf = s
        elif s in HEADING_TOKENS or buf in HEADING_TOKENS or SENTENCE_END_RE.search(buf):
            # 直前の行が文末（。」』）で終わっている、または見出し語なら新しい段落にする
            paragraphs.append(buf)
            buf = s
        else:
            # 文末で終わっていない → PDFの行折り返しなので直接連結する（区切り文字なし）
            buf += s
    if buf:
        paragraphs.append(buf)

    return "\n\n".join(paragraphs)


def is_garbled(text: str) -> bool:
    """日本語文字比率が低い、またはU+FFFDが多い場合は文字化けと判定する。"""
    non_ws = [c for c in text if not c.isspace()]
    total = len(non_ws)
    if total < 200:
        return True
    jp = sum(
        1
        for c in non_ws
        if "぀" <= c <= "ゟ"  # ひらがな
        or "゠" <= c <= "ヿ"  # カタカナ
        or "一" <= c <= "鿿"  # 漢字
    )
    fffd = text.count("�")
    jp_ratio = jp / total
    fffd_ratio = fffd / total
    return jp_ratio < 0.5 or fffd_ratio > 0.01


def main() -> int:
    if len(sys.argv) != 3:
        print(__doc__)
        return 1
    courts_id, slug = sys.argv[1], sys.argv[2]

    print(f"[1/4] PDFを検索中... courtsId={courts_id}")
    pdf_url, pdf_data = download_pdf(courts_id)
    print(f"      PDF URL: {pdf_url} ({len(pdf_data)} bytes)")

    with tempfile.TemporaryDirectory() as tmpdir:
        pdf_path = os.path.join(tmpdir, f"{courts_id}.pdf")
        with open(pdf_path, "wb") as f:
            f.write(pdf_data)

        print("[2/4] テキスト抽出中...")
        reader = pypdf.PdfReader(pdf_path)
        raw = "\n".join((p.extract_text() or "") for p in reader.pages)
        fixed = cp932_refix(raw)

    print("[3/4] 文字化け判定...")
    if is_garbled(fixed):
        print("★ 文字化けのため中止（日本語文字比率が低い、または抽出不能な文字が多い）")
        print("  古い判例で特殊フォント（Adobe-Japan1等）を使用している可能性がある。")
        print("  ファイルは作成しません。判例解説ページ側は「裁判要旨」の範囲で記述してください。")
        return 2

    body = clean_and_paragraph(fixed)

    print("[4/4] Markdownを書き出し中...")
    today = datetime.date.today().isoformat()
    frontmatter = (
        "---\n"
        f"hanreiSlug: {slug}\n"
        f'courtsId: "{courts_id}"\n'
        f"sourceUrl: {pdf_url}\n"
        f"fetchedAt: {today}\n"
        "---\n\n"
    )

    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_dir = os.path.join(repo_root, "src", "content", "zenbun")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, f"{slug}.md")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(frontmatter)
        f.write(body)
        f.write("\n")

    print(f"完了: {out_path} ({len(body)} 文字)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
