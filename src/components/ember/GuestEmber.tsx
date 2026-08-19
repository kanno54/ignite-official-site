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

  // Milestone 7.8c Diagnostic Gate Counters & Force Toggle
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  const [heartbeatCount, setHeartbeatCount] = useState(0);
  const [effectEntryCount, setEffectEntryCount] = useState(0);
  const [effectStartCount, setEffectStartCount] = useState(0);
  const [effectCleanupCount, setEffectCleanupCount] = useState(0);
  const [timerCreateCount, setTimerCreateCount] = useState(0);
  const [timerClearCount, setTimerClearCount] = useState(0);
  const [timerCallbackCount, setTimerCallbackCount] = useState(0);
  const [lastClearReason, setLastClearReason] = useState<string>('none');
  const [domSrcFilename, setDomSrcFilename] = useState('');
  const [renderMode, setRenderMode] = useState<'SRC_REPLACE' | 'FRAME_STACK'>('SRC_REPLACE');
  const [forceAnimation, setForceAnimation] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(true);

  const burnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const talkAutoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const subTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const modeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const prevPlayingRef = useRef<boolean>(false);
  const prevTrackIdRef = useRef<string | null>(null);

  const isExpanded = playerState.isExpanded;
  const isPlaying = state.playbackState === 'PLAYING';

  // Evaluate Animation Gates explicitly
  const gatePlayback = isPlaying || forceAnimation;
  const gateVisibility = state.visibility === 'VISIBLE';
  const gateReducedMotion = forceAnimation ? false : isReducedMotion;
  const gateReaction = state.temporaryReaction === 'NONE' || forceAnimation;
  const gateSpeech = state.speechState === 'NONE' || forceAnimation;

  const shouldAnimate = gatePlayback && gateVisibility && !gateReducedMotion && gateReaction && gateSpeech;

  const blockedReasons: string[] = [];
  if (!isPlaying && !forceAnimation) blockedReasons.push('NOT_PLAYING');
  if (state.visibility !== 'VISIBLE') blockedReasons.push(`VISIBILITY_${state.visibility}`);
  if (isReducedMotion && !forceAnimation) blockedReasons.push('REDUCED_MOTION');
  if (state.temporaryReaction !== 'NONE' && !forceAnimation) blockedReasons.push(`REACTION_${state.temporaryReaction}`);
  if (state.speechState !== 'NONE' && !forceAnimation) blockedReasons.push(`SPEECH_${state.speechState}`);

  // 0. Independent Heartbeat Timer (Completely decoupled from GUEST EMBER & Audio)
  useEffect(() => {
    const heartbeatInterval = window.setInterval(() => {
      setHeartbeatCount((prev) => prev + 1);
    }, 500);

    return () => {
      window.clearInterval(heartbeatInterval);
    };
  }, []);

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
    if (isPlaying || forceAnimation) {
      preloadModeAssets(state.listeningMode);
    }
  }, [isPlaying, forceAnimation, state.listeningMode]);

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

  // Helper timer wrapper for clear diagnostic logging
  const clearTimerWithReason = (
    ref: React.MutableRefObject<NodeJS.Timeout | null>,
    reason: string
  ) => {
    if (ref.current !== null) {
      clearTimeout(ref.current);
      clearInterval(ref.current);
      ref.current = null;
      setTimerClearCount((prev) => prev + 1);
      setLastClearReason(reason);
    }
  };

  // 6. Sequence & Animation Timers Engine (Milestone 7.8c Gate Isolation)
  useEffect(() => {
    // Increment Effect Entry Count BEFORE any Gate condition early returns
    setEffectEntryCount((prev) => prev + 1);

    if (!forceAnimation && isReducedMotion) {
      return;
    }

    setEffectStartCount((prev) => prev + 1);

    // Clear sub-timeout on effect start/re-run
    if (subTimeoutRef.current) {
      clearTimerWithReason(subTimeoutRef, 'effect-rerun:subTimeout');
    }
    if (modeIntervalRef.current) {
      clearTimerWithReason(modeIntervalRef, 'effect-rerun:modeInterval');
    }

    // IDLE Mode Animation Loop (Random 6-10s -> 150ms Blink)
    if (!forceAnimation && state.playbackState === 'IDLE' && state.visibility === 'VISIBLE' && state.speechState === 'NONE') {
      const scheduleBlink = () => {
        const nextDelay = 6000 + Math.random() * 4000;
        setTimerCreateCount((prev) => prev + 1);
        modeIntervalRef.current = setTimeout(() => {
          setTimerCallbackCount((prev) => prev + 1);
          setIsSpecialInsertActive(true);
          subTimeoutRef.current = setTimeout(() => {
            setIsSpecialInsertActive(false);
            scheduleBlink();
          }, 150);
        }, nextDelay);
      };
      scheduleBlink();
    }

    // PLAYING Mode Sequence Loops (Adjusted for Expanded mode & FORCE ON)
    if (shouldAnimate || forceAnimation) {
      if (state.listeningMode === 'LISTEN') {
        const frameTime = isExpanded ? 520 : 450;
        setTimerCreateCount((prev) => prev + 1);
        modeIntervalRef.current = setInterval(() => {
          setTimerCallbackCount((prev) => prev + 1);
          setSequenceFrame((prev) => (prev + 1) % 4);
        }, frameTime);
      } else if (state.listeningMode === 'DANCE') {
        const frameTime = isExpanded ? 400 : 350;
        setTimerCreateCount((prev) => prev + 1);
        modeIntervalRef.current = setInterval(() => {
          setTimerCallbackCount((prev) => prev + 1);
          setSequenceFrame((prev) => (prev + 1) % 4);
        }, frameTime);
      } else if (state.listeningMode === 'VOCAL') {
        const intervalTime = isExpanded ? 4500 : 5500;
        setTimerCreateCount((prev) => prev + 1);
        modeIntervalRef.current = setInterval(() => {
          setTimerCallbackCount((prev) => prev + 1);
          setIsSpecialInsertActive(true);
          subTimeoutRef.current = setTimeout(() => {
            setIsSpecialInsertActive(false);
          }, 900);
        }, intervalTime);
      } else if (state.listeningMode === 'CHILL') {
        const intervalTime = isExpanded ? 5500 : 7000;
        setTimerCreateCount((prev) => prev + 1);
        modeIntervalRef.current = setInterval(() => {
          setTimerCallbackCount((prev) => prev + 1);
          setIsSpecialInsertActive(true);
          subTimeoutRef.current = setTimeout(() => {
            setIsSpecialInsertActive(false);
          }, 1500);
        }, intervalTime);
      }
    }

    return () => {
      setEffectCleanupCount((prev) => prev + 1);
      clearTimerWithReason(modeIntervalRef, 'effect-cleanup');
      clearTimerWithReason(subTimeoutRef, 'effect-cleanup:sub');
    };
  }, [state.playbackState, state.listeningMode, state.visibility, state.speechState, isPlaying, isExpanded, isReducedMotion, forceAnimation, shouldAnimate]);

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
    forceAnimation ? false : isReducedMotion,
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
      {/* Diagnostic Overlay v2.6: Animation Gate Isolation */}
      {showDiagnostics && (
        <div
          style={{
            position: 'fixed',
            top: '8px',
            left: '8px',
            zIndex: 10000,
            backgroundColor: 'rgba(8, 12, 20, 0.94)',
            border: '1px solid #00FFCC',
            borderRadius: '8px',
            padding: '8px 12px',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '10px',
            color: '#00FFCC',
            boxShadow: '0 4px 16px rgba(0,0,0,0.85)',
            pointerEvents: 'auto',
            maxWidth: '320px',
            lineHeight: '1.45',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', borderBottom: '1px solid rgba(0,255,204,0.3)', paddingBottom: '4px' }}>
            <span style={{ fontWeight: 'bold', color: '#FFD700' }}>[EMBER GATE DIAGNOSTICS v2.6]</span>
            <button
              onClick={() => setShowDiagnostics(false)}
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '10px' }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>RENDER COUNT: {renderCountRef.current}</span>
            <span>HEARTBEAT: <strong style={{ color: '#00FFCC' }}>{heartbeatCount}</strong></span>
          </div>

          <div style={{ margin: '4px 0', borderTop: '1px dashed rgba(255,255,255,0.15)', paddingTop: '4px' }}>
            <div>RAW AUDIO isPlaying: <strong style={{ color: playerState.isPlaying ? '#10B981' : '#EF4444' }}>{String(playerState.isPlaying)}</strong></div>
            <div>RUNTIME state: <strong style={{ color: isPlaying ? '#10B981' : '#EAB308' }}>{state.playbackState}</strong> | Mode: {state.listeningMode}</div>
            <div>REDUCED MOTION: <strong style={{ color: isReducedMotion ? '#EF4444' : '#10B981' }}>{String(isReducedMotion)}</strong></div>
          </div>

          <div style={{ margin: '4px 0', borderTop: '1px dashed rgba(255,255,255,0.15)', paddingTop: '4px' }}>
            <div>GATE shouldAnimate: <strong style={{ color: shouldAnimate ? '#10B981' : '#EF4444' }}>{String(shouldAnimate)}</strong></div>
            <div style={{ color: blockedReasons.length > 0 ? '#EF4444' : '#10B981', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              BLOCKED BY: {blockedReasons.length > 0 ? blockedReasons.join(', ') : 'NONE'}
            </div>
          </div>

          <div style={{ margin: '4px 0', borderTop: '1px dashed rgba(255,255,255,0.15)', paddingTop: '4px' }}>
            <div>EFFECT ENTRY: {effectEntryCount} | START: {effectStartCount} | CLEANUP: {effectCleanupCount}</div>
            <div>TIMER CREATE: {timerCreateCount} | CLEAR: {timerClearCount} | TICK: <strong style={{ color: timerCallbackCount > 0 ? '#10B981' : '#EF4444' }}>{timerCallbackCount}</strong></div>
            <div style={{ fontSize: '9px', color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>LAST CLEAR: {lastClearReason}</div>
            <div>REACT FRAME: {sequenceFrame} | PROP: {frameInfo.assetCode} | DOM: {domSrcFilename || 'GE-S01.png'}</div>
          </div>

          <div style={{ marginTop: '6px', display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setForceAnimation((prev) => !prev)}
              style={{
                backgroundColor: forceAnimation ? '#EF4444' : 'rgba(255,255,255,0.1)',
                color: forceAnimation ? '#FFFFFF' : '#FFD700',
                border: '1px solid #FFD700',
                borderRadius: '4px',
                padding: '3px 8px',
                fontSize: '9px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              FORCE ANIMATION: {forceAnimation ? 'ON (BYPASS)' : 'OFF'}
            </button>
            <button
              onClick={() => setRenderMode((prev) => (prev === 'SRC_REPLACE' ? 'FRAME_STACK' : 'SRC_REPLACE'))}
              style={{
                backgroundColor: renderMode === 'FRAME_STACK' ? '#00FFCC' : 'rgba(255,255,255,0.1)',
                color: renderMode === 'FRAME_STACK' ? '#000000' : '#00FFCC',
                border: '1px solid #00FFCC',
                borderRadius: '4px',
                padding: '3px 8px',
                fontSize: '9px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              ENGINE: {renderMode}
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
        {(isPlaying || forceAnimation) && (
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
