// WorksheetGeneratorScreen.jsx — NIPUN Bharat Aligned Bilingual Worksheet Generator
// Generates printable, high-contrast A4 worksheets in Hindi + Santali (Ol Chiki)
// Supports 7 activity types, 8-12 tasks, teacher answer key, and tablet offline saving.

import { useState } from 'react';
import { FLN_PACKS } from '../data/flnCurriculumPacks';
import { saveToStore } from '../utils/offlineDb';
import LanguageChips from '../components/LanguageChips';

const WORKSHEET_TYPES = [
  { id: 'matching',   label: '🔗 शब्द-अर्थ मिलान (Word Match)' },
  { id: 'fill',       label: '✏️ रिक्त स्थान पूर्ति (Fill Blanks)' },
  { id: 'counting',   label: '🔢 संख्या गणना (Count & Match)' },
  { id: 'tracing',    label: '✍️ अक्षर अनुरेखण (Akshar Tracing)' },
  { id: 'truefalse',  label: '✓/✗ सही या गलत (True/False)' },
  { id: 'unscramble', label: '🔀 वर्ण संयोजन (Word Arrange)' },
  { id: 'oddone',     label: '🔍 भिन्न शब्द पहचान (Odd One Out)' },
];

export default function WorksheetGeneratorScreen({ initialPack }) {
  const [selectedLang,   setSelectedLang]   = useState('santali');
  const [activePackId,   setActivePackId]   = useState(initialPack?.id || FLN_PACKS[0].id);
  const [worksheetType,  setWorksheetType]  = useState('matching');
  const [showAnswerKey,  setShowAnswerKey]  = useState(false);
  const [isSaved,        setIsSaved]        = useState(false);

  const activePack = FLN_PACKS.find(p => p.id === activePackId) || FLN_PACKS[0];
  const langData   = activePack.translations?.[selectedLang] || activePack.translations?.['santali'];
  const vocabList  = langData?.vocabulary || [];

  function handlePrint() {
    window.print();
  }

  async function handleSaveOffline() {
    try {
      await saveToStore('worksheets', {
        title: `${activePack.title} - ${selectedLang.toUpperCase()}`,
        topic: activePack.theme,
        competencyCode: activePack.competencyCode,
        lang: selectedLang,
        worksheetType,
        createdAt: new Date().toISOString()
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (e) {
      alert('Save error: ' + e.message);
    }
  }

  return (
    <div className="screen">
      {/* ── Control Bar (Hidden on Print) ────────────────── */}
      <div className="card no-print" style={{ background: '#1E1610', border: '1.5px solid rgba(224, 121, 43, 0.35)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#FF9447', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              🖨️ PALASH NIPUN Bharat Worksheet Generator
            </span>
            <h2 style={{ fontSize: '1.25rem', color: '#FAF2E6', marginTop: '2px', fontWeight: 800 }}>
              द्विभाषी कार्यपत्रक (Bilingual Printable Worksheets)
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowAnswerKey(k => !k)}
              style={{
                fontSize: '0.85rem',
                background: '#2A1E16',
                color: '#FAF2E6',
                border: '1.5px solid rgba(224, 121, 43, 0.4)',
                padding: '0.5rem 0.9rem',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              {showAnswerKey ? '🙈 उत्तर कुंजी छुपाएं' : '🔑 उत्तर कुंजी (Answer Key)'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleSaveOffline}
              style={{
                fontSize: '0.85rem',
                background: 'rgba(114, 155, 120, 0.22)',
                color: '#8EB994',
                border: '1.5px solid #729B78',
                padding: '0.5rem 0.9rem',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              {isSaved ? '✓ सुरक्षित है' : '💾 टैबलेट में सेव करें'}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handlePrint}
              style={{
                fontSize: '0.85rem',
                background: 'linear-gradient(135deg, #E0792B, #FF9447)',
                color: '#160F0A',
                border: 'none',
                fontWeight: 700,
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(224, 121, 43, 0.35)'
              }}
            >
              🖨️ A4 शीट प्रिंट करें (Print / PDF)
            </button>
          </div>
        </div>

        {/* Configurations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Pack selector */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.35rem' }}>
            {FLN_PACKS.map(pack => {
              const isSelected = activePackId === pack.id;
              return (
                <button
                  key={pack.id}
                  type="button"
                  className={`btn ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                  style={{
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.82rem',
                    flexShrink: 0,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: isSelected
                      ? 'linear-gradient(135deg, #E0792B, #FF9447)'
                      : '#2A1E16',
                    color: isSelected ? '#160F0A' : '#FAF2E6',
                    border: isSelected ? '1px solid #FF9447' : '1.5px solid rgba(224, 121, 43, 0.35)',
                    fontWeight: isSelected ? 700 : 500
                  }}
                  onClick={() => setActivePackId(pack.id)}
                >
                  {pack.title}
                </button>
              );
            })}
          </div>

          <LanguageChips selected={selectedLang} onChange={setSelectedLang} />

          {/* Activity Type Chips */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#C4B0A0', fontWeight: 600 }}>प्रकार:</span>
            {WORKSHEET_TYPES.map(t => {
              const isSelected = worksheetType === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  className={`chip-btn ${isSelected ? 'selected' : ''}`}
                  style={{
                    background: isSelected
                      ? 'linear-gradient(135deg, #E0792B, #FF9447)'
                      : '#2A1E16',
                    color: isSelected ? '#160F0A' : '#C4B0A0',
                    border: isSelected ? '1.5px solid #FF9447' : '1.5px solid rgba(224, 121, 43, 0.35)',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '9999px',
                    fontSize: '0.82rem',
                    fontWeight: isSelected ? 700 : 600,
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 0 10px rgba(224, 121, 43, 0.4)' : 'none'
                  }}
                  onClick={() => setWorksheetType(t.id)}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>


      {/* ── Printable A4 Worksheet Document ──────────────── */}
      <div className="worksheet-paper">
        {/* Header Strip */}
        <div className="worksheet-header">
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#666', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              झारखंड प्राथमिक शिक्षा परियोजना परिषद (JEPC) · PALASH MTB-MLE
            </div>
            <h2 style={{ fontSize: '1.35rem', color: '#000', margin: '4px 0', fontWeight: 800 }}>
              {activePack.title} — अभ्यास कार्यपत्रक (Class {activePack.gradeLevel})
            </h2>
            <div style={{ fontSize: '0.85rem', color: '#444' }}>
              <strong>NIPUN Bharat दक्षता:</strong> {activePack.competencyCode} ({activePack.competencyTitle})
            </div>
          </div>

          <div style={{ textAlign: 'right', border: '1.5px solid #222', padding: '6px 12px', borderRadius: '4px', fontSize: '0.8rem' }}>
            <div><strong>भाषा:</strong> हिंदी + {selectedLang.toUpperCase()}</div>
            <div><strong>दिनांक:</strong> ____________</div>
          </div>
        </div>

        {/* Student Details Line */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #666', paddingBottom: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
          <span><strong>विद्यार्थी का नाम:</strong> ______________________</span>
          <span><strong>रोल नंबर:</strong> _______</span>
          <span><strong>विद्यालय:</strong> _____________________</span>
        </div>

        {/* Worksheet Instructions */}
        <div style={{ background: '#f5f5f5', padding: '8px 12px', borderRadius: '4px', borderLeft: '4px solid #333', marginBottom: '20px', fontSize: '0.9rem' }}>
          <strong>निर्देश (Instructions):</strong> नीचे दिए गए प्रश्नों को ध्यान से पढ़ें और सही उत्तर लिखें।
        </div>

        {/* 1. MATCHING ACTIVITY */}
        {worksheetType === 'matching' && (
          <div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '12px', color: '#111111' }}>
              भाग १: हिंदी शब्द को संताली (Ol Chiki) शब्द से रेखा खींचकर मिलाओ:
            </h4>
            <div className="worksheet-grid">
              {/* Column A (Hindi) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', borderBottom: '1px solid #999', paddingBottom: '4px' }}>स्तंभ क (हिंदी)</div>
                {vocabList.slice(0, 6).map((v, i) => (
                  <div key={i} className="worksheet-item" style={{ background: '#fafafa' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>({i + 1}) {v.hi}</span>
                    <span style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid #333', display: 'inline-block' }}></span>
                  </div>
                ))}
              </div>

              {/* Column B (Santali Scrambled) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', borderBottom: '1px solid #999', paddingBottom: '4px' }}>स्तंभ ख (ᱥᱟᱱᱛᱟᱲᱤ)</div>
                {[...vocabList.slice(0, 6)].reverse().map((v, i) => (
                  <div key={i} className="worksheet-item" style={{ background: '#fafafa' }}>
                    <span style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid #333', display: 'inline-block' }}></span>
                    <span className="olchiki" style={{ fontWeight: 700, fontSize: '1.15rem' }}>
                      {v.tribal}
                      {v.romanAid && <span style={{ fontSize: '0.75rem', color: '#666', marginLeft: '0.4rem', fontWeight: 400 }}>({v.romanAid})</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. FILL IN THE BLANKS */}
        {worksheetType === 'fill' && (
          <div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '14px', color: '#111111' }}>
              भाग १: सही शब्द चुनकर खाली स्थान भरें (Choose & Fill):
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {vocabList.slice(0, 6).map((v, i) => (
                <div key={i} style={{ border: '1px solid #ddd', padding: '10px 14px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '1rem', marginBottom: '4px' }}>
                    ({i + 1}) <strong>{v.hi}</strong> को संताली में क्या कहते हैं?
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '4px', fontSize: '0.92rem' }}>
                    <span>उत्तर: ________________________ (संताली Ol Chiki शब्द)</span>
                    <span style={{ color: '#666' }}>अंग्रेज़ी अर्थ: {v.en}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. COUNTING & MATH */}
        {worksheetType === 'counting' && (
          <div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '14px', color: '#111111' }}>
              भाग १: चित्रों को गिनो और संताली में सही संख्या लिखो (Count & Write in Santali):
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              {[
                { count: 3, icon: '🌳', label: 'तीन पेड़', sat: 'ᱯᱮ (Pey)' },
                { count: 5, icon: '🐟', label: 'पाँच मछली', sat: 'ᱢᱚᱬᱮ (More)' },
                { count: 2, icon: '🐄', label: 'दो गाय', sat: 'ᱵᱟᱨ (Bar)' },
                { count: 4, icon: '🌸', label: 'चार फूल', sat: 'ᱯᱩᱱ (Pun)' },
                { count: 1, icon: '☀️', label: 'एक सूरज', sat: 'ᱢᱤᱫ (Mid)' },
                { count: 6, icon: '🍃', label: 'छह पत्ते', sat: 'ᱛᱩᱨᱩᱭ (Turuy)' },
              ].map((item, idx) => (
                <div key={idx} style={{ border: '1.5px solid #444', padding: '12px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '1.6rem', letterSpacing: '4px', marginBottom: '6px' }}>
                    {Array.from({ length: item.count }, () => item.icon).join(' ')}
                  </div>
                  <div style={{ fontSize: '0.88rem' }}>
                    <strong>संख्या (अंक):</strong> [ ____ ] | <strong>संताली में:</strong> _______________
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. AKSHAR TRACING */}
        {worksheetType === 'tracing' && (
          <div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '14px', color: '#111111' }}>
              भाग १: वर्ण और शब्द अनुरेखण (Trace and Write Ol Chiki Words):
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {vocabList.slice(0, 6).map((v, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #ccc', padding: '10px 14px' }}>
                  <div style={{ width: '130px', fontWeight: 800, fontSize: '1.1rem' }}>{v.hi} ({v.en})</div>
                  <div style={{ flex: 1, borderBottom: '2px dashed #999', height: '32px', margin: '0 1rem' }}></div>
                  <div className="olchiki" style={{ width: '160px', fontWeight: 800, fontSize: '1.25rem', color: '#444' }}>
                    {v.tribal}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. TRUE / FALSE */}
        {worksheetType === 'truefalse' && (
          <div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '14px', color: '#111111' }}>
              भाग १: सही (✓) या गलत (✗) का निशान लगाओ (Mark True / False):
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {vocabList.slice(0, 6).map((v, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #ddd', padding: '10px 14px', borderRadius: '4px' }}>
                  <span style={{ fontSize: '0.95rem' }}>
                    ({i + 1}) "<strong>{v.hi}</strong>" को संताली में "<span className="olchiki">{v.tribal}</span>" कहते हैं।
                  </span>
                  <div style={{ display: 'flex', gap: '0.75rem', fontWeight: 700 }}>
                    <span style={{ border: '1.5px solid #333', padding: '3px 10px', borderRadius: '4px' }}>[  ] सही (✓)</span>
                    <span style={{ border: '1.5px solid #333', padding: '3px 10px', borderRadius: '4px' }}>[  ] गलत (✗)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. WORD UNSCRAMBLE */}
        {worksheetType === 'unscramble' && (
          <div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '14px', color: '#111111' }}>
              भाग १: सही क्रम में जोड़कर संताली शब्द बनाओ (Unscramble the Word):
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {vocabList.slice(0, 5).map((v, i) => (
                <div key={i} style={{ border: '1px solid #ddd', padding: '10px 14px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.95rem', marginBottom: '4px' }}>
                    ({i + 1}) हिंदी अर्थ: <strong>{v.hi}</strong> ({v.en})
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '4px', fontSize: '0.92rem' }}>
                    <span>संताली में सही शब्द: ________________________</span>
                    <span style={{ color: '#666', fontStyle: 'italic' }}>संकेत उच्चारण: {v.romanAid || ''}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. ODD ONE OUT */}
        {worksheetType === 'oddone' && (
          <div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '14px', color: '#111111' }}>
              भाग १: समूह में से अलग (भिन्न) शब्द पर गोला लगाओ (Circle the Odd One Out):
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                { items: ['ᱢᱤᱫ (1)', 'ᱵᱟᱨ (2)', 'ᱯᱩᱛᱷᱤ (किताब)', 'ᱯᱮ (3)'], odd: 'ᱯᱩᱛᱷᱤ' },
                { items: ['ᱫᱟᱨᱮ (पेड़)', 'ᱥᱟᱠᱟᱢ (पत्ता)', 'ᱵᱟᱦᱟ (फूल)', 'ᱫᱟᱜ (पानी)'], odd: 'ᱫᱟᱜ' },
                { items: ['ᱜᱟᱹᱭ (गाय)', 'ᱰᱟᱝᱜᱽᱨᱟ (बैल)', 'ᱢᱮᱨᱚᱢ (बकरी)', 'ᱥᱟᱨᱡᱚᱢ (पेड़)'], odd: 'ᱥᱟᱨᱡᱚᱢ' },
                { items: ['ᱢᱮᱫ (आँख)', 'ᱢᱩ (नाक)', 'ᱞᱩᱛᱩᱨ (कान)', 'ᱥᱮᱨᱮᱧ (गीत)'], odd: 'ᱥᱮᱨᱮᱧ' },
              ].map((group, i) => (
                <div key={i} style={{ border: '1px solid #ddd', padding: '10px 14px', borderRadius: '6px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>({i + 1}) </span>
                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '4px', flexWrap: 'wrap' }}>
                    {group.items.map((it, j) => (
                      <span key={j} style={{ border: '1px solid #999', padding: '4px 12px', borderRadius: '20px', fontSize: '0.95rem' }}>
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Teacher Answer Key ───────────────────────────── */}
        {showAnswerKey && (
          <div style={{ marginTop: '24px', border: '1.5px dashed #555', padding: '12px 16px', background: '#fafafa', borderRadius: '6px' }}>
            <h5 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: '#333' }}>
              🔑 शिक्षक उत्तर कुंजी (Teacher Answer Key):
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem' }}>
              {vocabList.map((v, idx) => (
                <div key={idx}>
                  <strong>({idx + 1}) {v.hi}:</strong> <span className="olchiki">{v.tribal}</span> {v.romanAid ? `(${v.romanAid})` : ''}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evaluation Rubric Footer */}
        <div style={{ marginTop: '28px', borderTop: '2px solid #222', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#555' }}>
          <div>
            <strong>शिक्षक टिप्पणी (Teacher Signature & Feedback):</strong> ______________________
          </div>
          <div>
            <strong>अंक / स्टार:</strong> ⭐️ ⭐️ ⭐️ ⭐️ ⭐️
          </div>
        </div>
      </div>
    </div>
  );
}
