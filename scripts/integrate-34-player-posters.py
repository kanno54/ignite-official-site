import os
import json
from PIL import Image

site_dir = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site'
brain_dir = r'C:\Users\kanno\.gemini\antigravity-ide\brain\b87b4d11-11ef-4be7-91d5-516ee9752a2e'

tracks_img_dir = os.path.join(site_dir, 'public', 'assets', 'images', 'tracks')
manifest_path = os.path.join(site_dir, 'content', 'public', 'asset-manifest.json')
discography_path = os.path.join(site_dir, 'content', 'public', 'discography.json')

os.makedirs(tracks_img_dir, exist_ok=True)

# Image source mappings for 3:4 Posters
posters_map = [
    ('track-poster-burn-it-down', 'media__1785071121139.jpg', 'poster-burn-it-down.webp', 'burn-it-down-main'),
    ('track-poster-ignition', 'media__1785071121197.jpg', 'poster-ignition.webp', 'ignition-main'),
    ('track-poster-firestarter', 'media__1785071121259.jpg', 'poster-firestarter.webp', 'firestarter-main'),
    ('track-poster-no-limits', 'media__1785071121288.jpg', 'poster-no-limits.webp', 'no-limits-title'),
    ('track-poster-ashes-in-motion', 'media__1785071121303.jpg', 'poster-ashes-in-motion.webp', 'ashes-in-motion'),
]

# 1. Save WebP images and update manifest
with open(manifest_path, 'r', encoding='utf-8') as f:
    manifest = json.load(f)

track_poster_ids = {}

for asset_id, src_fname, out_fname, rec_id in posters_map:
    src_path = os.path.join(brain_dir, src_fname)
    out_path = os.path.join(tracks_img_dir, out_fname)
    img = Image.open(src_path)
    img.save(out_path, 'WEBP', quality=95)
    print(f"[OK] Saved 3:4 Poster: {asset_id} -> {out_fname} ({img.size})")

    manifest['images'][asset_id] = {
        'path': f'/assets/images/tracks/{out_fname}',
        'status': 'ready',
        'aspect': '3:4'
    }
    track_poster_ids[rec_id] = asset_id

with open(manifest_path, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)

# 2. Update discography.json with posterAssetId
with open(discography_path, 'r', encoding='utf-8') as f:
    disco_data = json.load(f)

for rec in disco_data['recordings']:
    if rec['id'] in track_poster_ids:
        rec['posterAssetId'] = track_poster_ids[rec['id']]

with open(discography_path, 'w', encoding='utf-8') as f:
    json.dump(disco_data, f, indent=2, ensure_ascii=False)

print("[OK] Integrated 3:4 posters into asset-manifest.json and discography.json!")
