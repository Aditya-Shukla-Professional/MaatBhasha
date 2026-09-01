// CurriculumHubScreen.jsx - NIPUN Bharat FLN Curriculum Lesson, Activity & Assessment Hub
// Translates standard Hindi FLN curriculum into tribal languages with step-by-step guides

import { useState } from 'react';
import { FLN_PACKS } from '../data/flnCurriculumPacks';
import LanguageChips from '../components/LanguageChips';
import AudioPlayer from '../components/AudioPlayer';

export default function CurriculumHubScreen({ onNavigateToWorksheet, onNavigateToFlashcard }) {
  const [selectedLang, setSelectedLang] = useState('santali');
  const [selectedGrade, setSelectedGrade] = useState('1-2');
  const [activePackId, setActivePackId] = useState(FLN_PACKS[0].id);
  const [customTopic, setCustomTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPack, setCustomPack] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const currentPack = customPack || FLN_PACKS.find(p => p.id === activePackId) || FLN_PACKS[0];
  const langTrans = currentPack.translations?.[selectedLang] || currentPack.translations?.['santali'];

  async function handleGenerateCustomFLN(e) {
    e.preventDefault();
    if (!customTopic.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/curriculum/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: customTopic,
          gradeLevel: selectedGrade,
          targetLang: selectedLang,
          competency: 'oral_language'
        })
      });

      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();

      // Format as pack
      const formattedPack = {
        id: `custom-${Date.now()}`,
        title: data.title || customTopic,
        competencyCode: data.competencyCode || 'FLN-L1',
        competencyTitle: data.learningOutcome || 'बुनियादी समझ एवं मौखिक अभिव्यक्ति',
        gradeLevel: selectedGrade,
        subject: 'Custom FLN Module',
        theme: customTopic,
        lessonScript: data.lessonScript || {
          teacherHook: 'प्यारे बच्चों, आज हम इस विषय को जानेंगे।',
          coreExplanation: customTopic
        },
        classroomActivity: data.classroomActivity || {
          name: 'स्थानीय खेल गतिविधि',
          instructions: 'बच्चे समूह में कंकड़ और पत्तों से अभ्यास करेंगे।'
        },
        assessmentPrompts: data.assessmentPrompts || ['आपने क्या सीखा?'],
        translations: {
          [selectedLang]: {
            scriptName: selectedLang,
            title: data.title,
            teacherHook: data.lessonScript?.teacherHook || '',
            coreExplanation: data.lessonScript?.coreExplanation || '',
            vocabulary: data.keyVocabulary?.map(v => ({ hi: v.hindi, tribal: v.hindi, en: v.english })) || []
          }
        }
      };

      setCustomPack(formattedPack);
      setCustomTopic('');
    } catch (err) {
      alert('Generation error: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleGenerateSpeech(textToSpeak) {
    try {
      setIsPlayingAudio(true);
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSpeak,
          langCode: selectedLang === 'santali' ? 'sat-IN' : 'hi-IN',
          simplifiedText: textToSpeak
        })
      });
      const data = await res.json();
      if (data.audioDataUri) {
        setAudioUrl(data.audioDataUri);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPlayingAudio(false);
    }
  }

  return (
    <div className="screen">
      {/* ── Header Banner ─────────────────────────────────── */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(212,155,66,0.15), rgba(42,30,22,0.95))', borderColor: 'var(--accent-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              📚 NIPUN Bharat FLN Curriculum Suite (Jharkhand)
            </span>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginTop: '2px' }}>
              पाठ योजना एवं कक्षा गतिविधि इंजन
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <span className="card-badge">Class {selectedGrade}</span>
            <span className="card-badge" style={{ background: 'var(--accent-secondary-dim)', color: 'var(--accent-secondary-light)', borderColor: 'var(--accent-secondary)' }}>
              {selectedLang.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* ── Language & Grade Selection ────────────────────── */}
      <div className="card" style={{ padding: '1rem', background: '#1E1610', border: '1.5px solid rgba(224, 121, 43, 0.35)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#FAF2E6', fontWeight: 700 }}>
            १. लक्षित जनजातीय भाषा (Target Tribal Language):
          </span>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {['1-2', '3-5'].map(g => {
              const isSelected = selectedGrade === g;
              return (
                <button
                  key={g}
                  type="button"
                  className={`chip-btn ${isSelected ? 'selected' : ''}`}
                  style={{
                    background: isSelected ? 'linear-gradient(135deg, #E0792B, #FF9447)' : '#2A1E16',
                    color: isSelected ? '#160F0A' : '#C4B0A0',
                    border: isSelected ? '1.5px solid #FF9447' : '1.5px solid rgba(224, 121, 43, 0.35)',
                    padding: '0.4rem 0.9rem',
                    borderRadius: '9999px',
                    fontSize: '0.85rem',
                    fontWeight: isSelected ? 700 : 600,
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 0 12px rgba(224, 121, 43, 0.45)' : 'none'
                  }}
                  onClick={() => setSelectedGrade(g)}
                >
                  Class {g}
                </button>
              );
            })}
          </div>
        </div>
        <LanguageChips selected={selectedLang} onChange={setSelectedLang} />
      </div>

      {/* ── Pre-Loaded FLN Packs Selector ─────────────────── */}
      <div className="card" style={{ background: '#1E1610', border: '1.5px solid rgba(224, 121, 43, 0.35)' }}>
        <div className="card-header">
          <span className="card-title" style={{ color: '#FF9447', fontWeight: 700 }}>📖 प्री-लोडेड NIPUN भारत FLN मॉड्यूल (8 पैक)</span>
          <span style={{ fontSize: '0.75rem', color: '#8EB994', fontWeight: 600 }}>
            ✓ ऑफलाइन सुरक्षित
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.35rem' }}>
          {FLN_PACKS.map(pack => {
            const isSelected = activePackId === pack.id && !customPack;
            return (
              <button
                key={pack.id}
                type="button"
                className={`btn ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.85rem',
                  flexShrink: 0,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: isSelected ? 'linear-gradient(135deg, #E0792B, #FF9447)' : '#2A1E16',
                  color: isSelected ? '#160F0A' : '#FAF2E6',
                  border: isSelected ? '1px solid #FF9447' : '1.5px solid rgba(224, 121, 43, 0.35)',
                  fontWeight: isSelected ? 700 : 500
                }}
                onClick={() => { setActivePackId(pack.id); setCustomPack(null); }}
              >
                {pack.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── AI Custom FLN Topic Generator ─────────────────── */}
      <form className="card" onSubmit={handleGenerateCustomFLN} style={{ padding: '1rem', background: '#1E1610', border: '1.5px solid rgba(224, 121, 43, 0.35)' }}>
        <span style={{ fontSize: '0.85rem', color: '#FF9447', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
          ✨ नया FLN पाठ या गतिविधि स्वतः तैयार करें (AI Lesson Builder):
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            className="lesson-textarea devanagari"
            style={{
              minHeight: 'auto',
              height: '46px',
              padding: '0.5rem 0.85rem',
              background: '#2A1E16',
              color: '#FAF2E6',
              border: '1.5px solid rgba(224, 121, 43, 0.35)',
              borderRadius: '8px'
            }}
            placeholder="विषय लिखें (जैसे: महुआ के पेड़, चिड़ियों की गिनती, गाँव का हाट-बाज़ार)..."
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            disabled={isGenerating}
            aria-label="Custom FLN topic"
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isGenerating || !customTopic.trim()}
            style={{ height: '44px', whiteSpace: 'nowrap' }}
          >
            {isGenerating ? 'तैयार हो रहा है...' : 'पाठ बनाएं ✨'}
          </button>
        </div>
      </form>

      {/* ── Active FLN Lesson Details & Deliverable Cards ─── */}
      <div className="grid-2col">
        {/* Left Column: Lesson Script & Dialogue */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">📜 शिक्षक पाठ योजना (Lesson Script)</span>
            <button
              type="button"
              className="btn btn-outline"
              style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
              onClick={() => handleGenerateSpeech(langTrans?.teacherHook || currentPack.lessonScript.teacherHook)}
              disabled={isPlayingAudio}
            >
              🔊 बोलें (Speak)
            </button>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
              शिक्षक हुक (Classroom Opening Hook):
            </span>
            <div className="result-panel devanagari" style={{ marginTop: '0.25rem' }}>
              <strong>हिंदी:</strong> {currentPack.lessonScript.teacherHook}
              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }} />
              <strong>{selectedLang.toUpperCase()}:</strong> <span className="olchiki">{langTrans?.teacherHook}</span>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
              मुख्य अवधारणा (Core Concept):
            </span>
            <div className="result-panel result-panel--translated devanagari" style={{ marginTop: '0.25rem' }}>
              <strong>हिंदी:</strong> {currentPack.lessonScript.coreExplanation}
              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }} />
              <strong>{selectedLang.toUpperCase()}:</strong> <span className="olchiki">{langTrans?.coreExplanation}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Classroom Activity & Assessment */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">🎯 खेल-खेल में गतिविधि (Class Activity)</span>
            <span className="card-badge" style={{ background: 'var(--accent-secondary-dim)', color: 'var(--accent-secondary-light)' }}>
              FLN Activity
            </span>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--accent-secondary-light)', marginBottom: '0.25rem' }}>
              {currentPack.classroomActivity.name}
            </div>
            <p className="devanagari" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {currentPack.classroomActivity.instructions}
            </p>
            {currentPack.classroomActivity.materialsNeeded && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--accent-primary)' }}>
                🪵 <strong>सामग्री:</strong> {currentPack.classroomActivity.materialsNeeded}
              </div>
            )}
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
              ❓ समझ परख मूल्यांकन (Assessment Prompts):
            </span>
            <ul style={{ paddingLeft: '1.25rem', marginTop: '0.35rem', fontSize: '0.88rem' }} className="devanagari">
              {currentPack.assessmentPrompts.map((ap, idx) => (
                <li key={idx} style={{ marginBottom: '0.35rem' }}>{ap}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Audio Player Stream if Generated ─────────────── */}
      {audioUrl && (
        <div className="card" style={{ borderColor: 'var(--accent-primary)' }}>
          <span className="card-title" style={{ marginBottom: '0.5rem' }}>🔊 उच्चारित ध्वनि (Synthesized Speech)</span>
          <AudioPlayer src={audioUrl} fallback={selectedLang === 'santali'} usedLang="od-IN" />
        </div>
      )}

      {/* ── Action Bar: Export to Worksheet or Flashcard ─── */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            इस पाठ के आधार पर शिक्षण सामग्री बनाएं:
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>
            Direct export to NIPUN Bharat worksheets and flashcards
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onNavigateToWorksheet?.(currentPack)}
          >
            🖨️ द्विभाषी वर्कशीट बनाएं
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onNavigateToFlashcard?.(currentPack)}
          >
            🗂️ फ्लैशकार्ड डेक खोलें
          </button>
        </div>
      </div>
    </div>
  );
}
