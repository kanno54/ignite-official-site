import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const rootDir = path.resolve(__dirname, '..');
export const canonicalDir = path.join(rootDir, 'content', 'canonical', 'equinox');
export const sourceMap = JSON.parse(fs.readFileSync(path.join(canonicalDir, 'asset-source-map.json'), 'utf8'));

export const normalizeNewlines = (value) => value.replace(/\r\n?/g, '\n');

export const readCanonicalSource = (sourcePath) => {
  const absolutePath = path.join(rootDir, sourcePath);
  const value = normalizeNewlines(fs.readFileSync(absolutePath, 'utf8'));
  if (value.includes('\uFFFD')) throw new Error(`canonical source is not valid UTF-8: ${sourcePath}`);
  return value.replace(/\n*$/, '\n');
};

const trimBlankLines = (lines) => {
  const result = [...lines];
  while (result[0] === '') result.shift();
  while (result[result.length - 1] === '') result.pop();
  return result;
};

export const parseCanonicalLyrics = (markdown) => {
  const sections = [];
  let current = null;

  for (const rawLine of normalizeNewlines(markdown).split('\n')) {
    const line = rawLine.replace(/[ \t]+$/, '');
    const header = line.trim().match(/^(?:\*\*)?\[([^\]]+)\](?:\*\*)?$/);
    if (header) {
      if (current) {
        sections.push({
          speaker: current.speaker,
          text: trimBlankLines(current.lines).join('\n'),
        });
      }
      current = { speaker: header[1], lines: [] };
    } else if (current) {
      current.lines.push(line);
    } else if (line.trim() !== '') {
      throw new Error(`lyric content appears before the first section heading: ${line}`);
    }
  }

  if (current) {
    sections.push({
      speaker: current.speaker,
      text: trimBlankLines(current.lines).join('\n'),
    });
  }
  if (sections.length === 0) throw new Error('canonical lyric contains no sections');
  return sections;
};

const plainLinerText = (lines) => trimBlankLines(lines)
  .join('\n')
  .replace(/\*\*([^*]+)\*\*/g, '$1');

export const parseCanonicalLinerNotes = (markdown) => {
  const lines = normalizeNewlines(markdown).split('\n');
  const trackNotes = new Map();
  let mode = null;
  let currentTrack = null;
  let buffer = [];
  let albumIntroduction = '';
  let albumNote = '';

  const flush = () => {
    if (mode === 'introduction') albumIntroduction = plainLinerText(buffer);
    if (mode === 'track' && currentTrack !== null) trackNotes.set(currentTrack, plainLinerText(buffer));
    if (mode === 'album-note') albumNote = plainLinerText(buffer);
    buffer = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.replace(/[ \t]+$/, '');
    if (/^## Official Liner Notes\s*$/.test(line)) {
      flush();
      mode = 'introduction';
      continue;
    }
    const trackHeading = line.match(/^## (\d{2})\.\s+(.+)$/);
    if (trackHeading) {
      flush();
      mode = 'track';
      currentTrack = Number(trackHeading[1]);
      continue;
    }
    if (/^## ALBUM NOTE\s*$/.test(line)) {
      flush();
      mode = 'album-note';
      currentTrack = null;
      continue;
    }
    if (/^---\s*$/.test(line)) {
      flush();
      mode = null;
      currentTrack = null;
      continue;
    }
    if (mode) buffer.push(line);
  }
  flush();

  if (!albumIntroduction) throw new Error('AR-LN01 is missing Official Liner Notes introduction');
  if (trackNotes.size !== 12) throw new Error(`AR-LN01 contains ${trackNotes.size} track notes instead of 12`);
  if (!albumNote) throw new Error('AR-LN01 is missing ALBUM NOTE');

  return {
    releaseLinerNotes: `${albumIntroduction}\n\nALBUM NOTE\n\n${albumNote}`,
    trackNotes,
  };
};
