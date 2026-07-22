import json, sys
sys.stdout.reconfigure(encoding='utf-8')

# usage: py get_article3.py <json_path> <article_num> [<article_num> ...]
json_path = sys.argv[1]
targets = set(sys.argv[2:])

with open(json_path, encoding='utf-8') as f:
    data = json.load(f)

root = data['law_full_text']

def text_of(node):
    if isinstance(node, str):
        return node
    out = []
    if isinstance(node, dict):
        for c in node.get('children', []):
            out.append(text_of(c))
    elif isinstance(node, list):
        for c in node:
            out.append(text_of(c))
    return ''.join(out)

def fix(t):
    out = []
    buf = bytearray()
    for ch in t:
        cp = ord(ch)
        if cp < 256:
            buf.append(cp)
        else:
            if buf:
                out.append(bytes(buf).decode('cp932', errors='replace'))
                buf = bytearray()
            out.append(ch)
    if buf:
        out.append(bytes(buf).decode('cp932', errors='replace'))
    return ''.join(out)

def find_articles(node, targets, results, in_main=False):
    if isinstance(node, dict):
        tag = node.get('tag')
        if tag == 'MainProvision':
            in_main = True
        if tag == 'SupplProvision':
            in_main = False
        if tag == 'Article' and in_main:
            num = node.get('attr', {}).get('Num')
            if num in targets:
                results[num] = text_of(node)
        for c in node.get('children', []):
            find_articles(c, targets, results, in_main)
    elif isinstance(node, list):
        for c in node:
            find_articles(c, targets, results, in_main)

if __name__ == '__main__':
    results = {}
    find_articles(root, targets, results)
    for num in sys.argv[2:]:
        print(f"===== 第{num}条 =====")
        print(fix(results.get(num, '(not found)')))
        print()
