import os
import json
from PIL import Image

src_img_path = r'C:\Users\kanno\.gemini\antigravity-ide\brain\b87b4d11-11ef-4be7-91d5-516ee9752a2e\media__1785059678914.jpg'
members_dir = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\public\assets\images\members'
articles_dir = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\public\assets\images\articles'

os.makedirs(members_dir, exist_ok=True)
os.makedirs(articles_dir, exist_ok=True)

img = Image.open(src_img_path)
w, h = img.size # 1024 x 1024

# 1. Avatar YUTO WebP (1:1 square)
avatar_path = os.path.join(members_dir, 'avatar-yuto.webp')
img.save(avatar_path, 'WEBP', quality=95)
print(f"[OK] Saved Avatar YUTO: {avatar_path} ({w}x{h})")

# 2. Profile YUTO WebP (4:5 vertical)
target_w = int(h * (4/5)) # 819px
left = (w - target_w) // 2
right = left + target_w
profile_crop = img.crop((left, 0, right, h))

profile_path = os.path.join(members_dir, 'profile-yuto.webp')
profile_crop.save(profile_path, 'WEBP', quality=95)
print(f"[OK] Saved Profile YUTO: {profile_path} ({profile_crop.size})")

# 3. Article Feature Hero YUTO WebP (3:2 landscape)
target_h = int(w * (2/3)) # 682px
top = (h - target_h) // 2
bottom = top + target_h
article_crop = img.crop((0, top, w, bottom))

article_path = os.path.join(articles_dir, 'hero-yuto-feature.webp')
article_crop.save(article_path, 'WEBP', quality=95)
print(f"[OK] Saved Feature Article Hero YUTO: {article_path} ({article_crop.size})")

# 4. Update asset-manifest.json
manifest_path = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\content\public\asset-manifest.json'
with open(manifest_path, 'r', encoding='utf-8') as f:
    manifest = json.load(f)

manifest['images']['avatar-yuto']['status'] = 'ready'
manifest['images']['profile-yuto']['status'] = 'ready'
manifest['images']['article-hero-yuto']['status'] = 'ready'

with open(manifest_path, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)

print("[OK] Updated asset-manifest.json: avatar-yuto, profile-yuto, and article-hero-yuto are now READY!")
