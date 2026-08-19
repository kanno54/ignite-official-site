import { EmberRuntimeState, EmberAction } from '../../types/ember';

export const initialEmberState: EmberRuntimeState = {
  visibility: 'VISIBLE',
  playbackState: 'IDLE',
  listeningMode: 'LISTEN',
  temporaryReaction: 'NONE',
  speechState: 'NONE',
  noticeState: 'NONE',
  comboCount: 0,
  lastReactionTime: 0,
};

export const emberReducer = (state: EmberRuntimeState, action: EmberAction): EmberRuntimeState => {
  switch (action.type) {
    case 'SET_VISIBILITY':
      return { ...state, visibility: action.payload };

    case 'SET_PLAYBACK_STATE':
      return { ...state, playbackState: action.payload };

    case 'SET_LISTENING_MODE':
      return { ...state, listeningMode: action.payload };

    case 'TRIGGER_BURN': {
      const now = Date.now();
      const isWithinWindow = now - state.lastReactionTime <= 450;
      const nextCombo = isWithinWindow ? Math.min(state.comboCount + 1, 3) : 1;

      let reaction: EmberRuntimeState['temporaryReaction'] = 'BURN_HEY';
      if (nextCombo === 2) reaction = 'BURN_YEAH';
      if (nextCombo >= 3) reaction = 'BURN_STRONG';

      return {
        ...state,
        temporaryReaction: reaction,
        comboCount: nextCombo,
        lastReactionTime: now,
      };
    }

    case 'CLEAR_BURN':
      return {
        ...state,
        temporaryReaction: 'NONE',
      };

    case 'TOGGLE_TALK': {
      const nextSpeech = action.payload !== undefined
        ? (action.payload ? 'OPEN' : 'NONE')
        : (state.speechState === 'OPEN' ? 'NONE' : 'OPEN');

      return { ...state, speechState: nextSpeech };
    }

    case 'SET_NOTICE':
      return { ...state, noticeState: action.payload };

    case 'REST_EMBER':
      return {
        ...state,
        visibility: 'RESTING',
        speechState: 'NONE',
      };

    case 'RESTORE_EMBER':
      return {
        ...state,
        visibility: 'VISIBLE',
      };

    default:
      return state;
  }
};
