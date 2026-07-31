import os
from PIL import Image, ImageDraw, ImageFont

img_dir = 'public/assets/images'
os.makedirs(img_dir, exist_ok=True)

# 1. Full Logo (Transparent BG) SVG
svg_full_transparent = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" width="800" height="200">
  <defs>
    <linearGradient id="textGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#AEB6C4" />
    </linearGradient>
  </defs>
  <!-- Five Lights Symbol -->
  <g id="five-lights">
    <rect x="20" y="25" width="6" height="50" rx="3" fill="#D62839" />
    <rect x="32" y="25" width="6" height="50" rx="3" fill="#7B5CFF" />
    <rect x="44" y="25" width="6" height="50" rx="3" fill="#FF8A24" />
    <rect x="56" y="25" width="6" height="50" rx="3" fill="#D9B44A" />
    <rect x="68" y="25" width="6" height="50" rx="3" fill="#2450A4" />
  </g>
  <!-- IGNITE Text -->
  <text x="95" y="68" font-family="'Bebas Neue', 'IBM Plex Mono', 'Arial Black', sans-serif" font-size="58" font-weight="900" letter-spacing="6" fill="url(#textGrad)">IGNITE</text>
</svg>"""

# 2. Full Logo (Dark BG) SVG
svg_full_dark = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" width="800" height="200">
  <rect width="400" height="100" fill="#080A0F" />
  <defs>
    <linearGradient id="textGradDark" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#AEB6C4" />
    </linearGradient>
  </defs>
  <g id="five-lights-dark">
    <rect x="20" y="25" width="6" height="50" rx="3" fill="#D62839" />
    <rect x="32" y="25" width="6" height="50" rx="3" fill="#7B5CFF" />
    <rect x="44" y="25" width="6" height="50" rx="3" fill="#FF8A24" />
    <rect x="56" y="25" width="6" height="50" rx="3" fill="#D9B44A" />
    <rect x="68" y="25" width="6" height="50" rx="3" fill="#2450A4" />
  </g>
  <text x="95" y="68" font-family="'Bebas Neue', 'IBM Plex Mono', 'Arial Black', sans-serif" font-size="58" font-weight="900" letter-spacing="6" fill="url(#textGradDark)">IGNITE</text>
</svg>"""

# 3. Symbol Only (Five Lights) SVG
svg_symbol_only = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="400" height="400">
  <g id="symbol">
    <rect x="15" y="20" width="10" height="60" rx="5" fill="#D62839" />
    <rect x="31" y="20" width="10" height="60" rx="5" fill="#7B5CFF" />
    <rect x="47" y="20" width="10" height="60" rx="5" fill="#FF8A24" />
    <rect x="63" y="20" width="10" height="60" rx="5" fill="#D9B44A" />
    <rect x="79" y="20" width="10" height="60" rx="5" fill="#2450A4" />
  </g>
</svg>"""

with open(os.path.join(img_dir, 'ignite-logo-full.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_full_transparent)

with open(os.path.join(img_dir, 'ignite-logo-dark.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_full_dark)

with open(os.path.join(img_dir, 'ignite-logo-symbol.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_symbol_only)

with open('public/favicon.svg', 'w', encoding='utf-8') as f:
    f.write(svg_symbol_only)

# Generate PNG raster images using Pillow
# Symbol PNG (400x400)
img_symbol = Image.new('RGBA', (400, 400), (0, 0, 0, 0))
draw_symbol = ImageDraw.Draw(img_symbol)
colors = ['#D62839', '#7B5CFF', '#FF8A24', '#D9B44A', '#2450A4']
for i, col in enumerate(colors):
    x1 = 60 + i * 56
    y1 = 80
    x2 = x1 + 40
    y2 = 320
    draw_symbol.rounded_rectangle([x1, y1, x2, y2], radius=16, fill=col)

img_symbol.save(os.path.join(img_dir, 'ignite-logo-symbol.png'), 'PNG')

# Full Dark PNG (800x200)
img_full = Image.new('RGBA', (800, 200), (8, 10, 15, 255))
draw_full = ImageDraw.Draw(img_full)
for i, col in enumerate(colors):
    x1 = 40 + i * 24
    y1 = 50
    x2 = x1 + 14
    y2 = 150
    draw_full.rounded_rectangle([x1, y1, x2, y2], radius=6, fill=col)

# Text "IGNITE" using default or basic font
try:
    font = ImageFont.truetype("arialbd.ttf", 100)
except Exception:
    font = ImageFont.load_default()

draw_full.text((190, 45), "IGNITE", fill=(246, 243, 237, 255), font=font)
img_full.save(os.path.join(img_dir, 'ignite-logo-dark.png'), 'PNG')

print('Generated all IGNITE logo assets (SVG & PNG)!')
