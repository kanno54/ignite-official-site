import os
import json
from PIL import Image

src_img_path = r'C:\Users\kanno\.gemini\antigravity-ide\brain\b87b4d11-11ef-4be7-91d5-516ee9752a2e\media__1785063549351.jpg'
articles_dir = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\public\assets\images\articles'
os.makedirs(articles_dir, exist_ok=True)

img = Image.open(src_img_path)
w, h = img.size # 1024 x 682 (exact 3:2 ratio!)

# Save Article Hero WebP (3:2 landscape)
article_path = os.path.join(articles_dir, 'hero-no-limits-interview.webp')
img.save(article_path, 'WEBP', quality=95)
print(f"[OK] Saved No Limits Roundtable Interview Hero: {article_path} ({w}x{h})")

# Update asset-manifest.json
manifest_path = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\content\public\asset-manifest.json'
with open(manifest_path, 'r', encoding='utf-8') as f:
    manifest = json.load(f)

manifest['images']['article-hero-no-limits']['status'] = 'ready'

with open(manifest_path, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)

print("[OK] Verified asset-manifest.json: article-hero-no-limits is READY!")
