// Header.jsx — PALASH MTB-MLE Navigation Header with Smart Board Mode & Module Tabs

import { useState, useEffect } from 'react';

const TABS = [
  { id: 'compose',    label: '📝 पाठ अनुवाद',    sub: 'Lesson Translator' },
  { id: 'dialogue',   label: '🗣️ दो-तरफ़ा संवाद', sub: 'Live Voice Bridge' },
  { id: 'curriculum', label: '📚 FLN पाठ योजना',  sub: 'Curriculum Hub' },
  { id: 'worksheet',  label: '🖨️ द्विभाषी वर्कशीट', sub: 'Worksheet Gen' },
  { id: 'flashcard',  label: '🗂️ फ्लैशकार्ड डेक',  sub: 'Visual Flashcards' },
  { id: 'offline',    label: '📡 ऑफलाइन सिंक',   sub: 'Tablet Sync' },
];

export default function Header({ activeTab, onSelectTab, isSmartBoardMode, onToggleSmartBoard }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline  = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online',  handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online',  handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="app-header no-print">
      {/* ── Top Header Bar ───────────────────────────────── */}
      <div className="header-top">
        <div className="logo-group">
          <div className="logo-badge" aria-hidden="true">
            🌿
          </div>
          <div className="title-container">
            <h1>
              PALASH MaatBhasha
              <span style={{ fontSize: '0.72rem', background: 'var(--accent-primary-dim)', color: 'var(--accent-primary)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(212,155,66,0.3)' }}>
                MTB-MLE
              </span>
            </h1>
            <div className="sub-label">
              झारखंड मातृभाषा शिक्षण मंच · Santhali (Ol Chiki) · Ho · Mundari · Kurukh · Odia
            </div>
          </div>
        </div>

        {/* Actions & Toggles */}
        <div className="header-actions">
          {/* Smart Board / Projector Mode Toggle */}
          <button
            type="button"
            className={`btn ${isSmartBoardMode ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.4rem 0.9rem', fontSize: '0.82rem', borderRadius: 'var(--radius-full)' }}
            onClick={onToggleSmartBoard}
            aria-pressed={isSmartBoardMode}
            title="स्मार्ट बोर्ड / प्रोजेक्टर के लिए बड़े फॉन्ट और उच्च कंट्रास्ट दृश्य"
          >
            {isSmartBoardMode ? '🖥️ स्मार्ट बोर्ड सक्रिय' : '🖥️ स्मार्ट बोर्ड मोड'}
          </button>

          {/* Network Status Pill */}
          <span
            className={`offline-status-pill ${isOnline ? 'online' : 'offline'}`}
            role="status"
            aria-label={isOnline ? 'Online mode' : 'Offline mode'}
            style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem' }}
          >
            {isOnline ? '🟢 Online' : '🔴 Offline Mode'}
          </span>
        </div>
      </div>

      {/* ── Sohrai Tribal Motif Strip ────────────────────── */}
      <div className="sohrai-motif" role="presentation" aria-hidden="true" />

      {/* ── Navigation Tabs ──────────────────────────────── */}
      <nav className="nav-tabs" role="tablist" aria-label="मुख्य मॉड्यूल नेविगेशन">
        {TABS.map(tab => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onSelectTab(tab.id)}
          >
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>
    </header>
  );
}
