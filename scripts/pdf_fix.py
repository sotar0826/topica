# -*- coding: utf-8 -*-
"""pypdf抽出テキストの文字化け（cp932がlatin1的に再エンコードされたもの）を修復する。
使い方: py pdf_fix.py <pdf_path> <out_txt_path>
"""
import sys
import pypdf

path = sys.argv[1]
outpath = sys.argv[2]

r = pypdf.PdfReader(path)
raw = "\n".join((p.extract_text() or "") for p in r.pages)


def fix(t):
    out = []
    buf = bytearray()
    for ch in t:
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


fixed = fix(raw)
with open(outpath, "w", encoding="utf-8") as f:
    f.write(fixed)
print(len(fixed))
print(fixed[:1000])
