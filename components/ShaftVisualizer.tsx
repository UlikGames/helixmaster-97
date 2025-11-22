
import React from 'react';
import { GearForces } from '../types';

interface Props {
  L1: number;
  L2: number;
  forces: GearForces;
}

export const ShaftVisualizer: React.FC<Props> = ({ L1, L2, forces }) => {
  const totalL = L1 + L2;
  const width = 400;
  const scale = (width - 60) / totalL; // Margin
  
  const xA = 30;
  const xGear = xA + L1 * scale;
  const xB = xGear + L2 * scale;
  const yBase = 100;

  // Force vectors scaling
  const maxF = Math.max(forces.Fr, forces.Ft, 1000);
  const fScale = 50 / maxF;

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mt-4">
      <h4 className="text-sm font-bold text-slate-500 mb-4 border-b pb-2">Yükleme Durumu (Serbest Cisim Diyagramı)</h4>
      <div className="flex justify-center">
        <svg width={width} height="200">
           {/* Shaft */}
           <rect x={xA} y={yBase - 5} width={xB - xA} height={10} fill="#cbd5e1" stroke="#475569" />
           
           {/* Bearing A (Fixed) */}
           <path d={`M ${xA} ${yBase+5} L ${xA-10} ${yBase+20} L ${xA+10} ${yBase+20} Z`} fill="#ef4444" />
           <text x={xA} y={yBase+35} textAnchor="middle" className="text-xs fill-slate-600">A (Sabit)</text>
           
           {/* Bearing B (Floating) */}
           <circle cx={xB} cy={yBase+12} r={7} fill="none" stroke="#ef4444" />
           <line x1={xB-10} y1={yBase+20} x2={xB+10} y2={yBase+20} stroke="#ef4444" strokeWidth="2" />
           <text x={xB} y={yBase+35} textAnchor="middle" className="text-xs fill-slate-600">B (Serbest)</text>

           {/* Gear Position */}
           <rect x={xGear-5} y={yBase-30} width={10} height={60} fill="#3b82f6" opacity="0.5" />
           <text x={xGear} y={yBase-40} textAnchor="middle" className="text-xs font-bold fill-blue-600">Dişli</text>

           {/* Forces */}
           {/* Fr (Radial) - Downward */}
           <line x1={xGear} y1={yBase} x2={xGear} y2={yBase + forces.Fr * fScale} stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow)" />
           <text x={xGear + 5} y={yBase + forces.Fr * fScale} className="text-[10px] fill-green-600">Fr={forces.Fr}N</text>

           {/* Ft (Tangential) - Into page (Circle with X) */}
           <circle cx={xGear} cy={yBase} r={8} fill="white" stroke="#8b5cf6" strokeWidth="2" />
           <line x1={xGear-5} y1={yBase-5} x2={xGear+5} y2={yBase+5} stroke="#8b5cf6" strokeWidth="2" />
           <line x1={xGear-5} y1={yBase+5} x2={xGear+5} y2={yBase-5} stroke="#8b5cf6" strokeWidth="2" />
           <text x={xGear + 12} y={yBase - 10} className="text-[10px] fill-purple-600">Ft={forces.Ft}N</text>

           {/* Fa (Axial) - Horizontal */}
           <line x1={xGear} y1={yBase-15} x2={xGear + forces.Fa * fScale} y2={yBase-15} stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrow)" />
           <text x={xGear + forces.Fa * fScale} y={yBase-20} textAnchor="middle" className="text-[10px] fill-amber-600">Fa={forces.Fa}N</text>

           {/* Dimensions */}
           <line x1={xA} y1={yBase+50} x2={xB} y2={yBase+50} stroke="#94a3b8" />
           <text x={xA + (xGear-xA)/2} y={yBase+45} textAnchor="middle" className="text-[10px] fill-slate-400">L1={L1}mm</text>
           <text x={xGear + (xB-xGear)/2} y={yBase+45} textAnchor="middle" className="text-[10px] fill-slate-400">L2={L2}mm</text>

           <defs>
             <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
               <path d="M0,0 L0,6 L9,3 z" fill="currentColor" />
             </marker>
           </defs>
        </svg>
      </div>
    </div>
  );
};
