import os
import shutil
import json
from PIL import Image

src_dir = r"C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\data\007-silent_signal"
public_dir = r"C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\public\assets\images"
manifest_path = r"C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\content\public\asset-manifest.json"

asset_mapping = {
    # Hero
    "SS-H01.png": ("campaigns", "hero-silent-signal-desktop", "campaign-hero-silent-signal-desktop"),
    "SS-H02.png": ("campaigns", "hero-silent-signal-mobile", "campaign-hero-silent-signal-mobile"),
    
    # Covers & Posters
    "007-SilentSignal-cover.png": ("covers", "cover-silent-signal", "cover-silent-signal"),
    "007-01-SilentSignal.png": ("covers", "poster-silent-signal", "poster-silent-signal"),
    "007-02-InvisibleLine.png": ("covers", "poster-invisible-line", "poster-invisible-line"),
    "007-03-NoturneDrive.png": ("covers", "poster-nocturne-drive", "poster-nocturne-drive"),
    
    # Group & Members
    "SS-G01.png": ("members", "group-ss-g01", "group-ss-g01"),
    "SS-G02-KAI.png": ("members", "avatar-kai-ss", "avatar-kai-ss"),
    "SS-G03-SHO.png": ("members", "avatar-sho-ss", "avatar-sho-ss"),
    "SS-G04-LEO.png": ("members", "avatar-leo-ss", "avatar-leo-ss"),
    "SS-G05-REN.png": ("members", "avatar-ren-ss", "avatar-ren-ss"),
    "SS-G06-YUTO.png": ("members", "avatar-yuto-ss", "avatar-yuto-ss"),
    
    # Performance & Article
    "SS-D01.png": ("performance", "ss-d01-silence", "ss-d01-silence"),
    "SS-D02.png": ("articles", "hero-sho-choreography-ss", "article-hero-sho-choreography-ss"),
    "SS-D03.png": ("performance", "ss-d03-step", "ss-d03-step"),
    "SS-D04.png": ("performance", "ss-d04-gaze", "ss-d04-gaze"),
    "SS-D05.png": ("performance", "ss-d05-signal", "ss-d05-signal"),
    
    # Backgrounds & Teaser
    "SS-T01.png": ("backgrounds", "ss-t01-vertical", "ss-t01-vertical"),
    "SS-BG01.png": ("backgrounds", "ss-bg01-horizontal", "ss-bg01-horizontal"),
    "SS-T02.png": ("social", "ss-t02-sq", "ss-t02-sq"),
    "SS-T03.png": ("social", "ss-t03-portrait", "ss-t03-portrait"),
    "SS-T04.png": ("social", "ss-t04-story", "ss-t04-story"),
}

with open(manifest_path, 'r', encoding='utf-8') as f:
    manifest = json.load(f)

for src_filename, (subfolder, target_name, asset_id) in asset_mapping.items():
    src_file = os.path.join(src_dir, src_filename)
    if not os.path.exists(src_file):
        print(f"WARNING: Source file {src_filename} not found!")
        continue

    dest_folder = os.path.join(public_dir, subfolder)
    os.makedirs(dest_folder, exist_ok=True)
    
    # Save as PNG/JPG copy
    jpg_dest = os.path.join(dest_folder, f"{target_name}.jpg")
    png_dest = os.path.join(dest_folder, f"{target_name}.png")
    webp_dest = os.path.join(dest_folder, f"{target_name}.webp")
    
    shutil.copy(src_file, png_dest)
    
    try:
        im = Image.open(src_file)
        if im.mode in ("RGBA", "P"):
            im_rgb = im.convert("RGB")
            im_rgb.save(jpg_dest, "JPEG", quality=92)
            im.save(webp_dest, "WEBP", quality=90)
        else:
            im.save(jpg_dest, "JPEG", quality=92)
            im.save(webp_dest, "WEBP", quality=90)
    except Exception as e:
        print(f"Error converting {src_filename}: {e}")

    relative_path = f"/assets/images/{subfolder}/{target_name}.webp"
    manifest["images"][asset_id] = {
        "path": relative_path,
        "status": "ready"
    }

with open(manifest_path, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)

print("Successfully processed and registered all Silent Signal assets!")
