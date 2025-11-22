
import React, { useState, useEffect } from 'react';
import { ReducerInput, ReducerResult, SingleStageResult } from '../types';
import { GEAR_MATERIALS } from '../constants';
import { calculateReducer } from '../utils/calculations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import KoFactorSelector from './KoFactorSelector';
import { RatioDistributionPanel } from './RatioDistributionPanel';
import { GearVisualizer } from './GearVisualizer';

interface Props {
  onCalculateSuccess?: (result: ReducerResult) => void;
  onPowerSpeedChange?: (power: number, speed: number, forces: any) => void;
}

const GearModule: React.FC<Props> = ({ onCalculateSuccess, onPowerSpeedChange }) => {
  const [input, setInput] = useState<ReducerInput>({
    totalPower: 11,
    inputSpeed: 1450,
    outputSpeed: 100,
    totalRatio: 14.5,
    stage1PinionTeeth: 20,
    stage2PinionTeeth: 20,
    efficiency: 0.95,
    stage1HelixAngle: 15,
    stage1Material: GEAR_MATERIALS[8],
    stage1WidthFactor: 0.6,
    stage2HelixAngle: 12,
    stage2Material: GEAR_MATERIALS[14],
    stage2WidthFactor: 0.8,
    workingFactor: 1.25,
    safetyFactor: 1.5
  });

  const [result, setResult] = useState<ReducerResult | null>(null);
  const [activeVisualStage, setActiveVisualStage] = useState<1 | 2>(1);

  useEffect(() => {
    const res = calculateReducer(input);
    setResult(res);
    if (onCalculateSuccess) onCalculateSuccess(res);
  }, [input, onCalculateSuccess]);

  const exportToShaft = (stage: SingleStageResult) => {
    if (onPowerSpeedChange) {
      const speed = stage.speed / stage.ratio;
      const power = (stage.torque * speed) / 9550;
      onPowerSpeedChange(power, speed, stage.forces);
    }
  };

  // Styles for inputs to ensure they work in both modes
  const inputClass = "w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100";
  const labelClass = "block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1";

  return (
    <div className="space-y-6">
      {/* Ratio Distribution Panel */}
      <RatioDistributionPanel
        inputSpeed={input.inputSpeed}
        outputSpeed={input.outputSpeed}
        onSpeedsChange={(ng, nc) => setInput({ ...input, inputSpeed: ng, outputSpeed: nc, totalRatio: ng / nc })}
        ratioAnalysis={result?.ratioAnalysis}
      />

      {/* Main Calculation Form */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
             <div className="w-8 h-8 rounded bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
             </div>
             <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Tasarım Parametreleri</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* GLOBAL INPUTS */}
          <div className="space-y-4 lg:border-r lg:border-slate-100 lg:dark:border-slate-800 lg:pr-8">
            <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Genel Veriler</h4>
            
            <div className="space-y-3">
                <div>
                    <label className={labelClass}>Motor Gücü (kW)</label>
                    <input type="number" value={input.totalPower} onChange={(e) => setInput({ ...input, totalPower: Number(e.target.value) })} className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>Emniyet Katsayısı (S)</label>
                    <input type="number" step="0.1" value={input.safetyFactor} onChange={(e) => setInput({ ...input, safetyFactor: Number(e.target.value) })} className={inputClass} />
                </div>
                
                <div className="pt-2">
                    <KoFactorSelector
                    value={input.workingFactor}
                    onChange={(val) => setInput({ ...input, workingFactor: val })}
                    />
                </div>
            </div>
          </div>

          {/* STAGE 1 */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide flex items-center justify-between">
                <span>1. Kademe (Hızlı)</span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">Giriş</span>
            </h4>
            <div className="space-y-3">
                <div>
                    <label className={labelClass}>Malzeme Seçimi</label>
                    <select className={inputClass} onChange={(e) => {
                        const m = GEAR_MATERIALS.find(x => x.name === e.target.value);
                        if (m) setInput({ ...input, stage1Material: m });
                    }} value={input.stage1Material.name}>
                        {GEAR_MATERIALS.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className={labelClass}>Helis Açısı (β)</label>
                        <input type="number" value={input.stage1HelixAngle} onChange={(e) => setInput({ ...input, stage1HelixAngle: Number(e.target.value) })} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Genişlik (ψ)</label>
                        <input type="number" step="0.1" value={input.stage1WidthFactor} onChange={(e) => setInput({ ...input, stage1WidthFactor: Number(e.target.value) })} className={inputClass} />
                    </div>
                </div>
            </div>
          </div>

           {/* STAGE 2 */}
           <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide flex items-center justify-between">
                <span>2. Kademe (Yavaş)</span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">Çıkış</span>
            </h4>
            <div className="space-y-3">
                <div>
                    <label className={labelClass}>Malzeme Seçimi</label>
                    <select className={inputClass} onChange={(e) => {
                        const m = GEAR_MATERIALS.find(x => x.name === e.target.value);
                        if (m) setInput({ ...input, stage2Material: m });
                    }} value={input.stage2Material.name}>
                        {GEAR_MATERIALS.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className={labelClass}>Helis Açısı (β)</label>
                        <input type="number" value={input.stage2HelixAngle} onChange={(e) => setInput({ ...input, stage2HelixAngle: Number(e.target.value) })} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Genişlik (ψ)</label>
                        <input type="number" step="0.1" value={input.stage2WidthFactor} onChange={(e) => setInput({ ...input, stage2WidthFactor: Number(e.target.value) })} className={inputClass} />
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* RESULTS */}
      {result && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-in fade-in duration-500">
            
            {/* Left Column: Visuals & Basic Stats */}
            <div className="space-y-6">
                {/* Speeds */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mb-4">Devir Kademesi</h4>
                    <div className="flex items-center justify-between">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">{result.speeds.input}</div>
                            <div className="text-xs text-slate-500">Giriş RPM</div>
                        </div>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700 mx-4 relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 px-2 text-slate-400">→</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">{result.speeds.intermediate.toFixed(0)}</div>
                            <div className="text-xs text-slate-500">Ara RPM</div>
                        </div>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700 mx-4 relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 px-2 text-slate-400">→</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{result.speeds.output}</div>
                            <div className="text-xs text-slate-500">Çıkış RPM</div>
                        </div>
                    </div>
                </div>

                {/* Visualizer */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase">Geometri Görünümü</h4>
                        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                            <button 
                                onClick={() => setActiveVisualStage(1)} 
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeVisualStage === 1 ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                1. Kademe
                            </button>
                            <button 
                                onClick={() => setActiveVisualStage(2)} 
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeVisualStage === 2 ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                2. Kademe
                            </button>
                        </div>
                    </div>
                    {activeVisualStage === 1 ? (
                        <GearVisualizer d1={result.stage1.d1} d2={result.stage1.d2} centerDistance={result.stage1.centerDistance} b={result.stage1.b} />
                    ) : (
                        <GearVisualizer d1={result.stage2.d1} d2={result.stage2.d2} centerDistance={result.stage2.centerDistance} b={result.stage2.b} />
                    )}
                </div>
            </div>

            {/* Right Column: Detailed Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-slate-900 dark:text-white">Detaylı Hesap Sonuçları</h3>
                    <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                        Tork: {result.outputTorque} Nm
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-4 py-3 font-medium">Parametre</th>
                                <th className="px-4 py-3 font-medium">1. Kademe</th>
                                <th className="px-4 py-3 font-medium">2. Kademe</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                             <tr>
                                <td className="px-4 py-3 font-medium">Modül (Mn)</td>
                                <td className="px-4 py-3 font-mono font-bold text-blue-600 dark:text-blue-400">{result.stage1.module} mm</td>
                                <td className="px-4 py-3 font-mono font-bold text-blue-600 dark:text-blue-400">{result.stage2.module} mm</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-medium">Diş Sayıları (z1/z2)</td>
                                <td className="px-4 py-3">{result.stage1.z1} / {result.stage1.z2}</td>
                                <td className="px-4 py-3">{result.stage2.z1} / {result.stage2.z2}</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-medium">Bölüm Dairesi (d1/d2)</td>
                                <td className="px-4 py-3">{result.stage1.d1} / {result.stage1.d2}</td>
                                <td className="px-4 py-3">{result.stage2.d1} / {result.stage2.d2}</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-medium">Eksen Aralığı (a)</td>
                                <td className="px-4 py-3 font-bold">{result.stage1.centerDistance} mm</td>
                                <td className="px-4 py-3 font-bold">{result.stage2.centerDistance} mm</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-medium">Diş Genişliği (b)</td>
                                <td className="px-4 py-3">{result.stage1.b} mm</td>
                                <td className="px-4 py-3">{result.stage2.b} mm</td>
                            </tr>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                                <td className="px-4 py-3 font-medium text-xs text-slate-500">Kuvvetler (Ft/Fr/Fa)</td>
                                <td className="px-4 py-3 text-xs font-mono">{result.stage1.forces.Ft}/{result.stage1.forces.Fr}/{result.stage1.forces.Fa}</td>
                                <td className="px-4 py-3 text-xs font-mono">{result.stage2.forces.Ft}/{result.stage2.forces.Fr}/{result.stage2.forces.Fa}</td>
                            </tr>
                            <tr className="bg-green-50/50 dark:bg-green-900/10">
                                <td className="px-4 py-3 font-medium text-green-700 dark:text-green-400">Emniyet (Muk/Yüzey)</td>
                                <td className="px-4 py-3 font-bold text-green-700 dark:text-green-400">{result.stage1.safetyFactors.strength} / {result.stage1.safetyFactors.surfacePressure}</td>
                                <td className="px-4 py-3 font-bold text-green-700 dark:text-green-400">{result.stage2.safetyFactors.strength} / {result.stage2.safetyFactors.surfacePressure}</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3"></td>
                                <td className="px-4 py-3">
                                    <button onClick={() => exportToShaft(result.stage1)} className="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 transition-colors">
                                        Mil Hesabına Gönder
                                    </button>
                                </td>
                                <td className="px-4 py-3">
                                    <button onClick={() => exportToShaft(result.stage2)} className="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 transition-colors">
                                        Mil Hesabına Gönder
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default GearModule;
