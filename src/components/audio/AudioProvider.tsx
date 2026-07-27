import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { PlayerState, AudioContextType } from '../../types/audio';
import { getRecordingById, getRecordingsForRelease } from '../../utils/contentLoader';

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
        if (prev.queueIndex < prev.queue.length - 1) {
          const nextIndex = prev.queueIndex + 1;
          const nextTrackId = prev.queue[nextIndex];
          const nextRecording = getRecordingById(nextTrackId);

          if (nextRecording && nextRecording.audioStatus === 'ready' && audioRef.current) {
            audioRef.current.src = nextRecording.audioUrl;
            audioRef.current.play().catch(() => {});
            return {
              ...prev,
              currentTrackId: nextTrackId,
              currentRecording: nextRecording,
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

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, []);

  // Update Media Session API
  useEffect(() => {
    if ('mediaSession' in navigator && playerState.currentRecording) {
      const rec = playerState.currentRecording;
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `${rec.title} (${rec.versionLabel})`,
        artist: 'IGNITE',
        album: 'IGNITE Official Portal',
      });

      navigator.mediaSession.setActionHandler('play', () => resume());
      navigator.mediaSession.setActionHandler('pause', () => pause());
      navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
      navigator.mediaSession.setActionHandler('previoustrack', () => previousTrack());
    }
  }, [playerState.currentRecording]);

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
    if (playerState.isPlaying) {
      audioRef.current.pause();
      setPlayerState((prev) => ({ ...prev, isPlaying: false }));
    } else {
      audioRef.current.play().then(() => {
        setPlayerState((prev) => ({ ...prev, isPlaying: true }));
      }).catch(() => {});
    }
  };

  const pause = () => {
    if (audioRef.current && playerState.isPlaying) {
      audioRef.current.pause();
      setPlayerState((prev) => ({ ...prev, isPlaying: false }));
    }
  };

  const resume = () => {
    if (audioRef.current && !playerState.isPlaying && playerState.currentRecording) {
      audioRef.current.play().then(() => {
        setPlayerState((prev) => ({ ...prev, isPlaying: true }));
      }).catch(() => {});
    }
  };

  const nextTrack = () => {
    if (playerState.queueIndex < playerState.queue.length - 1) {
      const nextId = playerState.queue[playerState.queueIndex + 1];
      playTrack(nextId, playerState.queue, playerState.queueContext);
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
