import type { FC } from 'react';

export type LyricSectionData = {
  speaker: string;
  text: string;
};

export type LyricsSurface = 'song-detail' | 'expanded-player' | 'album-accordion' | 'default';

export const splitVisibleLyricLines: (text: string) => string[];
export const LyricSection: FC<{
  speaker: string;
  text: string;
  showSpeaker?: boolean;
  surface?: LyricsSurface;
  sectionIndex?: number;
}>;
export const LyricsRenderer: FC<{
  lyrics: LyricSectionData[];
  surface: Exclude<LyricsSurface, 'default'>;
  showSpeaker?: boolean;
  className?: string;
}>;
