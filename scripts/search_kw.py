# -*- coding: utf-8 -*-
"""日付＋キーワード全文検索で courts.go.jp から判例idを特定するヘルパー（hanrei.pyのsearchのid対応ずれを補う）。

使い方:
  py scripts/search_kw.py 平成 18 1 17 "時効取得 背信的悪意"
"""
import io
import re
import sys
import urllib.parse

sys.path.insert(0, __file__.rsplit("\\", 1)[0].rsplit("/", 1)[0] + "/scripts")
from hanrei import fetch, _jar  # noqa: E402


def search_kw(gengo: str, year: str, month: str, day: str, query: str) -> None:
    fetch("https://www.courts.go.jp/hanrei/search1/index.html")
    params = {
        "courtCaseType": "1",
        "filter[judgeDateMode]": "1",
        "filter[judgeGengoFrom]": gengo,
        "filter[judgeYearFrom]": year,
        "filter[judgeMonthFrom]": month,
        "filter[judgeDayFrom]": day,
        "query1": query,
    }
    url = "https://www.courts.go.jp/hanrei/search2/index.html?" + urllib.parse.urlencode(params)
    html = fetch(url)
    seen = set()
    for m in re.finditer(r'href="\./\.\./(\d+)/detail2/index\.html"', html):
        cid = m.group(1)
        if cid in seen:
            continue
        seen.add(cid)
        ctx = html[max(0, m.start() - 1200): m.start() + 1200]
        text = re.sub(r"<[^>]+>", " ", ctx)
        text = re.sub(r"\s+", " ", text).strip()
        mm = re.search(r"(昭和|平成|令和)\d+\((あ|お|オ|受|許|行ツ|行ヒ|ク|し|テ)\)\d+[^未]{0,80}", text)
        print(f"[{cid}] {(mm.group(0) if mm else text[:100])}")
    if not seen:
        print("(no results)")


if __name__ == "__main__":
    if len(sys.argv) >= 6:
        search_kw(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5])
    else:
        print(__doc__)
