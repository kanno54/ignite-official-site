import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { PlayerState, AudioContextType } from '../../types/audio';
import { getRecordingById, getRecordingsForRelease, getJukeboxRecordings, getReleases, getAssetManifest } from '../../utils/contentLoader';
import { trackTrackPlay, trackJukeboxPlay, trackTrackComplete } from '../../utils/analytics';

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playerState, setPlayerState] = useState<PlayerState>(() => {
    let savedVolume: string | null = null;
    try { savedVolume = localStorage.getItem('ignite_player_volume'); } catch { /* Private storage may be unavailable. */ }
    const parsedVolume = savedVolume === null ? 0.8 : Number(savedVolume);
    return {
      currentTrackId: null,
      currentRecording: null,
      queue: [],
      queueIndex: 0,
      queueContext: null,
      isPlaying: false,
      isLoading: false,
      currentTime: 0,
      duration: 0,
      volume: Number.isFinite(parsedVolume) ? Math.min(1, Math.max(0, parsedVolume)) : 0.8,
      muted: false,
      isExpanded: false,
      error: null,
    };
  });

  const stateRef = useRef(playerState);
  stateRef.current = playerState;
  const requestRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const clearPending = () => { clearTimeout(timeoutRef.current); };
  const playbackError = (message: string) => {
    console.warn("Audio playback interrupted", {message,src:audioRef.current?.currentSrc,mediaError:audioRef.current?.error?.code,networkState:audioRef.current?.networkState,readyState:audioRef.current?.readyState});
    clearPending();
    setPlayerState(prev => ({...prev, isPlaying:false, isLoading:false, error:message}));
  };
  const attemptPlay = (audio: HTMLAudioElement) => {
    const request = ++requestRef.current;
    clearPending();
    setPlayerState(prev=>({...prev,isLoading:true,error:null}));
    timeoutRef.current=setTimeout(()=>{
      if(request!==requestRef.current) return;
      ++requestRef.current; audio.pause();
      playbackError('通信がタイムアウトしました。再生ボタンで再試行できます。');
    },20000);
    audio.play().then(()=>{
      if(request!==requestRef.current) return;
      clearPending(); setPlayerState(prev=>({...prev,isPlaying:true,isLoading:false,error:null}));
    }).catch(error=>{
      if(request!==requestRef.current) return;
      playbackError(error.name==='NotAllowedError' ? '再生ボタンを押して音声を開始してください。' : '通信または音声の読み込みに失敗しました。再生ボタンで再試行できます。');
    });
  };

  // Initialize single shared HTMLAudioElement with strict event handling
  useEffect(() => {
    const audio = audioRef.current!;
    audio.preload = 'metadata';
    audio.volume = playerState.volume;


    const handleTimeUpdate = () => {
      setPlayerState((prev) => ({
        ...prev,
        currentTime: audio.currentTime || 0,
        duration: audio.duration || prev.duration,
      }));
    };

    const handleEnded = () => {
      const prev=stateRef.current;
      if(prev.currentRecording) trackTrackComplete({track_id:prev.currentRecording.id,release_id:prev.currentRecording.releaseId,track_position:prev.queueIndex+1,track_version:prev.currentRecording.versionLabel,source:prev.queueContext||'manual'});
      const next=prev.queueIndex+1;
      if(next<prev.queue.length) playTrack(prev.queue[next],prev.queue,prev.queueContext);
      else if(prev.queueContext==='jukebox') {
        const queue=getJukeboxRecordings().map(r=>r.id).filter(id=>id!==prev.currentTrackId).sort(()=>Math.random()-.5);
        if(queue.length) playTrack(queue[0],queue,'jukebox'); else stopTrack();
      } else stopTrack();
    };

    const handleError = () => {
      ++requestRef.current;
      audio.dataset.mediaError = String(audio.error?.code || 0);
      playbackError('音源を読み込めませんでした。再生ボタンで再試行できます。');
    };
    const handleWaiting = () => {
      if(!audio.paused) {
        setPlayerState(prev=>({...prev,isLoading:true}));
        clearPending();
        timeoutRef.current=setTimeout(()=>{++requestRef.current;audio.pause();playbackError('通信が途切れました。再生ボタンで再試行できます。');},20000);
      }
    };
    const handlePlaying = () => {clearPending();setPlayerState(prev=>({...prev,isPlaying:true,isLoading:false,error:null}));};

    const handlePlay = () => {
      setPlayerState((prev) => {
        if (!prev.isPlaying && prev.currentRecording) {
          const rec = prev.currentRecording;
          const isJukebox = prev.queueContext === 'jukebox';
          if (isJukebox) {
            trackJukeboxPlay({
              track_id: rec.id,
              release_id: rec.releaseId,
              track_version: rec.versionLabel,
              source: 'jukebox',
            });
          } else {
            trackTrackPlay({
              track_id: rec.id,
              release_id: rec.releaseId,
              track_position: prev.queueIndex + 1,
              track_version: rec.versionLabel,
              source: prev.queueContext || 'manual',
            });
          }
        }
        return prev.isPlaying ? prev : { ...prev, isPlaying: true };
      });
    };

    const handlePause = () => {
      setPlayerState((prev) => (prev.isPlaying ? { ...prev, isPlaying: false } : prev));
    };

    audio.addEventListener('waiting',handleWaiting);
    audio.addEventListener('playing',handlePlaying);
    audio.addEventListener('loadedmetadata',handleTimeUpdate);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      ++requestRef.current; clearPending();
      audio.removeEventListener('waiting',handleWaiting);
      audio.removeEventListener('playing',handlePlaying);
      audio.removeEventListener('loadedmetadata',handleTimeUpdate);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.pause();
    };
  }, []);

  // Update Media Session API metadata & action handlers with JPG lockscreen artwork
  useEffect(() => {
    if (typeof window === 'undefined' || !('mediaSession' in navigator) || typeof window.MediaMetadata === 'undefined') return;

    if (!playerState.currentRecording) {
      try {
        navigator.mediaSession.metadata = null;
      } catch (e) {
        // Ignore
      }
      return;
    }

    const rec = playerState.currentRecording;
    const release = getReleases().find((r) => r.id === rec.releaseId);
    const albumTitle = release ? release.title : 'IGNITE Official Site';

    const manifest = getAssetManifest();
    let relativeImagePath = '/assets/images/covers/cover-no-limits.jpg';

    if (rec.posterAssetId && manifest.images[rec.posterAssetId as keyof typeof manifest.images]) {
      relativeImagePath = manifest.images[rec.posterAssetId as keyof typeof manifest.images].path;
    } else if (release?.coverAssetId && manifest.images[release.coverAssetId as keyof typeof manifest.images]) {
      relativeImagePath = manifest.images[release.coverAssetId as keyof typeof manifest.images].path;
    }

    const origin = window.location.origin;
    const jpgImagePath = relativeImagePath;
    const fullJpgUrl = jpgImagePath.startsWith('http') ? jpgImagePath : `${origin}${jpgImagePath}`;
    const fullWebpUrl = relativeImagePath.startsWith('http') ? relativeImagePath : `${origin}${relativeImagePath}`;

    try {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: `${rec.title} (${rec.versionLabel})`,
        artist: 'IGNITE',
        album: albumTitle,
        artwork: [
          { src: fullJpgUrl, sizes: '512x512', type: 'image/jpeg' },
          { src: fullJpgUrl, sizes: '300x300', type: 'image/jpeg' },
          { src: fullJpgUrl, sizes: '192x192', type: 'image/jpeg' },
          { src: fullWebpUrl, sizes: '512x512', type: 'image/webp' },
        ],
      });
    } catch (e) {
      console.warn('Failed to construct MediaMetadata:', e);
    }

    const actionHandlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ['play', () => resume()],
      ['pause', () => pause()],
      ['nexttrack', () => nextTrack()],
      ['previoustrack', () => previousTrack()],
      [
        'seekto',
        (details) => {
          if (details.seekTime !== undefined) {
            seek(details.seekTime);
          }
        },
      ],
    ];

    for (const [action, handler] of actionHandlers) {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch (e) {
        // Ignore unsupported action types
      }
    }
  }, [playerState.currentRecording]);

  // Update Media Session playbackState & positionState
  useEffect(() => {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

    try {
      navigator.mediaSession.playbackState = playerState.isPlaying ? 'playing' : 'paused';
    } catch (e) {
      // Ignore
    }

    if ('setPositionState' in navigator.mediaSession && audioRef.current && playerState.duration > 0) {
      try {
        navigator.mediaSession.setPositionState({
          duration: playerState.duration,
          playbackRate: audioRef.current.playbackRate || 1,
          position: playerState.currentTime,
        });
      } catch (e) {
        // Ignore
      }
    }
  }, [playerState.isPlaying, playerState.currentTime, playerState.duration]);

  const playTrack = (recordingId: string, customQueue?: string[], context: PlayerState['queueContext'] = 'manual') => {
    const recording = getRecordingById(recordingId);
    if (!recording) return;

    if (recording.audioStatus !== 'ready') {
      setPlayerState((prev) => ({
        ...prev,
        error: `「${recording.title}」は準備中のため再生できません。`,
      }));
      return;
    }

    const queue = customQueue && customQueue.length > 0 ? customQueue : [recordingId];
    const queueIndex = Math.max(0, queue.indexOf(recordingId));

    const audio=audioRef.current;
    if (!audio || !recording.audioUrl) return;
    ++requestRef.current; clearPending(); audio.pause();
    setPlayerState(prev=>({...prev,currentTrackId:recordingId,currentRecording:recording,queue,queueIndex,queueContext:context,isPlaying:false,isLoading:true,currentTime:0,duration:recording.durationSeconds,error:null}));
    audio.dataset.recordingId=recordingId; delete audio.dataset.mediaError;
    audio.src=recording.audioUrl;
    audio.load();
    attemptPlay(audio);
  };

  const playRelease = (releaseId: string) => {
    const recordings = getRecordingsForRelease(releaseId).filter((r) => r.audioStatus === 'ready');
    if (recordings.length === 0) return;
    const queue = recordings.map((r) => r.id);
    playTrack(queue[0], queue, 'release');
  };

  const togglePlay = () => {
    if (stateRef.current.isPlaying || stateRef.current.isLoading) pause();
    else resume();
  };
  const pause = () => {
    ++requestRef.current; clearPending();
    audioRef.current?.pause();
    setPlayerState(prev=>({...prev,isPlaying:false,isLoading:false}));
  };

  const stopTrack = () => {
    ++requestRef.current; clearPending();
    if (audioRef.current) {
      const audio = audioRef.current;
      audio.pause();
      audio.currentTime = 0;
      audio.removeAttribute('src');
      audio.load();
    }

    if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
      try {
        navigator.mediaSession.metadata = null;
        navigator.mediaSession.playbackState = 'none';
      } catch (e) {
        // Ignore
      }
    }

    setPlayerState((prev) => ({
      ...prev,
      currentTrackId: null,
      currentRecording: null,
      isPlaying: false,
      isLoading: false,
      currentTime: 0,
      duration: 0,
      isExpanded: false,
      error: null,
    }));
  };

  const resume = () => {
    const audio=audioRef.current, current=stateRef.current;
    if (!audio || !current.currentRecording) return;
    if (audio.error || current.error) {
      audio.src=current.currentRecording.audioUrl; audio.load();
    } else if(audio.ended) audio.currentTime=0;
    attemptPlay(audio);
  };

  const nextTrack = () => {
    let nextIndex = playerState.queueIndex + 1;
    let nextQueue = playerState.queue;

    if (playerState.queueContext === 'jukebox' && nextIndex >= playerState.queue.length) {
      const allReady = getJukeboxRecordings()
        .filter((r) => r.audioStatus === 'ready')
        .map((r) => r.id);

      if (allReady.length > 0) {
        let shuffled = [...allReady].sort(() => Math.random() - 0.5);
        const lastTrackId = playerState.currentTrackId;
        if (lastTrackId && shuffled.length > 1 && shuffled[0] === lastTrackId) {
          const swapIdx = 1 + Math.floor(Math.random() * (shuffled.length - 1));
          [shuffled[0], shuffled[swapIdx]] = [shuffled[swapIdx], shuffled[0]];
        }
        nextQueue = shuffled;
        nextIndex = 0;
      }
    }

    if (nextIndex < nextQueue.length) {
      const nextId = nextQueue[nextIndex];
      playTrack(nextId, nextQueue, playerState.queueContext);
    }
  };

  const previousTrack = () => {
    if (playerState.queueIndex > 0) {
      const prevId = playerState.queue[playerState.queueIndex - 1];
      playTrack(prevId, playerState.queue, playerState.queueContext);
    }
  };

  const seek = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setPlayerState((prev) => ({ ...prev, currentTime: seconds }));
    }
  };

  const setVolume = (volume: number) => {
    const clamped = Math.max(0, Math.min(1, volume));
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
    if(audioRef.current) audioRef.current.muted=clamped===0;
    try { localStorage.setItem('ignite_player_volume', clamped.toString()); } catch { /* Playback works without storage. */ }
    setPlayerState((prev) => ({ ...prev, volume: clamped, muted: clamped === 0 }));
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !playerState.muted;
      audioRef.current.muted = newMuted;
      setPlayerState((prev) => ({ ...prev, muted: newMuted }));
    }
  };

  const toggleExpand = () => {
    setPlayerState((prev) => ({ ...prev, isExpanded: !prev.isExpanded }));
  };

  const setIsExpanded = (expanded: boolean) => {
    setPlayerState((prev) => ({ ...prev, isExpanded: expanded }));
  };

  return (
    <AudioContext.Provider
      value={{
        playerState,
        playTrack,
        playRelease,
        togglePlay,
        pause,
        resume,
        stopTrack,
        nextTrack,
        previousTrack,
        seek,
        setVolume,
        toggleMute,
        toggleExpand,
        setIsExpanded,
      }}
    >
      <audio ref={audioRef} preload="metadata" aria-hidden="true" style={{display:'none'}} />
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
