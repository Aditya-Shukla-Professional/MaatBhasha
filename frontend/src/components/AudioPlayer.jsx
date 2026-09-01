// AudioPlayer.jsx — Audio player with waveform visualization, scrubbable progress bar & keyboard navigation

import { useState, useRef, useEffect } from 'react';
import WaveformViz from './WaveformViz';

/**
 * Props:
 *   src: string       — audio data URI (data:audio/wav;base64,...)
 *   fallback: boolean — whether Odia fallback was used
 *   usedLang: string  — actual language code used for TTS
 *   disabled: boolean
 */
export default function AudioPlayer({ src, fallback, usedLang, disabled }) {
  const [playing, setPlaying]   = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current,  setCurrent]  = useState(0);
  const audioRef = useRef(null);
  const trackRef = useRef(null);

  // Reset when src changes
  useEffect(() => {
    setPlaying(false);
    setProgress(0);
    setCurrent(0);
    setDuration(0);
  }, [src]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => setPlaying(false));
      setPlaying(true);
    }
  }

  function onTimeUpdate() {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrent(audio.currentTime);
    setProgress((audio.currentTime / (audio.duration || 1)) * 100);
  }

  function onEnded() {
    setPlaying(false);
    setProgress(100);
  }

  function onLoadedMetadata() {
    setDuration(audioRef.current?.duration || 0);
  }

  function handleTrackClick(e) {
    const track = trackRef.current;
    const audio = audioRef.current;
    if (!track || !audio || !duration) return;

    const rect = track.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = ratio * duration;
    audio.currentTime = newTime;
    setCurrent(newTime);
    setProgress(ratio * 100);
  }

  function handleKeyDown(e) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      audio.currentTime = Math.min(duration, audio.currentTime + 3);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      audio.currentTime = Math.max(0, audio.currentTime - 3);
    } else if (e.key === ' ') {
      e.preventDefault();
      togglePlay();
    }
  }

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  return (
    <div className="audio-player">
      {/* Hidden native audio element */}
      {src && (
        <audio
          ref={audioRef}
          src={src}
          onTimeUpdate={onTimeUpdate}
          onEnded={onEnded}
          onLoadedMetadata={onLoadedMetadata}
          preload="auto"
        />
      )}

      {/* Waveform */}
      <WaveformViz isPlaying={playing} />

      {/* Controls row */}
      <div className="audio-controls">
        <button
          id="audio-play-btn"
          type="button"
          className="play-btn"
          onClick={togglePlay}
          disabled={disabled || !src}
          aria-label={playing ? 'ऑडियो रोकें (Pause audio)' : 'ऑडियो चलाएं (Play audio)'}
          title={playing ? 'रोकें (Pause)' : 'चलाएं (Play)'}
        >
          {playing ? (
            /* Pause icon */
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6"  y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            /* Play icon */
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>

        {/* Scrubbable progress track (Accessible Slider) */}
        <div
          ref={trackRef}
          className="audio-progress-track"
          style={{ flex: 1, cursor: 'pointer' }}
          onClick={handleTrackClick}
          onKeyDown={handleKeyDown}
          role="slider"
          tabIndex={0}
          aria-label="ऑडियो प्रगति (Audio timeline)"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={`${formatTime(current)} of ${formatTime(duration)}`}
        >
          <div
            className="audio-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="audio-time" aria-live="off">
          {formatTime(current)} / {formatTime(duration)}
        </span>
      </div>

      {/* Fallback badge */}
      {fallback && (
        <div className="fallback-badge" role="note">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          ऑडियो ओड़िया में है (संताली TTS उपलब्ध नहीं होने के कारण ओड़िया स्वर का उपयोग)
        </div>
      )}
    </div>
  );
}
