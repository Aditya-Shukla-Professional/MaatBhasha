// ComposeScreen.jsx — Redesigned PALASH Lesson Translator
// Two-pane Hindi ↔ Santali live translator with offline cache, classroom phrases,
// and honest capability disclosure. Never shows fake Santali text on error.

import { useState, useEffect, useRef } from 'react';
import MicButton from '../components/MicButton';
import GradeSelector from '../components/GradeSelector';
import { getCachedTranslation, cacheTranslation } from '../utils/offlineDb';
import { CLASSROOM_PHRASES, PHRASE_CATEGORIES, PHRASE_SOURCE_NOTE } from '../data/classroomPhrases';

const OFFLINE_MSG = 'अभी अनुवाद उपलब्ध नहीं है। इंटरनेट से जुड़कर पुनः प्रयास करें।';

// Error code → Hindi user-facing messages
function getHindiError(err) {
  if (!navigator.onLine) return OFFLINE_MSG;
  if (err?.code === 'PAIR_NOT_SUPPORTED') return 'यह भाषा अभी उपलब्ध नहीं है।';
  if (err?.code === 'NO_API_KEY') return 'अनुवाद सेवा कॉन्फ़िगर नहीं है। व्यवस्थापक से संपर्क करें।';
  if (err?.code === 'TEXT_EMPTY') return 'कृपया पहले हिंदी में पाठ लिखें।';
  return OFFLINE_MSG;
}

/**
 * Props: onResult(resultObj) — called when user clicks "Full Lesson" flow
 */
