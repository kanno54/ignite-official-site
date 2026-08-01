import os, subprocess
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

raw_dir = 'data/v00-motion-test/raw_assets'
out_dir = 'data/v00-motion-test/output_video'
qa_dir = 'data/v00-motion-test/qa_frames'

os.makedirs(out_dir, exist_ok=True)

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
audio_file = os.path.join(raw_dir, 'SOLAR.wav')

print('--- STARTING V00 MP4 VIDEO RENDERING WITH AUDIO SYNCHRONIZATION ---')

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

try:
    font_large_16 = ImageFont.truetype('arialbd.ttf', 52)
    font_mid_16 = ImageFont.truetype('arial.ttf', 36)
    font_sub_16 = ImageFont.truetype('arial.ttf', 24)

    font_large_9 = ImageFont.truetype('arialbd.ttf', 56)
    font_mid_9 = ImageFont.truetype('arial.ttf', 38)
    font_sub_9 = ImageFont.truetype('arial.ttf', 26)
except Exception:
    font_large_16 = font_mid_16 = font_sub_16 = ImageFont.load_default()
    font_large_9 = font_mid_9 = font_sub_9 = ImageFont.load_default()

particles = [
    {
        'x': (i * 137.5) % 1920,
        'y': (i * 83.1) % 1080,
        'size': 2 + (i % 6),
        'speedX': 0.4 + (i % 3) * 0.2,
        'speedY': -0.5 - (i % 3) * 0.3,
        'alpha': int(255 * (0.3 + (i % 5) * 0.1)),
    }
    for i in range(16)
]

