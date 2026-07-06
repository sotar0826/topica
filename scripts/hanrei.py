# -*- coding: utf-8 -*-
"""裁判所ウェブサイト（courts.go.jp）の最高裁判例をブラウザなしで照合するヘルパー。

使い方:
  py scripts/hanrei.py search 昭和 44 2 27      # 期日指定で最高裁判例を一覧
  py scripts/hanrei.py get 55117                # 判例IDの詳細（事件番号・出典・判示事項・裁判要旨）

検索結果はSPAではなくサーバーサイドでHTMLに埋め込まれているため、GETのみで取得できる。
詳細ページは静的 https://www.courts.go.jp/hanrei/{id}/detail2/index.html
"""
import http.cookiejar
import io
import re
import sys
import urllib.parse
import urllib.request

UA = {"User-Agent": "Mozilla/5.0"}
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

# 検索はセッションCookieがないと結果がサーバーサイドレンダリングされないため、
# CookieJar付きのopenerで先にトップページを踏んでから検索する。
_jar = http.cookiejar.CookieJar()
_opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(_jar))


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers=UA)
    return _opener.open(req).read().decode("utf-8", errors="ignore")


def strip_tags(html: str) -> list[str]:
    text = re.sub(r"<script.*?</script>", "", html, flags=re.S)
    text = re.sub(r"<style.*?</style>", "", text, flags=re.S)
    text = re.sub(r"<[^>]+>", "\n", text)
    return [l.strip() for l in text.split("\n") if l.strip()]


def search(gengo: str, year: str, month: str, day: str) -> None:
    # セッションCookie取得（これが無いと結果が埋め込まれない）
    fetch("https://www.courts.go.jp/hanrei/search1/index.html")
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
    # 各結果は id へのリンクを含むブロック。id と周辺テキストを対で出す
    seen = set()
    for m in re.finditer(r'href="\./\.\./(\d+)/detail2/index\.html"', html):
        cid = m.group(1)
        if cid in seen:
            continue
        seen.add(cid)
        ctx = html[max(0, m.start() - 1200): m.start() + 1200]
        text = re.sub(r"<[^>]+>", " ", ctx)
        text = re.sub(r"\s+", " ", text).strip()
        # 事件番号らしき箇所を切り出す
        mm = re.search(r"(昭和|平成|令和)\d+\((あ|お|オ|受|許|行ツ|行ヒ|ク|し|テ)\)\d+[^未]{0,80}", text)
        print(f"[{cid}] {(mm.group(0) if mm else text[:100])}")
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
