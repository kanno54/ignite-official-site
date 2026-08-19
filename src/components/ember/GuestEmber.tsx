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

  // Diagnostic Counters for Pipeline Isolation Test (Staging Only)
  const [timerTick, setTimerTick] = useState(0);
  const [domSrcFilename, setDomSrcFilename] = useState('');
  const [renderMode, setRenderMode] = useState<'SRC_REPLACE' | 'FRAME_STACK'>('SRC_REPLACE');
  const [showDiagnostics, setShowDiagnostics] = useState(true);

  const burnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const talkAutoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const subTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevPlayingRef = useRef<boolean>(false);
  const prevTrackIdRef = useRef<string | null>(null);

  const isExpanded = playerState.isExpanded;
  const isPlaying = state.playbackState === 'PLAYING';

  // 1. Initial Preload & iOS Safari Compatible Reduced Motion Detection
  useEffect(() => {
    preloadInitialEmberAssets();
    trackEmberView();

    if (typeof window !== 'undefined' && window.matchMedia) {
      try {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setIsReducedMotion(mediaQuery.matches);
        if (mediaQuery.matches) {
          trackEmberReduceMotion();
        }

        const handleMotionChange = (e: MediaQueryListEvent | MediaQueryList) => {
          setIsReducedMotion(e.matches);
          if (e.matches) trackEmberReduceMotion();
        };

        if (mediaQuery.addEventListener) {
          mediaQuery.addEventListener('change', handleMotionChange);
          return () => mediaQuery.removeEventListener('change', handleMotionChange);
        } else if ((mediaQuery as any).addListener) {
          (mediaQuery as any).addListener(handleMotionChange);
          return () => (mediaQuery as any).removeListener(handleMotionChange);
        }
      } catch (err) {
        // Fallback safely on older WebKit engines without crashing execution
      }
    }
  }, []);

  // 2. Track Expanded View Analytics
  useEffect(() => {
    if (isExpanded) {
      trackEmberExpandedView();
    }
  }, [isExpanded]);

  // 3. Connect Audio Player State via Adapter (iOS WebKit Buffer Safe)
  useEffect(() => {
    const trackChanged = prevTrackIdRef.current !== playerState.currentTrackId;
    prevTrackIdRef.current = playerState.currentTrackId;

    if (!playerState.currentTrackId) {
      dispatch({ type: 'SET_PLAYBACK_STATE', payload: 'IDLE' });
      setSequenceFrame(0);
      setIsSpecialInsertActive(false);
    } else if (playerState.isPlaying) {
      dispatch({ type: 'SET_PLAYBACK_STATE', payload: 'PLAYING' });
      // Only reset frame sequence when switching to a NEW track
      if (trackChanged) {
        setSequenceFrame(0);
        setIsSpecialInsertActive(false);
      }
    } else {
      dispatch({ type: 'SET_PLAYBACK_STATE', payload: 'PAUSED' });
    }
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

  // 6. Sequence & Animation Timers Engine (5 Layer Diagnostic Pipeline Tracker)
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
          setTimerTick((prev) => prev + 1);
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
          setTimerTick((prev) => prev + 1); // Layer 1: Timer Tick
          setSequenceFrame((prev) => (prev + 1) % 4); // Layer 2: State Update
        }, frameTime);
      } else if (state.listeningMode === 'DANCE') {
        const frameTime = isExpanded ? 400 : 350;
        intervalId = setInterval(() => {
          setTimerTick((prev) => prev + 1); // Layer 1: Timer Tick
          setSequenceFrame((prev) => (prev + 1) % 4); // Layer 2: State Update
        }, frameTime);
      } else if (state.listeningMode === 'VOCAL') {
        const intervalTime = isExpanded ? 4500 : 5500;
        intervalId = setInterval(() => {
          setTimerTick((prev) => prev + 1);
          setIsSpecialInsertActive(true);
          subTimeoutRef.current = setTimeout(() => {
            setIsSpecialInsertActive(false);
          }, 900);
        }, intervalTime);
      } else if (state.listeningMode === 'CHILL') {
        const intervalTime = isExpanded ? 5500 : 7000;
        intervalId = setInterval(() => {
          setTimerTick((prev) => prev + 1);
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
      setSequenceFrame((prev) => (prev + 1) % 4);
      setIsSpecialInsertActive(false);
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

  // Calculate current frame info (Layer 3: Renderer Props)
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
    <>
      {/* Staging Diagnostic Overlay for 5-Layer Pipeline Isolation Testing */}
      {showDiagnostics && (
        <div
          style={{
            position: 'fixed',
            top: '8px',
            left: '8px',
            zIndex: 10000,
            backgroundColor: 'rgba(8, 12, 20, 0.92)',
            border: '1px solid #00FFCC',
            borderRadius: '8px',
            padding: '8px 12px',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '10px',
            color: '#00FFCC',
            boxShadow: '0 4px 16px rgba(0,0,0,0.8)',
            pointerEvents: 'auto',
            maxWidth: '300px',
            lineHeight: '1.4',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', borderBottom: '1px solid rgba(0,255,204,0.3)', paddingBottom: '4px' }}>
            <span style={{ fontWeight: 'bold', color: '#FFD700' }}>[EMBER DIAGNOSTICS v2.4]</span>
            <button
              onClick={() => setShowDiagnostics(false)}
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '10px' }}
            >
              ✕
            </button>
          </div>
          <div>L1 TIMER TICK: <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>{timerTick}</span></div>
          <div>L2 FRAME STATE: <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>{sequenceFrame}</span></div>
          <div>L3 RENDER PROP: <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>{frameInfo.assetCode}</span></div>
          <div>L4 DOM IMG SRC: <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>{domSrcFilename || 'GE-S01.png'}</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0' }}>
            <span>L5 VISUAL TEST:</span>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '18px',
                borderRadius: '4px',
                backgroundColor: sequenceFrame % 2 === 0 ? '#EF4444' : '#3B82F6',
                color: '#FFFFFF',
                fontWeight: 'bold',
              }}
            >
              [ {(sequenceFrame % 4) + 1} ]
            </div>
          </div>
          <div>PLAYBACK: {state.playbackState} | MODE: {state.listeningMode}</div>
          <div>MODE ENGINE: <span style={{ color: '#F97316' }}>{renderMode}</span></div>
          <div style={{ marginTop: '6px', display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setRenderMode((prev) => (prev === 'SRC_REPLACE' ? 'FRAME_STACK' : 'SRC_REPLACE'))}
              style={{
                backgroundColor: renderMode === 'FRAME_STACK' ? '#00FFCC' : 'rgba(255,255,255,0.1)',
                color: renderMode === 'FRAME_STACK' ? '#000000' : '#00FFCC',
                border: '1px solid #00FFCC',
                borderRadius: '4px',
                padding: '2px 6px',
                fontSize: '9px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              TOGGLE FRAME STACK ({renderMode})
            </button>
          </div>
        </div>
      )}

      {/* Main Dock Unit */}
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
          onDomSrcChange={setDomSrcFilename}
          renderMode={renderMode}
          currentListeningMode={state.listeningMode}
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
    </>
  );
};
