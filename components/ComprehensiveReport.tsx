




import React, { useRef, useState } from 'react';
import { ReducerResult, BearingResult, ShaftResult } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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
    onExportDAT?: () => void;
    theme?: 'light' | 'dark';
}

/**
 * Comprehensive Report Display
 * Displays complete calculation results with export options
 */
export const ComprehensiveReport: React.FC<Props> = ({ data, onExportDAT }) => {
    const reportRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);

    const formatNumber = (value: number | null | undefined, digits = 2) =>
        typeof value === 'number' && Number.isFinite(value) ? value.toFixed(digits) : '—';

    const handleExportPDF = async () => {
        if (!reportRef.current) return;
        setIsExporting(true);
        try {
            // Capture the report using html2canvas
            const canvas = await html2canvas(reportRef.current, {
                scale: 2, // High resolution
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                // Ignore the actions div which has 'no-print' class
                ignoreElements: (element) => element.classList.contains('no-print'),
                onclone: (clonedDoc) => {
                    // Ensure the cloned content uses light mode styles for PDF
                    const html = clonedDoc.documentElement;
                    html.classList.remove('dark');
                    html.classList.add('light');

                    // Force background to white on body of clone
                    clonedDoc.body.style.backgroundColor = '#ffffff';
                    clonedDoc.body.style.color = '#000000';
                }
            });

            const imgData = canvas.toDataURL('image/png');

            // Create PDF (A4)
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            // Add first page
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;

            // Add subsequent pages if needed
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            // Save file
            const dateStr = new Date().toISOString().slice(0, 10);
            pdf.save(`HelixMaster97_Rapor_${dateStr}.pdf`);

        } catch (error) {
            console.error('PDF Export Failed:', error);
            alert('PDF oluşturulurken bir hata meydana geldi.');
        } finally {
            setIsExporting(false);
        }
    };

    const { reducer } = data;

    // Common styles - Added print break avoidance
    const sectionClass = "bg-white dark:bg-slate-800 p-6 mb-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 print:break-inside-avoid print:shadow-none print:border-slate-300 print:bg-white";
    const sectionTitleClass = "text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 pb-2 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2 print:text-black print:border-slate-300";
    const tableClass = "w-full text-sm text-left border-collapse";
    const thClass = "bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-medium py-2 px-3 border-b border-slate-200 dark:border-slate-600 print:bg-slate-100 print:text-black print:border-slate-300";
    const tdClass = "py-2 px-3 border-b border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 print:text-black print:border-slate-200";
    const infoBoxClass = "bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600 print:shadow-none print:border-slate-300 print:bg-slate-50";

    return (
        <div
            ref={reportRef}
            id="report-content"
            className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 max-w-5xl mx-auto print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none print:w-full print:bg-white"
        >

            {/* Header */}
            <div className="flex justify-between items-start mb-10 pb-6 border-b border-slate-200 dark:border-slate-700 print:border-black print:mb-6">
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

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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

                    <div className={infoBoxClass}>
                        <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 print:text-black">Dişli Tipi</div>
                        <div className="text-lg font-bold text-slate-900 dark:text-white print:text-black">
                            {reducer.gearType}
                        </div>
                    </div>

                    <div className={infoBoxClass}>
                        <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 print:text-black">Gövde</div>
                        <div className="text-lg font-bold text-slate-900 dark:text-white print:text-black">
                            {reducer.boxConstruction}
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
                                        <td className={tdClass + " text-slate-500 print:text-black"}>Helis Açısı (β)</td>
                                        <td className={tdClass + " font-mono text-right"}>{formatNumber(reducer.stage1.helixAngle, 0)}°</td>
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
                                        <td className={tdClass + " text-slate-500 print:text-black"}>Helis Açısı (β)</td>
                                        <td className={tdClass + " font-mono text-right"}>{formatNumber(reducer.stage2.helixAngle, 0)}°</td>
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
                        <span className="w-2 h-2 rounded-full bg-emerald-500 print:hidden"></span>
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
            <div className="flex flex-wrap gap-4 justify-center pt-8 border-t border-slate-200 dark:border-slate-700 no-print">
                <button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className={`group relative px-8 py-4 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 text-slate-800 dark:text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 overflow-hidden ${isExporting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-100/50 to-slate-200/50 dark:from-slate-700/50 dark:to-slate-600/50 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    {isExporting ? (
                        <span className="flex items-center gap-2 relative z-10">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Oluşturuluyor...
                        </span>
                    ) : (
                        <span className="relative z-10 flex items-center gap-2">📄 PDF İndir</span>
                    )}
                </button>
                <button
                    onClick={onExportDAT}
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105 flex items-center gap-3 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative z-10">📐 AutoCAD (.DAT) İndir</span>
                </button>
                <button
                    onClick={() => window.print()}
                    className="group relative px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-3 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 to-slate-800/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative z-10">🖨️ Yazdır</span>
                </button>
            </div>
        </div>
    );
};