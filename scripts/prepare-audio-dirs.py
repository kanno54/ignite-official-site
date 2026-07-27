import os

site_dir = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site'
drop_dir = os.path.join(site_dir, 'audio_drop')
audio_base = os.path.join(site_dir, 'public', 'media', 'audio')

subdirs = ['no-limits', 'firestarter', 'ignition', 'burn-it-down']

os.makedirs(drop_dir, exist_ok=True)
for sub in subdirs:
    os.makedirs(os.path.join(audio_base, sub), exist_ok=True)

print(f"[OK] Created audio drop directory: {drop_dir}")
print(f"[OK] Created audio target directories in: {audio_base}")
