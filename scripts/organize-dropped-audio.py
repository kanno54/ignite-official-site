import os
import shutil
import json
import glob

site_dir = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site'
drop_dir = os.path.join(site_dir, 'audio_drop')
audio_base = os.path.join(site_dir, 'public', 'media', 'audio')

# Track mapping definitions based on recordings list
track_mapping = [
    # No Limits
    {"id": "no-limits-title", "release": "no-limits", "filename": "01-no-limits.v1.mp3", "keywords": ["no limits", "nolimits", "01-no-limits"]},
    {"id": "higher-ground", "release": "no-limits", "filename": "02-higher-ground.v1.mp3", "keywords": ["higher ground", "higherground", "02-higher-ground"]},
    {"id": "run-with-us-live", "release": "no-limits", "filename": "03-run-with-us-live.v1.mp3", "keywords": ["run with us live", "runwithus live", "03-run-with-us-live", "run with us (live"]},

    # Firestarter
    {"id": "firestarter-main", "release": "firestarter", "filename": "01-firestarter.v1.mp3", "keywords": ["firestarter", "01-firestarter"]},
    {"id": "run-with-us-main", "release": "firestarter", "filename": "02-run-with-us.v1.mp3", "keywords": ["02-run-with-us", "run with us", "runwithus"]},
    {"id": "spark-of-light", "release": "firestarter", "filename": "03-spark-of-light.v1.mp3", "keywords": ["spark of light", "sparkoflight", "03-spark-of-light"]},
    {"id": "unstoppable", "release": "firestarter", "filename": "04-unstoppable.v1.mp3", "keywords": ["unstoppable", "04-unstoppable"]},
    {"id": "starting-line", "release": "firestarter", "filename": "05-starting-line.v1.mp3", "keywords": ["starting line", "startingline", "05-starting-line"]},

    # Ignition
    {"id": "ignition-main", "release": "ignition", "filename": "01-ignition.v1.mp3", "keywords": ["01-ignition", "ignition"]},
    {"id": "blaze-away", "release": "ignition", "filename": "02-blaze-away.v1.mp3", "keywords": ["blaze away", "blazeaway", "02-blaze-away"]},
    {"id": "night-glow", "release": "ignition", "filename": "03-night-glow.v1.mp3", "keywords": ["night glow", "nightglow", "03-night-glow"]},

    # Burn It Down
    {"id": "burn-it-down-main", "release": "burn-it-down", "filename": "01-burn-it-down.v1.mp3", "keywords": ["burn it down", "burnitdown", "01-burn-it-down"]},
    {"id": "ashes-and-diamonds", "release": "burn-it-down", "filename": "02-ashes-and-diamonds.v1.mp3", "keywords": ["ashes and diamonds", "ashes & diamonds", "02-ashes-and-diamonds"]},
    {"id": "over-the-fire", "release": "burn-it-down", "filename": "03-over-the-fire.v1.mp3", "keywords": ["over the fire", "overthefire", "03-over-the-fire"]},
    {"id": "ignition-live-shibuya", "release": "burn-it-down", "filename": "04-ignition-live.v1.mp3", "keywords": ["ignition live", "ignition (live", "04-ignition-live"]},
]

def scan_and_organize():
    found_files = glob.glob(os.path.join(drop_dir, '**', '*.mp3'), recursive=True)
    if not found_files:
        print("No MP3 files found in audio_drop yet.")
        return False

    processed = 0
    for file_path in found_files:
        fname = os.path.basename(file_path).lower()
        matched_track = None
        for track in track_mapping:
            for kw in track['keywords']:
                if kw in fname:
                    matched_track = track
                    break
            if matched_track:
                break
        
        if matched_track:
            target_dir = os.path.join(audio_base, matched_track['release'])
            os.makedirs(target_dir, exist_ok=True)
            target_path = os.path.join(target_dir, matched_track['filename'])
            shutil.copy2(file_path, target_path)
            print(f"[OK] Organized: {fname} -> {target_path}")
            processed += 1
        else:
            print(f"[WARN] Could not automatically map filename: {fname}")

    print(f"Organized {processed} audio files.")
    return processed > 0

if __name__ == '__main__':
    scan_and_organize()
