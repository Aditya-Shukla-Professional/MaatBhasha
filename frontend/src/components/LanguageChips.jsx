// LanguageChips.jsx — Language selector with availability status
// Only Santali (sat-IN) is production-ready in this prototype.
// Other languages are marked "coming soon" and disabled.

const LANGUAGES = [
  {
    id:        'santali',
    label:     'संताली',
    script:    'ᱥᱟᱱᱛᱟᱲᱤ',
    available: true,
    langCode:  'sat-IN',
    note:      'हिंदी ↔ संताली — Sarvam AI द्वारा',
  },
  {
    id:        'ho',
    label:     'हो',
    script:    '𑣸𑣉',
    available: false,
    langCode:  'ho-IN',
    note:      'भाषा पैक विकास में है',
  },
  {
    id:        'mundari',
    label:     'मुंडारी',
    script:    'मुंडारी',
    available: false,
    langCode:  'mwr-IN',
    note:      'भाषा पैक विकास में है',
  },
  {
    id:        'kurukh',
    label:     'कुड़ुख़',
    script:    'कुड़ुख़',
    available: false,
    langCode:  'kru-IN',
    note:      'भाषा पैक विकास में है',
  },
  {
    id:        'odia',
    label:     'ओड़िया',
    script:    'ଓଡ଼ିଆ',
    available: false,
    langCode:  'od-IN',
    note:      'भाषा पैक विकास में है',
  },
];

/**
 * Props:
 *   selected: string       — currently selected language id (should always be 'santali')
 *   onChange(id: string)  — called when an available chip is selected
 */
export default function LanguageChips({ selected, onChange }) {
  function handleClick(lang) {
    if (!lang.available) {
      alert(`${lang.label}: ${lang.note}\n\nकेवल संताली (Santali) इस प्रोटोटाइप में उपलब्ध है।`);
      return;
    }
    onChange(lang.id);
  }

  return (
    <div className="chips-container" style={{ width: '100%', overflowX: 'auto', paddingBottom: '0.4rem' }}>
      <div
        className="chips-row"
        role="radiogroup"
        aria-label="लक्ष्य भाषा चुनें"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: '0.75rem',
          flexWrap: 'nowrap',
          minWidth: 'max-content'
        }}
      >
        {LANGUAGES.map(lang => {
          const isSelected = selected === lang.id;
          return (
            <div
              key={lang.id}
              className="chip-wrapper"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.35rem',
                flexShrink: 0
              }}
            >
              <button
                id={`lang-chip-${lang.id}`}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-disabled={!lang.available}
                aria-label={`${lang.label}${!lang.available ? ' — जल्द आ रहा है' : ''}`}
                className={[
                  'chip',
                  isSelected ? 'chip--selected' : '',
                  !lang.available ? 'chip--unavailable' : '',
                ].filter(Boolean).join(' ')}
                style={{
                  display: 'inline-flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.55rem',
                  padding: '0.55rem 1.1rem',
                  borderRadius: '10px',
                  border: isSelected
                    ? '2px solid #E0792B'
                    : '1.5px solid rgba(224, 121, 43, 0.35)',
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(224, 121, 43, 0.28), rgba(224, 121, 43, 0.12))'
                    : '#2A1E16',
                  color: isSelected ? '#FFA666' : '#C4B0A0',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  cursor: lang.available ? 'pointer' : 'not-allowed',
                  minHeight: '48px',
                  minWidth: '105px',
                  opacity: lang.available ? 1 : 0.65,
                  boxShadow: isSelected ? '0 0 14px rgba(224, 121, 43, 0.45)' : 'none',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
                onClick={() => handleClick(lang)}
                title={lang.available ? lang.note : `${lang.label} — ${lang.note}`}
              >
                <span
                  className={lang.id === 'santali' ? 'olchiki' : 'devanagari'}
                  style={{
                    fontSize: lang.id === 'santali' ? '1.15rem' : '1rem',
                    fontWeight: 700,
                    color: isSelected ? '#FFA666' : (lang.available ? '#E0792B' : '#8C7566')
                  }}
                >
                  {lang.script}
                </span>
                <span
                  style={{
                    fontSize: '0.85rem',
                    color: isSelected ? '#FFA666' : '#FAF2E6',
                    fontFamily: 'var(--font-devanagari)',
                    fontWeight: 600
                  }}
                >
                  {lang.label}
                </span>
              </button>
              {lang.available ? (
                <span
                  className="badge-available"
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.55rem',
                    borderRadius: '9999px',
                    background: 'rgba(114, 155, 120, 0.2)',
                    color: '#8EB994',
                    border: '1px solid rgba(114, 155, 120, 0.4)'
                  }}
                >
                  उपलब्ध
                </span>
              ) : (
                <span
                  className="badge-coming-soon"
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '9999px',
                    background: '#1E1610',
                    color: '#8C7566',
                    border: '1px solid rgba(212, 155, 66, 0.2)'
                  }}
                >
                  जल्द आ रहा है
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
