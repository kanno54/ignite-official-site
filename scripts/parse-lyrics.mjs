import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileMapping = [
  { recordingId: 'firestarter-main', file: 'data/Lyrics/001-FIRESTARTER/001-01-FIRESTARTER.md' },
  { recordingId: 'firestarter-ignition-indies', file: 'data/Lyrics/001-FIRESTARTER/001-02-IGNITION.md' },
  { recordingId: 'firestarter-burn-it-down-indies', file: 'data/Lyrics/001-FIRESTARTER/001-03-BURN-IT-DOWN.md' },
  { recordingId: 'firestarter-heatwave-indies', file: 'data/Lyrics/001-FIRESTARTER/001-04-Heatwave.md' },
  { recordingId: 'firestarter-runaway-beat', file: 'data/Lyrics/001-FIRESTARTER/001-05-Runaway-Beat.md' },
  { recordingId: 'firestarter-first-light', file: 'data/Lyrics/001-FIRESTARTER/001-06-First-Light.md' },

  { recordingId: 'ignition-main', file: 'data/Lyrics/002-IGNITION/002-01-IGNITION.md' },
  { recordingId: 'back-to-the-spark', file: 'data/Lyrics/002-IGNITION/002-02-Back-to-the-Spark.md' },
  { recordingId: 'heatwave-live', file: 'data/Lyrics/002-IGNITION/002-03-Heatwave.md' },

  { recordingId: 'burn-it-down-main', file: 'data/Lyrics/003-BURN-IT-DOWN/003-01-BURN-IT-DOWN.md' },
  { recordingId: 'ashes-in-motion', file: 'data/Lyrics/003-BURN-IT-DOWN/003-02-Ashes-in-Motion.md' },
  { recordingId: 'hands-up-hearts-out-live', file: 'data/Lyrics/003-BURN-IT-DOWN/003-03-Hands-Up-Hearts-Out.md' },

  { recordingId: 'no-limits-title', file: 'data/Lyrics/004-No-Limits/004-01-No-Limits.md' },
  { recordingId: 'higher-ground', file: 'data/Lyrics/004-No-Limits/004-02-Higher-Ground.md' },
  { recordingId: 'run-with-us-live', file: 'data/Lyrics/004-No-Limits/004-03-Run-with-Us.md' },

  { recordingId: 'moonlit-title', file: 'data/Lyrics/005-Moonlit/005-01-Moonlit.md' },
  { recordingId: 'between-the-lights', file: 'data/Lyrics/005-Moonlit/005-02-Between-the-Lights.md' },
  { recordingId: 'afterimage-live', file: 'data/Lyrics/005-Moonlit/005-03-Afterimage.md' }
];

function parseLyricsMarkdown(content) {
  const lines = content.split(/\r?\n/);
  const result = [];
  let currentSpeaker = 'all';

  for (let rawLine of lines) {
    let line = rawLine.trim();
    if (!line) continue;

    // Check for section header like **[Intro / KAI]** or [Verse 1 - YUTO]
    const headerMatch = line.match(/^[\*\_]*\[(.*?)\][\*\_]*$/);
    if (headerMatch) {
      const headerText = headerMatch[1];
      // Try to extract speaker after / or -
      if (headerText.includes('/') || headerText.includes('-')) {
        const parts = headerText.split(/[\/-]/);
        const possibleSpeaker = parts[parts.length - 1].trim();
        if (possibleSpeaker) {
          currentSpeaker = possibleSpeaker;
        }
      }
      continue;
    }

    // Normal lyric line
    result.push({
      speaker: currentSpeaker,
      text: line
    });
  }

  return result;
}

const discographyPath = path.resolve(__dirname, '../content/public/discography.json');
const disco = JSON.parse(fs.readFileSync(discographyPath, 'utf8'));

fileMapping.forEach(m => {
  const filePath = path.resolve(__dirname, '../', m.file);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ Warning: file not found for ${m.recordingId}: ${filePath}`);
    return;
  }
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const parsedLyrics = parseLyricsMarkdown(fileContent);

  const recording = disco.recordings.find(r => r.id === m.recordingId);
  if (recording) {
    recording.lyrics = parsedLyrics;
    console.log(`✔ Updated lyrics for ${m.recordingId} (${parsedLyrics.length} lines)`);
  } else {
    console.warn(`⚠️ Warning: recording not found in discography.json for ID ${m.recordingId}`);
  }
});

fs.writeFileSync(discographyPath, JSON.stringify(disco, null, 2), 'utf8');
console.log('\n✔ Successfully updated discography.json with all 18 full lyrics!');
