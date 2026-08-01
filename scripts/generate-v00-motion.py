import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

raw_dir = 'data/v00-motion-test/raw_assets'
out_dir = 'data/v00-motion-test/output_16x9'
qa_dir = 'data/v00-motion-test/qa_frames'

os.makedirs(out_dir, exist_ok=True)
os.makedirs(qa_dir, exist_ok=True)

print('--- STARTING V00 16:9 REVIEW MASTER RENDER (PYTHON PIL) ---')

COLOR_DEEP_BLUE = (26, 56, 100)
COLOR_NIGHT_PURPLE = (20, 17, 33)
COLOR_PLATINUM = (251, 236, 205)
COLOR_WHITE = (255, 255, 255)
COLOR_YUTO_BLUE = (36, 80, 164)
COLOR_SHO_PURPLE = (123, 92, 255)

img_r05 = Image.open(os.path.join(raw_dir, 'R05-01-IGNITE-five-member-lineup_2400x1350.png')).convert('RGBA')
img_yuto = Image.open(os.path.join(raw_dir, 'R03-05-YUTO_SOLAR-outfit-front_1600x2000.png')).convert('RGBA')
img_sho = Image.open(os.path.join(raw_dir, 'R03-02-SHO_SOLAR-outfit-front_1600x2000.png')).convert('RGBA')
img_gfx01 = Image.open(os.path.join(raw_dir, 'GFX01-IGNITE-full-logo-transparent_3200x800.png')).convert('RGBA')

width = 1920
height = 1080
total_frames = 300
fps = 30

particles = [
    {
        'x': (i * 137.5) % width,
        'y': (i * 83.1) % height,
        'size': 2 + (i % 6),
        'speedX': 0.4 + (i % 3) * 0.2,
        'speedY': -0.5 - (i % 3) * 0.3,
        'alpha': int(255 * (0.3 + (i % 5) * 0.1)),
    }
    for i in range(16)
]

qa_frames = {
    45: 'V00_QA_C01_0150.png',
    165: 'V00_QA_C02_0550.png',
    255: 'V00_QA_C03_0850.png',
}

try:
    font_large = ImageFont.truetype('arialbd.ttf', 52)
    font_mid = ImageFont.truetype('arial.ttf', 36)
    font_sub = ImageFont.truetype('arial.ttf', 24)
except Exception:
    font_large = ImageFont.load_default()
    font_mid = ImageFont.load_default()
    font_sub = ImageFont.load_default()

for frame in range(total_frames):
    canvas = Image.new('RGBA', (width, height), COLOR_DEEP_BLUE + (255,))
    draw = ImageDraw.Draw(canvas)

    if frame < 120:
        # C01 (0.00-4.00s / 120f) R05 5-member Wide
        progress = frame / 120.0
        scale = 1.0 + progress * 0.025 # 100% -> 102.5%

        # Scale R05
        sw = int(width * scale)
        sh = int(height * scale)
        r05_scaled = img_r05.resize((sw, sh), Image.Resampling.LANCZOS)
        ox = (sw - width) // 2
        oy = (sh - height) // 2
        canvas.paste(r05_scaled.crop((ox, oy, ox + width, oy + height)), (0, 0))

        # Re-init draw on canvas
        draw = ImageDraw.Draw(canvas)

        # Particles
        for p in particles:
            px = int((p['x'] + p['speedX'] * frame) % width)
            py = int((p['y'] + p['speedY'] * frame + height) % height)
            draw.ellipse([px - p['size'], py - p['size'], px + p['size'], py + p['size']], fill=COLOR_PLATINUM + (p['alpha'],))

        # Flash
        if frame >= 116:
            alpha = int(255 * (((frame - 116) / 3.0) * 0.45))
            overlay = Image.new('RGBA', (width, height), COLOR_PLATINUM + (alpha,))
            canvas = Image.alpha_composite(canvas, overlay)
            draw = ImageDraw.Draw(canvas)

        # Text
        if frame >= 12:
            draw.text((120, 960), "FIVE LIGHTS.", fill=COLOR_WHITE + (255,), font=font_mid)
        if frame >= 66:
            draw.text((440, 960), "ONE CYCLE.", fill=COLOR_PLATINUM + (255,), font=font_mid)

    elif frame < 210:
        # C02 (4.00-7.00s / 90f) YUTO
        progress = (frame - 120) / 90.0
        scale = 1.20 + progress * 0.03 # 120% -> 123%
        drift_x = int((progress - 0.5) * 15)

        # Base background
        canvas = Image.new('RGBA', (width, height), COLOR_DEEP_BLUE + (255,))
        draw = ImageDraw.Draw(canvas)

        # Scale YUTO
        sw = int(width * scale)
        sh = int(height * scale)
        yuto_scaled = img_yuto.resize((sw, sh), Image.Resampling.LANCZOS)
        ox = (sw - width) // 2 + drift_x
        oy = (sh - height) // 2
        canvas.paste(yuto_scaled.crop((ox, oy, ox + width, oy + height)), (0, 0))

        draw = ImageDraw.Draw(canvas)

        # Flash at end
        if frame >= 207:
            alpha = int(255 * (((frame - 207) / 3.0) * 0.6))
            overlay = Image.new('RGBA', (width, height), COLOR_WHITE + (alpha,))
            canvas = Image.alpha_composite(canvas, overlay)
            draw = ImageDraw.Draw(canvas)

        # Text
        draw.text((140, 830), "YUTO", fill=COLOR_WHITE + (255,), font=font_large)
        draw.text((140, 890), "BEFORE DAWN", fill=COLOR_PLATINUM + (255,), font=font_sub)
        draw.rectangle([140, 925, 200, 929], fill=COLOR_YUTO_BLUE + (255,))

    else:
        # C03 (7.00-10.00s / 90f) SHO & Logo
        progress = (frame - 210) / 90.0
        scale = 1.18 + progress * 0.03 # 118% -> 121%

        # Base background
        canvas = Image.new('RGBA', (width, height), COLOR_NIGHT_PURPLE + (255,))

        # Scale SHO
        sw = int(width * scale)
        sh = int(height * scale)
        sho_scaled = img_sho.resize((sw, sh), Image.Resampling.LANCZOS)
        ox = (sw - width) // 2
        oy = (sh - height) // 2
        canvas.paste(sho_scaled.crop((ox, oy, ox + width, oy + height)), (0, 0))

        draw = ImageDraw.Draw(canvas)

        # Text
        draw.text((140, 830), "SHO", fill=COLOR_WHITE + (255,), font=font_large)
        draw.text((140, 890), "NIGHT", fill=COLOR_SHO_PURPLE + (255,), font=font_sub)
        draw.rectangle([140, 925, 200, 929], fill=COLOR_SHO_PURPLE + (255,))

        if frame >= 260:
            draw.text((1400, 830), "SOLAR CYCLE", fill=COLOR_PLATINUM + (255,), font=font_sub)

        if frame >= 275:
            gfx_scaled = img_gfx01.resize((360, 90), Image.Resampling.LANCZOS)
            canvas.paste(gfx_scaled, (1400, 860), mask=gfx_scaled)

    # Save QA Frame
    if frame in qa_frames:
        qa_path = os.path.join(qa_dir, qa_frames[frame])
        canvas.save(qa_path, 'PNG')
        print(f'  Saved QA Frame: {qa_frames[frame]}')

print('Completed 16:9 Review Master rendering!')
