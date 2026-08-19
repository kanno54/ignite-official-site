import React, { useReducer, useEffect, useState, useRef } from 'react';
import { useAudio } from '../audio/AudioProvider';
import { isFeatureEnabled } from '../../config/featureFlags';
import { initialEmberState, emberReducer } from './emberMachine';
import { getEmberFrame } from './emberAnimation';
import { EmberRenderer } from './EmberRenderer';
import { EmberControlBar } from './EmberControlBar';
import { EmberSpeechBubble } from './EmberSpeechBubble';
import {
  EMBER_ASSETS,
  preloadInitialEmberAssets,
  preloadModeAssets,
  preloadBurnAssets,
} from './emberAssets';
import {
  trackEmberView,
  trackEmberTap,
  trackEmberRest,
  trackEmberRestore,
  trackEmberModeChange,
  trackEmberBurn,
  trackEmberReduceMotion,
} from './emberAnalytics';
import './guestEmber.css';

const CONCIERGE_MESSAGES = [
  'IGNITEへようこそ！今聴いている曲のバイブスに合わせてModeを変えてみてね🔥',
  '右下のプレイヤーから楽曲を選んで再生できるよ。音声をオンにして楽しもう！',
  '『RISE AGAIN』6th Singleが公開中！Discographyから楽曲ライナーノーツをチェックできるよ。',
  '🔥ボタンを連打すると熱いリアクションが送れるよ！',
];

