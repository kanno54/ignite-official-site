import json

# Update campaigns.json
with open('content/public/campaigns.json', 'r', encoding='utf-8') as f:
    camps = json.load(f)

for c in camps:
    if c['id'] == 'firestarter' and c.get('status') == 'staging':
        c['status'] = 'archived'

with open('content/public/campaigns.json', 'w', encoding='utf-8') as f:
    json.dump(camps, f, ensure_ascii=False, indent=2)
print('Updated campaigns.json: firestarter status changed to archived')

# Update articles.json
with open('content/public/articles.json', 'r', encoding='utf-8') as f:
    arts = json.load(f)

for a in arts:
    if a.get('publication', {}).get('campaignState') == 'staging':
        if a['slug'] == 'archive-firestarter-leo-one-day-ahead':
            a['publication']['campaignState'] = 'past'
        elif a['slug'] in ['ren-moonlit-interview', 'between-the-lights-story']:
            a['publication']['campaignState'] = 'current'

with open('content/public/articles.json', 'w', encoding='utf-8') as f:
    json.dump(arts, f, ensure_ascii=False, indent=2)
print('Updated articles.json: publication.campaignState updated from staging to past/current')
