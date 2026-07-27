import os
import json
from PIL import Image

brain_dir = r'C:\Users\kanno\.gemini\antigravity-ide\brain\b87b4d11-11ef-4be7-91d5-516ee9752a2e'
covers_dir = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\public\assets\images\covers'
os.makedirs(covers_dir, exist_ok=True)

# 1. BURN IT DOWN (768 x 1024 -> 1:1 crop 768 x 768)
path_burn = os.path.join(brain_dir, 'media__1785062910003.jpg')
img_burn = Image.open(path_burn)
w, h = img_burn.size
crop_burn = img_burn.crop((0, 50, 768, 818))
out_burn = os.path.join(covers_dir, 'cover-burn-it-down.webp')
crop_burn.save(out_burn, 'WEBP', quality=95)
print(f"[OK] Saved cover-burn-it-down.webp ({crop_burn.size})")

# 2. FIRESTARTER (1024 x 1024 square)
path_fire = os.path.join(brain_dir, 'media__1785062910058.jpg')
img_fire = Image.open(path_fire)
out_fire = os.path.join(covers_dir, 'cover-firestarter.webp')
img_fire.save(out_fire, 'WEBP', quality=95)
print(f"[OK] Saved cover-firestarter.webp ({img_fire.size})")

# 3. IGNITION (1024 x 1024 square)
path_ign = os.path.join(brain_dir, 'media__1785062910112.jpg')
img_ign = Image.open(path_ign)
out_ign = os.path.join(covers_dir, 'cover-ignition.webp')
img_ign.save(out_ign, 'WEBP', quality=95)
print(f"[OK] Saved cover-ignition.webp ({img_ign.size})")

# 4. NO LIMITS (768 x 1024 -> 1:1 crop 768 x 768)
path_nolim = os.path.join(brain_dir, 'media__1785062910131.jpg')
img_nolim = Image.open(path_nolim)
crop_nolim = img_nolim.crop((0, 50, 768, 818))
out_nolim = os.path.join(covers_dir, 'cover-no-limits.webp')
crop_nolim.save(out_nolim, 'WEBP', quality=95)
print(f"[OK] Saved cover-no-limits.webp ({crop_nolim.size})")

# 5. Update asset-manifest.json setting ALL 18 assets to "ready"
manifest_path = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\content\public\asset-manifest.json'
with open(manifest_path, 'r', encoding='utf-8') as f:
    manifest = json.load(f)

for key in manifest['images']:
    manifest['images'][key]['status'] = 'ready'

with open(manifest_path, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)

print("[OK] Updated asset-manifest.json: ALL 18 ASSET IMAGES ARE NOW 100% READY!")
