
import React, { useMemo, useState } from 'react';
import { SingleStageInput, SingleStageResult } from '../types';
import { GEAR_MATERIALS } from '../constants';
import { calculateSingleStage } from '../utils/calculations';
import { GearVisualizer } from './GearVisualizer';
import KoFactorSelector from './KoFactorSelector';

const SingleGearModule: React.FC = () => {
  const [input, setInput] = useState<SingleStageInput>({
    power: 7.5,
    inputSpeed: 1450,
    ratio: 4.2,
    helixAngle: 15,
    pressureAngle: 20,
    material: GEAR_MATERIALS[8],
    safetyFactor: 1.5,
    widthFactor: 0.6,
    workingFactor: 1.25,
  });

  const result: SingleStageResult = useMemo(
    () => calculateSingleStage(input, 'Tek Kademe'),
    [input]
  );

  const inputClass = "w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-slate-100 transition-colors";
  const labelClass = "text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block";

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-6">
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-slate-800 pb-4">
             <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tek Kademe Hesabı</h3>
             <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                 Çıkış Torku: {result.torque.toFixed(2)} Nm
             </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Inputs */}
            <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Parametreler</h4>
                <div>
                    <label className={labelClass}>Güç (kW)</label>
                    <input type="number" value={input.power} onChange={(e) => setInput({...input, power: +e.target.value})} className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>Giriş Devri (rpm)</label>
                    <input type="number" value={input.inputSpeed} onChange={(e) => setInput({...input, inputSpeed: +e.target.value})} className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>Çevrim Oranı (i)</label>
                    <input type="number" step="0.1" value={input.ratio} onChange={(e) => setInput({...input, ratio: +e.target.value})} className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>Malzeme</label>
                    <select className={inputClass} onChange={(e) => {
                        const m = GEAR_MATERIALS.find(x => x.name === e.target.value);
                        if(m) setInput({...input, material: m});
                    }} value={input.material.name}>
                        {GEAR_MATERIALS.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                 <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Faktörler</h4>
                 <div>
                    <label className={labelClass}>Helis Açısı</label>
                    <input type="number" value={input.helixAngle} onChange={(e) => setInput({...input, helixAngle: +e.target.value})} className={inputClass} />
                 </div>
                 <div>
                    <label className={labelClass}>Genişlik Faktörü</label>
                    <input type="number" step="0.1" value={input.widthFactor} onChange={(e) => setInput({...input, widthFactor: +e.target.value})} className={inputClass} />
                 </div>
                 <KoFactorSelector value={input.workingFactor} onChange={(val) => setInput({...input, workingFactor: val})} />
            </div>

            {/* Results Display */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide mb-3">Sonuçlar</h4>
                <div className="flex justify-between text-sm border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="text-slate-500 dark:text-slate-400">Modül (Mn)</span>
                    <span className="font-bold font-mono text-blue-600 dark:text-blue-400">{result.module} mm</span>
                </div>
                <div className="flex justify-between text-sm border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="text-slate-500 dark:text-slate-400">Diş Sayıları</span>
                    <span className="font-bold font-mono text-slate-700 dark:text-slate-200">{result.z1} / {result.z2}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="text-slate-500 dark:text-slate-400">Eksen Aralığı</span>
                    <span className="font-bold font-mono text-slate-700 dark:text-slate-200">{result.centerDistance} mm</span>
                </div>
                <div className="flex justify-between text-sm border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="text-slate-500 dark:text-slate-400">Genişlik (b)</span>
                    <span className="font-bold font-mono text-slate-700 dark:text-slate-200">{result.b} mm</span>
                </div>
                <div className="mt-4">
                    <div className="text-xs text-slate-500 mb-1">Emniyet Katsayıları</div>
                    <div className="flex gap-2">
                        <span className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs px-2 py-1 rounded font-bold">Muk: {result.safetyFactors.strength}</span>
                        <span className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs px-2 py-1 rounded font-bold">Yüzey: {result.safetyFactors.surfacePressure}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Visualization */}
        <div className="border-t border-gray-100 dark:border-slate-800 pt-6">
             <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4 border border-slate-100 dark:border-slate-800/50 flex flex-col items-center justify-center">
                <GearVisualizer 
                    d1={result.d1} 
                    d2={result.d2} 
                    centerDistance={result.centerDistance} 
                    b={result.b} 
                />
             </div>
        </div>

      </div>
    </div>
  );
};

export default SingleGearModule;
