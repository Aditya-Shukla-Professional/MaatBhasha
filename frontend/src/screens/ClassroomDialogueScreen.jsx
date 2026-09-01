// ClassroomDialogueScreen.jsx — Real-Time Voice-to-Voice Interactive Classroom Dialogue

import { useState, useRef, useEffect } from 'react';
import MicButton from '../components/MicButton';
import LanguageChips from '../components/LanguageChips';
import WaveformViz from '../components/WaveformViz';

const QUICK_PROMPTS = {
  teacher: [
    { label: '👋 स्वागत / जोहार', text: 'नमस्ते बच्चों, सब बैठ जाओ।' },
    { label: '📖 किताब खोलो', text: 'सभी बच्चे अपनी भाषा की किताब निकालें।' },
    { label: '👂 ध्यान से सुनो', text: 'मेरी बात ध्यान से सुनो और समझो।' },
    { label: '🔢 कंकड़ गिनो', text: 'अपने हाथ में पाँच कंकड़ गिनकर दिखाओ।' },
    { label: '💧 पानी पीना', text: 'जिसको पानी पीना है, वह जा सकता है।' },
    { label: '🌟 बहुत बढ़िया!', text: 'शाबाश! आपने बहुत अच्छा उत्तर दिया।' }
  ],
  student: [
    { label: '🙋‍♂️ समझ आ गया', text: 'हां गुरुजी, मुझे समझ आ गया।' },
    { label: '❓ दोबारा बताइए', text: 'गुरुजी, एक बार फिर से समझाइए।' },
    { label: '💧 पानी पीना है', text: 'गुरुजी, मुझे प्यास लगी है, पानी पीना है।' },
    { label: '✋ बाहर जाना है', text: 'गुरुजी, मुझे बाहर जाना है।' }
  ]
};

