// App.jsx — Main Application Controller for PALASH MTB-MLE Education Suite

import { useState, useEffect } from 'react';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import ComposeScreen from './screens/ComposeScreen';
import ResultScreen from './screens/ResultScreen';
import ClassroomDialogueScreen from './screens/ClassroomDialogueScreen';
import CurriculumHubScreen from './screens/CurriculumHubScreen';
import WorksheetGeneratorScreen from './screens/WorksheetGeneratorScreen';
import FlashcardDeckScreen from './screens/FlashcardDeckScreen';
import OfflineSyncScreen from './screens/OfflineSyncScreen';
import { openOfflineDB } from './utils/offlineDb';

export default function App() {
  const [activeTab, setActiveTab] = useState('compose'); // 'compose' | 'dialogue' | 'curriculum' | 'worksheet' | 'flashcard' | 'offline'
  const [composeResult, setComposeResult] = useState(null);
  const [selectedPackForExport, setSelectedPackForExport] = useState(null);
  const [isSmartBoardMode, setIsSmartBoardMode] = useState(false);

  // Initialize offline IndexedDB on startup
  useEffect(() => {
    openOfflineDB().catch(e => console.warn('Offline DB init notice:', e));
  }, []);

  function handleComposeResult(res) {
    setComposeResult(res);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleBackToCompose() {
    setComposeResult(null);
  }

  function handleNavigateToWorksheet(pack) {
    setSelectedPackForExport(pack);
    setActiveTab('worksheet');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleNavigateToFlashcard(pack) {
    setSelectedPackForExport(pack);
    setActiveTab('flashcard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleSmartBoardMode() {
    setIsSmartBoardMode(prev => {
      const next = !prev;
      if (next) {
        document.body.classList.add('smart-board-mode');
      } else {
        document.body.classList.remove('smart-board-mode');
      }
      return next;
    });
  }

  return (
    <ErrorBoundary>
      {/* Accessible Skip to Content Link (WCAG 2.1 AA) */}
      <a href="#main-content" className="skip-link">
        मुख्य सामग्री पर जाएं (Skip to main content)
      </a>

      <div className={`app-container ${isSmartBoardMode ? 'smart-board-layout' : ''}`}>
        <Header
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isSmartBoardMode={isSmartBoardMode}
          onToggleSmartBoard={toggleSmartBoardMode}
        />

        <main id="main-content" className="main-content" tabIndex="-1">
          {/* Module 1: Lesson Translator */}
          {activeTab === 'compose' && (
            composeResult ? (
              <ResultScreen
                result={composeResult}
                onBack={handleBackToCompose}
                onNavigateToWorksheet={() => setActiveTab('worksheet')}
                onNavigateToFlashcard={() => setActiveTab('flashcard')}
              />
            ) : (
              <ComposeScreen onResult={handleComposeResult} />
            )
          )}

          {/* Module 2: Real-time Voice Dialogue */}
          {activeTab === 'dialogue' && (
            <ClassroomDialogueScreen />
          )}

          {/* Module 3: NIPUN Bharat FLN Curriculum Hub */}
          {activeTab === 'curriculum' && (
            <CurriculumHubScreen
              onNavigateToWorksheet={handleNavigateToWorksheet}
              onNavigateToFlashcard={handleNavigateToFlashcard}
            />
          )}

          {/* Module 4: Bilingual Printable Worksheets */}
          {activeTab === 'worksheet' && (
            <WorksheetGeneratorScreen initialPack={selectedPackForExport} />
          )}

          {/* Module 5: Interactive 3D Flashcards */}
          {activeTab === 'flashcard' && (
            <FlashcardDeckScreen isSmartBoardMode={isSmartBoardMode} />
          )}

          {/* Module 6: Offline Tablet Sync */}
          {activeTab === 'offline' && (
            <OfflineSyncScreen />
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}
