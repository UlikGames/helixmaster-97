
import { ReducerResult, ShaftResult, BearingResult } from '../types';

/**
 * Gearbox.Lsp - AutoCAD .DAT File Exporter
 * 
 * Exports calculation data in AutoLISP-compatible .dat format
 * Based on VB6 data file structure.
 */

export interface AutoCADExportData {
    reducer: ReducerResult;
    speeds: {
        N1: number; // Input speed (rpm)
        N2: number; // Intermediate speed (rpm)
        N3: number; // Output speed (rpm)
    };
    shaft?: ShaftResult;
    bearings?: BearingResult[];
    positioning?: {
        YN1: number;
        YN2: number;
        YN3: number;
        YN4: number;
        ao1: number;
        ao2: number;
    };
}

/**
 * Generate .DAT file content for AutoCAD import
 */
export function generateDATFiles(data: AutoCADExportData): Record<string, string> {
    const files: Record<string, string> = {};

    // Disli1.dat - Stage 1 Gear Data
    files['Disli1.dat'] = formatDatLine([
        data.reducer.stage1.helixAngle || 0,           // Bo (helix angle)
        data.reducer.stage1.b,                         // b1
        data.reducer.stage1.b,                         // b2 (same as b1)
        data.reducer.stage1.module,                    // Mn (module)
        0,                                             // h1 (addendum - calculated in AutoLISP)
        0,                                             // h2 (dedendum - calculated in AutoLISP)
        data.reducer.stage1.d1,                        // do1 (pitch diameter pinyon)
        data.reducer.stage1.d2,                        // do2 (pitch diameter gear)
        (data.reducer.stage1.d1 + data.reducer.stage1.d2) / 2, // ao1 (center distance)
        data.reducer.stage1.d1 + 2 * data.reducer.stage1.module, // db1 (tip diameter pinyon)
        data.reducer.stage1.d2 + 2 * data.reducer.stage1.module, // db2 (tip diameter gear)
        data.reducer.stage1.d1 - 2.5 * data.reducer.stage1.module, // dt1 (root diameter pinyon)
        data.reducer.stage1.d2 - 2.5 * data.reducer.stage1.module, // dt2 (root diameter gear)
        data.reducer.toothCounts?.stage1Pinion || 20,  // z1
        data.reducer.toothCounts?.stage1Gear || 40,    // z2
        data.reducer.stage1.forces?.Ft || 0,   // ft1
        data.reducer.stage1.forces?.Fa || 0,   // fa1
        data.reducer.stage1.forces?.Fr || 0,   // fr1
    ]);

    // Disli2.dat - Stage 2 Gear Data
    files['Disli2.dat'] = formatDatLine([
        data.reducer.stage2.helixAngle || 0,
        data.reducer.stage2.b,
        data.reducer.stage2.b,
        data.reducer.stage2.module,
        0,
        0,
        data.reducer.stage2.d1,
        data.reducer.stage2.d2,
        (data.reducer.stage2.d1 + data.reducer.stage2.d2) / 2,
        data.reducer.stage2.d1 + 2 * data.reducer.stage2.module,
        data.reducer.stage2.d2 + 2 * data.reducer.stage2.module,
        data.reducer.stage2.d1 - 2.5 * data.reducer.stage2.module,
        data.reducer.stage2.d2 - 2.5 * data.reducer.stage2.module,
        data.reducer.toothCounts?.stage2Pinion || 20,
        data.reducer.toothCounts?.stage2Gear || 40,
        data.reducer.stage2.forces?.Ft || 0,
        data.reducer.stage2.forces?.Fa || 0,
        data.reducer.stage2.forces?.Fr || 0,
    ]);

    // devir.dat - Speed Data
    files['devir.dat'] = [
        data.speeds.N1,
        data.speeds.N2,
        data.speeds.N3,
    ].join(', ') + '\n';

    // yerles.dat - Positioning Data (if available)
    if (data.positioning) {
        files['yerles.dat'] = [
            data.positioning.YN1,
            data.positioning.YN2,
            data.positioning.YN3,
            data.positioning.YN4,
            data.positioning.ao1,
        data.positioning.ao2,
        ].join('\n') + '\n';
    }

    // shaft.dat - basic shaft geometry/output
    if (data.shaft) {
        const s = data.shaft;
        files['shaft.dat'] = formatDatLine([
            s.standardDiameter,
            s.minDiameter,
            s.reactionA_H,
            s.reactionB_H,
            s.reactionA_V,
            s.reactionB_V,
            s.keyway.b,
            s.keyway.h,
            s.keyway.t1,
            s.keyway.t2,
        ]);
    }

    // bearing.dat - summary of bearing selections
    if (data.bearings && data.bearings.length > 0) {
        const lines = data.bearings.map((b, idx) =>
            formatDatLine([
                idx + 1,
                b.staticCheck?.P0 ?? 0,
                b.staticCheck?.C0 ?? 0,
                b.requiredDynamicLoad,
                b.equivalentLoad,
                b.calculatedLife,
                b.lifeStatus,
            ])
        );
        files['bearing.dat'] = lines.join('');
    }

    // README.txt - Instructions for AutoCAD import
    files['README.txt'] = `HelixMaster 97 - AutoCAD Data Export
======================================

Bu dosyalar AutoCAD'de gearbox.lsp AutoLISP scripti ile kullanılmak üzere oluşturulmuştur.

Kullanım:
1. Tüm .dat dosyalarını c:\\macdes\\data\\ klasörüne kopyalayın
2. AutoCAD'i açın
3. Command line'a: (load "gearbox.lsp") yazın
4. Command line'a: gearbox yazın
5. Çizim otomatik olarak oluşturulacaktır

Dosyalar:
- Disli1.dat: 1. kademe dişli verileri
- Disli2.dat: 2. kademe dişli verileri
- devir.dat: Devir hızları (N1, N2, N3)
- shaft.dat: Mil hesap özet verileri (çap)
- bearing.dat: Rulman özet verileri
- yerles.dat: Konum verileri

Tarih: ${new Date().toLocaleDateString('tr-TR')}
`;

    return files;
}

/**
 * Format values as comma-separated DAT line
 */
function formatDatLine(values: (number | string)[]): string {
    return values.map(v => typeof v === 'number' ? v.toFixed(2) : v).join(', ') + '\n';
}

/**
 * Download DAT files as a ZIP archive
 * Requires jszip and file-saver libraries
 */
export async function downloadDATFiles(data: AutoCADExportData): Promise<void> {
    try {
        // Dynamic import to avoid build issues if libraries not installed
        const JSZip = (await import('jszip')).default;
        const { saveAs } = await import('file-saver');

        const zip = new JSZip();
        const files = generateDATFiles(data);

        // Add data folder
        const dataFolder = zip.folder('data');
        if (!dataFolder) throw new Error('Failed to create data folder');

        // Add all .dat and .txt files
        Object.entries(files).forEach(([filename, content]) => {
            dataFolder.file(filename, content);
        });

        // Generate and download ZIP
        const blob = await zip.generateAsync({ type: 'blob' });
        saveAs(blob, `helixmaster_autocad_${Date.now()}.zip`);

        console.log('✅ AutoCAD .DAT files exported successfully');
    } catch (error) {
        console.error('❌ DAT export failed:', error);

        // Fallback: Download as individual text file if ZIP fails
        const files = generateDATFiles(data);
        const combined = Object.entries(files)
            .map(([name, content]) => `=== ${name} ===\n${content}\n`)
            .join('\n');

        const blob = new Blob([combined], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `helixmaster_data_${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
}