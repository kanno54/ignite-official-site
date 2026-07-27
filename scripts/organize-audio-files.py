import os
import shutil

drop_dir = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\audio_drop'
target_dir = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\public\media\audio\ignition'
os.makedirs(target_dir, exist_ok=True)

mappings = {
    '01-ignition-major.v1.mp3': '01-ignition.v1.mp3',
    '02-back-to-the-spark.v1.mp3': '02-blaze-away.v1.mp3',
    '03-heatwave-live.v1.mp3': '03-night-glow.v1.mp3',
}

for src_name, dst_name in mappings.items():
    src_path = os.path.join(drop_dir, src_name)
    dst_path = os.path.join(target_dir, dst_name)
    if os.path.exists(src_path):
        shutil.copy2(src_path, dst_path)
        print(f"[OK] Copied {src_name} -> {dst_path} ({os.path.getsize(dst_path)} bytes)")
    else:
        print(f"[WARN] File not found: {src_path}")
