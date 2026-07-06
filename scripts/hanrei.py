# -*- coding: utf-8 -*-
"""裁判所ウェブサイト（courts.go.jp）の最高裁判例をブラウザなしで照合するヘルパー。

使い方:
  py scripts/hanrei.py search 昭和 44 2 27      # 期日指定で最高裁判例を一覧
  py scripts/hanrei.py get 55117                # 判例IDの詳細（事件番号・出典・判示事項・裁判要旨）

検索結果はSPAではなくサーバーサイドでHTMLに埋め込まれているため、GETのみで取得できる。
詳細ページは静的 https://www.courts.go.jp/hanrei/{id}/detail2/index.html
"""
import io
import re
import sys
import urllib.parse
import urllib.request

UA = {"User-Agent": "Mozilla/5.0"}
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers=UA)
    return urllib.request.urlopen(req).read().decode("utf-8", errors="ignore")


def strip_tags(html: str) -> list[str]:
    text = re.sub(r"<script.*?</script>", "", html, flags=re.S)
    text = re.sub(r"<style.*?</style>", "", text, flags=re.S)
    text = re.sub(r"<[^>]+>", "\n", text)
    return [l.strip() for l in text.split("\n") if l.strip()]


def search(gengo: str, year: str, month: str, day: str) -> None:
    params = {
        "courtCaseType": "1",
        "filter[judgeDateMode]": "1",
        "filter[judgeGengoFrom]": gengo,
        "filter[judgeYearFrom]": year,
        "filter[judgeMonthFrom]": month,
        "filter[judgeDayFrom]": day,
    }
    url = "https://www.courts.go.jp/hanrei/search2/index.html?" + urllib.parse.urlencode(params)
    html = fetch(url)
    # 結果リストの各項目: <a href="./../{id}/detail2/index.html"> と周辺テキスト
    items = re.findall(
        r'href="\./\.\./(\d+)/detail2/index\.html".{0,2000}?</li>', html, flags=re.S
    )
    # 周辺テキストごと取る（liブロック単位）
    blocks = re.findall(r"<li[^>]*>(.*?)</li>", html, flags=re.S)
    seen = set()
    for b in blocks:
        m = re.search(r'href="\./\.\./(\d+)/detail2/index\.html"', b)
        if not m:
            continue
        cid = m.group(1)
        if cid in seen:
            continue
        seen.add(cid)
        text = re.sub(r"<[^>]+>", " ", b)
        text = re.sub(r"\s+", " ", text).strip()
        print(f"[{cid}] {text[:120]}")
    if not seen:
        print("(no results)")


def get(cid: str) -> None:
    html = fetch(f"https://www.courts.go.jp/hanrei/{cid}/detail2/index.html")
    lines = strip_tags(html)
    start = next((i for i, l in enumerate(lines) if "事件番号" in l), 0)
    end = next((i for i, l in enumerate(lines) if "ページ上部" in l), start + 45)
    print("\n".join(lines[start:end]))


if __name__ == "__main__":
    if len(sys.argv) >= 6 and sys.argv[1] == "search":
        search(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5])
    elif len(sys.argv) >= 3 and sys.argv[1] == "get":
        get(sys.argv[2])
    else:
        print(__doc__)
