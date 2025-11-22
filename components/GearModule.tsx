import React, { useState, useEffect } from 'react';
import { ReducerInput, ReducerResult, SingleStageResult } from '../types';
import { GEAR_MATERIALS, STANDARD_MODULES } from '../constants';
import { calculateReducer } from '../utils/calculations';
import { GearVisualizer } from './GearVisualizer';
import KoFactorSelector from './KoFactorSelector';

interface Props {
    onCalculateSuccess?: (result: ReducerResult) => void;
    onPowerSpeedChange?: (power: number, speed: number, forces: any) => void;
    onTabChange?: (tab: string) => void;
}

const GearModule: React.FC<Props> = ({ onCalculateSuccess, onPowerSpeedChange, onTabChange }) => {
    // State for the exact fields in the VB6 screenshot
    const [designValues, setDesignValues] = useState({
        power: 9,
        inputSpeed: 1000,
        outputSpeed: 100,
        stages: 2, // Fixed as per thesis
        gearType: 'Helisel',
        boxConstruction: 'Döküm'
    });

    const [ratioInputs, setRatioInputs] = useState({
        z1: 20,
        z3: 22 // From screenshot example
    });

    const [stageParams, setStageParams] = useState({
        stage1Helix: 15,
        stage1Material: GEAR_MATERIALS[8],
        stage1WidthFactor: 0.6,
        stage2Helix: 12,
        stage2Material: GEAR_MATERIALS[14],
        stage2WidthFactor: 0.8,
        workingFactor: 1.25,
        safetyFactor: 1.5,
        Kv: 1.2 // Dynamic Factor
    });

    // Module overrides (0 means automatic)
    const [forcedModules, setForcedModules] = useState<{ stage1: number, stage2: number }>({ stage1: 0, stage2: 0 });

    // Checkbox "Simulation" State
    const [activeSteps, setActiveSteps] = useState({
        ratios: true, // Always active initially
        stage1: false,
        stage2: false,
        shaft: false,
        keyway: false,
        bearing: false
    });

    const [result, setResult] = useState<ReducerResult | null>(null);

    // Handle Gear Type Change
    const handleGearTypeChange = (type: string) => {
        setDesignValues({ ...designValues, gearType: type });

        if (type === 'Duz') {
            // Spur gear means 0 helix angle
            setStageParams(prev => ({
                ...prev,
                stage1Helix: 0,
                stage2Helix: 0
            }));
        } else {
            // Restore default helical angles
            setStageParams(prev => ({
                ...prev,
                stage1Helix: 15,
                stage2Helix: 12
            }));
        }
    };

    // Main Calculation Effect
    useEffect(() => {
        const input: ReducerInput = {
            totalPower: designValues.power,
            inputSpeed: designValues.inputSpeed,
            outputSpeed: designValues.outputSpeed,
            totalRatio: designValues.inputSpeed / designValues.outputSpeed,
            gearType: designValues.gearType,
            boxConstruction: designValues.boxConstruction,
            stage1PinionTeeth: ratioInputs.z1,
            stage2PinionTeeth: ratioInputs.z3,
            stage1HelixAngle: stageParams.stage1Helix,
            stage1Material: stageParams.stage1Material,
            stage1WidthFactor: stageParams.stage1WidthFactor,
            stage1OverrideModule: forcedModules.stage1,
            stage2HelixAngle: stageParams.stage2Helix,
            stage2Material: stageParams.stage2Material,
            stage2WidthFactor: stageParams.stage2WidthFactor,
            stage2OverrideModule: forcedModules.stage2,
            workingFactor: stageParams.workingFactor,
            safetyFactor: stageParams.safetyFactor,
            efficiency: 0.95,
            Kv: stageParams.Kv
        };

        const Vk = calculateReducer(input);
        setResult(Vk);
        if (onCalculateSuccess) onCalculateSuccess(Vk);
    }, [designValues, ratioInputs, stageParams, forcedModules, onCalculateSuccess]);

    const handleCheckboxClick = (step: keyof typeof activeSteps) => {
        if (step === 'shaft' || step === 'keyway') {
            if (onTabChange) onTabChange('shaft');
        } else if (step === 'bearing') {
            if (onTabChange) onTabChange('bearing');
        } else {
            setActiveSteps(prev => ({ ...prev, [step]: !prev[step] }));
        }
    };

    // Premium UI Classes - Modern Design System
    const cardClass = "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-200/60 dark:border-slate-700/60 overflow-hidden hover:shadow-2xl hover:shadow-slate-300/50 dark:hover:shadow-black/30 transition-all duration-300 hover:-translate-y-1";
    const headerClass = "bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50 dark:from-slate-800 dark:via-slate-750 dark:to-slate-800 px-6 py-5 border-b border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3";
    const headerTitleClass = "font-black text-slate-900 dark:text-white text-lg tracking-tight";
    const labelClass = "block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2";
    const inputClass = "w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-300 dark:hover:border-slate-600 outline-none transition-all duration-200 shadow-sm";
    const readOnlyClass = "w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-sm font-mono font-bold text-slate-700 dark:text-slate-300 cursor-default shadow-inner";
    const selectClass = "w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-300 dark:hover:border-slate-600 outline-none transition-all duration-200 appearance-none shadow-sm cursor-pointer";

    // Reusable "Hlsd.Frm" Style Result Panel
    const ModuleAnalysisPanel = ({ stageResult, requiredSafety, onModuleOverride, currentOverride }: {
        stageResult: SingleStageResult,
        requiredSafety: number,
        onModuleOverride: (m: number) => void,
        currentOverride?: number
    }) => {
        const mnm = stageResult.calculatedModules.mnm;
        const mny = stageResult.calculatedModules.mny;
        const isSurfaceDominant = mny > mnm;
        const determinantText = isSurfaceDominant ? "Yüzey Basıncı" : "Mukavemet";

        return (
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 mt-4 font-sans">
                <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                    <h5 className="text-sm font-bold text-slate-800 dark:text-slate-100">Modül Analizi</h5>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-2 py-1 rounded-lg">
                        Belirleyici: {determinantText}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pinyon Modül Belirleme */}
                    <div className="bg-white dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                        <h6 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">Pinyon Modül Hesabı</h6>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600 dark:text-slate-400">Mukavemete göre:</span>
                                <div className="flex items-center gap-2">
                                    <span className={`font-mono font-bold ${!isSurfaceDominant ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>{mnm.toFixed(4)}</span>
                                    {!isSurfaceDominant && <span className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"></span>}
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600 dark:text-slate-400">Yüzey Basıncına göre:</span>
                                <div className="flex items-center gap-2">
                                    <span className={`font-mono font-bold ${isSurfaceDominant ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>{mny.toFixed(4)}</span>
                                    {isSurfaceDominant && <span className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"></span>}
                                </div>
                            </div>
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Seçilen Modül (Mn):</span>
                                <select
                                    value={currentOverride}
                                    onChange={(e) => onModuleOverride(Number(e.target.value))}
                                    className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded px-2 py-1 text-xs font-mono font-bold outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="0">Otomatik ({stageResult.module})</option>
                                    {STANDARD_MODULES.map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Kontrol Bölümü */}
                    <div className="bg-white dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                        <h6 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">Güvenlik Kontrolü</h6>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600 dark:text-slate-400">Mukavemet (S):</span>
                                <div className="flex items-center gap-2">
                                    <span className={`font-mono font-bold px-2 py-0.5 rounded ${stageResult.safetyFactors.strength >= requiredSafety ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                                        {stageResult.safetyFactors.strength.toFixed(2)}
                                    </span>
                                    <span className="text-xs text-slate-400 dark:text-slate-500">/ {requiredSafety}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600 dark:text-slate-400">Yüzey Basıncı (Sy):</span>
                                <div className="flex items-center gap-2">
                                    <span className={`font-mono font-bold px-2 py-0.5 rounded ${stageResult.safetyFactors.surfacePressure >= requiredSafety ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                                        {stageResult.safetyFactors.surfacePressure.toFixed(2)}
                                    </span>
                                    <span className="text-xs text-slate-400 dark:text-slate-500">/ {requiredSafety}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 p-6 font-sans">

            {/* MAIN FORM LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT COLUMN: Design Values & Ratios */}
                <div className="lg:col-span-8 space-y-8">

                    {/* PANEL 1: Tasarım Değerleri */}
                    <div className={cardClass}>
                        <div className={headerClass}>
                            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M2 12h20M2 12l5-5m-5 5 5 5" /></svg>
                            </div>
                            <h3 className={headerTitleClass}>Tasarım Değerleri</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className={labelClass}>Giriş Gücü (kW)</label>
                                <input type="number" value={designValues.power} onChange={(e) => setDesignValues({ ...designValues, power: +e.target.value })} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Giriş Devri (d/d)</label>
                                <input type="number" value={designValues.inputSpeed} onChange={(e) => setDesignValues({ ...designValues, inputSpeed: +e.target.value })} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Çıkış Devri (d/d)</label>
                                <input type="number" value={designValues.outputSpeed} onChange={(e) => setDesignValues({ ...designValues, outputSpeed: +e.target.value })} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Kademe Sayısı</label>
                                <input type="text" value="2" disabled className={readOnlyClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Dişli Tipi</label>
                                <select
                                    value={designValues.gearType}
                                    onChange={(e) => handleGearTypeChange(e.target.value)}
                                    className={selectClass}
                                >
                                    <option value="Helisel">Helisel</option>
                                    <option value="Duz">Düz</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Kutu Konstrüksiyonu</label>
                                <select
                                    value={designValues.boxConstruction}
                                    onChange={(e) => setDesignValues({ ...designValues, boxConstruction: e.target.value })}
                                    className={selectClass}
                                >
                                    <option value="Döküm">Döküm</option>
                                    <option value="Kaynak">Kaynak</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* PANEL 2: Çevrim Oranları */}
                    <div className={cardClass}>
                        <div className={headerClass}>
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" /></svg>
                            </div>
                            <h3 className={headerTitleClass}>Çevrim Oranları</h3>
                        </div>
                        <div className="p-6">
                            {result && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">1. Dişli Diş Sayısı (z1)</label>
                                            <input type="number" value={ratioInputs.z1} onChange={(e) => setRatioInputs({ ...ratioInputs, z1: +e.target.value })} className={inputClass + " w-24"} />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">3. Dişli Diş Sayısı (z3)</label>
                                            <input type="number" value={ratioInputs.z3} onChange={(e) => setRatioInputs({ ...ratioInputs, z3: +e.target.value })} className={inputClass + " w-24"} />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium text-slate-500 dark:text-slate-400">2. Dişli Diş Sayısı (z2)</label>
                                            <input type="text" value={result.toothCounts.stage1Gear} disabled className={readOnlyClass + " w-24"} />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium text-slate-500 dark:text-slate-400">4. Dişli Diş Sayısı (z4)</label>
                                            <input type="text" value={result.toothCounts.stage2Gear} disabled className={readOnlyClass + " w-24"} />
                                        </div>
                                    </div>

                                    <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">1. Çevrim Oranı</span>
                                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{result.ratioAnalysis.stage1Ratio.toFixed(3)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">2. Çevrim Oranı</span>
                                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{result.ratioAnalysis.stage2Ratio.toFixed(3)}</span>
                                        </div>
                                        <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Toplam Oran</span>
                                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{result.ratioAnalysis.actualRatio.toFixed(3)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Hata Payı</span>
                                            <span className={`text-sm font-bold px-2 py-0.5 rounded ${result.ratioAnalysis.errorPercentage < 3 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                                                %{result.ratioAnalysis.errorPercentage.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN: Hesaplama Bölümü (Checkboxes) */}
                <div className="lg:col-span-4">
                    <div className={cardClass + " h-full"}>
                        <div className={headerClass}>
                            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                            </div>
                            <h3 className={headerTitleClass}>Hesaplama Adımları</h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                <div className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${activeSteps.ratios ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${activeSteps.ratios ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'}`}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    <span className={`font-medium ${activeSteps.ratios ? 'text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>Çevrim Oranları</span>
                                </div>

                                <button onClick={() => handleCheckboxClick('stage1')} className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${activeSteps.stage1 ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${activeSteps.stage1 ? 'bg-blue-500 text-white' : 'border-2 border-slate-300 dark:border-slate-600 text-transparent'}`}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    <span className={`font-medium ${activeSteps.stage1 ? 'text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>1. Kademe Hesabı</span>
                                </button>

                                <button onClick={() => handleCheckboxClick('stage2')} className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${activeSteps.stage2 ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${activeSteps.stage2 ? 'bg-blue-500 text-white' : 'border-2 border-slate-300 dark:border-slate-600 text-transparent'}`}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    <span className={`font-medium ${activeSteps.stage2 ? 'text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>2. Kademe Hesabı</span>
                                </button>

                                <div className="border-t border-slate-100 dark:border-slate-700 my-4"></div>

                                <button onClick={() => handleCheckboxClick('shaft')} className="w-full flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-left group">
                                    <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                                    </div>
                                    <span className="font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200">Mil Hesabı</span>
                                    <svg className="w-4 h-4 ml-auto text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </button>

                                <button onClick={() => handleCheckboxClick('keyway')} className="w-full flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-left group">
                                    <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
                                    </div>
                                    <span className="font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200">Kama Hesabı</span>
                                    <svg className="w-4 h-4 ml-auto text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </button>

                                <button onClick={() => handleCheckboxClick('bearing')} className="w-full flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-left group">
                                    <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /></svg>
                                    </div>
                                    <span className="font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200">Rulman Hesabı</span>
                                    <svg className="w-4 h-4 ml-auto text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </button>
                            </div>

                            {/* Working Factor & General Setup */}
                            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-4">Genel Ayarlar</h4>
                                <div className="space-y-4">
                                    <KoFactorSelector value={stageParams.workingFactor} onChange={(v) => setStageParams({ ...stageParams, workingFactor: v })} />
                                    <div>
                                        <label className={labelClass}>Hız Faktörü (Kv)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={stageParams.Kv}
                                            onChange={(e) => setStageParams({ ...stageParams, Kv: +e.target.value })}
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* HIDDEN / EXPANDED DETAILS FOR STAGE 1 & 2 */}
            {activeSteps.stage1 && result && (
                <div className={cardClass + " animate-in fade-in slide-in-from-bottom-4"}>
                    <div className={headerClass}>
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <span className="font-bold">1</span>
                        </div>
                        <div className="flex-1">
                            <h3 className={headerTitleClass}>1. Kademe Detayları</h3>
                            <p className="text-xs text-slate-500 mt-0.5">{result.stage1.speed.toFixed(0)} rpm / {result.stage1.torque.toFixed(1)} Nm</p>
                        </div>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Malzeme</label>
                                    <select className={selectClass} onChange={(e) => {
                                        const m = GEAR_MATERIALS.find(x => x.name === e.target.value);
                                        if (m) setStageParams({ ...stageParams, stage1Material: m });
                                    }} value={stageParams.stage1Material.name}>
                                        {GEAR_MATERIALS.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Helis Açısı</label>
                                        <input
                                            type="number"
                                            value={stageParams.stage1Helix}
                                            onChange={(e) => setStageParams({ ...stageParams, stage1Helix: +e.target.value })}
                                            className={designValues.gearType === 'Duz' ? readOnlyClass : inputClass}
                                            disabled={designValues.gearType === 'Duz'}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Genişlik F.</label>
                                        <input type="number" step="0.1" value={stageParams.stage1WidthFactor} onChange={(e) => setStageParams({ ...stageParams, stage1WidthFactor: +e.target.value })} className={inputClass} />
                                    </div>
                                </div>
                            </div>
                            <ModuleAnalysisPanel
                                stageResult={result.stage1}
                                requiredSafety={stageParams.safetyFactor}
                                currentOverride={forcedModules.stage1}
                                onModuleOverride={(m) => setForcedModules(prev => ({ ...prev, stage1: m }))}
                            />
                        </div>
                        <div className="md:col-span-2 space-y-6">
                            {/* Technical Specifications - Premium */}
                            <div className="relative bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-800/80 dark:via-slate-800 dark:to-slate-900 rounded-2xl p-8 border-2 border-slate-200/60 dark:border-slate-700/60 shadow-xl overflow-hidden group">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl"></div>
                                <h4 className="relative text-base font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
                                    Teknik Özellikler
                                </h4>
                                <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="bg-white/50 dark:bg-slate-700/30 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-600/50">
                                        <span className="text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider block mb-2">Modül</span>
                                        <span className="text-xl font-black font-mono text-indigo-600 dark:text-indigo-400">{result.stage1.module} mm</span>
                                    </div>
                                    <div className="bg-white/50 dark:bg-slate-700/30 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-600/50">
                                        <span className="text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider block mb-2">Eksen Aralığı</span>
                                        <span className="text-xl font-black font-mono text-indigo-600 dark:text-indigo-400">{result.stage1.centerDistance} mm</span>
                                    </div>
                                    <div className="bg-white/50 dark:bg-slate-700/30 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-600/50">
                                        <span className="text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider block mb-2">Çaplar (d1/d2)</span>
                                        <span className="text-xl font-black font-mono text-indigo-600 dark:text-indigo-400">{result.stage1.d1} / {result.stage1.d2}</span>
                                    </div>
                                    <div className="bg-white/50 dark:bg-slate-700/30 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-600/50">
                                        <span className="text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider block mb-2">Genişlik</span>
                                        <span className="text-xl font-black font-mono text-indigo-600 dark:text-indigo-400">{result.stage1.b} mm</span>
                                    </div>
                                </div>
                                <div className="relative mt-8 pt-6 border-t border-slate-300/50 dark:border-slate-600/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <span className="text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider block mb-2">Kuvvetler (Ft / Fr / Fa)</span>
                                        <span className="font-mono font-black text-lg text-slate-900 dark:text-white">{result.stage1.forces.Ft} / {result.stage1.forces.Fr} / {result.stage1.forces.Fa} N</span>
                                    </div>
                                    <button
                                        onClick={() => onPowerSpeedChange && onPowerSpeedChange((result.stage1.torque * result.stage1.speed) / 9550, result.stage1.speed, result.stage1.forces)}
                                        className="group relative px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/50 hover:scale-105 overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-600/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                        <span className="relative z-10">Değerleri Mil Hesabına Aktar</span>
                                    </button>
                                </div>
                            </div>

                            {/* Gear Visualizer - Premium */}
                            <div className="relative bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-2xl border-2 border-slate-200/60 dark:border-slate-700/60 p-8 shadow-xl overflow-hidden">
                                <div className="absolute inset-0 bg-grid-slate-200/[0.03] dark:bg-grid-slate-700/[0.03]" style={{ backgroundImage: 'radial-gradient(circle, rgba(148, 163, 184, 0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                                <div className="relative w-full">
                                    <GearVisualizer d1={result.stage1.d1} d2={result.stage1.d2} centerDistance={result.stage1.centerDistance} b={result.stage1.b} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeSteps.stage2 && result && (
                <div className={cardClass + " animate-in fade-in slide-in-from-bottom-4"}>
                    <div className={headerClass}>
                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                            <span className="font-bold">2</span>
                        </div>
                        <div className="flex-1">
                            <h3 className={headerTitleClass}>2. Kademe Detayları</h3>
                            <p className="text-xs text-slate-500 mt-0.5">{result.stage2.speed.toFixed(0)} rpm / {result.stage2.torque.toFixed(1)} Nm</p>
                        </div>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Malzeme</label>
                                    <select className={selectClass} onChange={(e) => {
                                        const m = GEAR_MATERIALS.find(x => x.name === e.target.value);
                                        if (m) setStageParams({ ...stageParams, stage2Material: m });
                                    }} value={stageParams.stage2Material.name}>
                                        {GEAR_MATERIALS.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Helis Açısı</label>
                                        <input
                                            type="number"
                                            value={stageParams.stage2Helix}
                                            onChange={(e) => setStageParams({ ...stageParams, stage2Helix: +e.target.value })}
                                            className={designValues.gearType === 'Duz' ? readOnlyClass : inputClass}
                                            disabled={designValues.gearType === 'Duz'}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Genişlik F.</label>
                                        <input type="number" step="0.1" value={stageParams.stage2WidthFactor} onChange={(e) => setStageParams({ ...stageParams, stage2WidthFactor: +e.target.value })} className={inputClass} />
                                    </div>
                                </div>
                            </div>
                            <ModuleAnalysisPanel
                                stageResult={result.stage2}
                                requiredSafety={stageParams.safetyFactor}
                                currentOverride={forcedModules.stage2}
                                onModuleOverride={(m) => setForcedModules(prev => ({ ...prev, stage2: m }))}
                            />
                        </div>
                        <div className="md:col-span-2 space-y-6">
                            {/* Technical Specifications - Premium (Stage 2) */}
                            <div className="relative bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-800/80 dark:via-slate-800 dark:to-slate-900 rounded-2xl p-8 border-2 border-slate-200/60 dark:border-slate-700/60 shadow-xl overflow-hidden group">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl"></div>
                                <h4 className="relative text-base font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
                                    Teknik Özellikler
                                </h4>
                                <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="bg-white/50 dark:bg-slate-700/30 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-600/50">
                                        <span className="text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider block mb-2">Modül</span>
                                        <span className="text-xl font-black font-mono text-purple-600 dark:text-purple-400">{result.stage2.module} mm</span>
                                    </div>
                                    <div className="bg-white/50 dark:bg-slate-700/30 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-600/50">
                                        <span className="text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider block mb-2">Eksen Aralığı</span>
                                        <span className="text-xl font-black font-mono text-purple-600 dark:text-purple-400">{result.stage2.centerDistance} mm</span>
                                    </div>
                                    <div className="bg-white/50 dark:bg-slate-700/30 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-600/50">
                                        <span className="text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider block mb-2">Çaplar (d3/d4)</span>
                                        <span className="text-xl font-black font-mono text-purple-600 dark:text-purple-400">{result.stage2.d1} / {result.stage2.d2}</span>
                                    </div>
                                    <div className="bg-white/50 dark:bg-slate-700/30 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-600/50">
                                        <span className="text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider block mb-2">Genişlik</span>
                                        <span className="text-xl font-black font-mono text-purple-600 dark:text-purple-400">{result.stage2.b} mm</span>
                                    </div>
                                </div>
                                <div className="relative mt-8 pt-6 border-t border-slate-300/50 dark:border-slate-600/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <span className="text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider block mb-2">Kuvvetler (Ft / Fr / Fa)</span>
                                        <span className="font-mono font-black text-lg text-slate-900 dark:text-white">{result.stage2.forces.Ft} / {result.stage2.forces.Fr} / {result.stage2.forces.Fa} N</span>
                                    </div>
                                    <button
                                        onClick={() => onPowerSpeedChange && onPowerSpeedChange((result.stage2.torque * result.stage2.speed) / 9550, result.stage2.speed, result.stage2.forces)}
                                        className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 hover:scale-105 overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-600/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                        <span className="relative z-10">Değerleri Mil Hesabına Aktar</span>
                                    </button>
                                </div>
                            </div>

                            {/* Gear Visualizer - Premium (Stage 2) */}
                            <div className="relative bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-2xl border-2 border-slate-200/60 dark:border-slate-700/60 p-8 shadow-xl overflow-hidden">
                                <div className="absolute inset-0 bg-grid-slate-200/[0.03] dark:bg-grid-slate-700/[0.03]" style={{ backgroundImage: 'radial-gradient(circle, rgba(148, 163, 184, 0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                                <div className="relative w-full">
                                    <GearVisualizer d1={result.stage2.d1} d2={result.stage2.d2} centerDistance={result.stage2.centerDistance} b={result.stage2.b} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GearModule;
