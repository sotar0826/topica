# -*- coding: utf-8 -*-
import urllib.request, urllib.parse, http.cookiejar, re, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

jar = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    return opener.open(req).read().decode("utf-8", errors="ignore")


fetch("https://www.courts.go.jp/hanrei/search1/index.html")

kw = sys.argv[1]
gengo, year, month, day = sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5]
params = {
    "query1": kw,
    "courtCaseType": "1",
    "filter[judgeDateMode]": "1",
    "filter[judgeGengoFrom]": gengo,
    "filter[judgeYearFrom]": year,
    "filter[judgeMonthFrom]": month,
    "filter[judgeDayFrom]": day,
}
url = "https://www.courts.go.jp/hanrei/search2/index.html?" + urllib.parse.urlencode(params)
html = fetch(url)
ids = re.findall(r'href="\./\.\./(\d+)/detail2/index\.html"', html)
print(kw, gengo, year, month, day, len(ids), ids[:30])
