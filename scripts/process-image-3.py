import os
import json
from PIL import Image

src_img_path = r'C:\Users\kanno\.gemini\antigravity-ide\brain\b87b4d11-11ef-4be7-91d5-516ee9752a2e\media__1785055744200.jpg'
members_dir = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\public\assets\images\members'
os.makedirs(members_dir, exist_ok=True)

img = Image.open(src_img_path)
w, h = img.size # 1024 x 1024

# 1. Avatar KAI WebP (1:1 square)
avatar_path = os.path.join(members_dir, 'avatar-kai.webp')
img.save(avatar_path, 'WEBP', quality=95)
print(f"[OK] Saved Avatar KAI: {avatar_path} ({w}x{h})")

# 2. Profile KAI WebP (4:5 vertical)
# 1024 height -> 4:5 width = 1024 * (4/5) = 819px
target_w = int(h * (4/5)) # 819px
left = (w - target_w) // 2
right = left + target_w
profile_crop = img.crop((left, 0, right, h))

profile_path = os.path.join(members_dir, 'profile-kai.webp')
profile_crop.save(profile_path, 'WEBP', quality=95)
print(f"[OK] Saved Profile KAI: {profile_path} ({profile_crop.size})")

# 3. Update asset-manifest.json
manifest_path = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\content\public\asset-manifest.json'
with open(manifest_path, 'r', encoding='utf-8') as f:
    manifest = json.load(f)

manifest['images']['avatar-kai']['status'] = 'ready'
manifest['images']['profile-kai']['status'] = 'ready'

with open(manifest_path, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)

print("[OK] Updated asset-manifest.json: avatar-kai and profile-kai are now READY!")
