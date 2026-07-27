import os
import shutil
import json
import glob

site_dir = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site'
drop_dir = os.path.join(site_dir, 'audio_drop')
audio_base = os.path.join(site_dir, 'public', 'media', 'audio')

print("--- SCANNING AUDIO DROP DIRECTORY ---")
files = glob.glob(os.path.join(drop_dir, '**', '*'), recursive=True)
files = [f for f in files if os.path.isfile(f)]

for f in files:
    rel = os.path.relpath(f, drop_dir)
    print(f"Found: {rel} ({os.path.getsize(f)} bytes)")
