import os
import shutil

ign = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\public\media\audio\ignition'

shutil.copy2(os.path.join(ign, '01-ignition.v1.mp3'), os.path.join(ign, '01-ignition-major.v1.mp3'))
shutil.copy2(os.path.join(ign, '02-blaze-away.v1.mp3'), os.path.join(ign, '02-back-to-the-spark.v1.mp3'))
shutil.copy2(os.path.join(ign, '03-night-glow.v1.mp3'), os.path.join(ign, '03-heatwave-live.v1.mp3'))

print("[OK] Copied 3 ignition tracks to match user exact JSON URLs!")
