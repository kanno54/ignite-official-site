import os
from PIL import Image, ImageDraw, ImageFont

raw_dir = 'data/v00-motion-test/raw_assets'
out_dir = 'data/v00-motion-test/output_16x9'
qa_dir = 'data/v00-motion-test/qa_frames'

os.makedirs(out_dir, exist_ok=True)
os.makedirs(qa_dir, exist_ok=True)

print('--- FAST V00 16:9 REVIEW MASTER RENDER (REAL MASTER IMAGES) ---')

COLOR_DEEP_BLUE = (26, 56, 100)
COLOR_NIGHT_PURPLE = (20, 17, 33)
COLOR_PLATINUM = (251, 236, 205)
COLOR_WHITE = (255, 255, 255)
COLOR_YUTO_BLUE = (36, 80, 164)
COLOR_SHO_PURPLE = (123, 92, 255)

img_r05_raw = Image.open(os.path.join(raw_dir, 'R05-01-IGNITE-five-member-lineup_2400x1350.png')).convert('RGBA')
img_yuto_raw = Image.open(os.path.join(raw_dir, 'R03-05-YUTO_SOLAR-outfit-front_1600x2000.png')).convert('RGBA')
img_sho_raw = Image.open(os.path.join(raw_dir, 'R03-02-SHO_SOLAR-outfit-front_1600x2000.png')).convert('RGBA')
img_gfx01_raw = Image.open(os.path.join(raw_dir, 'GFX01-IGNITE-full-logo-transparent_3200x800.png')).convert('RGBA')

width = 1920
height = 1080

img_r05 = img_r05_raw.resize((width, height), Image.Resampling.BILINEAR)
img_yuto = img_yuto_raw.resize((width, height), Image.Resampling.BILINEAR)
img_sho = img_sho_raw.resize((width, height), Image.Resampling.BILINEAR)

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

for frame in [45, 165, 255]:
    canvas = Image.new('RGBA', (width, height), COLOR_DEEP_BLUE + (255,))

    if frame < 120:
        # C01 (0.00-4.00s / 120f) R05 5-member Wide
        progress = frame / 120.0
        scale = 1.0 + progress * 0.025

        sw = int(width * scale)
        sh = int(height * scale)
        r05_scaled = img_r05.resize((sw, sh), Image.Resampling.BILINEAR)
        ox = (sw - width) // 2
        oy = (sh - height) // 2
        canvas.paste(r05_scaled.crop((ox, oy, ox + width, oy + height)), (0, 0))

        draw = ImageDraw.Draw(canvas)

        for p in particles:
            px = int((p['x'] + p['speedX'] * frame) % width)
            py = int((p['y'] + p['speedY'] * frame + height) % height)
            draw.ellipse([px - p['size'], py - p['size'], px + p['size'], py + p['size']], fill=COLOR_PLATINUM + (p['alpha'],))

        draw.text((120, 960), "FIVE LIGHTS.", fill=COLOR_WHITE + (255,), font=font_mid)

    elif frame < 210:
        # C02 (4.00-7.00s / 90f) YUTO
        progress = (frame - 120) / 90.0
        scale = 1.20 + progress * 0.03
        drift_x = int((progress - 0.5) * 15)

        canvas = Image.new('RGBA', (width, height), COLOR_DEEP_BLUE + (255,))
        sw = int(width * scale)
        sh = int(height * scale)
        yuto_scaled = img_yuto.resize((sw, sh), Image.Resampling.BILINEAR)
        ox = (sw - width) // 2 + drift_x
        oy = (sh - height) // 2
        canvas.paste(yuto_scaled.crop((ox, oy, ox + width, oy + height)), (0, 0))

        draw = ImageDraw.Draw(canvas)

        draw.text((140, 830), "YUTO", fill=COLOR_WHITE + (255,), font=font_large)
        draw.text((140, 890), "BEFORE DAWN", fill=COLOR_PLATINUM + (255,), font=font_sub)
        draw.rectangle([140, 925, 200, 929], fill=COLOR_YUTO_BLUE + (255,))

    else:
        # C03 (7.00-10.00s / 90f) SHO & Logo
        progress = (frame - 210) / 90.0
        scale = 1.18 + progress * 0.03

        canvas = Image.new('RGBA', (width, height), COLOR_NIGHT_PURPLE + (255,))
        sw = int(width * scale)
        sh = int(height * scale)
        sho_scaled = img_sho.resize((sw, sh), Image.Resampling.BILINEAR)
        ox = (sw - width) // 2
        oy = (sh - height) // 2
        canvas.paste(sho_scaled.crop((ox, oy, ox + width, oy + height)), (0, 0))

        draw = ImageDraw.Draw(canvas)

        draw.text((140, 830), "SHO", fill=COLOR_WHITE + (255,), font=font_large)
        draw.text((140, 890), "NIGHT", fill=COLOR_SHO_PURPLE + (255,), font=font_sub)
        draw.rectangle([140, 925, 200, 929], fill=COLOR_SHO_PURPLE + (255,))

        draw.text((1400, 830), "SOLAR CYCLE", fill=COLOR_PLATINUM + (255,), font=font_sub)

        gfx_scaled = img_gfx01_raw.resize((360, 90), Image.Resampling.BILINEAR)
        canvas.paste(gfx_scaled, (1400, 860), mask=gfx_scaled)

    if frame in qa_frames:
        qa_path = os.path.join(qa_dir, qa_frames[frame])
        canvas.save(qa_path, 'PNG')
        print(f'  Saved QA Frame: {qa_frames[frame]}')

print('Completed Fast 16:9 Review Master rendering!')
