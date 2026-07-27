import json

discography_path = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\content\public\discography.json'

with open(discography_path, 'r', encoding='utf-8') as f:
    disco_data = json.load(f)

print(f"Total recordings: {len(disco_data['recordings'])}")
for r in disco_data['recordings']:
    poster = r.get('posterAssetId', 'NONE (Fallback to Profile/Cover)')
    print(f" - [{r['id']}] {r['title']} ({r['versionLabel']}): poster={poster}")
