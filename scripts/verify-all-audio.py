import os
import json

manifest_path = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\content\public\discography.json'
site_dir = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site'

with open(manifest_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

recordings = data['recordings']
print(f"Checking {len(recordings)} tracks...")

all_present = True
for r in recordings:
    rel_path = r['audioUrl'].lstrip('/')
    abs_path = os.path.join(site_dir, 'public', rel_path)
    exists = os.path.exists(abs_path)
    size = os.path.getsize(abs_path) if exists else 0
    print(f" - [{r['id']}] {r['title']} ({r['versionLabel']}): {'EXISTS' if exists else 'MISSING'} ({size} bytes)")
    if not exists:
        all_present = False

if all_present:
    print("\n[OK] ALL 15 TRACKS ARE 100% PRESENT IN PUBLIC AUDIO FOLDER!")
