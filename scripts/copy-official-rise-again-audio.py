import os
import shutil

print("--- COPYING OFFICIAL RISE AGAIN AUDIO FILES FROM HANDOFF PACKAGE ---")

pkg_audio_dir = r"C:\Users\kanno\OneDrive\project\material_control\asset-library\deliveries\rise-again\pkg-rise-again-2026-08-14T04-10-32-966Z\audio"
target_audio_dir = "public/media/audio/rise-again"

os.makedirs(target_audio_dir, exist_ok=True)

files = ["RA-A01_v01.mp3", "RA-A02_v01.mp3", "RA-A03_v01.mp3"]

for f in files:
    src = os.path.join(pkg_audio_dir, f)
    dst = os.path.join(target_audio_dir, f)
    if os.path.exists(src):
        shutil.copy(src, dst)
        size = os.path.getsize(dst)
        print(f"  [OK] Copied official audio {f} -> {dst} ({size} bytes)")
    else:
        print(f"  [ERROR] Source audio file not found: {src}")

print("[OK] Official RISE AGAIN audio replacement complete.")
