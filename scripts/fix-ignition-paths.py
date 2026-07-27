import os
import shutil

audio_base = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\public\media\audio'
ignition_dir = os.path.join(audio_base, 'ignition')
drop_dir = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\audio_drop'

pairs = [
    ('01-ignition-major.v1.mp3', '01-ignition-major.v1.mp3'),
    ('02-back-to-the-spark.v1.mp3', '02-back-to-the-spark.v1.mp3'),
    ('03-heatwave-live.v1.mp3', '03-heatwave-live.v1.mp3'),
]

for drop_name, target_name in pairs:
    src_drop = os.path.join(drop_dir, drop_name)
    dst_target = os.path.join(ignition_dir, target_name)
    if os.path.exists(src_drop):
        shutil.copy2(src_drop, dst_target)
        print(f"[OK] Copied from drop: {drop_name} -> {target_name}")
    else:
        print(f"[WARN] Not found in drop: {drop_name}")
