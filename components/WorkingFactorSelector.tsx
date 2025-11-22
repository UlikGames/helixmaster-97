
import React, { useState } from 'react';

const KO_MATRIX: number[][] = [
    [1.00, 1.25, 1.50],
    [1.25, 1.50, 1.75],
    [1.75, 2.00, 2.25],
];

type LoadType = 0 | 1 | 2;
type PrimeMoverType = 0 | 1 | 2;

interface Props {
    initialKo?: number;
    onChange?: (Ko: number) => void;
}

export const WorkingFactorSelector: React.FC<Props> = ({ initialKo, onChange }) => {
    const [loadType, setLoadType] = useState<LoadType>(0);
    const [primeMover, setPrimeMover] = useState<PrimeMoverType>(0);

    const Ko = KO_MATRIX[loadType][primeMover];

    const handleLoadChange = (newLoadType: LoadType) => {
        setLoadType(newLoadType);
        const newKo = KO_MATRIX[newLoadType][primeMover];
        if (onChange) onChange(newKo);
    };

    const handlePrimeMoverChange = (newPrimeMover: PrimeMoverType) => {
        setPrimeMover(newPrimeMover);
        const newKo = KO_MATRIX[loadType][newPrimeMover];
        if (onChange) onChange(newKo);
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                ⚙️ Çalışma Faktörü Seçimi (Ko)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase">Yük Durumu</div>
                    <div className="space-y-2">
                        {[
                            { val: 0, label: 'Düzgün Yük', desc: 'Sabit veya hafif dalgalanmalı' },
                            { val: 1, label: 'Orta Darbeli', desc: 'Orta şiddette darbeler' },
                            { val: 2, label: 'Ağır Darbeli', desc: 'Şiddetli ve ani darbeler' }
                        ].map((item) => (
                            <button
                                key={item.val}
                                onClick={() => handleLoadChange(item.val as LoadType)}
                                className={`w-full text-left p-3 rounded-lg border transition-all ${
                                    loadType === item.val
                                        ? 'bg-white dark:bg-slate-700 border-blue-500 ring-1 ring-blue-500 shadow-sm'
                                        : 'border-transparent hover:bg-white dark:hover:bg-slate-700/50'
                                }`}
                            >
                                <div className={`text-sm font-bold ${loadType === item.val ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>{item.label}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase">Tahrik Tipi</div>
                    <div className="space-y-2">
                        {[
                            { val: 0, label: 'Elektrik Motoru', desc: 'Sabit dönüş' },
                            { val: 1, label: 'Çok Silindirli', desc: 'Hafif titreşimler' },
                            { val: 2, label: 'Tek Silindirli', desc: 'Ağır titreşimler' }
                        ].map((item) => (
                            <button
                                key={item.val}
                                onClick={() => handlePrimeMoverChange(item.val as PrimeMoverType)}
                                className={`w-full text-left p-3 rounded-lg borderQB transition-all ${
                                    primeMover === item.val
                                        ? 'bg-white dark:bg-slate-700 border-blue-500 ring-1 ring-blue-500 shadow-sm'
                                        : 'border-transparent hover:bg-white dark:hover:bg-slate-700/50'
                                }`}
                            >
                                <div className={`text-sm font-bold ${primeMover === item.val ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>{item.label}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-lg p-4">
                <div className="text-sm font-medium text-green-800 dark:text-green-300">Seçilen Faktör</div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-400 font-mono">{Ko.toFixed(2)}</div>
            </div>
        </div>
    );
};