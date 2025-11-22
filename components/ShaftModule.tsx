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

   // Premium UI Classes - Modern Design System
   const cardClass = "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-200/60 dark:border-slate-700/60 overflow-hidden hover:shadow-2xl hover:shadow-slate-300/50 dark:hover:shadow-black/30 transition-all duration-300";
   const headerClass = "bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50 dark:from-slate-800 dark:via-slate-750 dark:to-slate-800 px-6 py-5 border-b border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3";
   const headerTitleClass = "font-black text-slate-900 dark:text-white text-lg tracking-tight";
   const labelClass = "block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2";
   const inputClass = "w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-300 dark:hover:border-slate-600 outline-none transition-all duration-200 shadow-sm";
   const selectClass = "w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-300 dark:hover:border-slate-600 outline-none transition-all duration-200 appearance-none shadow-sm cursor-pointer";

   return (
      <div className="space-y-8 animate-in fade-in duration-500 p-6 font-sans">

         {/* INPUT SECTION */}
         <div className={cardClass}>
            <div className={headerClass}>
               <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M2 12h20M2 12l5-5m-5 5 5 5" /></svg>
               </div>
               <h3 className={headerTitleClass}>Mil Mukavemet Verileri</h3>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* 1. Material & Factors */}
               <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Malzeme Seçimi</h4>
                  <div>
                     <label className={labelClass}>Mil Malzemesi</label>
                     <select
                        className={selectClass}
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
                     <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-100 dark:border-slate-700 flex justify-between">
                        <span>Akma: <b>{input.material.sigmaAk}</b></span>
                        <span>Kopma: <b>{input.material.sigmaK}</b></span>
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
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Geometri (mm)</h4>
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
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Kuvvetler (N)</h4>
                  <div className="grid grid-cols-2 gap-4">
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               {/* Left: Visualizer */}
               <div className="lg:col-span-7 space-y-8">
                  <div className={cardClass}>
                     <div className={headerClass}>
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
                        </div>
                        <h3 className={headerTitleClass}>Mil Görünümü</h3>
                     </div>
                     <div className="p-6">
                        <ShaftVisualizer L1={input.lengthL1} L2={input.lengthL2} forces={input.gearForces} />
                     </div>
                  </div>

                  <div className={cardClass}>
                     <div className={headerClass}>
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /></svg>
                        </div>
                        <h3 className={headerTitleClass}>Yatak Reaksiyonları</h3>
                     </div>
                     <div className="p-6 grid grid-cols-2 gap-6">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                           <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-3">Rulman A</div>
                           <div className="space-y-2">
                              <div className="flex justify-between text-sm"><span className="text-slate-500 dark:text-slate-400">Yatay:</span> <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{result.reactionA_H.toFixed(0)} N</span></div>
                              <div className="flex justify-between text-sm"><span className="text-slate-500 dark:text-slate-400">Düşey:</span> <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{result.reactionA_V.toFixed(0)} N</span></div>
                           </div>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                           <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-3">Rulman B</div>
                           <div className="space-y-2">
                              <div className="flex justify-between text-sm"><span className="text-slate-500 dark:text-slate-400">Yatay:</span> <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{result.reactionB_H.toFixed(0)} N</span></div>
                              <div className="flex justify-between text-sm"><span className="text-slate-500 dark:text-slate-400">Düşey:</span> <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{result.reactionB_V.toFixed(0)} N</span></div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Right: Results */}
               <div className="lg:col-span-5 space-y-8">
                  {/* Main Diameter Result - Clean Minimal Design */}
                  <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 border-2 border-slate-200/60 dark:border-slate-700/60 shadow-xl overflow-hidden">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <div className="text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Gerekli Standart Çap</div>
                     </div>

                     <div className="text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-8">
                        {result.standardDiameter}
                        <span className="text-2xl text-slate-500 dark:text-slate-400 font-normal ml-2">mm</span>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4">
                           <span className="text-slate-500 dark:text-slate-400 block text-xs font-bold uppercase tracking-wider mb-2">Hesaplanan Min</span>
                           <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">{result.minDiameter.toFixed(2)} mm</span>
                        </div>
                        {result.extension && (
                           <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4">
                              <span className="text-slate-500 dark:text-slate-400 block text-xs font-bold uppercase tracking-wider mb-2">Çıkış Mili Ucu</span>
                              <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">Ø{result.extension.dc} x {result.extension.lc}</span>
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Stress Check */}
                  <div className={cardClass}>
                     <div className={headerClass}>
                        <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 2v20M2 12h20" /></svg>
                        </div>
                        <h3 className={headerTitleClass}>Gerilme Kontrolü</h3>
                     </div>
                     <div className="p-6 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                           <span className="text-slate-600 dark:text-slate-400">Eğilme Momenti (Max)</span>
                           <span className="font-mono font-bold text-slate-900 dark:text-white">{result.maxBendingMoment} Nm</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                           <span className="text-slate-600 dark:text-slate-400">Eşdeğer Moment (Mv)</span>
                           <span className="font-mono font-bold text-slate-900 dark:text-white">{result.equivalentMoment} Nm</span>
                        </div>
                        <div className="h-px bg-slate-100 dark:bg-slate-700 my-2"></div>
                        <div className="flex justify-between items-center text-sm">
                           <span className="text-slate-600 dark:text-slate-400">Eğilme Gerilmesi (σ)</span>
                           <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{result.bendingStress} N/mm²</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                           <span className="text-slate-600 dark:text-slate-400">Eşdeğer Gerilme (σv)</span>
                           <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{result.equivalentStress} N/mm²</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                           <span className="text-slate-600 dark:text-slate-400">Kayma Gerilmesi (τ)</span>
                           <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{result.shearStress} N/mm²</span>
                        </div>
                        <div className={`mt-4 p-3 text-center rounded-lg text-sm font-bold ${result.safetyCheck ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                           {result.safetyCheck ? '✅ EMNİYETLİ' : '❌ EMNİYETSİZ - ÇAPI BÜYÜTÜN'}
                        </div>
                     </div>
                  </div>

                  {/* Keyway */}
                  <div className={cardClass}>
                     <div className={headerClass}>
                        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
                        </div>
                        <h3 className={headerTitleClass}>Kama Seçimi</h3>
                     </div>
                     <div className="p-6">
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mb-6">
                           <button onClick={() => setInput({ ...input, keywayType: 'A' })} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${input.keywayType === 'A' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>A Tipi (Yuvarlak)</button>
                           <button onClick={() => setInput({ ...input, keywayType: 'B' })} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${input.keywayType === 'B' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>B Tipi (Düz)</button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                           <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                              <span className="text-slate-400 dark:text-slate-500 text-xs block mb-1">Genişlik (b)</span>
                              <div className="font-bold text-slate-900 dark:text-white">{result.keyway.b} mm</div>
                           </div>
                           <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                              <span className="text-slate-400 dark:text-slate-500 text-xs block mb-1">Yükseklik (h)</span>
                              <div className="font-bold text-slate-900 dark:text-white">{result.keyway.h} mm</div>
                           </div>
                           <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                              <span className="text-slate-400 dark:text-slate-500 text-xs block mb-1">Mil Derinliği (t1)</span>
                              <div className="font-bold text-slate-900 dark:text-white">{result.keyway.t1} mm</div>
                           </div>
                           <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                              <span className="text-slate-400 dark:text-slate-500 text-xs block mb-1">Göbek Derinliği (t2)</span>
                              <div className="font-bold text-slate-900 dark:text-white">{result.keyway.t2} mm</div>
                           </div>
                        </div>

                        {result.keywayCheck && (
                           <div className={`p-4 rounded-xl border ${result.keywayCheck.safety >= 1 ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30' : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30'}`}>
                              <div className="flex justify-between text-sm mb-2">
                                 <span className="text-slate-600 dark:text-slate-400">Oluşan Basınç (p)</span>
                                 <span className={`font-mono font-bold ${result.keywayCheck.safety >= 1 ? 'text-slate-800 dark:text-slate-200' : 'text-red-600 dark:text-red-400'}`}>
                                    {result.keywayCheck.pressure} N/mm²
                                 </span>
                              </div>
                              <div className="flex justify-between text-sm mb-3">
                                 <span className="text-slate-600 dark:text-slate-400">Emniyet Basıncı (Pem)</span>
                                 <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                                    {result.keywayCheck.pem} N/mm²
                                 </span>
                              </div>
                              <div className={`text-xs text-center p-2 rounded-lg font-bold ${result.keywayCheck.safety >= 1 ? 'bg-white dark:bg-green-900/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' : 'bg-white dark:bg-red-900/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'}`}>
                                 Basınç Emniyeti S: {result.keywayCheck.safety}
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default ShaftModule;