export const GuestEmber: React.FC = () => {
  if (!isFeatureEnabled('GUEST_EMBER')) {
    return null;
  }

  const { playerState } = useAudio();
  const [state, dispatch] = useReducer(emberReducer, initialEmberState);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Animation Timers & Frames
  const [sequenceFrame, setSequenceFrame] = useState(0);
  const [isSpecialInsertActive, setIsSpecialInsertActive] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [conciergeIdx, setConciergeIdx] = useState(0);

  const burnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const talkAutoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Initial Preload & Reduced Motion Detection
  useEffect(() => {
    preloadInitialEmberAssets();
    trackEmberView();

    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setIsReducedMotion(mediaQuery.matches);
      if (mediaQuery.matches) {
        trackEmberReduceMotion();
      }

      const handleMotionChange = (e: MediaQueryListEvent) => {
        setIsReducedMotion(e.matches);
        if (e.matches) trackEmberReduceMotion();
      };

      mediaQuery.addEventListener('change', handleMotionChange);
      return () => mediaQuery.removeEventListener('change', handleMotionChange);
    }
  }, []);

  // 2. Connect Audio Player State via Adapter
  useEffect(() => {
    if (!playerState.currentTrackId) {
      dispatch({ type: 'SET_PLAYBACK_STATE', payload: 'IDLE' });
    } else if (playerState.isPlaying) {
      dispatch({ type: 'SET_PLAYBACK_STATE', payload: 'PLAYING' });
    } else {
      dispatch({ type: 'SET_PLAYBACK_STATE', payload: 'PAUSED' });
    }
  }, [playerState.currentTrackId, playerState.isPlaying]);

  // Preload Mode & Burn Assets when mode changes or player starts
  useEffect(() => {
    if (state.playbackState === 'PLAYING') {
      preloadModeAssets(state.listeningMode);
    }
  }, [state.playbackState, state.listeningMode]);

  // 3. Scroll Behavior (Opacity Dimming during Scroll)
  useEffect(() => {
    const handleScroll = () => {
      setScrollOpacity(0.8);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        setScrollOpacity(1);
      }, 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  // 4. Sequence & Animation Timers Engine
  useEffect(() => {
    if (isReducedMotion) return;

    let intervalId: NodeJS.Timeout | null = null;
    let insertTimeoutId: NodeJS.Timeout | null = null;

    // IDLE Mode Animation Loop
    if (state.playbackState === 'IDLE' && state.visibility === 'VISIBLE' && state.speechState === 'NONE') {
      const scheduleBlink = () => {
        const nextDelay = 6000 + Math.random() * 4000;
        insertTimeoutId = setTimeout(() => {
          setIsSpecialInsertActive(true);
          setTimeout(() => {
            setIsSpecialInsertActive(false);
            scheduleBlink();
          }, 150);
        }, nextDelay);
      };
      scheduleBlink();
    }

    // PLAYING Mode Sequence Loops
    if (state.playbackState === 'PLAYING' && state.visibility === 'VISIBLE') {
      if (state.listeningMode === 'LISTEN') {
        intervalId = setInterval(() => {
          setSequenceFrame((prev) => (prev + 1) % 4);
        }, 450);
      } else if (state.listeningMode === 'DANCE') {
        intervalId = setInterval(() => {
          setSequenceFrame((prev) => (prev + 1) % 4);
        }, 350);
      } else if (state.listeningMode === 'VOCAL') {
        intervalId = setInterval(() => {
          setIsSpecialInsertActive(true);
          setTimeout(() => setIsSpecialInsertActive(false), 900);
        }, 5500);
      } else if (state.listeningMode === 'CHILL') {
        intervalId = setInterval(() => {
          setIsSpecialInsertActive(true);
          setTimeout(() => setIsSpecialInsertActive(false), 1500);
        }, 7000);
      }
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (insertTimeoutId) clearTimeout(insertTimeoutId);
    };
  }, [state.playbackState, state.listeningMode, state.visibility, state.speechState, isReducedMotion]);

  // 5. Handlers
  const handleSelectMode = (mode: typeof state.listeningMode) => {
    dispatch({ type: 'SET_LISTENING_MODE', payload: mode });
    preloadModeAssets(mode);
    trackEmberModeChange(mode);
  };

  const handleTriggerBurn = () => {
    preloadBurnAssets();
    dispatch({ type: 'TRIGGER_BURN' });

    const newCombo = state.comboCount >= 3 ? 3 : state.comboCount + 1;
    trackEmberBurn(newCombo);

    if (burnTimerRef.current) clearTimeout(burnTimerRef.current);
    burnTimerRef.current = setTimeout(() => {
      dispatch({ type: 'CLEAR_BURN' });
    }, 1100);
  };

  const handleEmberClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackEmberTap();

    if (state.visibility === 'RESTING') {
      dispatch({ type: 'RESTORE_EMBER' });
      trackEmberRestore();
      return;
    }

    const nextSpeech = state.speechState === 'NONE';
    dispatch({ type: 'TOGGLE_TALK', payload: nextSpeech });

    if (nextSpeech) {
      setConciergeIdx((prev) => (prev + 1) % CONCIERGE_MESSAGES.length);
      if (talkAutoCloseTimerRef.current) clearTimeout(talkAutoCloseTimerRef.current);
      talkAutoCloseTimerRef.current = setTimeout(() => {
        dispatch({ type: 'TOGGLE_TALK', payload: false });
      }, 5000);
    }
  };

  const handleRestEmber = () => {
    dispatch({ type: 'REST_EMBER' });
    trackEmberRest();
  };

  // Calculate current frame info
  const frameInfo = getEmberFrame(
    state,
    isReducedMotion,
    sequenceFrame,
    isSpecialInsertActive
  );

  // Hidden state: return null
  if (state.visibility === 'HIDDEN') {
    return null;
  }

  // RESTING state: Render small PEEK call button
  if (state.visibility === 'RESTING') {
    return (
      <div className="guest-ember-root" style={{ opacity: scrollOpacity }}>
        <button
          type="button"
          className="ember-resting-btn"
          onClick={handleEmberClick}
          aria-label="EMBERを呼ぶ"
        >
          <img
            src={EMBER_ASSETS['GE-S09']}
            alt="EMBER PEEK"
            style={{ width: '24px', height: '24px', objectFit: 'contain' }}
          />
          <span>EMBERを呼ぶ 🔥</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className="guest-ember-root"
      style={{
        opacity: scrollOpacity,
        zIndex: playerState.isExpanded ? 900 : 995, // Hide behind expanded player if full modal
      }}
    >
      {/* Speech Bubble */}
      {state.speechState === 'OPEN' && (
        <EmberSpeechBubble
          messageText={CONCIERGE_MESSAGES[conciergeIdx]}
          onClose={() => dispatch({ type: 'TOGGLE_TALK', payload: false })}
          onRestEmber={handleRestEmber}
        />
      )}

      {/* Control Bar (Mode Switcher + 🔥 Reaction) */}
      <EmberControlBar
        currentMode={state.listeningMode}
        onSelectMode={handleSelectMode}
        onTriggerBurn={handleTriggerBurn}
        comboCount={state.comboCount}
      />

      {/* Main Ember Avatar Renderer */}
      <EmberRenderer
        assetCode={frameInfo.assetCode}
        altText={frameInfo.altText}
        onClick={handleEmberClick}
      />
    </div>
  );
};
