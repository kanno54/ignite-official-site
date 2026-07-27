import os

ign = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site\public\media\audio\ignition'
print("Files in ignition:")
for f in os.listdir(ign):
    full = os.path.join(ign, f)
    print(f" - {f} ({os.path.getsize(full)} bytes)")
