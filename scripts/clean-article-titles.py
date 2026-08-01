import json
import re

with open('content/public/articles.json', 'r', encoding='utf-8') as f:
    articles = json.load(f)

for a in articles:
    old_title = a['title']
    new_title = re.sub(r'^[【\[].*?[】\]]\s*', '', old_title).strip()
    a['title'] = new_title

with open('content/public/articles.json', 'w', encoding='utf-8') as f:
    json.dump(articles, f, ensure_ascii=False, indent=2)

print('Successfully cleaned all article titles in articles.json!')
