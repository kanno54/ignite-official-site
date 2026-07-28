import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const releaseMapping = [
  {
    releaseId: 'firestarter',
    file: 'data/Liner-Notes/001-FIRESTARTER_official_liner_notes.md',
    tracks: [
      'firestarter-main',
      'firestarter-ignition-indies',
      'firestarter-burn-it-down-indies',
      'firestarter-heatwave-indies',
      'firestarter-runaway-beat',
      'firestarter-first-light'
    ]
  },
  {
    releaseId: 'ignition',
    file: 'data/Liner-Notes/002-IGNITION_official_liner_notes.md',
    tracks: [
      'ignition-main',
      'back-to-the-spark',
      'heatwave-live'
    ]
  },
  {
    releaseId: 'burn-it-down',
    file: 'data/Liner-Notes/003-BURN_IT_DOWN_official_liner_notes.md',
    tracks: [
      'burn-it-down-main',
      'ashes-in-motion',
      'hands-up-hearts-out-live'
    ]
  },
  {
    releaseId: 'no-limits',
    file: 'data/Liner-Notes/004-NO_LIMITS_official_liner_notes.md',
    tracks: [
      'no-limits-title',
      'higher-ground',
      'run-with-us-live'
    ]
  },
  {
    releaseId: 'moonlit',
    file: 'data/Liner-Notes/005-MOONLIT_official_liner_notes.md',
    tracks: [
      'moonlit-title',
      'between-the-lights',
      'afterimage-live'
    ]
  }
];

function parseLinerNotesMarkdown(content) {
  const lines = content.split(/\r?\n/);
  let mode = null; // 'album_liner' | 'track_notes'
  let albumLinerParagraphs = [];
  const trackNotesMap = {}; // { '01': '...', '02': '...' }
  let currentTrackNum = null;
  let currentTrackParagraphs = [];

  for (let rawLine of lines) {
    const line = rawLine.trim();

    if (line.startsWith('## Official Liner Notes')) {
      mode = 'album_liner';
      continue;
    }

    if (line.startsWith('## Track Notes')) {
      mode = 'track_notes';
      continue;
    }

    if (line.startsWith('## Track List') || line.startsWith('## Source Status')) {
      if (currentTrackNum && currentTrackParagraphs.length > 0) {
        trackNotesMap[currentTrackNum] = currentTrackParagraphs.join('\n\n');
      }
      mode = null;
      continue;
    }

    if (mode === 'album_liner') {
      if (line.startsWith('##')) {
        mode = null;
        continue;
      }
      if (line) {
        albumLinerParagraphs.push(line);
      }
    } else if (mode === 'track_notes') {
      if (line.startsWith('###')) {
        // Save previous track if any
        if (currentTrackNum && currentTrackParagraphs.length > 0) {
          trackNotesMap[currentTrackNum] = currentTrackParagraphs.join('\n\n');
        }
        // Match e.g. ### 01. FIRESTARTER -> extract '01'
        const trackMatch = line.match(/###\s+(\d{2})\./);
        if (trackMatch) {
          currentTrackNum = trackMatch[1];
          currentTrackParagraphs = [];
        } else {
          currentTrackNum = null;
        }
      } else if (currentTrackNum && line) {
        currentTrackParagraphs.push(line);
      }
    }
  }

  // Save last track if any
  if (mode === 'track_notes' && currentTrackNum && currentTrackParagraphs.length > 0) {
    trackNotesMap[currentTrackNum] = currentTrackParagraphs.join('\n\n');
  }

  return {
    albumLinerNotes: albumLinerParagraphs.join('\n\n'),
    trackNotesMap
  };
}

const discographyPath = path.resolve(__dirname, '../content/public/discography.json');
const disco = JSON.parse(fs.readFileSync(discographyPath, 'utf8'));

releaseMapping.forEach(rm => {
  const filePath = path.resolve(__dirname, '../', rm.file);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ Warning: file not found for release ${rm.releaseId}: ${filePath}`);
    return;
  }
  let fileContent = fs.readFileSync(filePath, 'utf8');
  fileContent = fileContent.replace(/1st Full Album『SOLAR』/g, '1st Full Album').replace(/『SOLAR』/g, '1st Full Album');
  const parsed = parseLinerNotesMarkdown(fileContent);

  // Update Release linerNotes
  const release = disco.releases.find(r => r.id === rm.releaseId);
  if (release) {
    if (parsed.albumLinerNotes) {
      release.linerNotes = parsed.albumLinerNotes;
      console.log(`✔ Updated release linerNotes for ${rm.releaseId}`);
    }
  }

  // Update Recording linerNotes
  rm.tracks.forEach((recordingId, index) => {
    const trackNumStr = String(index + 1).padStart(2, '0'); // '01', '02', etc.
    const noteText = parsed.trackNotesMap[trackNumStr];
    if (noteText) {
      const recording = disco.recordings.find(r => r.id === recordingId);
      if (recording) {
        recording.linerNotes = noteText;
        console.log(`  └─ Updated track linerNotes for ${recordingId} (Track ${trackNumStr})`);
      }
    } else {
      console.warn(`  ⚠️ Track note ${trackNumStr} not found for ${recordingId}`);
    }
  });
});

fs.writeFileSync(discographyPath, JSON.stringify(disco, null, 2), 'utf8');
console.log('\n✔ Successfully updated discography.json with all official Release and Track Liner Notes!');
