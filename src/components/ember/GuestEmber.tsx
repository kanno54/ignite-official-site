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
  trackEmberExpandedView,
  trackEmberExpandedModeChange,
  trackEmberExpandedBurn,
  trackEmberControlBarShow,
  trackEmberControlBarHide,
  trackEmberReduceMotion,
} from './emberAnalytics';
import './guestEmber.css';

const CONCIERGE_MESSAGES = [
  'IGNITEへようこそ！楽曲再生中に下部のModeボタンで雰囲気を変えられるよ🔥',
  'プレイヤーを拡大すると、大画面でListening Companionとして一緒に過ごせるよ。',
  '『RISE AGAIN』6th Singleが好評公開中！Discographyから楽曲解説をチェックしよう。',
  '🔥ボタンを連打すると熱いリアクションが送れるよ！',
];

export const GuestEmber: React.FC = () => {
  if (!isFeatureEnabled('GUEST_EMBER')) {
    return null;
  }

  const { playerState } = useAudio();
  const [state, dispatch] = useReducer(emberReducer, initialEmberState);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Animation Timers & Frames State
  const [sequenceFrame, setSequenceFrame] = useState(0);
  const [isSpecialInsertActive, setIsSpecialInsertActive] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [conciergeIdx, setConciergeIdx] = useState(0);

  const burnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const talkAutoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const subTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevPlayingRef = useRef<boolean>(false);

  const isExpanded = playerState.isExpanded;
  const isPlaying = state.playbackState === 'PLAYING';

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

  // 2. Track Expanded View Analytics
  useEffect(() => {
    if (isExpanded) {
      trackEmberExpandedView();
    }
  }, [isExpanded]);

  // 3. Connect Audio Player State via Adapter
  useEffect(() => {
    if (!playerState.currentTrackId) {
      dispatch({ type: 'SET_PLAYBACK_STATE', payload: 'IDLE' });
    } else if (playerState.isPlaying) {
      dispatch({ type: 'SET_PLAYBACK_STATE', payload: 'PLAYING' });
    } else {
      dispatch({ type: 'SET_PLAYBACK_STATE', payload: 'PAUSED' });
    }
    // Reset sequence frame when playback state changes
    setSequenceFrame(0);
    setIsSpecialInsertActive(false);
  }, [playerState.currentTrackId, playerState.isPlaying]);

  // 4. Control Bar Visibility Analytics
  useEffect(() => {
    if (isPlaying && !prevPlayingRef.current) {
      trackEmberControlBarShow();
    } else if (!isPlaying && prevPlayingRef.current) {
      trackEmberControlBarHide();
    }
    prevPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Preload Mode & Burn Assets when mode changes or player starts
  useEffect(() => {
    if (isPlaying) {
      preloadModeAssets(state.listeningMode);
    }
  }, [isPlaying, state.listeningMode]);

  // 5. Scroll Behavior (Opacity Dimming during Scroll in Normal mode)
  useEffect(() => {
    if (isExpanded) return; // Do not dim in Expanded Mode

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
  }, [isExpanded]);

  // 6. Sequence & Animation Timers Engine
  useEffect(() => {
    if (isReducedMotion) return;

    let intervalId: NodeJS.Timeout | null = null;
    let insertTimeoutId: NodeJS.Timeout | null = null;

    // Clear sub-timeout on effect start/re-run
    if (subTimeoutRef.current) {
      clearTimeout(subTimeoutRef.current);
      subTimeoutRef.current = null;
    }

    // IDLE Mode Animation Loop (Random 6-10s -> 150ms Blink)
    if (state.playbackState === 'IDLE' && state.visibility === 'VISIBLE' && state.speechState === 'NONE') {
      const scheduleBlink = () => {
        const nextDelay = 6000 + Math.random() * 4000;
        insertTimeoutId = setTimeout(() => {
          setIsSpecialInsertActive(true);
          subTimeoutRef.current = setTimeout(() => {
            setIsSpecialInsertActive(false);
            scheduleBlink();
          }, 150);
        }, nextDelay);
      };
      scheduleBlink();
    }

    // PLAYING Mode Sequence Loops (Adjusted for Expanded mode)
    if (isPlaying && state.visibility === 'VISIBLE') {
      if (state.listeningMode === 'LISTEN') {
        const frameTime = isExpanded ? 520 : 450;
        intervalId = setInterval(() => {
          setSequenceFrame((prev) => (prev + 1) % 4);
        }, frameTime);
      } else if (state.listeningMode === 'DANCE') {
        const frameTime = isExpanded ? 400 : 350;
        intervalId = setInterval(() => {
          setSequenceFrame((prev) => (prev + 1) % 4);
        }, frameTime);
      } else if (state.listeningMode === 'VOCAL') {
        const intervalTime = isExpanded ? 4500 : 5500;
        intervalId = setInterval(() => {
          setIsSpecialInsertActive(true);
          subTimeoutRef.current = setTimeout(() => {
            setIsSpecialInsertActive(false);
          }, 900);
        }, intervalTime);
      } else if (state.listeningMode === 'CHILL') {
        const intervalTime = isExpanded ? 5500 : 7000;
        intervalId = setInterval(() => {
          setIsSpecialInsertActive(true);
          subTimeoutRef.current = setTimeout(() => {
            setIsSpecialInsertActive(false);
          }, 1500);
        }, intervalTime);
      }
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (insertTimeoutId) clearTimeout(insertTimeoutId);
      if (subTimeoutRef.current) clearTimeout(subTimeoutRef.current);
    };
  }, [state.playbackState, state.listeningMode, state.visibility, state.speechState, isPlaying, isExpanded, isReducedMotion]);

  // 7. Handlers
  const handleSelectMode = (mode: typeof state.listeningMode) => {
    dispatch({ type: 'SET_LISTENING_MODE', payload: mode });
    setSequenceFrame(0);
    setIsSpecialInsertActive(false);
    preloadModeAssets(mode);
    if (isExpanded) {
      trackEmberExpandedModeChange(mode);
    } else {
      trackEmberModeChange(mode);
    }
  };

  const handleTriggerBurn = () => {
    preloadBurnAssets();
    dispatch({ type: 'TRIGGER_BURN' });

    const newCombo = state.comboCount >= 3 ? 3 : state.comboCount + 1;
    if (isExpanded) {
      trackEmberExpandedBurn(newCombo);
    } else {
      trackEmberBurn(newCombo);
    }

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
    isSpecialInsertActive,
    isExpanded
  );

  // Hidden state: return null
  if (state.visibility === 'HIDDEN') {
    return null;
  }

  // RESTING state: Render small PEEK call button
  if (state.visibility === 'RESTING') {
    return (
      <div className="guest-ember-dock" style={{ opacity: scrollOpacity }}>
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
      className={`guest-ember-dock ${isExpanded ? 'is-expanded' : ''}`}
      style={{
        opacity: isExpanded ? 1 : scrollOpacity,
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

      {/* Main Ember Avatar Renderer (Top) */}
      <EmberRenderer
        assetCode={frameInfo.assetCode}
        altText={frameInfo.altText}
        onClick={handleEmberClick}
      />

      {/* Control Bar (Mode Switcher + 🔥 Reaction) directly BELOW Ember - Only shown when PLAYING */}
      {isPlaying && (
        <EmberControlBar
          currentMode={state.listeningMode}
          onSelectMode={handleSelectMode}
          onTriggerBurn={handleTriggerBurn}
          comboCount={state.comboCount}
        />
      )}
    </div>
  );
};
