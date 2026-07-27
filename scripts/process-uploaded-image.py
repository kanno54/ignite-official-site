import os
import json
from PIL import Image

src_img_path = r'C:\Users\kanno\.gemini\antigravity-ide\brain\b87b4d11-11ef-4be7-91d5-516ee9752a2e\media__1785055098118.jpg'
out_dir = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\public\assets\images'
os.makedirs(out_dir, exist_ok=True)

img = Image.open(src_img_path)
w, h = img.size

# 1. Save Desktop Hero WebP (16:9)
desktop_path = os.path.join(out_dir, 'hero-no-limits-desktop.webp')
img.save(desktop_path, 'WEBP', quality=92)
print(f'[OK] Saved Desktop WebP: {desktop_path} ({w}x{h})')

# 2. Crop & Save Mobile Hero WebP (3:4 ratio centered on the members)
target_w = int(h * (3/4)) # 432px
left = (w - target_w) // 2 + 50 # Shift right to capture all 5 members perfectly
right = left + target_w
mobile_img = img.crop((left, 0, right, h))

mobile_path = os.path.join(out_dir, 'hero-no-limits-mobile.webp')
mobile_img.save(mobile_path, 'WEBP', quality=92)
print(f'[OK] Saved Mobile WebP: {mobile_path} ({mobile_img.size})')

# 3. Update asset-manifest.json
manifest_path = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\content\public\asset-manifest.json'
with open(manifest_path, 'r', encoding='utf-8') as f:
    manifest = json.load(f)

manifest['images']['hero-no-limits-desktop']['status'] = 'ready'
manifest['images']['hero-no-limits-mobile']['status'] = 'ready'

with open(manifest_path, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)

print('[OK] Updated asset-manifest.json: hero-no-limits-desktop & mobile are now READY!')
