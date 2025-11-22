
import React from 'react';

interface Props {
  d1: number; // Pinion Diameter
  d2: number; // Gear Diameter
  centerDistance: number;
  b: number; // Width
}

export const GearVisualizer: React.FC<Props> = ({ d1, d2, centerDistance, b }) => {
  // Scale factor to fit in SVG
  const maxDim = d1 + d2 + 50;
  const scale = 300 / maxDim;

  const cx = 150;
  const cy1 = 50 + (d1 / 2) * scale;
  const cy2 = cy1 + centerDistance * scale;

  const r1 = (d1 / 2) * scale;
  const r2 = (d2 / 2) * scale;
  const w = b * scale;

  return (
    <div className="flex flex-col items-center bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
      <h4 className="text-base font-black text-slate-900 dark:text-white mb-6 w-full flex items-center gap-2">
        <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
        Şematik Görünüm
      </h4>
      <div className="flex gap-8">
        {/* Front View */}
        <div className="text-center">
          <p className="text-xs mb-2 text-slate-400">Ön Görünüş</p>
          <svg width="300" height={cy2 + r2 + 20} className="border border-dashed border-slate-200 dark:border-slate-700 rounded">
            {/* Center Line */}
            <line x1={cx} y1="0" x2={cx} y2={cy2 + r2 + 20} stroke="#94a3b8" strokeDasharray="5,5" />

            {/* Pinion */}
            <circle cx={cx} cy={cy1} r={r1} fill="none" stroke="#3b82f6" strokeWidth="2" />
            <circle cx={cx} cy={cy1} r={r1 * 0.9} fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4,2" />
            <text x={cx + r1 + 5} y={cy1} className="text-[10px] fill-slate-500">d1={d1}mm</text>

            {/* Gear */}
            <circle cx={cx} cy={cy2} r={r2} fill="none" stroke="#ef4444" strokeWidth="2" />
            <circle cx={cx} cy={cy2} r={r2 * 0.9} fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,2" />
            <text x={cx + r2 + 5} y={cy2} className="text-[10px] fill-slate-500">d2={d2}mm</text>

            {/* Meshing Point */}
            <circle cx={cx} cy={cy1 + (centerDistance - d2 / 2) * scale} r={3} fill="#10b981" />
          </svg>
        </div>

        {/* Side View (Simplified) */}
        <div className="text-center">
          <p className="text-xs mb-2 text-slate-400">Yan Görünüş</p>
          <svg width="100" height={cy2 + r2 + 20} className="border border-dashed border-slate-200 dark:border-slate-700 rounded">
            {/* Pinion Side */}
            <rect x={50 - w / 2} y={cy1 - r1} width={w} height={d1 * scale} fill="#dbeafe" stroke="#3b82f6" />
            <line x1="20" y1={cy1} x2="80" y2={cy1} stroke="#3b82f6" strokeDasharray="4,2" />

            {/* Gear Side */}
            <rect x={50 - w / 2} y={cy2 - r2} width={w} height={d2 * scale} fill="#fee2e2" stroke="#ef4444" />
            <line x1="20" y1={cy2} x2="80" y2={cy2} stroke="#ef4444" strokeDasharray="4,2" />

            <text x="50" y={cy2 + r2 + 15} textAnchor="middle" className="text-[10px] fill-slate-500">b={b}mm</text>
          </svg>
        </div>
      </div>
      <p className="text-[10px] text-slate-400 mt-2">* Çizimler ölçeklidir (Scale: {scale.toFixed(2)})</p>
    </div>
  );
};
