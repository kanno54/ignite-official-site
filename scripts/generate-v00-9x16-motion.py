import os
from PIL import Image, ImageDraw, ImageFont

raw_dir = 'data/v00-motion-test/raw_assets'
out_dir = 'data/v00-motion-test/output_9x16'
qa_dir = 'data/v00-motion-test/qa_frames'

os.makedirs(out_dir, exist_ok=True)
os.makedirs(qa_dir, exist_ok=True)

print('--- STARTING V00 9:16 EDITORIAL STRIP REVIEW VERSION RENDER ---')

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

width = 1080
height = 1920
total_frames = 300

try:
    font_large = ImageFont.truetype('arialbd.ttf', 56)
    font_mid = ImageFont.truetype('arial.ttf', 38)
    font_sub = ImageFont.truetype('arial.ttf', 26)
except Exception:
    font_large = ImageFont.load_default()
    font_mid = ImageFont.load_default()
    font_sub = ImageFont.load_default()

for frame in range(total_frames):
    canvas = Image.new('RGBA', (width, height), COLOR_DEEP_BLUE + (255,))
    draw = ImageDraw.Draw(canvas)

    if frame < 120:
        # C01 (0.00-4.00s) R05 Editorial Strip
        progress = frame / 120.0
        scale = 1.0 + progress * 0.025

        # Editorial Strip Dimensions (1080px wide x 608px high)
        strip_w = 1080
        strip_h = 608
        strip_y = (height - strip_h) // 2

        sw = int(strip_w * scale)
        sh = int(strip_h * scale)
        r05_scaled = img_r05.resize((sw, sh), Image.Resampling.BILINEAR)
        ox = (sw - strip_w) // 2
        oy = (sh - strip_h) // 2
        canvas.paste(r05_scaled.crop((ox, oy, ox + strip_w, oy + strip_h)), (0, strip_y))

        draw = ImageDraw.Draw(canvas)

        # Editorial Top & Bottom Layout
        if frame >= 12:
            draw.text((80, 420), "FIVE LIGHTS.", fill=COLOR_WHITE + (255,), font=font_mid)
        if frame >= 66:
            draw.text((80, 1340), "ONE CYCLE.", fill=COLOR_PLATINUM + (255,), font=font_mid)

        # Flash at end of C01
        if frame >= 116:
            alpha = int(255 * (((frame - 116) / 3.0) * 0.45))
            overlay = Image.new('RGBA', (width, height), COLOR_PLATINUM + (alpha,))
            canvas = Image.alpha_composite(canvas, overlay)
            draw = ImageDraw.Draw(canvas)

    elif frame < 210:
        # C02 (4.00-7.00s) YUTO 9:16 Crop
        progress = (frame - 120) / 90.0
        scale = 1.0 + progress * 0.03

        sw = int(1536 * scale)
        sh = int(1920 * scale)
        yuto_scaled = img_yuto.resize((sw, sh), Image.Resampling.BILINEAR)
        ox = (sw - width) // 2
        oy = (sh - height) // 2
        canvas.paste(yuto_scaled.crop((ox, oy, ox + width, oy + height)), (0, 0))

        draw = ImageDraw.Draw(canvas)

        # Text in vertical safe area
        draw.text((80, 1500), "YUTO", fill=COLOR_WHITE + (255,), font=font_large)
        draw.text((80, 1570), "BEFORE DAWN", fill=COLOR_PLATINUM + (255,), font=font_sub)
        draw.rectangle([80, 1610, 160, 1615], fill=COLOR_YUTO_BLUE + (255,))

        if frame >= 207:
            alpha = int(255 * (((frame - 207) / 3.0) * 0.6))
            overlay = Image.new('RGBA', (width, height), COLOR_WHITE + (alpha,))
            canvas = Image.alpha_composite(canvas, overlay)
            draw = ImageDraw.Draw(canvas)

    else:
        # C03 (7.00-10.00s) SHO 9:16 Crop
        progress = (frame - 210) / 90.0
        scale = 1.0 + progress * 0.03

        canvas = Image.new('RGBA', (width, height), COLOR_NIGHT_PURPLE + (255,))
        sw = int(1536 * scale)
        sh = int(1920 * scale)
        sho_scaled = img_sho.resize((sw, sh), Image.Resampling.BILINEAR)
        ox = (sw - width) // 2
        oy = (sh - height) // 2
        canvas.paste(sho_scaled.crop((ox, oy, ox + width, oy + height)), (0, 0))

        draw = ImageDraw.Draw(canvas)

        draw.text((80, 1500), "SHO", fill=COLOR_WHITE + (255,), font=font_large)
        draw.text((80, 1570), "NIGHT", fill=COLOR_SHO_PURPLE + (255,), font=font_sub)
        draw.rectangle([80, 1610, 160, 1615], fill=COLOR_SHO_PURPLE + (255,))

        if frame >= 260:
            draw.text((640, 1500), "SOLAR CYCLE", fill=COLOR_PLATINUM + (255,), font=font_sub)

        if frame >= 275:
            gfx_scaled = img_gfx01.resize((360, 90), Image.Resampling.BILINEAR)
            canvas.paste(gfx_scaled, (640, 1540), mask=gfx_scaled)

    # Save 9:16 QA Frames
    if frame == 45:
        canvas.save(os.path.join(qa_dir, 'V00_QA_9x16_C01_0150.png'), 'PNG')
    elif frame == 165:
        canvas.save(os.path.join(qa_dir, 'V00_QA_9x16_C02_0550.png'), 'PNG')
    elif frame == 255:
        canvas.save(os.path.join(qa_dir, 'V00_QA_9x16_C03_0850.png'), 'PNG')

print('Completed 9:16 Editorial Strip Review Version rendering!')
