import React, { useCallback, useEffect, useState } from 'react';
import GearModule from './components/GearModule';
import BearingModule from './components/BearingModule';
import ShaftModule from './components/ShaftModule';
import SingleGearModule from './components/SingleGearModule';
import { ComprehensiveReport } from './components/ComprehensiveReport';
import { downloadDATFiles } from './utils/datExporter';
import { GearForces, ReducerResult, ShaftResult, BearingResult } from './types';

enum Tab {
  Reducer = 'reducer',
  Shaft = 'shaft',
  Bearing = 'bearing',
  Single = 'single',
  Report = 'report'
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Reducer);

  // Shared State
  const [shaftForces, setShaftForces] = useState<GearForces | undefined>(undefined);
  const [shaftPower, setShaftPower] = useState<number>(11);
  const [shaftSpeed, setShaftSpeed] = useState<number>(1450);

  // Report Data
  const [reducerResult, setReducerResult] = useState<ReducerResult | null>(null);
  const [shaftResult, setShaftResult] = useState<ShaftResult | null>(null);
  const [bearingResults, setBearingResults] = useState<BearingResult[]>([]);

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    return savedTheme || 'dark'; // Default to dark mode
  });

  // Apply Theme Class to HTML
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleCalculateSuccess = useCallback((result: ReducerResult) => {
    setReducerResult(result);
  }, []);

  const handlePowerSpeedChange = (p: number, s: number, forces: GearForces) => {
    setShaftPower(p);
    setShaftSpeed(s);
    setShaftForces(forces);
    setActiveTab(Tab.Shaft); // Auto switch to shaft tab
  };

  const handleTabChange = (tabKey: string) => {
    if (tabKey === 'shaft') setActiveTab(Tab.Shaft);
    if (tabKey === 'bearing') setActiveTab(Tab.Bearing);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-blue-100 transition-colors duration-300">

      {/* Header with Glassmorphism */}
      <header className="sticky top-0 z-50 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 dark:shadow-blue-500/20 transform group-hover:scale-105 transition duration-300">
                  <span className="text-white font-black text-2xl">H</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                  HelixMaster <span className="font-mono text-lg opacity-60">97</span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">Modern Gear Design Suite</p>
              </div>
            </div>

            {/* Status & Theme Toggle */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-4 text-sm font-medium bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">System Ready</span>
                </div>
                <div className="w-px h-5 bg-slate-300 dark:bg-slate-600"></div>
                <div className="font-mono text-xs text-slate-500 dark:text-slate-400">v2.0.0</div>
              </div>

              <button
                onClick={toggleTheme}
                className="relative p-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 rounded-2xl transition-all duration-300 border border-slate-200/60 dark:border-slate-700/60 group"
                title="Toggle Theme"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 relative z-10 transform group-hover:rotate-45 transition-transform duration-500"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 relative z-10 transform group-hover:rotate-12 transition-transform duration-500"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Enhanced Navigation Tabs */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
            {/* Tabs Container */}
            <div className="relative w-full lg:w-auto">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-2 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-slate-200/50 dark:shadow-black/20 inline-flex flex-wrap gap-2 w-full lg:w-auto">
                {
                  [
                    { id: Tab.Reducer, label: 'Dişli Tasarımı', icon: '⚙️' },
                    { id: Tab.Shaft, label: 'Mil Mukavemet', icon: '📏' },
                    { id: Tab.Bearing, label: 'Rulman Seçimi', icon: '◎' },
                    { id: Tab.Single, label: 'Tek Dişli', icon: '🔧' },
                    { id: Tab.Report, label: 'Raporlama', icon: '📄' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as Tab)}
                      className={`
                        relative px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2.5 flex-1 lg:flex-none justify-center overflow-hidden group
                        ${activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20 scale-105'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-700/50'}
                      `}
                    >
                      {activeTab === tab.id && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-600/20 animate-pulse"></div>
                      )}
                      <span className={`text-lg transform transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'opacity-70 grayscale group-hover:scale-110 group-hover:opacity-100 group-hover:grayscale-0'
                        }`}>{tab.icon}</span>
                      <span className="relative z-10">{tab.label}</span>
                      {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/50 rounded-full"></div>
                      )}
                    </button>
                  ))
                }
              </div>
            </div>

            {/* Active Module Title */}
            <div className="hidden lg:block">
              <div className="text-right">
                <h2 className="text-2xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                  {activeTab === Tab.Reducer && "Redüktör Tasarımı"}
                  {activeTab === Tab.Shaft && "Mil Analizi"}
                  {activeTab === Tab.Bearing && "Rulman Hesabı"}
                  {activeTab === Tab.Single && "Tek Kademe"}
                  {activeTab === Tab.Report && "Proje Raporu"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-1">Aktif Modül</p>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="min-h-[600px] animate-in fade-in duration-300">

            {/* Module Render */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === Tab.Reducer && (
                <GearModule
                  onPowerSpeedChange={handlePowerSpeedChange}
                  onCalculateSuccess={handleCalculateSuccess}
                  onTabChange={handleTabChange}
                />
              )}

              {activeTab === Tab.Shaft && (
                <ShaftModule
                  defaultForces={shaftForces}
                  defaultPower={shaftPower}
                  defaultSpeed={shaftSpeed}
                  onResult={(res) => setShaftResult(res)}
                />
              )}

              {activeTab === Tab.Bearing && (
                <BearingModule
                  onResult={(res) => setBearingResults([res])}
                />
              )}

              {activeTab === Tab.Single && <SingleGearModule />}

              {activeTab === Tab.Report && reducerResult && (
                <ComprehensiveReport
                  theme={theme}
                  data={{
                    project: {
                      name: 'HelixMaster 97 Projesi',
                      designer: 'Mühendis',
                      date: new Date(),
                    },
                    reducer: reducerResult,
                    bearings: bearingResults,
                    shaft: shaftResult,
                  }}
                  onExportDAT={() => {
                    if (reducerResult.speeds) {
                      downloadDATFiles({
                        reducer: reducerResult,
                        speeds: {
                          N1: reducerResult.speeds.input,
                          N2: reducerResult.speeds.intermediate,
                          N3: reducerResult.speeds.output,
                        },
                        shaft: shaftResult || undefined,
                        bearings: bearingResults.length ? bearingResults : undefined,
                      });
                    }
                  }}
                />
              )}

              {activeTab === Tab.Report && !reducerResult && (
                <div className="flex flex-col items-center justify-center p-24 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-300/60 dark:border-slate-600/60 text-center">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-3xl blur-2xl"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-3xl flex items-center justify-center shadow-xl border border-slate-200 dark:border-slate-600">
                      <svg className="w-12 h-12 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent mb-3">Rapor Görüntülenemiyor</h3>
                  <p className="text-slate-600 dark:text-slate-400 max-w-md mb-10 leading-relaxed">
                    Henüz bir hesaplama yapılmadı. Rapor oluşturmak için lütfen önce <span className="font-bold text-slate-800 dark:text-slate-200">Dişli Tasarımı</span> sekmesinden bir sistem hesaplayın.
                  </p>
                  <button
                    onClick={() => setActiveTab(Tab.Reducer)}
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 flex items-center gap-3 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-600/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 relative z-10"><path d="M12 2v20M2 12h20" /><circle cx="12" cy="12" r="3" /></svg>
                    <span className="relative z-10">Hesaplamaya Başla</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-t border-slate-200 dark:border-slate-700/50 mt-12 py-16 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-slate-200/[0.05] dark:bg-grid-slate-700/[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(148, 163, 184, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-[1800px] mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Logo */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20 dark:shadow-blue-500/50">
                <span className="text-white font-black text-2xl">H</span>
              </div>
            </div>

            {/* Title */}
            <div>
              <h3 className="text-slate-900 dark:text-white font-bold text-xl mb-2">HelixMaster 97</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Modern Gear Design Suite</p>
            </div>

            {/* Description */}
            <p className="text-slate-500 dark:text-slate-500 text-xs max-w-md leading-relaxed">
              Designed for Advanced Engineering Applications • Redüktör Tasarımı
            </p>

            {/* Links */}
            <div className="flex items-center gap-6 pt-4">
              <a
                href="http://ulik.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-sm font-medium transition-colors duration-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:bg-blue-400 transition-colors"></span>
                Made by Ulik
              </a>
            </div>

            {/* Copyright */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 w-full max-w-md">
              <p className="text-slate-400 dark:text-slate-600 text-xs">
                © 2025 HelixMaster 97 Modernization Project. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default App;