import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { PlayerState, AudioContextType } from '../../types/audio';
import { getRecordingById, getRecordingsForRelease, getRecordings, getReleases, getAssetManifest } from '../../utils/contentLoader';

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playerState, setPlayerState] = useState<PlayerState>(() => {
    const savedVolume = localStorage.getItem('ignite_player_volume');
    return {
      currentTrackId: null,
      currentRecording: null,
      queue: [],
      queueIndex: 0,
      queueContext: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: savedVolume ? parseFloat(savedVolume) : 0.8,
      muted: false,
      isExpanded: false,
      error: null,
    };
  });

  // Initialize single shared HTMLAudioElement
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = playerState.volume;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setPlayerState((prev) => ({
        ...prev,
        currentTime: audio.currentTime || 0,
        duration: audio.duration || prev.duration,
      }));
    };

    const handleEnded = () => {
      setPlayerState((prev) => {
        let nextIndex = prev.queueIndex + 1;
        let nextQueue = prev.queue;

        // Shuffle Bag auto-advance for jukebox mode
        if (prev.queueContext === 'jukebox' && nextIndex >= prev.queue.length) {
          const allReady = getRecordings()
            .filter((r) => r.audioStatus === 'ready')
            .map((r) => r.id);

          if (allReady.length > 0) {
            let shuffled = [...allReady].sort(() => Math.random() - 0.5);
            const lastTrackId = prev.currentTrackId;
            if (lastTrackId && shuffled.length > 1 && shuffled[0] === lastTrackId) {
              const swapIdx = 1 + Math.floor(Math.random() * (shuffled.length - 1));
              [shuffled[0], shuffled[swapIdx]] = [shuffled[swapIdx], shuffled[0]];
            }
            nextQueue = shuffled;
            nextIndex = 0;
          }
        }

        if (nextIndex < nextQueue.length) {
          const nextTrackId = nextQueue[nextIndex];
          const nextRecording = getRecordingById(nextTrackId);

          if (nextRecording && nextRecording.audioStatus === 'ready' && audioRef.current) {
            audioRef.current.src = nextRecording.audioUrl;
            audioRef.current.play().catch(() => {});
            return {
              ...prev,
              currentTrackId: nextTrackId,
              currentRecording: nextRecording,
              queue: nextQueue,
              queueIndex: nextIndex,
              isPlaying: true,
              error: null,
            };
          }
        }
        return { ...prev, isPlaying: false };
      });
    };

    const handleError = () => {
      setPlayerState((prev) => ({
        ...prev,
        isPlaying: false,
        error: 'この音源は現在再生できません。',
      }));
    };

    const handlePlay = () => {
      setPlayerState((prev) => ({ ...prev, isPlaying: true }));
    };

    const handlePause = () => {
      setPlayerState((prev) => ({ ...prev, isPlaying: false }));
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.pause();
    };
  }, []);

  // Update Media Session API metadata & action handlers
  useEffect(() => {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

    if (!playerState.currentRecording) {
      navigator.mediaSession.metadata = null;
      return;
    }

    const rec = playerState.currentRecording;
    const release = getReleases().find((r) => r.id === rec.releaseId);
    const albumTitle = release ? release.title : 'IGNITE Official Site';

    const manifest = getAssetManifest();
    let relativeImagePath = '/assets/images/hero-no-limits-desktop.webp';

    if (rec.posterAssetId && manifest.images[rec.posterAssetId as keyof typeof manifest.images]) {
      relativeImagePath = manifest.images[rec.posterAssetId as keyof typeof manifest.images].path;
    } else if (release?.coverAssetId && manifest.images[release.coverAssetId as keyof typeof manifest.images]) {
      relativeImagePath = manifest.images[release.coverAssetId as keyof typeof manifest.images].path;
    }

    const origin = window.location.origin;
    const absoluteImageUrl = relativeImagePath.startsWith('http')
      ? relativeImagePath
      : `${origin}${relativeImagePath}`;

    const mimeType = absoluteImageUrl.endsWith('.png') ? 'image/png' : 'image/webp';

    navigator.mediaSession.metadata = new MediaMetadata({
      title: `${rec.title} (${rec.versionLabel})`,
      artist: 'IGNITE',
      album: albumTitle,
      artwork: [
        { src: absoluteImageUrl, sizes: '512x512', type: mimeType },
        { src: absoluteImageUrl, sizes: '300x300', type: mimeType },
        { src: absoluteImageUrl, sizes: '192x192', type: mimeType },
        { src: absoluteImageUrl, sizes: '96x96', type: mimeType },
      ],
    });

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

    if (audioRef.current) {
      audioRef.current.src = recording.audioUrl;
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => {
        setPlayerState((prev) => ({
          ...prev,
          currentTrackId: recordingId,
          currentRecording: recording,
          queue,
          queueIndex,
          queueContext: context,
          isPlaying: true,
          error: null,
        }));
      }).catch(() => {
        setPlayerState((prev) => ({
          ...prev,
          currentTrackId: recordingId,
          currentRecording: recording,
          isPlaying: false,
          error: '音声の再生に失敗しました。',
        }));
      });
    }
  };

  const playRelease = (releaseId: string) => {
    const recordings = getRecordingsForRelease(releaseId).filter((r) => r.audioStatus === 'ready');
    if (recordings.length === 0) return;
    const queue = recordings.map((r) => r.id);
    playTrack(queue[0], queue, 'release');
  };

  const togglePlay = () => {
    if (!audioRef.current || !playerState.currentRecording) return;
    const audio = audioRef.current;

    if (playerState.isPlaying && !audio.paused) {
      audio.pause();
      setPlayerState((prev) => ({ ...prev, isPlaying: false }));
    } else {
      if (audio.ended || (audio.duration > 0 && audio.currentTime >= audio.duration)) {
        audio.currentTime = 0;
      }
      audio
        .play()
        .then(() => {
          setPlayerState((prev) => ({ ...prev, isPlaying: true }));
        })
        .catch(() => {
          setPlayerState((prev) => ({ ...prev, isPlaying: false }));
        });
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayerState((prev) => ({ ...prev, isPlaying: false }));
    }
  };

  const resume = () => {
    if (!audioRef.current || !playerState.currentRecording) return;
    const audio = audioRef.current;
    if (audio.ended || (audio.duration > 0 && audio.currentTime >= audio.duration)) {
      audio.currentTime = 0;
    }
    audio
      .play()
      .then(() => {
        setPlayerState((prev) => ({ ...prev, isPlaying: true }));
      })
      .catch(() => {
        setPlayerState((prev) => ({ ...prev, isPlaying: false }));
      });
  };

  const nextTrack = () => {
    let nextIndex = playerState.queueIndex + 1;
    let nextQueue = playerState.queue;

    if (playerState.queueContext === 'jukebox' && nextIndex >= playerState.queue.length) {
      const allReady = getRecordings()
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
    localStorage.setItem('ignite_player_volume', clamped.toString());
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
        nextTrack,
        previousTrack,
        seek,
        setVolume,
        toggleMute,
        toggleExpand,
        setIsExpanded,
      }}
    >
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
