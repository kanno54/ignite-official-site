import { Recording } from './content';

export type PlayerState = {
  currentTrackId: string | null;
  currentRecording: Recording | null;
  queue: string[]; // recording IDs
  queueIndex: number;
  queueContext: 'release' | 'jukebox' | 'manual' | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  isExpanded: boolean;
  error: string | null;
};

export type AudioContextType = {
  playerState: PlayerState;
  playTrack: (recordingId: string, customQueue?: string[], context?: PlayerState['queueContext']) => void;
  playRelease: (releaseId: string) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seek: (seconds: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleExpand: () => void;
  setIsExpanded: (expanded: boolean) => void;
};
