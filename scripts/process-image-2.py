import os
import json
from PIL import Image

src_img_path = r'C:\Users\kanno\.gemini\antigravity-ide\brain\b87b4d11-11ef-4be7-91d5-516ee9752a2e\media__1785055311193.jpg'
images_dir = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\public\assets\images'
covers_dir = os.path.join(images_dir, 'covers')
articles_dir = os.path.join(images_dir, 'articles')

os.makedirs(images_dir, exist_ok=True)
os.makedirs(covers_dir, exist_ok=True)
os.makedirs(articles_dir, exist_ok=True)

img = Image.open(src_img_path)
w, h = img.size # 768 x 1024

# 1. Mobile Hero WebP (3:4 - original aspect ratio)
mobile_hero_path = os.path.join(images_dir, 'hero-no-limits-mobile.webp')
img.save(mobile_hero_path, 'WEBP', quality=95)
print(f"[OK] Saved Mobile Hero: {mobile_hero_path} ({w}x{h})")

# 2. Discography Cover WebP (1:1 square - centered on members)
# 768 x 768 cropped from top-middle
cover_crop = img.crop((0, 100, 768, 868))
cover_path = os.path.join(covers_dir, 'cover-no-limits.webp')
cover_crop.save(cover_path, 'WEBP', quality=95)
print(f"[OK] Saved Discography Cover: {cover_path} ({cover_crop.size})")

# 3. Article Feature Hero WebP (3:2 landscape)
# 768 x 512 cropped from upper-middle
article_crop = img.crop((0, 120, 768, 632))
article_path = os.path.join(articles_dir, 'hero-no-limits-interview.webp')
article_crop.save(article_path, 'WEBP', quality=95)
print(f"[OK] Saved Feature Article Hero: {article_path} ({article_crop.size})")

# 4. Update asset-manifest.json
manifest_path = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\content\public\asset-manifest.json'
with open(manifest_path, 'r', encoding='utf-8') as f:
    manifest = json.load(f)

manifest['images']['hero-no-limits-mobile']['status'] = 'ready'
manifest['images']['cover-no-limits']['status'] = 'ready'
manifest['images']['article-hero-no-limits']['status'] = 'ready'

with open(manifest_path, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)

print("[OK] Updated asset-manifest.json: hero-no-limits-mobile, cover-no-limits, and article-hero-no-limits are now READY!")
