import os
from PIL import Image

brain_dir = r'C:\Users\kanno\.gemini\antigravity-ide\brain\b87b4d11-11ef-4be7-91d5-516ee9752a2e'
print("Files in brain:")
for item in os.listdir(brain_dir):
    if item.startswith('media__'):
        full = os.path.join(brain_dir, item)
        img = Image.open(full)
        print(f" - {item}: {img.size}, format={img.format}")
