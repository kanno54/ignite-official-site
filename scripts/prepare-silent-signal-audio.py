import os
import shutil

audio_dir = r"C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\public\media\audio\silent-signal"
os.makedirs(audio_dir, exist_ok=True)

source_audio = r"C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\public\media\audio\solar\a01-01-SOLAR.mp3"
if not os.path.exists(source_audio):
    source_audio = r"C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\public\media\audio\moonlit\01-moonlit.mp3"

target_tracks = [
    "01-Silent-Signal.mp3",
    "02-Invisible-Line.mp3",
    "03-Nocturne-Drive-Live.mp3"
]

for track in target_tracks:
    dest = os.path.join(audio_dir, track)
    if not os.path.exists(dest):
        shutil.copy(source_audio, dest)
        print(f"Created audio file: {dest}")

print("Audio files for Silent Signal ready!")
