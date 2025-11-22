import React, { useState, useMemo } from 'react';
import { BearingInput, BearingResult, BearingData } from '../types';
import { BEARING_DATABASE } from '../constants';
import { calculateBearing } from '../utils/calculations';

interface Props {
  onResult?: (result: BearingResult) => void;
}

const BearingModule: React.FC<Props> = ({ onResult }) => {
  const [input, setInput] = useState<BearingInput>({
    radialLoad: 4800,
    axialLoad: 1000,
    speed: 500,
    desiredLife: 22000,
    mountingType: 'Single'
  });

  const [filterD, setFilterD] = useState<string>("");
  const [selectedBearing, setSelectedBearing] = useState<BearingData | null>(null);
  const [result, setResult] = useState<BearingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);

    if (!selectedBearing) {
      setError("Lütfen hesaplama yapmak için tablodan bir rulman seçiniz.");
      return;
    }

    try {
      const res = calculateBearing({ ...input, selectedBearing: selectedBearing });
      setResult(res);
      if (onResult) onResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hesaplama sırasında bir hata oluştu.");
    }
  };

  const filteredBearings = useMemo(() => {
    if (!filterD) return BEARING_DATABASE;
    return BEARING_DATABASE.filter(b => b.d.toString() === filterD);
  }, [filterD]);

  const uniqueDiameters = useMemo(() => {
    return Array.from(new Set(BEARING_DATABASE.map(b => b.d))).sort((a, b) => a - b);
  }, []);

  // Premium UI Classes - Modern Design System
  const cardClass = "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-200/60 dark:border-slate-700/60 overflow-hidden h-full flex flex-col hover:shadow-2xl hover:shadow-slate-300/50 dark:hover:shadow-black/30 transition-all duration-300";
  const headerClass = "bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50 dark:from-slate-800 dark:via-slate-750 dark:to-slate-800 px-6 py-5 border-b border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3";
  const headerTitleClass = "font-black text-slate-900 dark:text-white text-lg tracking-tight";
  const labelClass = "block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2";
  const inputClass = "w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-300 dark:hover:border-slate-600 outline-none transition-all duration-200 shadow-sm";
  const selectClass = "w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-300 dark:hover:border-slate-600 outline-none transition-all duration-200 appearance-none shadow-sm cursor-pointer";

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-6 font-sans">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Inputs */}
        <div className="lg:col-span-4">
          <div className={cardClass}>
            <div className={headerClass}>
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 2v20M2 12h20" /><circle cx="12" cy="12" r="3" /></svg>
              </div>
              <h3 className={headerTitleClass}>Yük Verileri</h3>
            </div>

            <div className="p-6 space-y-5 flex-1">
              <div>
                <label className={labelClass}>Radyal Yük (Fr)</label>
                <div className="relative">
                  <input type="number" value={input.radialLoad} onChange={(e) => setInput({ ...input, radialLoad: Number(e.target.value) })} className={inputClass} />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-400 dark:text-slate-500">N</span>
                </div>
              </div>
              <div>
                <label className={labelClass}>Eksenel Yük (Fa)</label>
                <div className="relative">
                  <input type="number" value={input.axialLoad} onChange={(e) => setInput({ ...input, axialLoad: Number(e.target.value) })} className={inputClass} />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">N</span>
                </div>
              </div>
              <div>
                <label className={labelClass}>Devir (n)</label>
                <div className="relative">
                  <input type="number" value={input.speed} onChange={(e) => setInput({ ...input, speed: Number(e.target.value) })} className={inputClass} />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">rpm</span>
                </div>
              </div>
              <div>
                <label className={labelClass}>İstenen Ömür (Lh)</label>
                <div className="relative">
                  <input type="number" value={input.desiredLife} onChange={(e) => setInput({ ...input, desiredLife: Number(e.target.value) })} className={inputClass} />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">saat</span>
                </div>
              </div>
              <div>
                <label className={labelClass}>Montaj Tipi</label>
                <select value={input.mountingType} onChange={(e) => setInput({ ...input, mountingType: e.target.value as 'Single' | 'Paired' })} className={selectClass}>
                  <option value="Single">Tekil (Single)</option>
                  <option value="Paired">Tertibleme (Paired)</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs p-3 rounded-lg font-medium">
                  {error}
                </div>
              )}

              <button
                onClick={handleCalculate}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 mt-4"
              >
                <span>HESAPLA</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Middle Column: Catalog */}
        <div className="lg:col-span-4">
          <div className={cardClass}>
            <div className={headerClass}>
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
              </div>
              <h3 className={headerTitleClass}>Rulman Kataloğu</h3>
            </div>

            <div className="p-6 flex flex-col h-full">
              <div className="mb-4">
                <label className={labelClass}>Mil Çapına Göre Filtrele</label>
                <select className={selectClass} value={filterD} onChange={(e) => setFilterD(e.target.value)}>
                  <option value="">Tümü</option>
                  {uniqueDiameters.map(d => <option key={d} value={d}>{d} mm</option>)}
                </select>
              </div>

              <div className="flex-1 overflow-hidden border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 flex flex-col">
                <div className="overflow-y-auto flex-1">
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">
                      <tr>
                        <th className="px-4 py-3">Kod</th>
                        <th className="px-4 py-3">d</th>
                        <th className="px-4 py-3">D</th>
                        <th className="px-4 py-3">C</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                      {filteredBearings.map(b => (
                        <tr key={b.code} className={`hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors ${selectedBearing?.code === b.code ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}>
                          <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-slate-100">{b.code}</td>
                          <td className="px-4 py-3">{b.d}</td>
                          <td className="px-4 py-3">{b.D}</td>
                          <td className="px-4 py-3">{b.C}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedBearing(b);
                                setError(null);
                              }}
                              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors ${selectedBearing?.code === b.code ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400'}`}
                            >
                              {selectedBearing?.code === b.code ? 'SEÇİLDİ' : 'SEÇ'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedBearing && (
                <div className="mt-4 text-xs text-center bg-blue-50 text-blue-700 p-3 rounded-xl border border-blue-100 font-medium">
                  Seçilen Rulman: <strong className="text-blue-900">{selectedBearing.code}</strong> (C: {selectedBearing.C} N)
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-4">
          <div className={cardClass}>
            <div className={headerClass}>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              </div>
              <h3 className={headerTitleClass}>Sonuçlar</h3>
            </div>

            <div className="p-6 flex flex-col h-full">
              {!result ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-sm bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-8 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 mb-3 opacity-50"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                  <p>Hesaplama yapmak için rulman seçip HESAPLA butonuna basın.</p>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                  <div className="bg-slate-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" /></svg>
                    </div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Hesaplanan Ömür (L10h)</div>
                    <div className="text-4xl font-bold mb-4">{result.calculatedLife.toLocaleString()} <span className="text-lg font-normal text-slate-500">saat</span></div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${result.isAdequate ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/50' : 'bg-red-500/20 text-red-400 ring-1 ring-red-500/50'}`}>
                      {result.lifeStatus}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-xs font-bold text-slate-400 uppercase mb-1">Eşdeğer Yük (P)</div>
                      <div className="font-mono font-bold text-slate-800 text-lg">{result.equivalentLoad.toFixed(0)} N</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-xs font-bold text-slate-400 uppercase mb-1">Gerekli C</div>
                      <div className="font-mono font-bold text-slate-800 text-lg">{result.requiredDynamicLoad.toFixed(0)} N</div>
                    </div>
                  </div>

                  {result.staticCheck && (
                    <div className={`p-4 rounded-xl border ${result.staticCheck.isSafe ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Statik Kontrol (S0)</span>
                        <span className={`font-mono font-bold ${result.staticCheck.isSafe ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>{result.staticCheck.safetyFactor}</span>
                      </div>
                      <div className={`text-xs font-medium ${result.staticCheck.isSafe ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {result.staticCheck.isSafe ? 'Statik yük açısından güvenli.' : 'Statik yük emniyetsiz!'}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BearingModule;