export default function ComposeScreen({ onResult }) {
  // ── Translator state ────────────────────────────────────────────────────────
  const [hindiText,     setHindiText]     = useState('');
  const [direction,     setDirection]     = useState('hi→sat'); // 'hi→sat' | 'sat→hi'
  const [output,        setOutput]        = useState(null);     // null | { text, fromCache, error }
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied,        setCopied]        = useState(false);
  const [isOnline,      setIsOnline]      = useState(navigator.onLine);

  // ── Full lesson state ───────────────────────────────────────────────────────
  const [grade,      setGrade]      = useState('3-5');
  const [processing, setProcessing] = useState(false);
  const [step,       setStep]       = useState(null);
  const [fullError,  setFullError]  = useState(null);

  // ── Quick phrases state ─────────────────────────────────────────────────────
  const [activeCat,       setActiveCat]       = useState('all');
  const [phrasesExpanded, setPhrasesExpanded] = useState(true);
  const [phraseNote,      setPhraseNote]      = useState(false);

  const abortRef  = useRef(null);
  const outputRef = useRef(null);

  // ── Online/offline detection ────────────────────────────────────────────────
  useEffect(() => {
    const onOnline  = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online',  onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online',  onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  // ── Debounced live translation effect ───────────────────────────────────────
  useEffect(() => {
    if (!hindiText.trim()) {
      setOutput(null);
      setIsTranslating(false);
      return;
    }

    const timer = setTimeout(async () => {
      const [srcLang, tgtLang] = direction === 'hi→sat' ? ['hi-IN', 'sat-IN'] : ['sat-IN', 'hi-IN'];
      const textToTranslate = hindiText.trim();

      // 1. Cache lookup first
      try {
        const cached = await getCachedTranslation(textToTranslate, srcLang, tgtLang);
        if (cached) {
          setOutput({ text: cached, fromCache: true });
          setIsTranslating(false);
          return;
        }
      } catch (_) {}

      // 2. Network request
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      setIsTranslating(true);
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textToTranslate, sourceLang: srcLang, targetLang: tgtLang }),
          signal: abortRef.current.signal,
        });

        const data = await res.json();
        if (!res.ok) throw { code: data.error, message: data.message };

        // Cache the successful result
        await cacheTranslation(textToTranslate, srcLang, tgtLang, data.translated).catch(() => {});
        setOutput({ text: data.translated, fromCache: false });
      } catch (err) {
        if (err.name === 'AbortError') return;

        // On any error: try cache fallback first, then show Hindi message
        try {
          const cached = await getCachedTranslation(textToTranslate, srcLang, tgtLang);
          if (cached) {
            setOutput({ text: cached, fromCache: true, hasError: true });
            return;
          }
        } catch (_) {}

        setOutput({ text: null, error: getHindiError(err) });
      } finally {
        setIsTranslating(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [hindiText, direction]);

  function handleSwapDirection() {
    const newDir = direction === 'hi→sat' ? 'sat→hi' : 'hi→sat';
    if (output?.text) {
      setHindiText(output.text);
      setOutput(null);
    }
    setDirection(newDir);
  }

  function handleMicTranscript(t) {
    setHindiText(prev => prev ? `${prev} ${t}` : t);
  }

  async function handleCopy() {
    if (!output?.text) return;
    try {
      await navigator.clipboard.writeText(output.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (_) {}
  }

  function handlePhraseClick(phrase) {
    if (direction === 'hi→sat') {
      setHindiText(phrase.hindi);
    } else {
      setHindiText(phrase.santali);
    }
  }

  // ── Full Lesson pipeline ──────────────────────────────────────────────────
  async function handleFullLesson(e) {
    e.preventDefault();
    if (!hindiText.trim()) { setFullError('पहले हिंदी में पाठ लिखें।'); return; }
    setFullError(null);
    setProcessing(true);

    try {
      setStep('simplify');
      const simplifyRes = await fetch('/api/simplify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: hindiText.trim(), gradeLevel: grade }),
      });
      if (!simplifyRes.ok) throw new Error((await simplifyRes.json()).error || 'Simplification failed');
      const { simplified } = await simplifyRes.json();

      setStep('translate');
      const transRes = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: simplified, sourceLang: 'hi-IN', targetLang: 'sat-IN' }),
      });
      if (!transRes.ok) throw new Error((await transRes.json()).message || 'Translation failed');
      const { translated } = await transRes.json();

      setStep('tts');
      const ttsRes = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: translated, langCode: 'sat-IN', simplifiedText: simplified }),
      });
      if (!ttsRes.ok) throw new Error((await ttsRes.json()).error || 'Audio failed');
      const { audioDataUri, fallback, usedLang } = await ttsRes.json();

      onResult({
        originalText: hindiText.trim(),
        simplified,
        translated,
        audioDataUri,
        fallback,
        usedLang,
        targetLang: 'santali',
        gradeLevel: grade,
      });
    } catch (err) {
      setFullError(err.message || 'कुछ गड़बड़ हुई। पुनः प्रयास करें।');
    } finally {
      setProcessing(false);
      setStep(null);
    }
  }

  const stepLabels = { simplify: 'सरलीकरण…', translate: 'अनुवाद…', tts: 'ऑडियो तैयार…' };

  const srcLabel = direction === 'hi→sat' ? 'हिंदी' : 'संताली (Ol Chiki)';
  const tgtLabel = direction === 'hi→sat' ? 'संताली (ᱥᱟᱱᱛᱟᱲᱤ)' : 'हिंदी';

  const filteredPhrases = activeCat === 'all'
    ? CLASSROOM_PHRASES
    : CLASSROOM_PHRASES.filter(p => p.category === activeCat);

  return (
    <div className="screen">

      {/* ── Capability Status Banner ──────────────────────── */}
      <div className="capability-panel" role="status">
        <span className={`capability-item ${isOnline ? 'ok' : 'err'}`}>
          <span>{isOnline ? '🟢' : '🔴'}</span>
          {isOnline ? 'ऑनलाइन' : 'ऑफलाइन'}
        </span>
        <span className="capability-item ok">✅ हिंदी ↔ संताली अनुवाद (Sarvam AI)</span>
        <span className="capability-item warn">⚠️ लाइव अनुवाद के लिए इंटरनेट आवश्यक</span>
        <span className="capability-item ok">📦 पाठ सामग्री ऑफलाइन उपलब्ध</span>
        <span className="capability-item warn">🎙️ संताली TTS: केवल सहेजे वाक्यांशों के लिए</span>
      </div>

      {/* ── Two-pane Translator ────────────────────────────── */}
      <section className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="translator-grid">
          {/* Input pane */}
          <div className="translator-pane translator-pane--input">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="translator-lang-label">{srcLabel}</span>
              <MicButton
                onTranscript={handleMicTranscript}
                onError={() => {}}
                disabled={processing}
                size="sm"
              />
            </div>
            <textarea
              className="translator-textarea devanagari"
              placeholder={direction === 'hi→sat'
                ? 'यहाँ हिंदी में लिखें या माइक से बोलें…'
                : 'ᱮᱛᱮᱢ ᱥᱟᱱᱛᱟᱲᱤ ᱨᱮ ᱞᱤᱠᱷᱩ…'
              }
              value={hindiText}
              onChange={e => { setHindiText(e.target.value); setFullError(null); }}
              maxLength={4000}
              rows={5}
              aria-label="Input text"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span>हिंदी / English</span>
              <span style={{ color: hindiText.length > 3500 ? 'var(--color-warning)' : undefined }}>
                {hindiText.length}/4000
              </span>
            </div>
          </div>

          {/* Swap divider */}
          <button
            type="button"
            className="translator-divider"
            onClick={handleSwapDirection}
            title="दिशा बदलें (Swap direction)"
            aria-label="Swap translation direction"
          >
            ⇄
          </button>

          {/* Output pane */}
          <div className="translator-pane translator-pane--output" ref={outputRef}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="translator-lang-label">{tgtLabel}</span>
              <div className="translator-pane-actions">
                {output?.fromCache && (
                  <span className="cached-badge" title="कैश से अनुवाद">
                    📦 कैश
                  </span>
                )}
                <button
                  type="button"
                  className={`icon-btn${copied ? ' icon-btn--active' : ''}`}
                  onClick={handleCopy}
                  disabled={!output?.text}
                  title="कॉपी करें"
                  aria-label="Copy translation"
                >
                  {copied ? '✓' : '⎘'}
                </button>
              </div>
            </div>

            {/* Output content */}
            <div className="translator-output-text">
              {isTranslating && !output ? (
                <div>
                  <div className="skeleton skeleton-text" />
                  <div className="skeleton skeleton-text" />
                  <div className="skeleton skeleton-text-sm" />
                </div>
              ) : output?.error ? (
                <div className="error-block">
                  <span>{output.error}</span>
                  <button
                    type="button"
                    className="retry-btn"
                    onClick={() => {
                      const t = hindiText;
                      setHindiText('');
                      setTimeout(() => setHindiText(t), 50);
                    }}
                  >
                    🔄 पुनः प्रयास
                  </button>
                </div>
              ) : output?.text ? (
                <span className={direction === 'hi→sat' ? 'olchiki' : 'devanagari'}>
                  {output.text}
                </span>
              ) : (
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {direction === 'hi→sat'
                    ? 'संताली अनुवाद यहाँ दिखेगा…'
                    : 'हिंदी अनुवाद यहाँ दिखेगा…'
                  }
                </span>
              )}
            </div>

            {/* Attribution */}
            {output?.text && !output?.error && (
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 'auto' }}>
                अनुवाद स्रोत: Sarvam AI{output.fromCache ? ' (कैश)' : ''}
                {output.hasError && ' · ⚠️ ऑफलाइन कैश से'}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Grade selector + Full Lesson button ────────────── */}
      <section className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, minWidth: '180px' }}>
          <div className="card-label" style={{ marginBottom: '0.5rem' }}>🎯 कक्षा स्तर</div>
          <GradeSelector selected={grade} onChange={setGrade} />
        </div>
        <button
          id="full-lesson-btn"
          type="button"
          className="cta-btn"
          style={{ flex: '0 0 auto', whiteSpace: 'nowrap' }}
          disabled={processing || !hindiText.trim()}
          onClick={handleFullLesson}
          aria-busy={processing}
        >
          {processing ? (
            <span className="flex-row" style={{ gap: '0.6rem', justifyContent: 'center' }}>
              <span className="spinner" />
              {stepLabels[step] || 'प्रोसेस हो रहा है…'}
            </span>
          ) : '✨ पूरा पाठ बनाएं'}
        </button>
      </section>

      {fullError && (
        <div className="error-block" role="alert">
          ⚠️ {fullError}
        </div>
      )}

      {/* ── Quick Classroom Phrases ────────────────────────── */}
      <section className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div className="card-label" style={{ margin: 0 }}>
            💬 कक्षा के सामान्य वाक्यांश
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginLeft: '0.5rem', fontWeight: 400 }}>
              ({CLASSROOM_PHRASES.length} वाक्यांश)
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <button
              type="button"
              className={`icon-btn${phraseNote ? ' icon-btn--active' : ''}`}
              title="स्रोत नोट (Source Note)"
              onClick={() => setPhraseNote(n => !n)}
              aria-label="Source note"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" strokeLinecap="round" />
                <line x1="12" y1="8" x2="12.01" y2="8" strokeLinecap="round" />
              </svg>
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={() => setPhrasesExpanded(e => !e)}
              aria-expanded={phrasesExpanded}
              aria-label={phrasesExpanded ? 'Collapse phrases' : 'Expand phrases'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: phrasesExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {phraseNote && (
          <div style={{
            padding: '0.6rem 0.8rem',
            background: 'rgba(212,155,66,0.08)',
            border: '1px solid rgba(212,155,66,0.2)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            marginBottom: '0.75rem',
            fontFamily: 'var(--font-devanagari)',
          }}>
            ℹ️ {PHRASE_SOURCE_NOTE}
          </div>
        )}

        {phrasesExpanded && (
          <>
            {/* Category filter tabs */}
            <div className="category-tabs" role="tablist">
              <button
                type="button"
                className={`category-tab${activeCat === 'all' ? ' category-tab--active' : ''}`}
                onClick={() => setActiveCat('all')}
                role="tab"
                aria-selected={activeCat === 'all'}
              >
                सभी
              </button>
              {PHRASE_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-tab${activeCat === cat.id ? ' category-tab--active' : ''}`}
                  onClick={() => setActiveCat(cat.id)}
                  role="tab"
                  aria-selected={activeCat === cat.id}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Phrase cards grid */}
            <div className="phrase-grid" role="list">
              {filteredPhrases.map(phrase => (
                <button
                  key={phrase.id}
                  type="button"
                  className="phrase-card"
                  onClick={() => handlePhraseClick(phrase)}
                  title="क्लिक करके अनुवाद करें"
                  role="listitem"
                >
                  <div className="phrase-card-hindi">{phrase.hindi}</div>
                  <div className="phrase-card-santali">{phrase.santali}</div>
                  {phrase.romanAid && (
                    <div className="phrase-card-roman">{phrase.romanAid}</div>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </section>

    </div>
  );
}