export default function ClassroomDialogueScreen() {
  const [targetLang, setTargetLang] = useState('santali');
  const [speakerRole, setSpeakerRole] = useState('teacher'); // 'teacher' | 'student'
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [micError, setMicError] = useState(null);
  const [dialogueHistory, setDialogueHistory] = useState([
    {
      id: 1,
      speaker: 'teacher',
      sourceText: 'नमस्ते बच्चों, आज हम पेड़ और पक्षियों के बारे में जानेंगे।',
      translatedText: 'ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ, ᱛᱮᱦᱮᱧ ᱫᱚ ᱫᱟᱨᱮ ᱟᱨ ᱪᱮᱬᱮ ᱵᱟᱵᱚᱛ ᱵᱚᱱ ᱪᱮᱫᱚᱜ-ᱟ᱾',
      phoneticHint: 'Sagun daram gidra ko, tehenj do dare ar chende babat bon chedoga.',
      latencyMs: 1420,
      timestamp: 'Class 1-A'
    }
  ]);

  const audioRef      = useRef(null);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dialogueHistory]);

  async function handleSendTurn(customText) {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isProcessing) return;

    setIsProcessing(true);
    setInputText('');
    setMicError(null);

    try {
      const srcLang = speakerRole === 'teacher' ? 'hi' : targetLang;
      const tgtLang = speakerRole === 'teacher' ? targetLang : 'hi';

      const res = await fetch('/api/dialogue/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputText: textToSend,
          speakerRole,
          sourceLang: srcLang,
          targetLang: tgtLang,
          generateAudio: true
        })
      });

      if (!res.ok) throw new Error('Dialogue turn failed');

      const data = await res.json();

      const newTurn = {
        id: Date.now(),
        speaker: speakerRole,
        sourceText: textToSend,
        translatedText: data.translatedText,
        audioDataUri: data.audioDataUri,
        latencyMs: data.latencyMs || 1850,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };

      setDialogueHistory(prev => [...prev, newTurn]);

      // Auto-play audio response
      if (data.audioDataUri) {
        playAudio(data.audioDataUri);
      }

    } catch (err) {
      console.error(err);
      setMicError('अनुवाद या ध्वनि निर्माण में त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsProcessing(false);
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    handleSendTurn();
  }

  function playAudio(audioUri) {
    if (!audioUri) return;
    if (audioRef.current) {
      audioRef.current.src = audioUri;
      audioRef.current.play()
        .then(() => setIsPlayingAudio(true))
        .catch(e => console.warn('Audio auto-play blocked', e));
    }
  }

  return (
    <div className="screen dialogue-container">
      {/* Hidden Audio Player */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlayingAudio(false)}
        onError={() => setIsPlayingAudio(false)}
      />

      {/* ── Top Bar: Role & Language Select ─────────────── */}
      <div className="card" style={{ padding: '1rem', background: '#1E1610', border: '1.5px solid rgba(224, 121, 43, 0.35)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#8C7566', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              🎯 Live Classroom Voice Bridge
            </span>
            <h2 style={{ fontSize: '1.25rem', color: '#FF9447', marginTop: '2px', fontWeight: 800 }}>
              दो-तरफ़ा संवाद
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className={`btn ${speakerRole === 'teacher' ? 'btn-primary' : 'btn-outline'}`}
              style={{
                padding: '0.45rem 0.95rem',
                fontSize: '0.85rem',
                minHeight: '44px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: speakerRole === 'teacher'
                  ? 'linear-gradient(135deg, #E0792B, #FF9447)'
                  : '#2A1E16',
                color: speakerRole === 'teacher' ? '#160F0A' : '#FAF2E6',
                border: speakerRole === 'teacher' ? '1px solid #FF9447' : '1.5px solid rgba(224, 121, 43, 0.35)',
                fontWeight: speakerRole === 'teacher' ? 700 : 500
              }}
              onClick={() => setSpeakerRole('teacher')}
            >
              👨‍🏫 शिक्षक (Hindi)
            </button>
            <button
              type="button"
              className={`btn ${speakerRole === 'student' ? 'btn-secondary' : 'btn-outline'}`}
              style={{
                padding: '0.45rem 0.95rem',
                fontSize: '0.85rem',
                minHeight: '44px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: speakerRole === 'student'
                  ? 'rgba(114, 155, 120, 0.25)'
                  : '#2A1E16',
                color: speakerRole === 'student' ? '#8EB994' : '#FAF2E6',
                border: speakerRole === 'student' ? '1.5px solid #729B78' : '1.5px solid rgba(224, 121, 43, 0.35)',
                fontWeight: speakerRole === 'student' ? 700 : 500
              }}
              onClick={() => setSpeakerRole('student')}
              title="संताली वाक पहचान बीटा मोड में है"
            >
              🧒 छात्र (बीटा)
            </button>
          </div>
          {speakerRole === 'student' && (
            <div style={{ fontSize: '0.75rem', color: '#D49B42', marginTop: '0.3rem', fontFamily: 'var(--font-devanagari)', width: '100%' }}>
              ⚠️ छात्र उत्तर फ़ीचर बीटा में है — संताली STT सिस्टम अभी प्रमाणित नहीं हुआ है।
            </div>
          )}
        </div>

        <LanguageChips selected={targetLang} onChange={setTargetLang} />
      </div>

      {micError && (
        <div className="error-block" role="alert" style={{ margin: '0' }}>
          <span>{micError}</span>
        </div>
      )}

      {/* ── Dialogue Feed ─────────────────────────────────── */}
      <div className="dialogue-container">
        <div className="dialogue-history">
          {dialogueHistory.map(turn => (
            <div
              key={turn.id}
              className={`dialogue-bubble ${turn.speaker === 'teacher' ? 'bubble-teacher' : 'bubble-student'}`}
            >
              <div className="bubble-meta">
                <span style={{ fontWeight: 700, color: turn.speaker === 'teacher' ? 'var(--accent-primary)' : 'var(--accent-secondary)' }}>
                  {turn.speaker === 'teacher' ? '👨‍🏫 शिक्षक बोल रहे हैं' : '🧒 छात्र बोल रहे हैं'} · {turn.timestamp}
                </span>
                <span className="latency-badge">
                  ⚡ {turn.latencyMs ? `${(turn.latencyMs / 1000).toFixed(1)}s Latency` : 'Real-time'}
                </span>
              </div>

              <div className="bubble-source devanagari">
                "{turn.sourceText}"
              </div>

              <div className="bubble-translated devanagari olchiki">
                {turn.translatedText}
              </div>

              {turn.audioDataUri && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', minHeight: '34px', background: '#2A1E16', color: '#FAF2E6', border: '1px solid rgba(224, 121, 43, 0.35)' }}
                    onClick={() => playAudio(turn.audioDataUri)}
                  >
                    {isPlayingAudio ? '⏸ रोकें' : '🔊 सुनें'}
                  </button>
                  {turn.phoneticHint && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      ({turn.phoneticHint})
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>
      </div>

      {/* Waveform indicator during audio playback */}
      {isPlayingAudio && (
        <div className="card" style={{ padding: '0.6rem 1rem', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-secondary-light)', fontWeight: 600 }}>
              🔊 कक्षा में आवाज़ प्रसारित हो रही है...
            </span>
            <WaveformViz isPlaying={true} bars={24} />
          </div>
        </div>
      )}

      {/* ── Quick Classroom Prompts ──────────────────────── */}
      <div className="card" style={{ padding: '0.85rem', background: '#1E1610', border: '1.5px solid rgba(224, 121, 43, 0.35)' }}>
        <span style={{ fontSize: '0.75rem', color: '#FF9447', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block', fontWeight: 700 }}>
          ⚡ त्वरित संवाद सूत्र (Quick Classroom Prompts):
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
          {QUICK_PROMPTS[speakerRole].map((p, idx) => (
            <button
              key={idx}
              type="button"
              className="chip-btn devanagari"
              style={{
                fontSize: '0.82rem',
                minHeight: '38px',
                background: '#2A1E16',
                color: '#FAF2E6',
                border: '1.5px solid rgba(224, 121, 43, 0.35)',
                borderRadius: '9999px',
                padding: '0.4rem 0.9rem',
                cursor: 'pointer'
              }}
              onClick={() => handleSendTurn(p.text)}
              disabled={isProcessing}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Input & Voice Mic Trigger ────────────────────── */}
      <form className="card" style={{ padding: '0.85rem', width: '100%' }} onSubmit={handleFormSubmit}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', width: '100%' }}>
          <MicButton
            onTranscript={(t) => setInputText(prev => prev ? `${prev} ${t}` : t)}
            onError={(err) => setMicError(err)}
            disabled={isProcessing}
          />
          <input
            type="text"
            className="lesson-textarea devanagari"
            style={{ flex: 1, height: '48px', padding: '0.6rem 1rem' }}
            placeholder={speakerRole === 'teacher' ? 'शिक्षक: यहाँ बोलें या लिखें (e.g. सभी बच्चे बैठ जाओ)...' : 'छात्र उत्तर दर्ज करें...'}
            value={inputText}
            onChange={(e) => { setInputText(e.target.value); setMicError(null); }}
            disabled={isProcessing}
            aria-label={speakerRole === 'teacher' ? 'Teacher voice input' : 'Student voice input'}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ height: '48px', padding: '0 1.5rem', whiteSpace: 'nowrap', minWidth: '105px', fontWeight: 700 }}
            disabled={isProcessing || !inputText.trim()}
          >
            {isProcessing ? 'अनुवाद...' : 'बोलें ⚡'}
          </button>
        </div>
      </form>
    </div>
  );
}
