/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenId, TariffItem } from './types';
import { MOCK_TARIFF_ITEMS, CURRENT_OPERATION } from './data/mockData';
import { Navigation } from './components/Navigation';

// Screens
import { Screen1LoginOnboarding } from './components/screens/Screen1LoginOnboarding';
import { Screen2Dashboard } from './components/screens/Screen2Dashboard';
import { Screen3Wizard } from './components/screens/Screen3Wizard';
import { Screen4DataExtraction } from './components/screens/Screen4DataExtraction';
import { Screen5ConsistencyMatrix } from './components/screens/Screen5ConsistencyMatrix';
import { Screen6TariffClassifier } from './components/screens/Screen6TariffClassifier';
import { Screen7TariffDetail } from './components/screens/Screen7TariffDetail';
import { Screen8ReportShare } from './components/screens/Screen8ReportShare';
import { Screen9Settings } from './components/screens/Screen9Settings';

export default function App() {
  // Start on Screen 5 (Consistency Matrix) by default as it is the star screen requested by user,
  // or allow direct navigation to any of the 9 screens.
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('consistency-matrix');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [criticalIssuesCount, setCriticalIssuesCount] = useState<number>(2);
  const [selectedTariffItem, setSelectedTariffItem] = useState<TariffItem>(MOCK_TARIFF_ITEMS[0]);

  // Apply dark mode class to root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const handleNavigate = (screen: ScreenId, extraId?: string) => {
    if (extraId && screen === 'tariff-detail') {
      const found = MOCK_TARIFF_ITEMS.find(i => i.id === extraId);
      if (found) setSelectedTariffItem(found);
    }
    setCurrentScreen(screen);
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    } catch {
      // ignore
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-[#071324] text-white' : 'bg-[#F4F7FB] text-[#0B1F3A]'
    }`}>
      {/* Top Fixed Navigation with Brand & 9-Screen Switcher */}
      <Navigation
        currentScreen={currentScreen}
        onSelectScreen={handleNavigate}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        criticalIssuesCount={criticalIssuesCount}
      />

      {/* Main View Container */}
      <main className="pb-32 sm:pb-40">
        {currentScreen === 'login-onboarding' && (
          <Screen1LoginOnboarding
            onCompleteOnboarding={(target) => handleNavigate(target || 'dashboard')}
            darkMode={darkMode}
          />
        )}

        {currentScreen === 'dashboard' && (
          <Screen2Dashboard
            onNavigate={handleNavigate}
            darkMode={darkMode}
          />
        )}

        {currentScreen === 'wizard' && (
          <Screen3Wizard
            onNavigate={handleNavigate}
            darkMode={darkMode}
          />
        )}

        {currentScreen === 'extraction' && (
          <Screen4DataExtraction
            onNavigate={handleNavigate}
            darkMode={darkMode}
          />
        )}

        {currentScreen === 'consistency-matrix' && (
          <Screen5ConsistencyMatrix
            onNavigate={handleNavigate}
            darkMode={darkMode}
            onUpdateBlockersCount={setCriticalIssuesCount}
          />
        )}

        {currentScreen === 'classifier' && (
          <Screen6TariffClassifier
            onNavigate={handleNavigate}
            onSelectItemForDetail={(item) => setSelectedTariffItem(item)}
            darkMode={darkMode}
          />
        )}

        {currentScreen === 'tariff-detail' && (
          <Screen7TariffDetail
            onNavigate={handleNavigate}
            selectedItem={selectedTariffItem}
            darkMode={darkMode}
          />
        )}

        {currentScreen === 'report' && (
          <Screen8ReportShare
            onNavigate={handleNavigate}
            darkMode={darkMode}
          />
        )}

        {currentScreen === 'settings' && (
          <Screen9Settings
            onNavigate={handleNavigate}
            darkMode={darkMode}
          />
        )}
      </main>

      {/* Bottom Floating Step Workflow Bar for Fast Reviewing of all 9 screens */}
      <aside aria-label="Navegador rápido de pantallas" className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 bg-[#0B1F3A]/95 text-white backdrop-blur-md px-3 py-2 rounded-2xl border border-[#18335E] shadow-2xl flex items-center gap-2 max-w-[95vw] overflow-x-auto">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#00E5B0] font-bold px-2 hidden sm:inline">
          Flujo de 9 Pantallas:
        </span>
        {[
          { id: 'login-onboarding', num: '1', label: 'Login' },
          { id: 'dashboard', num: '2', label: 'Operaciones' },
          { id: 'wizard', num: '3', label: 'Wizard' },
          { id: 'extraction', num: '4', label: 'Extracción' },
          { id: 'consistency-matrix', num: '5', label: 'Matriz ★', star: true },
          { id: 'classifier', num: '6', label: 'NANDINA' },
          { id: 'tariff-detail', num: '7', label: 'Normativa' },
          { id: 'report', num: '8', label: 'Pre-DAM' },
          { id: 'settings', num: '9', label: 'Equipo' },
        ].map((step) => {
          const isActive = currentScreen === step.id;
          return (
            <button
              key={step.id}
              onClick={() => handleNavigate(step.id as ScreenId)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#00E5B0] text-[#0B1F3A] shadow-md shadow-[#00E5B0]/30 scale-105'
                  : step.star
                  ? 'bg-[#FF5A5F]/20 text-[#FF5A5F] hover:bg-[#FF5A5F]/40'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{step.num}.</span>
              <span className="hidden md:inline">{step.label}</span>
            </button>
          );
        })}
      </aside>
    </div>
  );
}
