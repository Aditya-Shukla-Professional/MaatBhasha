// ResultScreen.jsx — Shows simplified text, translated text, audio player, share action

import { useState, useCallback } from 'react';
import AudioPlayer from '../components/AudioPlayer';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const LANG_DISPLAY = {
  santali: 'Santali (ᱥᱟᱱᱛᱟᱲᱤ)',
  ho:      'Ho (𑣸𑣉)',
  mundari: 'Mundari (मुंडारी)',
  kurukh:  'Kurukh (कुड़ुख़)',
  odia:    'Odia (ଓଡ଼ିଆ)',
};

const GRADE_DISPLAY = { '1-2': 'Class 1–2', '3-5': 'Class 3–5', '6-8': 'Class 6–8' };

/**
 * Props: result object from ComposeScreen
 *   { originalText, simplified, translated, audioDataUri, fallback, usedLang, targetLang, gradeLevel }
 * onBack() — navigate back to compose
 */
export default function ResultScreen({ result, onBack, onNavigateToWorksheet, onNavigateToFlashcard }) {
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [saveErr, setSaveErr] = useState(null);
  const [toast,   setToast]   = useState(null);
  const [copied,  setCopied]  = useState(false);

  async function handleCopyTranslation() {
    try {
      await navigator.clipboard.writeText(translated);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (_) {}
  }

  const {
    originalText, simplified, translated,
    audioDataUri, fallback, usedLang,
    targetLang, gradeLevel,
  } = result;

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSendToStudents() {
    if (saved) { showToast('Already saved!'); return; }
    setSaving(true);
    setSaveErr(null);
    try {
      // Save lesson doc
      const lessonRef = await addDoc(collection(db, 'lessons'), {
        original_text:   originalText,
        source_language: 'hi',
        grade_level:     gradeLevel,
        created_at:      serverTimestamp(),
        teacher_id:      'demo-teacher',
      });

      // Save translation doc
      await addDoc(collection(db, 'translations'), {
        lesson_id:       lessonRef.id,
        target_language: targetLang,
        simplified_text: simplified,
        translated_text: translated,
        audio_url:       audioDataUri,
        created_at:      serverTimestamp(),
      });

      setSaved(true);
      showToast('✅ Saved! Lesson ready for student devices.', 'success');
    } catch (err) {
      console.error('[Firestore] Save error:', err);
      setSaveErr(err.message);
      showToast('❌ Save failed — check Firebase config', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="screen">

      {/* ── Back button ──────────────────────────────────── */}
      <button
        id="back-btn"
        type="button"
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          fontSize: '0.85rem',
          padding: '0.25rem 0',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        New lesson
      </button>

      {/* ── Metadata strip ───────────────────────────────── */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
      }}>
        <span style={{
          fontSize: '0.72rem',
          background: 'var(--accent-primary-dim)',
          color: 'var(--accent-primary)',
          borderRadius: 'var(--radius-full)',
          padding: '0.25rem 0.65rem',
          fontWeight: 600,
        }}>
          {GRADE_DISPLAY[gradeLevel]}
        </span>
        <span style={{
          fontSize: '0.72rem',
          background: 'var(--accent-secondary-dim)',
          color: 'var(--accent-secondary-light)',
          borderRadius: 'var(--radius-full)',
          padding: '0.25rem 0.65rem',
          fontWeight: 600,
        }}>
          {LANG_DISPLAY[targetLang] || targetLang}
        </span>
      </div>

      {/* ── Simplified Text ───────────────────────────────── */}
      <section className="card">
        <div className="card-label">✏️ Simplified (Hindi)</div>
        <div className="result-panel devanagari">{simplified}</div>
      </section>

      {/* ── Translated Text ───────────────────────── */}
      <section className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <div className="card-label" style={{ margin: 0 }}>🌏 अनुवाद — {LANG_DISPLAY[targetLang] || targetLang}</div>
          <button
            type="button"
            className={`icon-btn${copied ? ' icon-btn--active' : ''}`}
            onClick={handleCopyTranslation}
            title="संताली पाठ कॉपी करें"
            aria-label="Copy Santali translation"
          >
            {copied ? '✓ कॉपी!' : '⎋ कॉपी'}
          </button>
        </div>
        <div className="result-panel olchiki">
          {translated}
        </div>
        {targetLang === 'santali' && (
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontFamily: 'var(--font-devanagari)' }}>
            ℹ️ रोमन उच्चारण सहायता: संताली लिखावट Ol Chiki लिपि में है।
          </p>
        )}
      </section>

      {/* ── Audio Player ────────────────────────── */}
      <section className="card" style={{ borderColor: 'var(--accent-primary)', background: 'var(--bg-surface)' }}>
        <div className="card-label">🔊 वाचन ऑडियो</div>
        <AudioPlayer src={audioDataUri} fallback={fallback} usedLang={usedLang} />
        {fallback && targetLang === 'santali' && (
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontFamily: 'var(--font-devanagari)' }}>
            ℹ️ संताली TTS अभी उपलब्ध नहीं है। यह ऑडियो ओड़िया भाषा में है (Sarvam Bulbul v3 पर आधारित)।
            केवल सहेजे गए कक्षा वाक्यांशों के लिए संताली ऑडियो उपलब्ध है।
          </p>
        )}
      </section>

      {/* ── Direct Pedagogical Material Generation ─────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => onNavigateToWorksheet?.({ title: originalText.slice(0, 30), theme: originalText, gradeLevel, translations: { [targetLang]: { vocabulary: [{ hi: originalText.slice(0, 15), tribal: translated.slice(0, 20), en: 'Lesson' }] } } })}
        >
          🖨️ वर्कशीट बनाएं
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => onNavigateToFlashcard?.()}
        >
          🗂️ फ्लैशकार्ड देखें
        </button>
      </div>

      {/* ── Send to Students ──────────────────────────────── */}
      <button
        id="send-to-students-btn"
        type="button"
        className="btn-secondary"
        onClick={handleSendToStudents}
        disabled={saving || saved}
        aria-busy={saving}
      >
        {saving ? (
          <>
            <span className="spinner" style={{ borderTopColor: 'currentColor' }} />
            Saving…
          </>
        ) : saved ? (
          '✅ Saved to student devices'
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
            </svg>
            Send to student devices
          </>
        )}
      </button>

      {saveErr && (
        <p style={{ fontSize: '0.75rem', color: 'var(--color-error)', textAlign: 'center' }}>
          {saveErr}
        </p>
      )}

      {/* ── Toast ─────────────────────────────────────────── */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`toast toast--visible toast--${toast.type}`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
