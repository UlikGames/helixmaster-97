
import React from 'react';

interface Props {
  inputSpeed: number;
  outputSpeed: number;
  onSpeedsChange: (input: number, output: number) => void;
  ratioAnalysis?: {
    targetRatio: number;
    stage1Ratio: number;
    stage2Ratio: number;
    actualRatio: number;
    errorPercentage: number;
  };
}

export const RatioDistributionPanel: React.FC<Props> = ({
  inputSpeed,
  outputSpeed,
  onSpeedsChange,
  ratioAnalysis
}) => {
  const inputClass = "w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-slate-100 transition-colors font-mono";
  const labelClass = "text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block";

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
        Çevrim Oranı Dağılımı
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className={labelClass}>Giriş Devri (Ng)</label>
          <div className="relative">
            <input
                type="number"
                value={inputSpeed}
                onChange={(e) => onSpeedsChange(+e.target.value, outputSpeed)}
                className={inputClass}
            />
            <span className="absolute right-3 top-2 text-xs text-slate-400">rpm</span>
          </div>
        </div>
        <div>
          <label className={labelClass}>Çıkış Devri (Nc)</label>
          <div className="relative">
            <input
                type="number"
                value={outputSpeed}
                onChange={(e) => onSpeedsChange(inputSpeed, +e.target.value)}
                className={inputClass}
            />
            <span className="absolute right-3 top-2 text-xs text-slate-400">rpm</span>
          </div>
        </div>
      </div>

      {ratioAnalysis && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
             <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-400 mb-1">Toplam Oran</div>
                <div className="font-bold text-slate-900 dark:text-white font-mono">{ratioAnalysis.targetRatio.toFixed(2)}</div>
             </div>
             <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-400 mb-1">1. Kademe</div>
                <div className="font-bold text-slate-900 dark:text-white font-mono">{ratioAnalysis.stage1Ratio.toFixed(2)}</div>
             </div>
             <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-400 mb-1">2. Kademe</div>
                <div className="font-bold text-slate-900 dark:text-white font-mono">{ratioAnalysis.stage2Ratio.toFixed(2)}</div>
             </div>
             <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-400 mb-1">Gerçek Oran</div>
                <div className="font-bold text-slate-900 dark:text-white font-mono">{ratioAnalysis.actualRatio.toFixed(2)}</div>
             </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
             <span className="text-slate-500 dark:text-slate-400">Hata Oranı:</span>
             <span className={`font-mono font-bold px-2 py-1 rounded ${ratioAnalysis.errorPercentage < 3 ? 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400' : 'text-red-600 bg-red-100'}`}>
                %{ratioAnalysis.errorPercentage.toFixed(2)}
             </span>
          </div>
        </div>
      )}
    </div>
  );
};
