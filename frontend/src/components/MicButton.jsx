// MicButton.jsx — Accessible animated microphone button for voice input

import { useState, useRef, useEffect } from 'react';

/**
 * Props:
 *   onTranscript(text: string) — called when STT returns result
 *   onError(message: string)   — called on any error
 *   disabled: boolean
 *   size: 'sm' | 'md' | 'lg'
 */
export default function MicButton({ onTranscript, onError, disabled, size = 'md' }) {
  const [state, setState] = useState('idle'); // idle | recording | loading
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg',
      });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = e => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        await sendToSTT(blob, recorder.mimeType);
      };

      recorder.start();
      setState('recording');
    } catch (err) {
      onError?.('माइक्रोफ़ोन अनुमति नहीं मिली। कृपया ब्राउज़र सेटिंग्स में माइक्रोफ़ोन की अनुमति दें।');
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      setState('loading');
    }
  }

  async function sendToSTT(blob, mimeType) {
    try {
      const form = new FormData();
      form.append('audio', blob, `recording.${mimeType.includes('webm') ? 'webm' : 'ogg'}`);

      const res = await fetch('/api/stt', { method: 'POST', body: form });
      if (!res.ok) throw new Error((await res.json()).error || 'STT failed');
      const data = await res.json();
      if (data.transcript) {
        onTranscript?.(data.transcript);
      }
    } catch (err) {
      onError?.(err.message || 'वाक पहचान असफल रही। कृपया पुनः बोलें।');
    } finally {
      setState('idle');
    }
  }

  function handleClick() {
    if (disabled) return;
    if (state === 'idle') startRecording();
    else if (state === 'recording') stopRecording();
  }

  const label = {
    idle:      'माइक से बोलें (Voice input)',
    recording: 'रिकॉर्डिंग रोकें (Stop recording)',
    loading:   'ध्वनि विश्लेषण हो रहा है… (Transcribing)',
  }[state];

  const sizeClass = size === 'sm' ? 'mic-btn--sm' : size === 'lg' ? 'mic-btn--lg' : '';

  return (
    <button
      id="mic-btn"
      type="button"
      className={`mic-btn mic-btn--${state} ${sizeClass}`}
      onClick={handleClick}
      disabled={disabled || state === 'loading'}
      aria-label={label}
      title={label}
      aria-pressed={state === 'recording'}
    >
      {state === 'loading' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="spinner-icon">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="2" width="6" height="12" rx="3" />
          <path d="M5 10a7 7 0 0014 0" strokeLinecap="round"/>
          <line x1="12" y1="19" x2="12" y2="22" strokeLinecap="round"/>
          <line x1="8"  y1="22" x2="16" y2="22" strokeLinecap="round"/>
        </svg>
      )}
    </button>
  );
}
