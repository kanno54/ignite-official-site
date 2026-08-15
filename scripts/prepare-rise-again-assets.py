import os
import shutil

print("--- PREPARING RISE AGAIN (6TH SINGLE) ASSETS ---")

# Directories
img_dir = "public/media/images/rise-again"
audio_dir = "public/media/audio/rise-again"

os.makedirs(img_dir, exist_ok=True)
os.makedirs(audio_dir, exist_ok=True)

# Audio Files from audio_drop (FULL_LENGTH)
audio_sources = [
    ("audio_drop/007-01-Silent Signal.mp3", os.path.join(audio_dir, "RA-A01_v01.mp3")),
    ("audio_drop/007-02-Invisible Line.mp3", os.path.join(audio_dir, "RA-A02_v01.mp3")),
    ("audio_drop/007-03-Nocturne Drive - Live Version -.mp3", os.path.join(audio_dir, "RA-A03_v01.mp3")),
]

for src, dst in audio_sources:
    if os.path.exists(src):
        shutil.copy(src, dst)
        print(f"  [OK] Copied audio: {dst}")

# Visual Assets Placeholders in public/media/images/rise-again/
visual_files = [
    "RA-H01_v01.png",
    "RA-H02_v01.png",
    "RA-C01_v01.png",
    "RA-C02_v01.png",
    "RA-C03_v01.png",
    "RA-C04_v01.png",
    "RA-G01_v01.png",
    "RA-G02_v01.png",
    "RA-G03_v01.png",
    "RA-G04_v01.png",
    "RA-G05_v01.png",
    "RA-G06_v01.png",
    "RA-ARH01_v01.png",
]

for vf in visual_files:
    path = os.path.join(img_dir, vf)
    if not os.path.exists(path):
        # Create a small valid 1x1 transparent PNG fallback if file doesn't exist
        with open(path, "wb") as f:
            f.write(bytes.fromhex("89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d49444154789c63000100000500010d0a2d4b0000000049454e44ae426082"))
        print(f"  [OK] Created placeholder: {path}")

print("[OK] Rise Again asset preparation complete.")
