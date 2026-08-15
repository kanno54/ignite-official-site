import json
import os
import shutil

print("--- SYNCING RISE AGAIN STANDARD PATHS AND ASSET MANIFEST ---")

src_dir = "public/media/images/rise-again"
covers_dir = "public/assets/images/covers"
campaigns_dir = "public/assets/images/campaigns"
articles_dir = "public/assets/images/articles"
members_dir = "public/assets/images/members"

os.makedirs(covers_dir, exist_ok=True)
os.makedirs(campaigns_dir, exist_ok=True)
os.makedirs(articles_dir, exist_ok=True)
os.makedirs(members_dir, exist_ok=True)

copy_map = {
    "RA-C01_v01.png": [os.path.join(covers_dir, "cover-rise-again.png")],
    "RA-C02_v01.png": [os.path.join(covers_dir, "poster-rise-again-title.png")],
    "RA-C03_v01.png": [os.path.join(covers_dir, "poster-keep-the-flame.png")],
    "RA-C04_v01.png": [os.path.join(covers_dir, "poster-afterglow-live.png")],
    "RA-H01_v01.png": [os.path.join(campaigns_dir, "hero-rise-again-desktop.png")],
    "RA-H02_v01.png": [os.path.join(campaigns_dir, "hero-rise-again-mobile.png")],
    "RA-ARH01_v01.png": [os.path.join(articles_dir, "hero-rise-again-feature.png")],
    "RA-G01_v01.png": [os.path.join(members_dir, "group-rise-again-g01.png")],
    "RA-G02_v01.png": [os.path.join(members_dir, "avatar-kai-ra.png")],
    "RA-G03_v01.png": [os.path.join(members_dir, "avatar-sho-ra.png")],
    "RA-G04_v01.png": [os.path.join(members_dir, "avatar-leo-ra.png")],
    "RA-G05_v01.png": [os.path.join(members_dir, "avatar-ren-ra.png")],
    "RA-G06_v01.png": [os.path.join(members_dir, "avatar-yuto-ra.png")],
}

for src_name, dst_paths in copy_map.items():
    src_path = os.path.join(src_dir, src_name)
    if os.path.exists(src_path):
        for dst in dst_paths:
            shutil.copy(src_path, dst)
            print(f"  [OK] Copied {src_name} -> {dst}")

# Update Asset Manifest
manifest_path = "content/public/asset-manifest.json"
with open(manifest_path, "r", encoding="utf-8") as f:
    manifest = json.load(f)

manifest["images"]["cover-rise-again"] = {
    "path": "/assets/images/covers/cover-rise-again.png",
    "status": "ready",
    "aspect": "1:1"
}
manifest["images"]["RA-C01"] = {
    "path": "/media/images/rise-again/RA-C01_v01.png",
    "status": "ready",
    "aspect": "1:1"
}
manifest["images"]["poster-rise-again-title"] = {
    "path": "/assets/images/covers/poster-rise-again-title.png",
    "status": "ready",
    "aspect": "1:1"
}
manifest["images"]["RA-C02"] = {
    "path": "/media/images/rise-again/RA-C02_v01.png",
    "status": "ready",
    "aspect": "1:1"
}
manifest["images"]["poster-keep-the-flame"] = {
    "path": "/assets/images/covers/poster-keep-the-flame.png",
    "status": "ready",
    "aspect": "1:1"
}
manifest["images"]["RA-C03"] = {
    "path": "/media/images/rise-again/RA-C03_v01.png",
    "status": "ready",
    "aspect": "1:1"
}
manifest["images"]["poster-afterglow-live"] = {
    "path": "/assets/images/covers/poster-afterglow-live.png",
    "status": "ready",
    "aspect": "1:1"
}
manifest["images"]["RA-C04"] = {
    "path": "/media/images/rise-again/RA-C04_v01.png",
    "status": "ready",
    "aspect": "1:1"
}
manifest["images"]["hero-rise-again-desktop"] = {
    "path": "/assets/images/campaigns/hero-rise-again-desktop.png",
    "status": "ready",
    "aspect": "16:9"
}
manifest["images"]["hero-rise-again-mobile"] = {
    "path": "/assets/images/campaigns/hero-rise-again-mobile.png",
    "status": "ready",
    "aspect": "3:4"
}
manifest["images"]["article-hero-rise-again"] = {
    "path": "/assets/images/articles/hero-rise-again-feature.png",
    "status": "ready",
    "aspect": "3:2"
}

with open(manifest_path, "w", encoding="utf-8") as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)

print("[OK] Manifest updated with all RISE AGAIN standard assets.")
