import os
import shutil
import glob

print("--- COPYING GUEST EMBER RUNTIME ASSETS (18 FRAMES) ---")

src_base = r"C:\Users\kanno\OneDrive\project\material_control\asset-library\.ingest-temp"
dst_dir = "public/assets/images/ember"

os.makedirs(dst_dir, exist_ok=True)

targets = [f"GE-S{i:02d}" for i in range(1, 16)] + [f"GE-X{i:02d}" for i in range(1, 4)]

copied = 0
for t in targets:
    pattern = os.path.join(src_base, f"*-{t}_v01.png")
    matches = glob.glob(pattern)
    if matches:
        src = matches[-1]
        dst_name = f"{t}.png"
        dst = os.path.join(dst_dir, dst_name)
        shutil.copy(src, dst)
        copied += 1
        print(f"  [OK] Copied {dst_name} ({os.path.getsize(dst)} bytes)")
    else:
        print(f"  [MISSING] Could not find pattern for {t}")

print(f"[SUMMARY] Copied {copied} / {len(targets)} GUEST EMBER assets to {dst_dir}")
