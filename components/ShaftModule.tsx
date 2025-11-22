


import React, { useState, useEffect } from 'react';
import { ShaftInput, ShaftResult, GearForces } from '../types';
import { GENERAL_MATERIALS } from '../constants';
import { calculateShaft } from '../utils/calculations';
import { ShaftVisualizer } from './ShaftVisualizer';

interface Props {
   defaultForces?: GearForces;
   defaultPower?: number;
   defaultSpeed?: number;
   onResult?: (result: ShaftResult) => void;
}

const ShaftModule: React.FC<Props> = ({ defaultForces, defaultPower, defaultSpeed, onResult }) => {
   const [input, setInput] = useState<ShaftInput>({
      power: defaultPower || 9,
      speed: defaultSpeed || 1000,
      material: GENERAL_MATERIALS[1],
      gearForces: defaultForces || { Ft: 2000, Fr: 800, Fa: 400, d: 100 },
      lengthL1: 60,
      lengthL2: 60,
      safetyFactor: 2.0,
      keywayType: 'A'
   });

   const [result, setResult] = useState<ShaftResult | null>(null);

   useEffect(() => {
      if (defaultForces && defaultPower && defaultSpeed) {
         setInput(prev => ({
            ...prev,
            power: defaultPower,
            speed: defaultSpeed,
            gearForces: defaultForces
         }));
      }
   }, [defaultForces, defaultPower, defaultSpeed]);

   useEffect(() => {
      const res = calculateShaft(input);
      setResult(res);
      if (onResult) onResult(res);
   }, [input, onResult]);

   const inputClass = "w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100";
   const labelClass = "block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1";

   return (
      <div className="space-y-6">
         <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="w-8 h-8 rounded bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Mil Mukavemet Verileri</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* 1. Material & Factors */}
               <div className="space-y-4">
                  <h4 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide">Malzeme</h4>
                  <div>
                     <label className={labelClass}>Mil Malzemesi</label>
                     <select
                        className={inputClass}
                        onChange={(e) => {
                           const selected = GENERAL_MATERIALS.find(m => m.name === e.target.value);
                           if (selected) setInput({ ...input, material: selected });
                        }}
                        value={input.material.name}
                     >
                        {GENERAL_MATERIALS.map((m) => (
                           <option key={m.name} value={m.name}>{m.name}</option>
                        ))}
                     </select>
                     <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-100 dark:border-slate-700">
                        Akma: {input.material.sigmaAk} N/mm² | Kopma: {input.material.sigmaK} N/mm²
                     </div>
                  </div>
                  <div>
                     <label className={labelClass}>Emniyet Katsayısı (S)</label>
                     <input
                        type="number" step="0.1"
                        value={input.safetyFactor}
                        onChange={(e) => setInput({ ...input, safetyFactor: Number(e.target.value) })}
                        className={inputClass}
                     />
                  </div>
               </div>

               {/* 2. Geometry */}
               <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">Mesafeler</h4>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className={labelClass}>L1 (Rulman A)</label>
                        <input
                           type="number"
                           value={input.lengthL1}
                           onChange={(e) => setInput({ ...input, lengthL1: Number(e.target.value) })}
                           className={inputClass}
                        />
                     </div>
                     <div>
                        <label className={labelClass}>L2 (Rulman B)</label>
                        <input
                           type="number"
                           value={input.lengthL2}
                           onChange={(e) => setInput({ ...input, lengthL2: Number(e.target.value) })}
                           className={inputClass}
                        />
                     </div>
                  </div>
               </div>

               {/* 3. Forces */}
               <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">Kuvvetler</h4>
                  <div className="grid grid-cols-2 gap-3">
                     <div>
                        <label className={labelClass}>Teğetsel (Ft)</label>
                        <input type="number" value={input.gearForces.Ft} onChange={(e) => setInput({ ...input, gearForces: { ...input.gearForces, Ft: Number(e.target.value) } })} className={inputClass} />
                     </div>
                     <div>
                        <label className={labelClass}>Radyal (Fr)</label>
                        <input type="number" value={input.gearForces.Fr} onChange={(e) => setInput({ ...input, gearForces: { ...input.gearForces, Fr: Number(e.target.value) } })} className={inputClass} />
                     </div>
                     <div>
                        <label className={labelClass}>Eksenel (Fa)</label>
                        <input type="number" value={input.gearForces.Fa} onChange={(e) => setInput({ ...input, gearForces: { ...input.gearForces, Fa: Number(e.target.value) } })} className={inputClass} />
                     </div>
                     <div>
                        <label className={labelClass}>Dişli Çapı (d)</label>
                        <input type="number" value={input.gearForces.d} onChange={(e) => setInput({ ...input, gearForces: { ...input.gearForces, d: Number(e.target.value) } })} className={inputClass} />
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {result && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
               {/* Left: Visualizer */}
               <div className="lg:col-span-7 space-y-6">
                   <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <ShaftVisualizer L1={input.lengthL1} L2={input.lengthL2} forces={input.gearForces} />
                   </div>
                   <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mb-4">Yatak Reaksiyonları (Rulman Seçimi İçin)</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-100 dark:border-slate-700">
                                <div className="text-xs text-slate-400 uppercase mb-1">Rulman A</div>
                                <div className="flex justify-between text-sm"><span className="text-slate-500">Yatay:</span> <span className="font-mono">{result.reactionA_H.toFixed(0)} N</span></div>
                                <div className="flex justify-between text-sm"><span className="text-slate-500">Düşey:</span> <span className="font-mono">{result.reactionA_V.toFixed(0)} N</span></div>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-100 dark:border-slate-700">
                                <div className="text-xs text-slate-400 uppercase mb-1">Rulman B</div>
                                <div className="flex justify-between text-sm"><span className="text-slate-500">Yatay:</span> <span className="font-mono">{result.reactionB_H.toFixed(0)} N</span></div>
                                <div className="flex justify-between text-sm"><span className="text-slate-500">Düşey:</span> <span className="font-mono">{result.reactionB_V.toFixed(0)} N</span></div>
                            </div>
                        </div>
                   </div>
               </div>

               {/* Right: Results */}
               <div className="lg:col-span-5 space-y-6">
                   {/* Main Diameter Result */}
                   <div className="bg-purple-600 text-white rounded-xl p-6 shadow-lg shadow-purple-900/20">
                        <div className="text-purple-200 text-sm font-medium mb-1">Gerekli Standart Çap</div>
                        <div className="text-5xl font-bold">{result.standardDiameter} <span className="text-2xl text-purple-300">mm</span></div>
                        
                        <div className="mt-4 pt-4 border-t border-purple-500/50 grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-purple-200 block text-xs">Hesaplanan Min</span>
                                <span className="font-mono">{result.minDiameter.toFixed(2)} mm</span>
                            </div>
                            {result.extension && (
                                <div>
                                    <span className="text-purple-200 block text-xs">Çıkış Mili Ucu</span>
                                    <span className="font-mono">Ø{result.extension.dc} x {result.extension.lc} mm</span>
                                </div>
                            )}
                        </div>
                   </div>

                   {/* Stress Check */}
                   <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mb-4">Gerilme Kontrolü</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600 dark:text-slate-300">Eğilme Momenti (Max)</span>
                                <span className="font-mono font-bold text-slate-900 dark:text-white">{result.maxBendingMoment} Nm</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600 dark:text-slate-300">Eşdeğer Moment (Mv)</span>
                                <span className="font-mono font-bold text-slate-900 dark:text-white">{result.equivalentMoment} Nm</span>
                            </div>
                            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600 dark:text-slate-300">Eğilme Gerilmesi (σ)</span>
                                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                                    {result.bendingStress} N/mm²
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600 dark:text-slate-300">Eşdeğer Gerilme (σv)</span>
                                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                                    {result.equivalentStress} N/mm²
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600 dark:text-slate-300">Kayma Gerilmesi (τ)</span>
                                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                                    {result.shearStress} N/mm²
                                </span>
                            </div>
                            <div className={`mt-2 p-2 text-center rounded text-xs font-bold ${result.safetyCheck ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
                                {result.safetyCheck ? '✅ EMNİYETLİ' : '❌ EMNİYETSİZ - ÇAPI BÜYÜTÜN'}
                            </div>
                        </div>
                   </div>

                   {/* Keyway */}
                   <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mb-4">Kama Seçimi</h4>
                        
                        <div className="flex gap-2 mb-4">
                            <button onClick={() => setInput({...input, keywayType: 'A'})} className={`flex-1 py-1 text-xs rounded border ${input.keywayType==='A' ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}>A Tipi (Yuvarlak)</button>
                            <button onClick={() => setInput({...input, keywayType: 'B'})} className={`flex-1 py-1 text-xs rounded border ${input.keywayType==='B' ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}>B Tipi (Düz)</button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg mb-3">
                             <div><span className="text-slate-400 text-xs">Genişlik (b)</span> <div className="font-bold text-slate-900 dark:text-white">{result.keyway.b} mm</div></div>
                             <div><span className="text-slate-400 text-xs">Yükseklik (h)</span> <div className="font-bold text-slate-900 dark:text-white">{result.keyway.h} mm</div></div>
                             <div><span className="text-slate-400 text-xs">Mil Derinliği (t1)</span> <div className="font-bold text-slate-900 dark:text-white">{result.keyway.t1} mm</div></div>
                             <div><span className="text-slate-400 text-xs">Göbek Derinliği (t2)</span> <div className="font-bold text-slate-900 dark:text-white">{result.keyway.t2} mm</div></div>
                        </div>

                        {result.keywayCheck && (
                            <div className="space-y-2 p-3 rounded border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500 dark:text-slate-400">Oluşan Basınç (p)</span>
                                    <span className={`font-mono font-bold ${result.keywayCheck.safety >= 1 ? 'text-slate-700 dark:text-slate-200' : 'text-red-600'}`}>
                                        {result.keywayCheck.pressure} N/mm²
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500 dark:text-slate-400">Emniyet Basıncı (Pem)</span>
                                    <span className="font-mono font-bold text-slate-700 dark:text-slate-200">
                                        {result.keywayCheck.pem} N/mm²
                                    </span>
                                </div>
                                <div className={`text-xs text-center p-2 rounded font-bold border ${result.keywayCheck.safety >= 1 ? 'text-green-700 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' : 'text-red-700 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'}`}>
                                    Basınç Emniyeti S: {result.keywayCheck.safety}
                                </div>
                            </div>
                        )}
                   </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default ShaftModule;
