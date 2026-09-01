// FlashcardDeckScreen.jsx — Interactive 3D Visual Flashcards & Smart Board Deck Player
// Multi-modal phonics & vocabulary trainer for Santali, Ho, Mundari, Kurukh, Odia

import { useState } from 'react';
import { TRIBAL_DICTIONARY, DICT_CATEGORIES } from '../data/tribalDictionary';
import LanguageChips from '../components/LanguageChips';

export default function FlashcardDeckScreen({ isSmartBoardMode = false }) {
  const [selectedLang, setSelectedLang] = useState('santali');
  const [selectedCat, setSelectedCat] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isQuizMode, setIsQuizMode] = useState(false);

  const filteredCards = selectedCat === 'all'
    ? TRIBAL_DICTIONARY
    : TRIBAL_DICTIONARY.filter(c => c.category === selectedCat);

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  function handleNext() {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % filteredCards.length);
  }

  function handlePrev() {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + filteredCards.length) % filteredCards.length);
  }

  async function handlePlaySound(e) {
    e.stopPropagation();
    try {
      setIsPlayingAudio(true);
      const textToSpeak = currentCard[selectedLang] || currentCard.hindi;
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSpeak,
          langCode: selectedLang === 'santali' ? 'sat-IN' : 'hi-IN',
          simplifiedText: currentCard.english
        })
      });
      const data = await res.json();
      if (data.audioDataUri) {
        const snd = new Audio(data.audioDataUri);
        snd.play();
      }
    } catch (err) {
      console.warn('Sound play failed', err);
    } finally {
      setIsPlayingAudio(false);
    }
  }

  return (
    <div className={`screen ${isSmartBoardMode ? 'smart-board-deck' : ''}`} style={{ gap: '1.25rem' }}>
      {/* ── Control Header ───────────────────────────────── */}
      <div className="card" style={{ background: '#1E1610', border: '1.5px solid rgba(224, 121, 43, 0.35)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#FF9447', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              🗂️ Interactive Smart Board Flashcard Deck
            </span>
            <h2 style={{ fontSize: '1.25rem', color: '#FAF2E6', marginTop: '2px', fontWeight: 800 }}>
              सचित्र फ्लैशकार्ड एवं शब्दावली डेक
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              type="button"
              className={`btn ${isQuizMode ? 'btn-secondary' : 'btn-outline'}`}
              style={{
                padding: '0.4rem 0.9rem',
                fontSize: '0.82rem',
                minHeight: '38px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: isQuizMode ? 'rgba(114, 155, 120, 0.25)' : '#2A1E16',
                color: isQuizMode ? '#8EB994' : '#FAF2E6',
                border: isQuizMode ? '1.5px solid #729B78' : '1.5px solid rgba(224, 121, 43, 0.35)',
                fontWeight: isQuizMode ? 700 : 500
              }}
              onClick={() => setIsQuizMode(!isQuizMode)}
            >
              {isQuizMode ? '🎯 क्विज मोड चालू' : '🕹️ क्विज मोड'}
            </button>
            <span className="card-badge" style={{ background: 'rgba(224, 121, 43, 0.2)', color: '#FF9447', border: '1px solid rgba(224, 121, 43, 0.4)', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700 }}>
              {currentIndex + 1} / {filteredCards.length}
            </span>
          </div>
        </div>

        <LanguageChips selected={selectedLang} onChange={setSelectedLang} />

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '0.45rem', overflowX: 'auto', marginTop: '0.75rem', paddingBottom: '0.25rem' }}>
          {DICT_CATEGORIES.map(cat => {
            const isSelected = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className={`chip-btn ${isSelected ? 'selected' : ''}`}
                style={{
                  fontSize: '0.82rem',
                  minHeight: '38px',
                  borderRadius: '9999px',
                  padding: '0.4rem 0.9rem',
                  cursor: 'pointer',
                  background: isSelected ? 'linear-gradient(135deg, #E0792B, #FF9447)' : '#2A1E16',
                  color: isSelected ? '#160F0A' : '#C4B0A0',
                  border: isSelected ? '1.5px solid #FF9447' : '1.5px solid rgba(224, 121, 43, 0.35)',
                  fontWeight: isSelected ? 700 : 500,
                  whiteSpace: 'nowrap'
                }}
                onClick={() => { setSelectedCat(cat.id); setCurrentIndex(0); setIsFlipped(false); }}
              >
                {cat.icon} {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3D Interactive Flashcard ─────────────────────── */}
      <div
        className={`flashcard-wrapper ${isFlipped ? 'flipped' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsFlipped(!isFlipped)}
        aria-label="Flip flashcard"
      >
        <div className="flashcard-inner">
          {/* Front Face: Visual Emoji + Hindi Word */}
          <div className="flashcard-front">
            <div className="flashcard-emoji">{currentCard.emoji}</div>
            <div className="flashcard-main-text devanagari">{currentCard.hindi}</div>
            <div className="flashcard-sub-text">{currentCard.english}</div>
            <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
              👆 कार्ड पलटने के लिए छुएं (Tap to Flip for {selectedLang.toUpperCase()})
            </div>
          </div>

          {/* Back Face: Tribal Script + Phonetic Sound + Example Sentence */}
          <div className="flashcard-back">
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-secondary-light)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              {selectedLang.toUpperCase()} अनुवाद:
            </div>
            <div className="flashcard-main-text devanagari olchiki" style={{ color: 'var(--accent-primary-light)' }}>
              {currentCard[selectedLang] || currentCard.santali}
            </div>
            <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              उच्चारण (Phonetic): <em>{currentCard.phonetic}</em>
            </div>

            {currentCard.exampleTribal && (
              <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.3)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }}>
                <span className="devanagari olchiki">"{currentCard.exampleTribal}"</span>
              </div>
            )}

            <button
              type="button"
              className="btn btn-primary"
              style={{ marginTop: '1.25rem', padding: '0.4rem 1.25rem', fontSize: '0.85rem', borderRadius: 'var(--radius-full)', minHeight: '40px' }}
              onClick={handlePlaySound}
              disabled={isPlayingAudio}
            >
              🔊 आवाज़ सुनें (Pronounce)
            </button>
          </div>
        </div>
      </div>

      {/* ── Slide Navigation Controls ────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
        <button
          type="button"
          className="btn btn-outline"
          style={{ width: '48px', height: '48px', borderRadius: '50%', padding: 0 }}
          onClick={handlePrev}
          aria-label="Previous card"
        >
          ◀
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          style={{ padding: '0.5rem 1.5rem', minHeight: '44px' }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          🔄 पलटें (Flip Card)
        </button>

        <button
          type="button"
          className="btn btn-outline"
          style={{ width: '48px', height: '48px', borderRadius: '50%', padding: 0 }}
          onClick={handleNext}
          aria-label="Next card"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
