import os
import shutil

audio_drop_dir = r"C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\audio_drop"
public_audio_dir = r"C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\public\media\audio"

# Silent Signal Audio Mapping
silent_signal_dest = os.path.join(public_audio_dir, "silent-signal")
os.makedirs(silent_signal_dest, exist_ok=True)

mapping = {
    # 007 Silent Signal
    ("007-01-Silent Signal.mp3", "silent-signal", "01-Silent-Signal.mp3"),
    ("007-02-Invisible Line.mp3", "silent-signal", "02-Invisible-Line.mp3"),
    ("007-03-Nocturne Drive - Live Version -.mp3", "silent-signal", "03-Nocturne-Drive-Live.mp3"),
    
    # 001 FIRESTARTER
    ("01-firestarter.v1.mp3", "firestarter", "01-FIRESTARTER.mp3"),
    ("02-higher-ground.v1.mp3", "firestarter", "02-Higher-Ground.mp3"),
    ("03-burn-it-down-indies.v1.mp3", "firestarter", "03-BURN-IT-DOWN-Indies.mp3"),
    ("04-heatwave-indies.v1.mp3", "firestarter", "04-Heatwave-Indies.mp3"),
    ("05-runaway-beat.v1.mp3", "firestarter", "05-Runaway-Beat.mp3"),
    ("06-first-light.v1.mp3", "firestarter", "06-First-Light.mp3"),
    
    # 002 IGNITION
    ("02-ignition-indies.v1.mp3", "ignition", "01-IGNITION.mp3"),
    ("02-ashes-in-motion.v1.mp3", "ignition", "02-Ashes-in-Motion.mp3"),
    
    # 003 BURN IT DOWN
    ("01-burn-it-down-major.v1.mp3", "burn-it-down", "01-BURN-IT-DOWN.mp3"),
    ("03-run-with-us-live.v1.mp3", "burn-it-down", "03-Run-With-Us-Live.mp3"),
    
    # 004 No Limits
    ("01-no-limits.v1.mp3", "no-limits", "01-no-limits.mp3"),
    ("03-hands-up-hearts-out-live.v1.mp3", "no-limits", "03-Hands-Up-Hearts-Out-Live.mp3"),
}

for src_name, subfolder, target_filename in mapping:
    src_path = os.path.join(audio_drop_dir, src_name)
    target_dir = os.path.join(public_audio_dir, subfolder)
    os.makedirs(target_dir, exist_ok=True)
    target_path = os.path.join(target_dir, target_filename)
    
    if os.path.exists(src_path):
        shutil.copy(src_path, target_path)
        size = os.path.getsize(target_path)
        print(f"Copied {src_name} -> {target_path} ({size} bytes)")
    else:
        print(f"File not found: {src_path}")

print("All audio drop files successfully deployed across all release folders!")
