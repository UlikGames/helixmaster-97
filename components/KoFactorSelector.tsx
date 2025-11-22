
import React, { useState, useEffect } from 'react';

interface Props {
    value: number;
    onChange: (value: number) => void;
}

type MotorType = 'Electric' | 'MultiCylinder' | 'SingleCylinder';
type LoadType = 'Uniform' | 'Moderate' | 'Heavy';

const KoFactorSelector: React.FC<Props> = ({ value, onChange }) => {
    const [motor, setMotor] = useState<MotorType>('Electric');
    const [load, setLoad] = useState<LoadType>('Moderate');

    const factors: Record<MotorType, Record<LoadType, number>> = {
        Electric: { Uniform: 1.00, Moderate: 1.25, Heavy: 1.50 },
        MultiCylinder: { Uniform: 1.25, Moderate: 1.50, Heavy: 1.75 },
        SingleCylinder: { Uniform: 1.75, Moderate: 2.00, Heavy: 2.25 }
    };

    useEffect(() => {
        const newValue = factors[motor][load];
        if (newValue !== value) onChange(newValue);
    }, [motor, load, onChange, value, factors]);

    return (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Ko Çalışma Faktörü</h4>
                <span className="text-xs font-mono font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 px-2 py-1 rounded text-slate-900 dark:text-white">
                    {value.toFixed(2)}
                </span>
            </div>

            <div className="space-y-3">
                <div>
                    <div className="text-[10px] text-slate-400 mb-1 uppercase font-bold">Motor</div>
                    <div className="flex flex-wrap gap-1">
                        {[
                            {id: 'Electric', label: 'Elektrik'},
                            {id: 'MultiCylinder', label: 'Çok Sil.'},
                            {id: 'SingleCylinder', label: 'Tek Sil.'}
                        ].map(m => (
                            <button
                                key={m.id}
                                onClick={() => setMotor(m.id as MotorType)}
                                className={`px-2 py-1 text-xs rounded border transition-colors ${motor === m.id 
                                    ? 'bg-blue-500 border-blue-500 text-white' 
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div>
                    <div className="text-[10px] text-slate-400 mb-1 uppercase font-bold">Yük</div>
                    <div className="flex flex-wrap gap-1">
                        {[
                            {id: 'Uniform', label: 'Düzgün'},
                            {id: 'Moderate', label: 'Orta'},
                            {id: 'Heavy', label: 'Ağır'}
                        ].map(l => (
                            <button
                                key={l.id}
                                onClick={() => setLoad(l.id as LoadType)}
                                className={`px-2 py-1 text-xs rounded border transition-colors ${load === l.id 
                                    ? 'bg-blue-500 border-blue-500 text-white' 
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                            >
                                {l.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KoFactorSelector;
