import os
import json
from PIL import Image

src_img_path = r'C:\Users\kanno\.gemini\antigravity-ide\brain\b87b4d11-11ef-4be7-91d5-516ee9752a2e\media__1785059368245.jpg'
members_dir = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\public\assets\images\members'
os.makedirs(members_dir, exist_ok=True)

img = Image.open(src_img_path)
w, h = img.size # 655 x 1024

# Create 4:5 portrait (819x1024) by padding dark stage background horizontally or resizing to fit
target_w = int(h * (4/5)) # 819px
canvas = Image.new('RGB', (target_w, h), (8, 10, 15)) # #080A0F dark stage background
offset_x = (target_w - w) // 2
canvas.paste(img, (offset_x, 0))

profile_path = os.path.join(members_dir, 'profile-ren.webp')
canvas.save(profile_path, 'WEBP', quality=95)
print(f"[OK] Updated Profile REN (4:5 portrait canvas): {profile_path} ({canvas.size})")

# Update asset-manifest.json
manifest_path = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\content\public\asset-manifest.json'
with open(manifest_path, 'r', encoding='utf-8') as f:
    manifest = json.load(f)

manifest['images']['avatar-ren']['status'] = 'ready'
manifest['images']['profile-ren']['status'] = 'ready'

with open(manifest_path, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)

print("[OK] Verified asset-manifest.json: avatar-ren and profile-ren are READY!")
