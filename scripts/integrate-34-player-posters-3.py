import os
import json
from PIL import Image

site_dir = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site'
brain_dir = r'C:\Users\kanno\.gemini\antigravity-ide\brain\b87b4d11-11ef-4be7-91d5-516ee9752a2e'

tracks_img_dir = os.path.join(site_dir, 'public', 'assets', 'images', 'tracks')
manifest_path = os.path.join(site_dir, 'content', 'public', 'asset-manifest.json')
discography_path = os.path.join(site_dir, 'content', 'public', 'discography.json')

os.makedirs(tracks_img_dir, exist_ok=True)

# Image source mappings for 3rd batch of 3:4 Posters
posters_map = [
    ('track-poster-run-with-us-live', 'media__1785071506944.jpg', 'poster-run-with-us-live.webp', 'run-with-us-live'),
    ('track-poster-heatwave-indies', 'media__1785071506970.jpg', 'poster-heatwave-indies.webp', 'firestarter-heatwave-indies'),
    ('track-poster-runaway-beat', 'media__1785071506996.jpg', 'poster-runaway-beat.webp', 'firestarter-runaway-beat'),
    ('track-poster-first-light', 'media__1785071507013.jpg', 'poster-first-light.webp', 'firestarter-first-light'),
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

# 2. Update discography.json with posterAssetId for all recordings
with open(discography_path, 'r', encoding='utf-8') as f:
    disco_data = json.load(f)

# Supplementary mappings for any recording without unique upload
supplementary_map = {
    'back-to-the-spark': 'track-poster-ignition',
}

for rec in disco_data['recordings']:
    if rec['id'] in track_poster_ids:
        rec['posterAssetId'] = track_poster_ids[rec['id']]
    elif rec['id'] in supplementary_map:
        rec['posterAssetId'] = supplementary_map[rec['id']]

with open(discography_path, 'w', encoding='utf-8') as f:
    json.dump(disco_data, f, indent=2, ensure_ascii=False)

print("[OK] Integrated 3rd batch of 3:4 posters into asset-manifest.json and discography.json!")
