import os
import json
from PIL import Image

src_img_path = r'C:\Users\kanno\.gemini\antigravity-ide\brain\b87b4d11-11ef-4be7-91d5-516ee9752a2e\media__1785056405638.jpg'
members_dir = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\public\assets\images\members'
os.makedirs(members_dir, exist_ok=True)

img = Image.open(src_img_path)
w, h = img.size # 1024 x 1024

# 1. Avatar SHO WebP (1:1 square)
avatar_path = os.path.join(members_dir, 'avatar-sho.webp')
img.save(avatar_path, 'WEBP', quality=95)
print(f"[OK] Saved Avatar SHO: {avatar_path} ({w}x{h})")

# 2. Profile SHO WebP (4:5 vertical)
target_w = int(h * (4/5)) # 819px
left = (w - target_w) // 2
right = left + target_w
profile_crop = img.crop((left, 0, right, h))

profile_path = os.path.join(members_dir, 'profile-sho.webp')
profile_crop.save(profile_path, 'WEBP', quality=95)
print(f"[OK] Saved Profile SHO: {profile_path} ({profile_crop.size})")

# 3. Update asset-manifest.json
manifest_path = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\content\public\asset-manifest.json'
with open(manifest_path, 'r', encoding='utf-8') as f:
    manifest = json.load(f)

manifest['images']['avatar-sho']['status'] = 'ready'
manifest['images']['profile-sho']['status'] = 'ready'

with open(manifest_path, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)

print("[OK] Updated asset-manifest.json: avatar-sho and profile-sho are now READY!")
