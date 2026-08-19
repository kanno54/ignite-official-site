export type EmberVisibility = 'VISIBLE' | 'RESTING' | 'HIDDEN';
export type PlaybackState = 'IDLE' | 'PLAYING' | 'PAUSED';
export type ListeningMode = 'LISTEN' | 'DANCE' | 'VOCAL' | 'CHILL';
export type TemporaryReaction = 'NONE' | 'BURN_HEY' | 'BURN_YEAH' | 'BURN_STRONG';
export type SpeechState = 'NONE' | 'OPEN';
export type NoticeState = 'NONE' | 'NEW_CONTENT';

export interface EmberRuntimeState {
  visibility: EmberVisibility;
  playbackState: PlaybackState;
  listeningMode: ListeningMode;
  temporaryReaction: TemporaryReaction;
  speechState: SpeechState;
  noticeState: NoticeState;
  comboCount: number;
  lastReactionTime: number;
}

export type EmberAction =
  | { type: 'SET_VISIBILITY'; payload: EmberVisibility }
  | { type: 'SET_PLAYBACK_STATE'; payload: PlaybackState }
  | { type: 'SET_LISTENING_MODE'; payload: ListeningMode }
  | { type: 'TRIGGER_BURN' }
  | { type: 'CLEAR_BURN' }
  | { type: 'TOGGLE_TALK'; payload?: boolean }
  | { type: 'SET_NOTICE'; payload: NoticeState }
  | { type: 'RESTORE_EMBER' }
  | { type: 'REST_EMBER' };

export interface ConciergeMessage {
  id: string;
  category: 'GREETING' | 'PLAYER_GUIDE' | 'NEW_CONTENT' | 'DISCOVERY' | 'FEATURE_GUIDE';
  text: string;
  ctaText?: string;
  ctaLink?: string;
}
