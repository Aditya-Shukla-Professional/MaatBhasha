// GradeSelector.jsx — Grade level selector (Class 1-2, 3-5, 6-8)

const GRADES = [
  { id: '1-2', label: 'Class 1-2', sub: 'Ages 6–7', emoji: '🌱' },
  { id: '3-5', label: 'Class 3-5', sub: 'Ages 8–10', emoji: '📖' },
  { id: '6-8', label: 'Class 6-8', sub: 'Ages 11–13', emoji: '🎓' },
];

/**
 * Props:
 *   selected: string       — "1-2" | "3-5" | "6-8"
 *   onChange(id: string)  — called on selection
 */
export default function GradeSelector({ selected, onChange }) {
  return (
    <div className="grade-row" role="radiogroup" aria-label="Grade level">
      {GRADES.map(grade => {
        const isSelected = selected === grade.id;
        return (
          <button
            key={grade.id}
            id={`grade-btn-${grade.id}`}
            type="button"
            role="radio"
            aria-checked={isSelected}
            className={`grade-btn${isSelected ? ' grade-btn--selected' : ''}`}
            style={{
              background: isSelected ? 'linear-gradient(135deg, rgba(224, 121, 43, 0.28), rgba(224, 121, 43, 0.14))' : '#2A1E16',
              border: isSelected ? '2px solid #E0792B' : '1.5px solid rgba(212, 155, 66, 0.3)',
              color: isSelected ? '#FFA666' : '#C4B0A0',
              borderRadius: '8px',
              padding: '0.55rem 1.15rem',
              cursor: 'pointer',
              minHeight: '52px',
              minWidth: '105px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              boxShadow: isSelected ? '0 0 14px rgba(224, 121, 43, 0.45)' : 'none'
            }}
            onClick={() => onChange(grade.id)}
          >
            <span style={{ fontSize: '1.1rem', display: 'block', marginBottom: '2px' }}>
              {grade.emoji}
            </span>
            <span style={{ fontWeight: isSelected ? 700 : 600 }}>{grade.label}</span>
            <span style={{ display: 'block', fontSize: '0.7rem', opacity: isSelected ? 0.9 : 0.75 }}>
              {grade.sub}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export { GRADES };