# Helper to pipe PIL frames directly to FFmpeg
def create_video(resolution, mode_name, output_filename):
    width, height = resolution
    temp_video = os.path.join(out_dir, f'temp_{mode_name}.mp4')
    final_output = os.path.join(out_dir, output_filename)

    # Launch FFmpeg process for video pipe
    cmd_video = [
        ffmpeg_exe, '-y',
        '-f', 'rawvideo',
        '-vcodec', 'rawvideo',
        '-s', f'{width}x{height}',
        '-pix_fmt', 'rgba',
        '-r', '30',
        '-i', '-',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-preset', 'fast',
        temp_video
    ]
    proc = subprocess.Popen(cmd_video, stdin=subprocess.PIPE)

    if mode_name == '16x9':
        img_r05 = img_r05_raw.resize((width, height), Image.Resampling.BILINEAR)
        img_yuto = img_yuto_raw.resize((width, height), Image.Resampling.BILINEAR)
        img_sho = img_sho_raw.resize((width, height), Image.Resampling.BILINEAR)

    total_frames = 300 # 10 seconds @ 30fps
    for frame in range(total_frames):
        canvas = Image.new('RGBA', (width, height), COLOR_DEEP_BLUE + (255,))

        if mode_name == '16x9':
            if frame < 120:
                progress = frame / 120.0
                scale = 1.0 + progress * 0.025
                sw, sh = int(width * scale), int(height * scale)
                r05_scaled = img_r05.resize((sw, sh), Image.Resampling.BILINEAR)
                ox, oy = (sw - width) // 2, (sh - height) // 2
                canvas.paste(r05_scaled.crop((ox, oy, ox + width, oy + height)), (0, 0))
                draw = ImageDraw.Draw(canvas)
                for p in particles:
                    px = int((p['x'] + p['speedX'] * frame) % width)
                    py = int((p['y'] + p['speedY'] * frame + height) % height)
                    draw.ellipse([px - p['size'], py - p['size'], px + p['size'], py + p['size']], fill=COLOR_PLATINUM + (p['alpha'],))
                if frame >= 116:
                    alpha = int(255 * (((frame - 116) / 3.0) * 0.45))
                    canvas = Image.alpha_composite(canvas, Image.new('RGBA', (width, height), COLOR_PLATINUM + (alpha,)))
                    draw = ImageDraw.Draw(canvas)
                if frame >= 12:
                    draw.text((120, 960), "FIVE LIGHTS.", fill=COLOR_WHITE + (255,), font=font_mid_16)
                if frame >= 66:
                    draw.text((440, 960), "ONE CYCLE.", fill=COLOR_PLATINUM + (255,), font=font_mid_16)

            elif frame < 210:
                progress = (frame - 120) / 90.0
                scale = 1.20 + progress * 0.03
                drift_x = int((progress - 0.5) * 15)
                sw, sh = int(width * scale), int(height * scale)
                yuto_scaled = img_yuto.resize((sw, sh), Image.Resampling.BILINEAR)
                ox, oy = (sw - width) // 2 + drift_x, (sh - height) // 2
                canvas.paste(yuto_scaled.crop((ox, oy, ox + width, oy + height)), (0, 0))
                draw = ImageDraw.Draw(canvas)
                if frame >= 207:
                    alpha = int(255 * (((frame - 207) / 3.0) * 0.6))
                    canvas = Image.alpha_composite(canvas, Image.new('RGBA', (width, height), COLOR_WHITE + (alpha,)))
                    draw = ImageDraw.Draw(canvas)
                draw.text((140, 830), "YUTO", fill=COLOR_WHITE + (255,), font=font_large_16)
                draw.text((140, 890), "BEFORE DAWN", fill=COLOR_PLATINUM + (255,), font=font_sub_16)
                draw.rectangle([140, 925, 200, 929], fill=COLOR_YUTO_BLUE + (255,))

            else:
                progress = (frame - 210) / 90.0
                scale = 1.18 + progress * 0.03
                canvas = Image.new('RGBA', (width, height), COLOR_NIGHT_PURPLE + (255,))
                sw, sh = int(width * scale), int(height * scale)
                sho_scaled = img_sho.resize((sw, sh), Image.Resampling.BILINEAR)
                ox, oy = (sw - width) // 2, (sh - height) // 2
                canvas.paste(sho_scaled.crop((ox, oy, ox + width, oy + height)), (0, 0))
                draw = ImageDraw.Draw(canvas)
                draw.text((140, 830), "SHO", fill=COLOR_WHITE + (255,), font=font_large_16)
                draw.text((140, 890), "NIGHT", fill=COLOR_SHO_PURPLE + (255,), font=font_sub_16)
                draw.rectangle([140, 925, 200, 929], fill=COLOR_SHO_PURPLE + (255,))
                if frame >= 260:
                    draw.text((1400, 830), "SOLAR CYCLE", fill=COLOR_PLATINUM + (255,), font=font_sub_16)
                if frame >= 275:
                    gfx_scaled = img_gfx01_raw.resize((360, 90), Image.Resampling.BILINEAR)
                    canvas.paste(gfx_scaled, (1400, 860), mask=gfx_scaled)

        else: # 9x16 Editorial Strip
            if frame < 120:
                progress = frame / 120.0
                scale = 1.0 + progress * 0.025
                strip_w, strip_h = 1080, 608
                strip_y = (height - strip_h) // 2
                sw, sh = int(strip_w * scale), int(strip_h * scale)
                r05_scaled = img_r05_raw.resize((sw, sh), Image.Resampling.BILINEAR)
                ox, oy = (sw - strip_w) // 2, (sh - strip_h) // 2
                canvas.paste(r05_scaled.crop((ox, oy, ox + strip_w, oy + strip_h)), (0, strip_y))
                draw = ImageDraw.Draw(canvas)
                draw.text((80, 420), "FIVE LIGHTS.", fill=COLOR_WHITE + (255,), font=font_mid_9)
                draw.text((80, 1340), "ONE CYCLE.", fill=COLOR_PLATINUM + (255,), font=font_mid_9)

            elif frame < 210:
                progress = (frame - 120) / 90.0
                scale = 1.0 + progress * 0.03
                sw, sh = int(1536 * scale), int(1920 * scale)
                yuto_scaled = img_yuto_raw.resize((sw, sh), Image.Resampling.BILINEAR)
                ox, oy = (sw - width) // 2, (sh - height) // 2
                canvas.paste(yuto_scaled.crop((ox, oy, ox + width, oy + height)), (0, 0))
                draw = ImageDraw.Draw(canvas)
                draw.text((80, 1500), "YUTO", fill=COLOR_WHITE + (255,), font=font_large_9)
                draw.text((80, 1570), "BEFORE DAWN", fill=COLOR_PLATINUM + (255,), font=font_sub_9)
                draw.rectangle([80, 1610, 160, 1615], fill=COLOR_YUTO_BLUE + (255,))

            else:
                progress = (frame - 210) / 90.0
                scale = 1.0 + progress * 0.03
                canvas = Image.new('RGBA', (width, height), COLOR_NIGHT_PURPLE + (255,))
                sw, sh = int(1536 * scale), int(1920 * scale)
                sho_scaled = img_sho_raw.resize((sw, sh), Image.Resampling.BILINEAR)
                ox, oy = (sw - width) // 2, (sh - height) // 2
                canvas.paste(sho_scaled.crop((ox, oy, ox + width, oy + height)), (0, 0))
                draw = ImageDraw.Draw(canvas)
                draw.text((80, 1500), "SHO", fill=COLOR_WHITE + (255,), font=font_large_9)
                draw.text((80, 1570), "NIGHT", fill=COLOR_SHO_PURPLE + (255,), font=font_sub_9)
                draw.rectangle([80, 1610, 160, 1615], fill=COLOR_SHO_PURPLE + (255,))
                draw.text((640, 1500), "SOLAR CYCLE", fill=COLOR_PLATINUM + (255,), font=font_sub_9)
                gfx_scaled = img_gfx01_raw.resize((360, 90), Image.Resampling.BILINEAR)
                canvas.paste(gfx_scaled, (640, 1540), mask=gfx_scaled)

        proc.stdin.write(canvas.tobytes())

    proc.stdin.close()
    proc.wait()

    # Mux video with SOLAR.wav audio (first 10 seconds)
    cmd_mux = [
        ffmpeg_exe, '-y',
        '-i', temp_video,
        '-ss', '0', '-t', '10',
        '-i', audio_file,
        '-c:v', 'copy',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-shortest',
        final_output
    ]
    subprocess.run(cmd_mux, check=True)

    if os.path.exists(temp_video):
        os.remove(temp_video)

    print(f'Rendered MP4 Video with Audio: {final_output}')

create_video((1920, 1080), '16x9', 'V00_IDENTITY-SAFE-MOTION_TEST_16x9_v001.mp4')
create_video((1080, 1920), '9x16', 'V00_IDENTITY-SAFE-MOTION_TEST_9x16_v001.mp4')

print('All V00 MP4 videos (16:9 and 9:16) rendered and audio-synced successfully!')
