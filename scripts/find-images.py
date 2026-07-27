import os
from PIL import Image

path1 = r'C:\Users\kanno\.gemini\antigravity-ide\brain\b87b4d11-11ef-4be7-91d5-516ee9752a2e\media__1785055098118.jpg'
path2 = r'C:\Users\kanno\.gemini\antigravity-ide\brain\b87b4d11-11ef-4be7-91d5-516ee9752a2e\media__1785055311193.jpg'

img1 = Image.open(path1)
img2 = Image.open(path2)

print(f"Image 1 (Desktop Hero): {img1.size}, format={img1.format}")
print(f"Image 2 (Uploaded):     {img2.size}, format={img2.format}")
