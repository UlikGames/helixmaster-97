
import React from 'react';
import { ReducerResult, BearingResult, ShaftResult } from '../types';

interface ReportData {
    project: {
        name: string;
        designer: string;
        date: Date;
    };
    reducer: ReducerResult;
    bearings?: BearingResult[];
    shaft?: ShaftResult | null;
}

interface Props {
    data: ReportData;
    onExportPDF?: () => void;
    onExportDAT?: () => void;
    theme?: 'light' | 'dark';
}

/**
 * Comprehensive Report Display
 * Displays complete calculation results with export options
 */
export const ComprehensiveReport: React.FC<Props> = ({ data, onExportPDF, onExportDAT }) => {
    
    const formatNumber = (value: number | null | undefined, digits = 2) =>
        typeof value === 'number' && Number.isFinite(value) ? value.toFixed(digits) : '—';

    const { reducer } = data;

    // Common styles - Added print break avoidance
    const sectionClass = "bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-xl p-6 mb-6 print:break-inside-avoid print:bg-white print:border-slate-300";
    const sectionTitleClass = "text-lg font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2";
    const tableClass = "w-full text-sm text-left border-collapse";
    const thClass = "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium py-2 px-3 border-b border-slate-200 dark:border-slate-700 print:bg-slate-100 print:text-black";
    const tdClass = "py-2 px-3 border-b border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 print:text-black print:border-slate-200";
    const infoBoxClass = "bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm print:shadow-none print:border-slate-300";

    return (
        <div className="bg-white dark:bg-slate-950 p-8 md:p-12 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-5xl mx-auto transition-colors duration-300 print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none print:w-full">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-10 pb-6 border-b border-slate-200 dark:border-slate-800 print:border-black print:mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 print:text-black">Tasarım Raporu</h1>
                    <div className="text-slate-500 dark:text-slate-400 text-sm space-y-1 print:text-black">
                        <p><strong>Proje:</strong> {data.project.name}</p>
                        <p><strong>Tasarımcı:</strong> {data.project.designer}</p>
                        <p><strong>Tarih:</strong> {data.project.date.toLocaleDateString('tr-TR')}</p>
                    </div>
                </div>
                <div className="text-right hidden sm:block print:block">
                    <div className="text-4xl font-black text-slate-200 dark:text-slate-800 print:text-slate-200">HM97</div>
                </div>
            </div>

            {/* 1. Reducer Summary */}
            <div className={sectionClass}>
                <h2 className={sectionTitleClass}>
                    <span className="w-2 h-2 rounded-full bg-blue-500 print:bg-black print:hidden"></span>
                    1. Redüktör Özeti
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className={infoBoxClass}>
                        <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 print:text-black">Toplam Çevrim Oranı</div>
                        <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white print:text-black">
                            {formatNumber(reducer.totalRatioActual, 3)}
                        </div>
                    </div>

                    <div className={infoBoxClass}>
                        <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 print:text-black">Çıkış Torku</div>
                        <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white print:text-black">
                            {formatNumber(reducer.outputTorque, 2)} <span className="text-sm font-normal text-slate-500 print:text-black">Nm</span>
                        </div>
                    </div>
                </div>

                {reducer.ratioAnalysis && (
                    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden print:border-slate-300">
                         <table className={tableClass}>
                            <thead>
                                <tr>
                                    <th className={thClass}>1. Kademe (i₁₂)</th>
                                    <th className={thClass}>2. Kademe (i₃₄)</th>
                                    <th className={thClass}>Hedef Oran</th>
                                    <th className={thClass}>Gerçek Oran</th>
                                    <th className={thClass}>Hata</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className={tdClass + " font-mono"}>{formatNumber(reducer.ratioAnalysis.stage1Ratio, 3)}</td>
                                    <td className={tdClass + " font-mono"}>{formatNumber(reducer.ratioAnalysis.stage2Ratio, 3)}</td>
                                    <td className={tdClass + " font-mono"}>{formatNumber(reducer.ratioAnalysis.targetRatio, 3)}</td>
                                    <td className={tdClass + " font-mono font-bold"}>{formatNumber(reducer.ratioAnalysis.actualRatio, 3)}</td>
                                    <td className={tdClass}>
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${reducer.ratioAnalysis.errorPercentage < 3 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 print:text-black print:bg-transparent print:border print:border-black' : 'bg-red-100 text-red-700 print:text-black print:bg-transparent print:border print:border-black'}`}>
                                            %{formatNumber(reducer.ratioAnalysis.errorPercentage, 2)}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* 2. Gear Calculations */}
            <div className={sectionClass}>
                <h2 className={sectionTitleClass}>
                    <span className="w-2 h-2 rounded-full bg-purple-500 print:hidden"></span>
                    2. Dişli Hesapları
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Stage 1 */}
                    <div className="print:break-inside-avoid">
                        <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-3 text-sm uppercase print:text-black">1. Kademe (Giriş)</h3>
                        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden print:border-slate-300">
                            <table className={tableClass}>
                                <tbody>
                                    <tr>
                                        <td className={tdClass + " text-slate-500 print:text-black"}>Diş Sayıları (z1/z2)</td>
                                        <td className={tdClass + " font-mono text-right"}>{reducer.toothCounts?.stage1Pinion} / {reducer.toothCounts?.stage1Gear}</td>
                                    </tr>
                                    <tr>
                                        <td className={tdClass + " text-slate-500 print:text-black"}>Modül (mn)</td>
                                        <td className={tdClass + " font-mono text-right font-bold"}>{formatNumber(reducer.stage1.module, 2)} mm</td>
                                    </tr>
                                    <tr>
                                        <td className={tdClass + " text-slate-500 print:text-black"}>Çaplar (d1/d2)</td>
                                        <td className={tdClass + " font-mono text-right"}>{formatNumber(reducer.stage1.d1, 1)} / {formatNumber(reducer.stage1.d2, 1)}</td>
                                    </tr>
                                    <tr>
                                        <td className={tdClass + " text-slate-500 print:text-black"}>Eksen Aralığı</td>
                                        <td className={tdClass + " font-mono text-right"}>{formatNumber(reducer.stage1.centerDistance, 1)} mm</td>
                                    </tr>
                                    <tr>
                                        <td className={tdClass + " text-slate-500 print:text-black"}>Genişlik (b)</td>
                                        <td className={tdClass + " font-mono text-right"}>{formatNumber(reducer.stage1.b, 1)} mm</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Stage 2 */}
                    <div className="print:break-inside-avoid">
                        <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-3 text-sm uppercase print:text-black">2. Kademe (Çıkış)</h3>
                        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden print:border-slate-300">
                            <table className={tableClass}>
                                <tbody>
                                    <tr>
                                        <td className={tdClass + " text-slate-500 print:text-black"}>Diş Sayıları (z3/z4)</td>
                                        <td className={tdClass + " font-mono text-right"}>{reducer.toothCounts?.stage2Pinion} / {reducer.toothCounts?.stage2Gear}</td>
                                    </tr>
                                    <tr>
                                        <td className={tdClass + " text-slate-500 print:text-black"}>Modül (mn)</td>
                                        <td className={tdClass + " font-mono text-right font-bold"}>{formatNumber(reducer.stage2.module, 2)} mm</td>
                                    </tr>
                                    <tr>
                                        <td className={tdClass + " text-slate-500 print:text-black"}>Çaplar (d3/d4)</td>
                                        <td className={tdClass + " font-mono text-right"}>{formatNumber(reducer.stage2.d1, 1)} / {formatNumber(reducer.stage2.d2, 1)}</td>
                                    </tr>
                                    <tr>
                                        <td className={tdClass + " text-slate-500 print:text-black"}>Eksen Aralığı</td>
                                        <td className={tdClass + " font-mono text-right"}>{formatNumber(reducer.stage2.centerDistance, 1)} mm</td>
                                    </tr>
                                    <tr>
                                        <td className={tdClass + " text-slate-500 print:text-black"}>Genişlik (b)</td>
                                        <td className={tdClass + " font-mono text-right"}>{formatNumber(reducer.stage2.b, 1)} mm</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Bearings */}
            {data.bearings && data.bearings.length > 0 && (
                <div className={sectionClass}>
                    <h2 className={sectionTitleClass}>
                        <span className="w-2 h-2 rounded-full bg-green-500 print:hidden"></span>
                        3. Rulman Seçimi
                    </h2>
                    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden print:border-slate-300">
                        <table className={tableClass}>
                            <thead>
                                <tr>
                                    <th className={thClass}>No</th>
                                    <th className={thClass}>Kod</th>
                                    <th className={thClass}>Yük (P)</th>
                                    <th className={thClass}>Ömür (L10h)</th>
                                    <th className={thClass}>Durum</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.bearings.map((bearing, idx) => (
                                    <tr key={idx}>
                                        <td className={tdClass}>{idx + 1}</td>
                                        <td className={tdClass + " font-bold font-mono"}>{bearing.selectedBearing?.code || '-'}</td>
                                        <td className={tdClass + " font-mono"}>{formatNumber(bearing.equivalentLoad, 0)} N</td>
                                        <td className={tdClass + " font-mono"}>{formatNumber(bearing.calculatedLife, 0)} h</td>
                                        <td className={tdClass}>
                                            {bearing.isAdequate 
                                                ? <span className="text-green-600 font-bold flex items-center gap-1 print:text-black">✓ Uygun</span> 
                                                : <span className="text-red-600 font-bold flex items-center gap-1 print:text-black">✕ Yetersiz</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* 4. Shaft */}
            {data.shaft && (
                <div className={sectionClass}>
                    <h2 className={sectionTitleClass}>
                        <span className="w-2 h-2 rounded-full bg-orange-500 print:hidden"></span>
                        4. Mil Özeti
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className={infoBoxClass}>
                            <div className="text-xs text-slate-500 dark:text-slate-400 uppercase mb-1 print:text-black">Standart Mil Çapı</div>
                            <div className="text-3xl font-bold font-mono text-slate-900 dark:text-white print:text-black">{data.shaft.standardDiameter} <span className="text-lg text-slate-400 font-sans print:text-black">mm</span></div>
                         </div>
                         <div className={infoBoxClass}>
                            <div className="text-xs text-slate-500 dark:text-slate-400 uppercase mb-1 print:text-black">Kama Ölçüleri (bxh)</div>
                            <div className="text-3xl font-bold font-mono text-slate-900 dark:text-white print:text-black">{data.shaft.keyway.b}x{data.shaft.keyway.h} <span className="text-lg text-slate-400 font-sans print:text-black">mm</span></div>
                         </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-700 print:text-black print:border-slate-300">
                         <div>Ay: {formatNumber(data.shaft.reactionA_V, 0)} N</div>
                         <div>By: {formatNumber(data.shaft.reactionB_V, 0)} N</div>
                         <div>Ax: {formatNumber(data.shaft.reactionA_H, 0)} N</div>
                         <div>Bx: {formatNumber(data.shaft.reactionB_H, 0)} N</div>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-4 justify-center pt-8 border-t border-slate-200 dark:border-slate-800 no-print">
                <button onClick={onExportPDF} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-semibold transition-all shadow-sm flex items-center gap-2">
                    📄 PDF İndir
                </button>
                <button onClick={onExportDAT} className="px-6 py-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg font-semibold transition-all shadow-sm flex items-center gap-2">
                    📐 AutoCAD (.DAT) İndir
                </button>
                <button onClick={() => window.print()} className="px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-lg font-semibold transition-all shadow-lg flex items-center gap-2">
                    🖨️ Yazdır
                </button>
            </div>
        </div>
    );
};
