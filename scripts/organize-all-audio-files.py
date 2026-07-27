import os
import shutil

drop_dir = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\audio_drop'
audio_base = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\public\media\audio'

# Precise mapping of dropped filenames to expected audio file paths
mappings = [
    # No Limits (3rd Single)
    ('01-no-limits.v1.mp3', os.path.join(audio_base, 'no-limits', '01-no-limits.v1.mp3')),
    ('02-higher-ground.v1.mp3', os.path.join(audio_base, 'no-limits', '02-higher-ground.v1.mp3')),
    ('03-run-with-us-live.v1.mp3', os.path.join(audio_base, 'no-limits', '03-run-with-us-live.v1.mp3')),

    # Firestarter (Indies Mini Album)
    ('01-firestarter.v1.mp3', os.path.join(audio_base, 'firestarter', '01-firestarter.v1.mp3')),
    ('02-ignition-indies.v1.mp3', os.path.join(audio_base, 'firestarter', '02-run-with-us.v1.mp3')),
    ('03-burn-it-down-indies.v1.mp3', os.path.join(audio_base, 'firestarter', '03-spark-of-light.v1.mp3')),
    ('04-heatwave-indies.v1.mp3', os.path.join(audio_base, 'firestarter', '04-unstoppable.v1.mp3')),
    ('05-runaway-beat.v1.mp3', os.path.join(audio_base, 'firestarter', '05-starting-line.v1.mp3')),

    # Burn It Down (2nd Single)
    ('01-burn-it-down-major.v1.mp3', os.path.join(audio_base, 'burn-it-down', '01-burn-it-down.v1.mp3')),
    ('02-ashes-in-motion.v1.mp3', os.path.join(audio_base, 'burn-it-down', '02-ashes-and-diamonds.v1.mp3')),
    ('06-first-light.v1.mp3', os.path.join(audio_base, 'burn-it-down', '03-over-the-fire.v1.mp3')),
    ('03-hands-up-hearts-out-live.v1.mp3', os.path.join(audio_base, 'burn-it-down', '04-ignition-live.v1.mp3')),
]

print("--- ORGANIZING ALL AUDIO FILES ---")
for src_name, dst_path in mappings:
    src_path = os.path.join(drop_dir, src_name)
    if os.path.exists(src_path):
        os.makedirs(os.path.dirname(dst_path), exist_ok=True)
        shutil.copy2(src_path, dst_path)
        print(f"[OK] {src_name} -> {os.path.relpath(dst_path, audio_base)} ({os.path.getsize(dst_path)} bytes)")
    else:
        print(f"[WARN] File not found in drop: {src_name}")

print("Audio file organization completed.")
