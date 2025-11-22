
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
    return savedTheme || 'light';
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

  const handleCalculateSuccess = useCallback((result: ReducerResult) => {
    setReducerResult(result);
  }, []);

  const handlePowerSpeedChange = (p: number, s: number, forces: GearForces) => {
    setShaftPower(p);
    setShaftSpeed(s);
    setShaftForces(forces);
    setActiveTab(Tab.Shaft); // Auto switch to shaft tab
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      
      {/* Header - Hidden on Print */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-gray-200 dark:border-slate-800 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              H
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight leading-none">HELIXMASTER 97</h1>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Modern Dişli Tasarımı</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
             {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1 mr-4">
              {[
                { key: Tab.Reducer, label: 'Redüktör' },
                { key: Tab.Shaft, label: 'Mil' },
                { key: Tab.Bearing, label: 'Rulman' },
                { key: Tab.Single, label: 'Tek Dişli' },
                { key: Tab.Report, label: 'Rapor' }
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeTab === item.key
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Nav (Simple) */}
        <div className="md:hidden border-t border-gray-200 dark:border-slate-800 overflow-x-auto">
            <div className="flex p-2 gap-2 min-w-max">
                {[
                    { key: Tab.Reducer, label: 'Redüktör' },
                    { key: Tab.Shaft, label: 'Mil' },
                    { key: Tab.Bearing, label: 'Rulman' },
                    { key: Tab.Single, label: 'Tek Dişli' },
                    { key: Tab.Report, label: 'Rapor' }
                ].map((item) => (
                    <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap ${
                        activeTab === item.key
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-gray-200 dark:border-slate-700'
                    }`}
                    >
                    {item.label}
                    </button>
                ))}
            </div>
        </div>
      </header>

      {/* Main Content - Adjusted for Print */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full print:p-0 print:max-w-none print:w-full">
        <div className="mb-8 print:hidden">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {activeTab === Tab.Reducer && '2 Kademeli Redüktör Tasarımı'}
                {activeTab === Tab.Shaft && 'Mil ve Kama Hesabı'}
                {activeTab === Tab.Bearing && 'Rulman Seçimi ve Ömür'}
                {activeTab === Tab.Single && 'Tek Kademe Dişli Hesabı'}
                {activeTab === Tab.Report && 'Tasarım Raporu'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
                {activeTab === Tab.Reducer && 'Komple sistem geometrisi, kuvvetler ve mukavemet kontrolü.'}
                {activeTab === Tab.Shaft && 'Burulma ve eğilme momentlerine göre çap tayini.'}
                {activeTab === Tab.Bearing && 'SKF kataloğundan rulman seçimi ve L10h ömür hesabı.'}
                {activeTab === Tab.Single && 'Hızlı hesaplama için bağımsız tek kademe modülü.'}
                {activeTab === Tab.Report && 'Proje çıktıları, PDF ve AutoCAD export seçenekleri.'}
            </p>
        </div>

        {/* Module Render */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === Tab.Reducer && (
            <GearModule
                onPowerSpeedChange={handlePowerSpeedChange}
                onCalculateSuccess={handleCalculateSuccess}
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
                <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center print:hidden">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Rapor Hazır Değil</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">
                        Rapor oluşturabilmek için önce "Redüktör" sekmesinden bir hesaplama yapmanız gerekmektedir.
                    </p>
                    <button 
                        onClick={() => setActiveTab(Tab.Reducer)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Hesaplamaya Git
                    </button>
                </div>
            )}
        </div>
      </main>

      {/* Footer - Hidden on Print */}
      <footer className="border-t border-gray-200 dark:border-slate-800 mt-auto py-8 text-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm print:hidden">
        <p className="text-sm text-slate-500 dark:text-slate-400">
            Made by <a href="https://ulik.vercel.app/" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">Ulik</a>
        </p>
      </footer>
    </div>
  );
};

export default App;