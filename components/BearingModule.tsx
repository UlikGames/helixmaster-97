
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

  const inputClass = "w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100";
  const labelClass = "block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-6">
      <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-slate-800 pb-4">
        <div className="w-8 h-8 rounded bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Rulman Ömür Hesabı</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Inputs */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-sm font-bold text-green-600 dark:text-green-400 uppercase tracking-wide">Yük Verileri</h4>
          <div>
            <label className={labelClass}>Radyal Yük (Fr)</label>
            <div className="relative">
                <input type="number" value={input.radialLoad} onChange={(e) => setInput({ ...input, radialLoad: Number(e.target.value) })} className={inputClass} />
                <span className="absolute right-3 top-2 text-xs text-slate-400">N</span>
            </div>
          </div>
          <div>
            <label className={labelClass}>Eksenel Yük (Fa)</label>
            <div className="relative">
                <input type="number" value={input.axialLoad} onChange={(e) => setInput({ ...input, axialLoad: Number(e.target.value) })} className={inputClass} />
                <span className="absolute right-3 top-2 text-xs text-slate-400">N</span>
            </div>
          </div>
          <div>
            <label className={labelClass}>Devir (n)</label>
            <div className="relative">
                <input type="number" value={input.speed} onChange={(e) => setInput({ ...input, speed: Number(e.target.value) })} className={inputClass} />
                <span className="absolute right-3 top-2 text-xs text-slate-400">rpm</span>
            </div>
          </div>
          <div>
            <label className={labelClass}>İstenen Ömür (Lh)</label>
            <div className="relative">
                <input type="number" value={input.desiredLife} onChange={(e) => setInput({ ...input, desiredLife: Number(e.target.value) })} className={inputClass} />
                <span className="absolute right-3 top-2 text-xs text-slate-400">saat</span>
            </div>
          </div>
          <div>
            <label className={labelClass}>Montaj Tipi</label>
            <select value={input.mountingType} onChange={(e) => setInput({ ...input, mountingType: e.target.value as 'Single' | 'Paired' })} className={inputClass}>
              <option value="Single">Tekil (Single)</option>
              <option value="Paired">Tertibleme (Paired)</option>
            </select>
          </div>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleCalculate}
            className="w-full mt-4 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            Hesapla
          </button>
        </div>

        {/* Middle Column: Catalog */}
        <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-gray-100 dark:border-slate-800 md:pl-8 pt-6 md:pt-0">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide mb-4">Rulman Kataloğu</h4>
          
          <div className="mb-4">
            <label className={labelClass}>Mil Çapına Göre Filtrele</label>
            <select className={inputClass} value={filterD} onChange={(e) => setFilterD(e.target.value)}>
              <option value="">Tümü</option>
              {uniqueDiameters.map(d => <option key={d} value={d}>{d} mm</option>)}
            </select>
          </div>

          <div className="h-80 overflow-y-auto border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
             <table className="w-full text-left text-sm">
               <thead className="sticky top-0 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 uppercase">
                 <tr>
                   <th className="px-3 py-2">Kod</th>
                   <th className="px-3 py-2">d</th>
                   <th className="px-3 py-2">D</th>
                   <th className="px-3 py-2">C</th>
                   <th className="px-3 py-2"></th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                 {filteredBearings.map(b => (
                   <tr key={b.code} className={`hover:bg-green-50 dark:hover:bg-slate-700/50 transition-colors ${selectedBearing?.code === b.code ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
                     <td className="px-3 py-2 font-mono">{b.code}</td>
                     <td className="px-3 py-2">{b.d}</td>
                     <td className="px-3 py-2">{b.D}</td>
                     <td className="px-3 py-2">{b.C}</td>
                     <td className="px-3 py-2 text-right">
                        <button 
                           onClick={() => {
                               setSelectedBearing(b);
                               setError(null);
                           }} 
                           className="text-xs bg-white border border-green-200 text-green-600 hover:bg-green-600 hover:text-white rounded px-2 py-1 transition-colors dark:bg-slate-800 dark:border-slate-600 dark:text-green-400 dark:hover:bg-green-600 dark:hover:text-white"
                        >
                          Seç
                        </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
          {selectedBearing && (
             <div className="mt-2 text-xs text-center bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-2 rounded border border-green-100 dark:border-green-800/30">
                Seçilen: <strong>{selectedBearing.code}</strong> (C: {selectedBearing.C} N)
             </div>
          )}
        </div>

        {/* Right Column: Results */}
        <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-gray-100 dark:border-slate-800 md:pl-8 pt-6 md:pt-0 flex flex-col">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide mb-4">Sonuçlar</h4>
          {!result ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm italic bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
               Hesaplama bekleniyor...
            </div>
          ) : (
             <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-700">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Hesaplanan Ömür (L10h)</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{result.calculatedLife.toLocaleString()} <span className="text-sm font-normal text-slate-500">saat</span></div>
                    <div className={`mt-2 text-xs inline-flex items-center px-2 py-1 rounded-full font-medium ${result.isAdequate ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {result.lifeStatus}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                        <div className="text-xs text-slate-400">Eşdeğer Yük (P)</div>
                        <div className="font-mono font-semibold text-slate-700 dark:text-slate-200">{result.equivalentLoad.toFixed(0)} N</div>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                        <div className="text-xs text-slate-400">Gerekli C</div>
                        <div className="font-mono font-semibold text-slate-700 dark:text-slate-200">{result.requiredDynamicLoad.toFixed(0)} N</div>
                    </div>
                </div>

                {result.staticCheck && (
                    <div className={`text-xs p-3 rounded border ${result.staticCheck.isSafe ? 'bg-green-50/50 border-green-100 dark:bg-green-900/10 dark:border-green-800' : 'bg-red-50/50 border-red-100 dark:bg-red-900/10 dark:border-red-800'}`}>
                        <div className="font-bold mb-1 flex justify-between">
                            <span>Statik Kontrol (S0)</span>
                            <span>{result.staticCheck.safetyFactor}</span>
                        </div>
                        <div className={result.staticCheck.isSafe ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            {result.staticCheck.isSafe ? 'Statik yük açısından güvenli.' : 'Statik yük emniyetsiz!'}
                        </div>
                    </div>
                )}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BearingModule;
