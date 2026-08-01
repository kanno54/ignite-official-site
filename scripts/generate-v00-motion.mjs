import fs from 'fs';
import path from 'path';
import { createCanvas, loadImage } from 'canvas';

const rawDir = path.resolve('data/v00-motion-test/raw_assets');
const outDir = path.resolve('data/v00-motion-test/output_16x9');
const qaDir = path.resolve('data/v00-motion-test/qa_frames');

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(qaDir, { recursive: true });

console.log('--- STARTING V00 16:9 REVIEW MASTER GENERATION ---');

// Colors
const COLOR_DEEP_BLUE = '#1A3864';
const COLOR_NIGHT_PURPLE = '#141121';
const COLOR_PLATINUM = '#FBECCD';
const COLOR_TEXT_WHITE = '#FFFFFF';
const COLOR_YUTO_BLUE = '#2450A4';
const COLOR_SHO_PURPLE = '#7B5CFF';

// Helper to draw text with tracking
function drawTextWithTracking(ctx, text, x, y, tracking) {
  let currentX = x;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    ctx.fillText(char, currentX, y);
    currentX += ctx.measureText(char).width + tracking;
  }
}

async function renderV00Master16x9() {
  const width = 1920;
  const height = 1080;
  const totalFrames = 300; // 10s @ 30fps
  const fps = 30;

  // Load raw plates
  const imgR05 = await loadImage(path.join(rawDir, 'R05-01-IGNITE-five-member-lineup_2400x1350.png'));
  const imgYuto = await loadImage(path.join(rawDir, 'R03-05-YUTO_SOLAR-outfit-front_1600x2000.png'));
  const imgSho = await loadImage(path.join(rawDir, 'R03-02-SHO_SOLAR-outfit-front_1600x2000.png'));
  const imgGfx01 = await loadImage(path.join(rawDir, 'GFX01-IGNITE-full-logo-transparent_3200x800.png'));

  // Seeded particles
  const particles = Array.from({ length: 16 }).map((_, i) => ({
    x: (i * 137.5) % width,
    y: (i * 83.1) % height,
    size: 2 + (i % 6),
    speedX: 0.4 + (i % 3) * 0.2,
    speedY: -0.5 - (i % 3) * 0.3,
    alpha: 0.3 + (i % 5) * 0.1,
  }));

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const qaFrames = {
    45: 'V00_QA_C01_0150.png',
    165: 'V00_QA_C02_0550.png',
    255: 'V00_QA_C03_0850.png',
  };

  for (let frame = 0; frame < totalFrames; frame++) {
    ctx.clearRect(0, 0, width, height);
    const t = frame / fps;

    if (frame < 120) {
      // ==========================================
      // CUT 01 (f000-119 / 0.00-4.00s) R05 5-member Wide
      // ==========================================
      const progress = frame / 120;
      const scale = 1.0 + progress * 0.025; // 100% -> 102.5%

      // Layer 1: Background
      ctx.fillStyle = COLOR_DEEP_BLUE;
      ctx.fillRect(0, 0, width, height);

      // Layer 2: Back Light / Vignette
      const grad = ctx.createRadialGradient(width / 2, height / 2, 200, width / 2, height / 2, 1000);
      grad.addColorStop(0, 'rgba(251, 236, 205, 0.08)');
      grad.addColorStop(1, 'rgba(26, 56, 100, 0.9)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Layer 3: Character / Source Plate (R05)
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(scale, scale);
      ctx.drawImage(imgR05, -width / 2, -height / 2, width, height);
      ctx.restore();

      // Layer 4: Front Atmosphere (Particles & Flash)
      particles.forEach((p) => {
        const px = (p.x + p.speedX * frame) % width;
        const py = (p.y + p.speedY * frame + height) % height;
        ctx.fillStyle = `rgba(251, 236, 205, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Platinum streak light at 3.86s - 4.00s (f116 - f119)
      if (frame >= 116) {
        const flashAlpha = ((frame - 116) / 3) * 0.45;
        ctx.fillStyle = `rgba(251, 236, 205, ${flashAlpha})`;
        ctx.fillRect(0, 0, width, height);
      }

      // Layer 5: Typography
      ctx.fillStyle = COLOR_TEXT_WHITE;
      ctx.font = 'bold 36px sans-serif';
      if (frame >= 12) { // 0.4s
        drawTextWithTracking(ctx, 'FIVE LIGHTS.', 120, 960, 6);
      }
      if (frame >= 66) { // 2.2s
        ctx.fillStyle = COLOR_PLATINUM;
        drawTextWithTracking(ctx, 'ONE CYCLE.', 440, 960, 6);
      }

    } else if (frame < 210) {
      // ==========================================
      // CUT 02 (f120-209 / 4.00-7.00s) YUTO Close-Up
      // ==========================================
      const progress = (frame - 120) / 90;
      const scale = 1.20 + progress * 0.03; // 120% -> 123%
      const offsetX = (progress - 0.5) * 15; // Max 20px drift

      // Layer 1: Background
      ctx.fillStyle = COLOR_DEEP_BLUE;
      ctx.fillRect(0, 0, width, height);

      // Layer 2: Back Light Beam
      ctx.fillStyle = 'rgba(78, 140, 255, 0.12)';
      ctx.fillRect(200 + progress * 50, 0, 180, height);

      // Layer 3: Character / Source Plate (YUTO)
      ctx.save();
      ctx.translate(width / 2 + offsetX, height / 2);
      ctx.scale(scale, scale);
      ctx.drawImage(imgYuto, -width / 2, -height / 2, width, height);
      ctx.restore();

      // Layer 4: Front Atmosphere
      if (frame >= 207) { // 6.90s - 7.00s Flash
        const flashAlpha = ((frame - 207) / 3) * 0.6;
        ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
        ctx.fillRect(0, 0, width, height);
      }

      // Layer 5: Typography
      ctx.fillStyle = COLOR_TEXT_WHITE;
      ctx.font = 'bold 52px sans-serif';
      drawTextWithTracking(ctx, 'YUTO', 140, 840, 8);

      ctx.fillStyle = COLOR_PLATINUM;
      ctx.font = '24px sans-serif';
      drawTextWithTracking(ctx, 'BEFORE DAWN', 140, 890, 10);

      // YUTO Accent line
      ctx.fillStyle = COLOR_YUTO_BLUE;
      ctx.fillRect(140, 910, 60, 4);

    } else {
      // ==========================================
      // CUT 03 (f210-299 / 7.00-10.00s) SHO Close-Up & Logo
      // ==========================================
      const progress = (frame - 210) / 90;
      const scale = 1.18 + progress * 0.03; // 118% -> 121%

      // Layer 1: Background
      ctx.fillStyle = COLOR_NIGHT_PURPLE;
      ctx.fillRect(0, 0, width, height);

      // Layer 2: Back Light Edge Light
      const edgeGrad = ctx.createLinearGradient(0, 0, width, height);
      edgeGrad.addColorStop(0, 'rgba(123, 92, 255, 0.15)');
      edgeGrad.addColorStop(1, 'rgba(251, 236, 205, 0.1)');
      ctx.fillStyle = edgeGrad;
      ctx.fillRect(0, 0, width, height);

      // Layer 3: Character / Source Plate (SHO)
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(scale, scale);
      ctx.drawImage(imgSho, -width / 2, -height / 2, width, height);
      ctx.restore();

      // Layer 5: Typography
      ctx.fillStyle = COLOR_TEXT_WHITE;
      ctx.font = 'bold 52px sans-serif';
      drawTextWithTracking(ctx, 'SHO', 140, 840, 8);

      ctx.fillStyle = COLOR_SHO_PURPLE;
      ctx.font = '24px sans-serif';
      drawTextWithTracking(ctx, 'NIGHT', 140, 890, 10);

      // SHO Accent line
      ctx.fillStyle = COLOR_SHO_PURPLE;
      ctx.fillRect(140, 910, 60, 4);

      // 8.65s (f260) SOLAR CYCLE
      if (frame >= 260) {
        ctx.fillStyle = COLOR_PLATINUM;
        ctx.font = 'bold 28px sans-serif';
        drawTextWithTracking(ctx, 'SOLAR CYCLE', 1400, 840, 8);
      }

      // 9.15s (f275) GFX01 Logo
      if (frame >= 275) {
        ctx.drawImage(imgGfx01, 1400, 860, 360, 90);
      }
    }

    // Save QA Frames
    if (qaFrames[frame]) {
      const qaPath = path.join(qaDir, qaFrames[frame]);
      fs.writeFileSync(qaPath, canvas.toBuffer('image/png'));
      console.log(`  ✔ Exported QA Frame: ${qaFrames[frame]}`);
    }
  }

  console.log('✔ Rendered 16:9 Review Master frames successfully!');
}

renderV00Master16x9().catch(console.error);
