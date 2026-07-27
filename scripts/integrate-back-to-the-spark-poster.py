import os
import json
from PIL import Image

site_dir = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site'
brain_dir = r'C:\Users\kanno\.gemini\antigravity-ide\brain\b87b4d11-11ef-4be7-91d5-516ee9752a2e'

tracks_img_dir = os.path.join(site_dir, 'public', 'assets', 'images', 'tracks')
manifest_path = os.path.join(site_dir, 'content', 'public', 'asset-manifest.json')
discography_path = os.path.join(site_dir, 'content', 'public', 'discography.json')

os.makedirs(tracks_img_dir, exist_ok=True)

src_path = os.path.join(brain_dir, 'media__1785071704477.jpg')
out_path = os.path.join(tracks_img_dir, 'poster-back-to-the-spark.webp')

img = Image.open(src_path)
img.save(out_path, 'WEBP', quality=95)
print(f"[OK] Saved Back to the Spark Poster WebP: {out_path} ({img.size})")

# Update asset-manifest.json
with open(manifest_path, 'r', encoding='utf-8') as f:
    manifest = json.load(f)

manifest['images']['track-poster-back-to-the-spark'] = {
    'path': '/assets/images/tracks/poster-back-to-the-spark.webp',
    'status': 'ready',
    'aspect': '3:4'
}

with open(manifest_path, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)

# Update discography.json
with open(discography_path, 'r', encoding='utf-8') as f:
    disco_data = json.load(f)

for rec in disco_data['recordings']:
    if rec['id'] == 'back-to-the-spark':
        rec['posterAssetId'] = 'track-poster-back-to-the-spark'

with open(discography_path, 'w', encoding='utf-8') as f:
    json.dump(disco_data, f, indent=2, ensure_ascii=False)

print("[OK] Updated Back to the Spark poster in asset-manifest.json and discography.json!")
