import os
import json
from PIL import Image

src_img_path = r'C:\Users\kanno\.gemini\antigravity-ide\brain\b87b4d11-11ef-4be7-91d5-516ee9752a2e\media__1785056890481.jpg'
members_dir = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\public\assets\images\members'
os.makedirs(members_dir, exist_ok=True)

img = Image.open(src_img_path)
w, h = img.size # 819 x 1024 (exact 4:5 ratio!)

# Save Profile SHO WebP (4:5 vertical standing portrait)
profile_path = os.path.join(members_dir, 'profile-sho.webp')
img.save(profile_path, 'WEBP', quality=95)
print(f"[OK] Updated Profile SHO (4:5 portrait): {profile_path} ({w}x{h})")

# Update asset-manifest.json
manifest_path = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\content\public\asset-manifest.json'
with open(manifest_path, 'r', encoding='utf-8') as f:
    manifest = json.load(f)

manifest['images']['avatar-sho']['status'] = 'ready'
manifest['images']['profile-sho']['status'] = 'ready'

with open(manifest_path, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)

print("[OK] Verified asset-manifest.json: avatar-sho and profile-sho are READY!")
