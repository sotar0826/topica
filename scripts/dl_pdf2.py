import urllib.request, urllib.parse, http.cookiejar, sys, re
jar = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent':'Mozilla/5.0'})
    return opener.open(req).read()
cid = sys.argv[1]
detail_url = f'https://www.courts.go.jp/hanrei/{cid}/detail2/index.html'
html = fetch(detail_url).decode('utf-8', errors='ignore')
m = re.findall(r'href="([^"]*\.pdf)"', html)
pdf_url = urllib.parse.urljoin(detail_url, m[0])
print(pdf_url)
data = fetch(pdf_url)
open(f'pdf_{cid}.pdf','wb').write(data)
print(len(data))
