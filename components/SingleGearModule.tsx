import React, { useMemo, useState, useEffect } from 'react';
import { SingleStageInput, SingleStageResult } from '../types';
import { GEAR_MATERIALS, STANDARD_MODULES } from '../constants';
import { calculateSingleStage } from '../utils/calculations';

const SingleGearModule: React.FC = () => {
    const [input, setInput] = useState<SingleStageInput>({
        power: 3,
        inputSpeed: 1450,
        ratio: 3.0,
        helixAngle: 15,
        pressureAngle: 20,
        pinionMaterial: GEAR_MATERIALS[12], // 42 CrMo 4
        gearMaterial: GEAR_MATERIALS[11],   // 34 CrMo 4
        safetyFactor: 2.2,
        safetyFactorSurface: 1.3,
        notchFactor: 1.5,
        widthFactor: 1.0,
        workingFactor: 1.4,
        Kv: 1.2,
        pinionTeeth: 20,
        loadDirection: 'Tek',
        overrideModule: 0,
    });

    // Ensure correct material defaults on first render
    useEffect(() => {
        const pMat = GEAR_MATERIALS.find(m => m.name.includes("42 CrMo 4"));
        const gMat = GEAR_MATERIALS.find(m => m.name.includes("34 CrMo 4"));
        if (pMat && gMat && (input.pinionMaterial.name !== pMat.name || input.gearMaterial.name !== gMat.name)) {
            setInput(prev => ({
                ...prev,
                pinionMaterial: pMat,
                gearMaterial: gMat
            }));
        }
    }, []);

    const result: SingleStageResult = useMemo(
        () => calculateSingleStage(input, 'Tek Kademe'),
        [input]
    );

    const mn = result.module;
    const h = 2.25 * mn;
    const da1 = result.d1 + 2 * mn;
    const da2 = result.d2 + 2 * mn;
    const df1 = result.d1 - 2.5 * mn;
    const df2 = result.d2 - 2.5 * mn;

    // Premium UI Classes - Modern Design System
    const cardClass = "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-200/60 dark:border-slate-700/60 overflow-hidden h-full flex flex-col hover:shadow-2xl hover:shadow-slate-300/50 dark:hover:shadow-black/30 transition-all duration-300";
    const headerClass = "bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50 dark:from-slate-800 dark:via-slate-750 dark:to-slate-800 px-6 py-5 border-b border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3";
    const headerTitleClass = "font-black text-slate-900 dark:text-white text-lg tracking-tight";
    const sectionTitleClass = "text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-4";
    const inputGroupClass = "space-y-2";
    const labelClass = "block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide";
    const inputClass = "w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-300 dark:hover:border-slate-600 outline-none transition-all duration-200 shadow-sm";
    const selectClass = "w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-300 dark:hover:border-slate-600 outline-none transition-all duration-200 appearance-none shadow-sm cursor-pointer";
    const readOnlyClass = "w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-sm font-mono font-bold text-slate-700 dark:text-slate-300 cursor-default shadow-inner";

    return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-in fade-in duration-500 font-sans p-6">

            {/* LEFT COLUMN: INPUTS */}
            <div className="xl:col-span-4 space-y-6">

                {/* Main Inputs Card */}
                <div className={cardClass}>
                    <div className={headerClass}>
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                        </div>
                        <h2 className={headerTitleClass}>Giriş Değerleri</h2>
                    </div>

                    <div className="p-6 space-y-6 flex-1">
                        {/* Primary Inputs */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className={inputGroupClass}>
                                <label className={labelClass}>Güç (kW)</label>
                                <input type="number" value={input.power} onChange={(e) => setInput({ ...input, power: +e.target.value })} className={inputClass} />
                            </div>
                            <div className={inputGroupClass}>
                                <label className={labelClass}>Devir (d/d)</label>
                                <input type="number" value={input.inputSpeed} onChange={(e) => setInput({ ...input, inputSpeed: +e.target.value })} className={inputClass} />
                            </div>
                            <div className={inputGroupClass}>
                                <label className={labelClass}>Çevrim Oranı (i)</label>
                                <input type="number" step="0.1" value={input.ratio} onChange={(e) => setInput({ ...input, ratio: +e.target.value })} className={inputClass} />
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* Factors */}
                        <div>
                            <h3 className={sectionTitleClass}>Mukavemet Faktörleri</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className={inputGroupClass}>
                                    <label className={labelClass}>Zorlanma Faktörü (Kz)</label>
                                    <input type="number" step="0.1" value={input.workingFactor} onChange={(e) => setInput({ ...input, workingFactor: +e.target.value })} className={inputClass} />
                                </div>
                                <div className={inputGroupClass}>
                                    <label className={labelClass}>Çentik Faktörü (Kç)</label>
                                    <input type="number" step="0.1" value={input.notchFactor} onChange={(e) => setInput({ ...input, notchFactor: +e.target.value })} className={inputClass} />
                                </div>
                                <div className={inputGroupClass}>
                                    <label className={labelClass}>Emniyet Katsayısı (S)</label>
                                    <input type="number" step="0.1" value={input.safetyFactor} onChange={(e) => setInput({ ...input, safetyFactor: +e.target.value })} className={inputClass} />
                                </div>
                                <div className={inputGroupClass}>
                                    <label className={labelClass}>Yüzey Emniyet (Sy)</label>
                                    <input type="number" step="0.1" value={input.safetyFactorSurface} onChange={(e) => setInput({ ...input, safetyFactorSurface: +e.target.value })} className={inputClass} />
                                </div>
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* Material Selection */}
                        <div>
                            <h3 className={sectionTitleClass}>Malzeme Seçimi</h3>
                            <div className="space-y-4">
                                <div className={inputGroupClass}>
                                    <label className={labelClass}>Pinyon Malzemesi</label>
                                    <select className={selectClass} onChange={(e) => {
                                        const m = GEAR_MATERIALS.find(x => x.name === e.target.value);
                                        if (m) setInput({ ...input, pinionMaterial: m });
                                    }} value={input.pinionMaterial.name}>
                                        {GEAR_MATERIALS.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                                    </select>
                                </div>
                                <div className={inputGroupClass}>
                                    <label className={labelClass}>Çark Malzemesi</label>
                                    <select className={selectClass} onChange={(e) => {
                                        const m = GEAR_MATERIALS.find(x => x.name === e.target.value);
                                        if (m) setInput({ ...input, gearMaterial: m });
                                    }} value={input.gearMaterial.name}>
                                        {GEAR_MATERIALS.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Load Direction */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 mt-auto">
                            <label className={labelClass + " mb-2 block"}>Yükleme Yönü</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" checked={input.loadDirection === 'Tek'} onChange={() => setInput({ ...input, loadDirection: 'Tek' })} className="text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">Tek Yönlü</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" checked={input.loadDirection === 'Cift'} onChange={() => setInput({ ...input, loadDirection: 'Cift' })} className="text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">Çift Yönlü</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MIDDLE COLUMN: PARAMETERS & MODULE */}
            <div className="xl:col-span-4 space-y-6 flex flex-col">

                {/* Parameters Card */}
                <div className={cardClass + " flex-none"}>
                    <div className={headerClass}>
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                        </div>
                        <h2 className={headerTitleClass}>Dişli Parametreleri</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className={inputGroupClass}>
                                <label className={labelClass}>Profil Açısı</label>
                                <input type="number" value={input.pressureAngle} onChange={(e) => setInput({ ...input, pressureAngle: +e.target.value })} className={inputClass} />
                            </div>
                            <div className={inputGroupClass}>
                                <label className={labelClass}>Helis Açısı (Bo)</label>
                                <input type="number" value={input.helixAngle} onChange={(e) => setInput({ ...input, helixAngle: +e.target.value })} className={inputClass} />
                            </div>
                            <div className={inputGroupClass}>
                                <label className={labelClass}>Pinyon Diş (z)</label>
                                <input type="number" value={input.pinionTeeth} onChange={(e) => setInput({ ...input, pinionTeeth: +e.target.value })} className={inputClass} />
                            </div>
                            <div className={inputGroupClass}>
                                <label className={labelClass}>Genişlik Faktörü</label>
                                <input type="number" step="0.1" value={input.widthFactor} onChange={(e) => setInput({ ...input, widthFactor: +e.target.value })} className={inputClass} />
                            </div>
                            <div className={inputGroupClass}>
                                <label className={labelClass}>Dinamik Fak. (Kv)</label>
                                <input type="number" step="0.1" value={input.Kv} onChange={(e) => setInput({ ...input, Kv: +e.target.value })} className={inputClass} />
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        <div>
                            <h3 className={sectionTitleClass}>Hesaplanan Faktörler</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className={inputGroupClass}>
                                    <label className={labelClass}>Çevrim Oranı Fak. (Ki)</label>
                                    <input readOnly value={result.factors.Ki.toFixed(3)} className={readOnlyClass} />
                                </div>
                                <div className={inputGroupClass}>
                                    <label className={labelClass}>Form Faktörü (Kf)</label>
                                    <input readOnly value={result.factors.Kf.toFixed(3)} className={readOnlyClass} />
                                </div>
                                <div className={inputGroupClass}>
                                    <label className={labelClass}>Yuvarlanma Fak. (Kα)</label>
                                    <input readOnly value={result.factors.Kalpha.toFixed(2)} className={readOnlyClass} />
                                </div>
                                <div className={inputGroupClass}>
                                    <label className={labelClass}>Malzeme Fak. (Ke)</label>
                                    <input readOnly value={result.factors.Ke.toFixed(2)} className={readOnlyClass} />
                                </div>
                                <div className={inputGroupClass}>
                                    <label className={labelClass}>Eğim Açısı Fak. (Kb)</label>
                                    <input readOnly value={result.factors.Kb.toFixed(3)} className={readOnlyClass} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Module Selection Card */}
                <div className={cardClass + " flex-1"}>
                    <div className={headerClass}>
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                        </div>
                        <h2 className={headerTitleClass}>Modül Hesabı</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                                <span className="text-xs text-slate-500 block mb-1">Mukavemete Göre</span>
                                <span className="font-mono font-bold text-slate-800">{result.calculatedModules.mnm.toFixed(4)}</span>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                                <span className="text-xs text-slate-500 block mb-1">Yüzey Basıncına Göre</span>
                                <span className="font-mono font-bold text-slate-800">{result.calculatedModules.mny.toFixed(4)}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-amber-50 p-4 rounded-xl border border-amber-100">
                            <span className="text-sm font-bold text-amber-900">Seçilen Modül:</span>
                            <select
                                value={input.overrideModule}
                                onChange={(e) => setInput({ ...input, overrideModule: +e.target.value })}
                                className="bg-white border border-amber-200 text-amber-900 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full p-2.5 font-bold"
                            >
                                <option value="0">Otomatik ({result.module})</option>
                                {STANDARD_MODULES.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>

                        <div>
                            <h3 className={sectionTitleClass}>Güvenlik Kontrolü</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">Mukavemet Güvenliği</span>
                                    <span className={`font-mono font-bold px-2 py-0.5 rounded ${result.safetyFactors.strength >= input.safetyFactor ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                                        {result.safetyFactors.strength.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">Yüzey Basınç Güvenliği</span>
                                    <span className={`font-mono font-bold px-2 py-0.5 rounded ${result.safetyFactors.surfacePressure >= input.safetyFactorSurface ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                                        {result.safetyFactors.surfacePressure.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: RESULTS */}
            <div className="xl:col-span-4 space-y-6">
                <div className={cardClass}>
                    <div className={headerClass}>
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                        </div>
                        <h2 className={headerTitleClass}>Sonuç Tablosu</h2>
                    </div>

                    <div className="p-0">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Parametre</th>
                                    <th className="px-4 py-3 font-medium text-right">Pinyon</th>
                                    <th className="px-4 py-3 font-medium text-right">Çark</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">Modül (mn)</td>
                                    <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-400">{mn}</td>
                                    <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-400">{mn}</td>
                                </tr>
                                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">Helis Açısı</td>
                                    <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-400">{result.helixAngle}°</td>
                                    <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-400">{result.helixAngle}°</td>
                                </tr>
                                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">Diş Sayısı (z)</td>
                                    <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-400">{result.z1}</td>
                                    <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-400">{result.z2}</td>
                                </tr>
                                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">Taksimat Çapı (d0)</td>
                                    <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-400">{result.d1.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-400">{result.d2.toFixed(2)}</td>
                                </tr>
                                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">Baş Çapı (da)</td>
                                    <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-400">{da1.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-400">{da2.toFixed(2)}</td>
                                </tr>
                                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">Taban Çapı (df)</td>
                                    <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-400">{df1.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-400">{df2.toFixed(2)}</td>
                                </tr>
                                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">Diş Yüksekliği (h)</td>
                                    <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-400" colSpan={2}>{h.toFixed(2)}</td>
                                </tr>
                                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">Diş Genişliği (b)</td>
                                    <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-400" colSpan={2}>{result.b.toFixed(2)}</td>
                                </tr>
                                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">Eksen Arası (a)</td>
                                    <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-400" colSpan={2}>{result.centerDistance.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-slate-100 dark:border-slate-700">
                            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">Seçilen Malzemeler</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Pinyon:</span>
                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{input.pinionMaterial.name}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Çark:</span>
                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{input.gearMaterial.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleGearModule;
