
import React, { useState } from 'react';
import {
    BearingInput,
    BearingResult,
    BearingType,
    calculateBearingLife
} from '../utils/bearingCalculations';

interface Props {
    onBearingSelect?: (result: BearingResult) => void;
}

export const BearingSelector: React.FC<Props> = ({ onBearingSelect }) => {
    const [input, setInput] = useState<BearingInput>({
        bearingType: 'deep_groove_ball',
        radialForce: 5000,
        axialForce: 1500,
        speed: 1450,
        operatingHours: 20000,
        diameter: 40,
    });

    const [result, setResult] = useState<BearingResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        try {
            setError(null);
            const bearingResult = calculateBearingLife(input);
            setResult(bearingResult);
            if (onBearingSelect) onBearingSelect(bearingResult);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Hesaplama hatası');
            setResult(null);
        }
    };

    const bearingTypes: { value: BearingType; label: string }[] = [
        { value: 'deep_groove_ball', label: 'Sabit Bilyalı' },
        { value: 'self_aligning_ball', label: 'Oynak Bilyalı' },
        { value: 'angular_contact', label: 'Eğik Bilyalı' },
        { value: 'tapered_roller', label: 'Konik Makaralı' },
        { value: 'cylindrical_roller', label: 'Silindirik Makaralı' },
    ];

    const inputClass = "w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-slate-100 transition-colors";
    const labelClass = "text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block";

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="text-blue-500">🔷</span> Rulman Seçimi
            </h3>

            {/* Type Selection */}
            <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Rulman Tipi</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {bearingTypes.map((type) => (
                        <label
                            key={type.value}
                            className={`flex items-center gap-2 cursor-pointer p-3 rounded-lg border text-sm transition-all ${
                                input.bearingType === type.value
                                    ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-300 shadow-sm ring-1 ring-blue-500'
                                    : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300'
                            }`}
                        >
                            <input
                                type="radio"
                                name="bearingType"
                                checked={input.bearingType === type.value}
                                onChange={() => setInput({ ...input, bearingType: type.value })}
                                className="hidden"
                            />
                            <span className="font-medium">{type.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                <div>
                    <label className={labelClass}>Radyal Kuvvet (N)</label>
                    <input type="number" value={input.radialForce} onChange={(e) => setInput({ ...input, radialForce: +e.target.value })} className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>Eksenel Kuvvet (N)</label>
                    <input type="number" value={input.axialForce} onChange={(e) => setInput({ ...input, axialForce: +e.target.value })} className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>Devir (rpm)</label>
                    <input type="number" value={input.speed} onChange={(e) => setInput({ ...input, speed: +e.target.value })} className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>Ömür (saat)</label>
                    <input type="number" value={input.operatingHours} onChange={(e) => setInput({ ...input, operatingHours: +e.target.value })} className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>Mil Çapı (mm)</label>
                    <input type="number" value={input.diameter} onChange={(e) => setInput({ ...input, diameter: +e.target.value })} className={inputClass} />
                </div>
            </div>

            <button
                onClick={handleCalculate}
                className="w-full md:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors"
            >
                Hesapla ve Seç
            </button>

            {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm border border-red-200 dark:border-red-800">
                    {error}
                </div>
            )}

            {result && result.selectedBearing && (
                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="text-xs text-slate-500 uppercase">Seçilen Rulman</div>
                            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">{result.selectedBearing.designation}</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">{result.selectedBearing.manufacturer} - {input.bearingType}</div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${result.isAdequate ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700'}`}>
                            {result.isAdequate ? 'UYGUN' : 'YETERSİZ'}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div><span className="text-slate-400 text-xs block">Eşdeğer Yük</span> <span className="font-mono font-semibold dark:text-slate-200">{result.equivalentLoad.toFixed(0)} N</span></div>
                        <div><span className="text-slate-400 text-xs block">Hesaplanan Ömür</span> <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">{result.lifeHours.toLocaleString()} h</span></div>
                        <div><span className="text-slate-400 text-xs block">Dinamik Kapasite</span> <span className="font-mono font-semibold dark:text-slate-200">{result.selectedBearing.C} N</span></div>
                        <div><span className="text-slate-400 text-xs block">Boyutlar (dxDxB)</span> <span className="font-mono font-semibold dark:text-slate-200">{result.selectedBearing.d}x{result.selectedBearing.D}x{result.selectedBearing.B}</span></div>
                    </div>
                </div>
            )}
        </div>
    );
};
