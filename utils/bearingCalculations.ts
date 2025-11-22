// Bearing calculation types and functions

// ========================================
// BEARING TYPES & INTERFACES
// ========================================

export type BearingType =
    | 'deep_groove_ball'      // Sabit Bilyalı
    | 'self_aligning_ball'    // Oynak Bilyalı
    | 'angular_contact'       // Eğik Bilyalı Tek Sıra
    | 'tapered_roller'        // Konik Makaralı
    | 'cylindrical_roller';   // Silindirik Makaralı

export type MountingType = 'single' | 'back_to_back' | 'tandem';

export interface BearingInput {
    bearingType: BearingType;
    radialForce: number;      // Fr (N)
    axialForce: number;       // Fa (N)
    speed: number;            // N (rpm)
    operatingHours: number;   // Lh (hours) - required life
    diameter: number;         // d (mm) - shaft diameter
    mountingType?: MountingType;
}

export interface BearingCatalogEntry {
    designation: string;      // SKF designation (e.g., "6308")
    d: number;                // Bore diameter (mm)
    D: number;                // Outer diameter (mm)
    B: number;                // Width (mm)
    C: number;                // Dynamic load rating (N)
    C0: number;               // Static load rating (N)
    type: BearingType;
    manufacturer: string;     // SKF, FAG, etc.
}

export interface BearingResult {
    selectedBearing: BearingCatalogEntry;
    equivalentLoad: number;   // P (N)
    lifeHours: number;        // L10h (hours)
    lifeCycles: number;       // L10 (million revolutions)
    xFactor: number;          // Radial load factor
    yFactor: number;          // Axial load factor
    safetyFactor: number;     // Fs = L10h_actual / L10h_required
    isAdequate: boolean;      // true if L10h >= required
}

// ========================================
// LOAD FACTOR TABLES (from VB6 Rlm.Bas)
// ========================================

/**
 * Get X and Y load factors based on bearing type and Fa/Fr ratio
 * Reference: VB6 Rlm.Bas - sbdat, oybdat, egbiltsdat functions
 */
export function getLoadFactors(
    bearingType: BearingType,
    fa_fr_ratio: number,
    C0_Fr_ratio?: number
): { X: number; Y: number } {

    switch (bearingType) {
        case 'deep_groove_ball': // Sabit Bilyalı
            // From VB6: Sub sbdat
            if (fa_fr_ratio === 0 || !fa_fr_ratio) {
                return { X: 1, Y: 0 };
            }

            // e = 0.22 to 0.44 depending on C0/Fr (simplified)
            const e_sb = 0.3; // Typical value

            if (fa_fr_ratio <= e_sb) {
                return { X: 1, Y: 0 };
            } else {
                return { X: 0.56, Y: 1.8 }; // Typical for Fa/Fr > e
            }

        case 'self_aligning_ball': // Oynak Bilyalı
            // From VB6: Sub oybdat
            if (fa_fr_ratio === 0) {
                return { X: 1, Y: 0 };
            }

            const e_oy = 0.3;
            if (fa_fr_ratio <= e_oy) {
                return { X: 1, Y: 0 };
            } else {
                return { X: 0.65, Y: 2.5 };
            }

        case 'angular_contact': // Eğik Bilyalı
            // From VB6: Sub egbiltsdat
            // More complex, depends on contact angle (typically 15°, 25°, 40°)
            // For 25° (most common):
            if (fa_fr_ratio === 0) {
                return { X: 1, Y: 0 };
            }

            const e_ang = 0.68; // For 25° contact angle
            if (fa_fr_ratio <= e_ang) {
                return { X: 1, Y: 0 };
            } else {
                return { X: 0.41, Y: 0.87 };
            }

        case 'tapered_roller': // Konik Makaralı
            // Always has axial load component
            const e_taper = 1.5; // Typical for tapered
            if (fa_fr_ratio <= e_taper) {
                return { X: 1, Y: 0.4 };
            } else {
                return { X: 0.67, Y: 0.67 };
            }

        case 'cylindrical_roller': // Silindirik Makaralı
            // Cannot take axial loads
            return { X: 1, Y: 0 };

        default:
            return { X: 1, Y: 0 };
    }
}

// ========================================
// BEARING LIFE CALCULATION (L10)
// ========================================

/**
 * Calculate bearing life based on VB6 Rlm.Bas logic
 * 
 * Life in million revolutions: L10 = (C/P)^p
 * Life in hours: L10h = (C/P)^p * (10^6 / (60 * N))
 * 
 * Where:
 * - C: Dynamic load rating (N)
 * - P: Equivalent dynamic load (N)
 * - p: 3 for ball bearings, 10/3 for roller bearings
 * - N: Speed (rpm)
 * 
 * Reference: M. Akkurt Makina Elemanları, VB6 Sub yuksecimi
 */
export function calculateBearingLife(input: BearingInput): BearingResult {
    // 1. Get bearing from catalog
    const catalog = getBearingCatalog();
    const candidateBearings = catalog.filter(
        b => b.d >= input.diameter && b.type === input.bearingType
    );

    if (candidateBearings.length === 0) {
        throw new Error(`No ${input.bearingType} bearing found for d >= ${input.diameter} mm`);
    }

    // Start with smallest suitable bearing
    let selectedBearing = candidateBearings[0];
    let result: BearingResult | null = null;

    // Try each bearing until we find one with adequate life
    for (const bearing of candidateBearings) {
        // 2. Calculate load factors
        const fa_fr_ratio = input.axialForce / input.radialForce;
        const c0_fr_ratio = bearing.C0 / input.radialForce;
        const { X, Y } = getLoadFactors(input.bearingType, fa_fr_ratio, c0_fr_ratio);

        // 3. Calculate equivalent dynamic load
        const P = X * input.radialForce + Y * input.axialForce;

        // 4. Determine life exponent
        const p = (input.bearingType === 'deep_groove_ball' ||
            input.bearingType === 'self_aligning_ball' ||
            input.bearingType === 'angular_contact') ? 3 : 10 / 3;

        // 5. Calculate life
        const L10_millions = Math.pow(bearing.C / P, p);
        const L10h = L10_millions * (1e6 / (60 * input.speed));

        // 6. Calculate safety factor
        const safetyFactor = L10h / input.operatingHours;
        const isAdequate = L10h >= input.operatingHours;

        result = {
            selectedBearing: bearing,
            equivalentLoad: P,
            lifeHours: L10h,
            lifeCycles: L10_millions,
            xFactor: X,
            yFactor: Y,
            safetyFactor,
            isAdequate
        };

        // If this bearing is adequate, use it
        if (isAdequate) {
            selectedBearing = bearing;
            break;
        }
    }

    // Return result (either adequate bearing or largest available)
    return result || calculateLifeForBearing(candidateBearings[candidateBearings.length - 1], input);
}

/**
 * Helper function to calculate life for a specific bearing
 */
function calculateLifeForBearing(bearing: BearingCatalogEntry, input: BearingInput): BearingResult {
    const fa_fr_ratio = input.axialForce / input.radialForce;
    const { X, Y } = getLoadFactors(input.bearingType, fa_fr_ratio);
    const P = X * input.radialForce + Y * input.axialForce;
    const p = (input.bearingType === 'deep_groove_ball' ||
        input.bearingType === 'self_aligning_ball' ||
        input.bearingType === 'angular_contact') ? 3 : 10 / 3;
    const L10_millions = Math.pow(bearing.C / P, p);
    const L10h = L10_millions * (1e6 / (60 * input.speed));
    const safetyFactor = L10h / input.operatingHours;

    return {
        selectedBearing: bearing,
        equivalentLoad: P,
        lifeHours: L10h,
        lifeCycles: L10_millions,
        xFactor: X,
        yFactor: Y,
        safetyFactor,
        isAdequate: L10h >= input.operatingHours
    };
}

// ========================================
// BEARING CATALOG (SKF Data)
// ========================================

let bearingCatalogCache: BearingCatalogEntry[] | null = null;

/**
 * Get bearing catalog (cached)
 * Data from SKF General Catalogue
 */
export function getBearingCatalog(): BearingCatalogEntry[] {
    if (bearingCatalogCache) {
        return bearingCatalogCache;
    }

    bearingCatalogCache = [
        // DEEP GROOVE BALL BEARINGS (62 series)
        { designation: '6200', d: 10, D: 30, B: 9, C: 5070, C0: 2360, type: 'deep_groove_ball', manufacturer: 'SKF' },
        { designation: '6201', d: 12, D: 32, B: 10, C: 6890, C0: 3100, type: 'deep_groove_ball', manufacturer: 'SKF' },
        { designation: '6202', d: 15, D: 35, B: 11, C: 7800, C0: 3750, type: 'deep_groove_ball', manufacturer: 'SKF' },
        { designation: '6203', d: 17, D: 40, B: 12, C: 9560, C0: 4750, type: 'deep_groove_ball', manufacturer: 'SKF' },
        { designation: '6204', d: 20, D: 47, B: 14, C: 12800, C0: 6650, type: 'deep_groove_ball', manufacturer: 'SKF' },
        { designation: '6205', d: 25, D: 52, B: 15, C: 14000, C0: 7800, type: 'deep_groove_ball', manufacturer: 'SKF' },
        { designation: '6206', d: 30, D: 62, B: 16, C: 19500, C0: 11400, type: 'deep_groove_ball', manufacturer: 'SKF' },
        { designation: '6207', d: 35, D: 72, B: 17, C: 25500, C0: 15300, type: 'deep_groove_ball', manufacturer: 'SKF' },
        { designation: '6208', d: 40, D: 80, B: 18, C: 29600, C0: 18600, type: 'deep_groove_ball', manufacturer: 'SKF' },
        { designation: '6209', d: 45, D: 85, B: 19, C: 33200, C0: 21600, type: 'deep_groove_ball', manufacturer: 'SKF' },
        { designation: '6210', d: 50, D: 90, B: 20, C: 35100, C0: 23200, type: 'deep_groove_ball', manufacturer: 'SKF' },
        { designation: '6211', d: 55, D: 100, B: 21, C: 43600, C0: 29600, type: 'deep_groove_ball', manufacturer: 'SKF' },
        { designation: '6212', d: 60, D: 110, B: 22, C: 52700, C0: 36500, type: 'deep_groove_ball', manufacturer: 'SKF' },
        { designation: '6213', d: 65, D: 120, B: 23, C: 57200, C0: 40500, type: 'deep_groove_ball', manufacturer: 'SKF' },
        { designation: '6214', d: 70, D: 125, B: 24, C: 61800, C0: 44000, type: 'deep_groove_ball', manufacturer: 'SKF' },
        { designation: '6215', d: 75, D: 130, B: 25, C: 66300, C0: 48000, type: 'deep_groove_ball', manufacturer: 'SKF' },
        { designation: '6216', d: 80, D: 140, B: 26, C: 72800, C0: 53000, type: 'deep_groove_ball', manufacturer: 'SKF' },

        // ANGULAR CONTACT BALL BEARINGS (72 series, 25° contact angle)
        { designation: '7201', d: 12, D: 32, B: 10, C: 7020, C0: 3100, type: 'angular_contact', manufacturer: 'SKF' },
        { designation: '7202', d: 15, D: 35, B: 11, C: 8060, C0: 3900, type: 'angular_contact', manufacturer: 'SKF' },
        { designation: '7203', d: 17, D: 40, B: 12, C: 10400, C0: 5200, type: 'angular_contact', manufacturer: 'SKF' },
        { designation: '7204', d: 20, D: 47, B: 14, C: 14300, C0: 7350, type: 'angular_contact', manufacturer: 'SKF' },
        { designation: '7205', d: 25, D: 52, B: 15, C: 15900, C0: 8800, type: 'angular_contact', manufacturer: 'SKF' },
        { designation: '7206', d: 30, D: 62, B: 16, C: 22900, C0: 13000, type: 'angular_contact', manufacturer: 'SKF' },
        { designation: '7207', d: 35, D: 72, B: 17, C: 30700, C0: 18000, type: 'angular_contact', manufacturer: 'SKF' },
        { designation: '7208', d: 40, D: 80, B: 18, C: 35800, C0: 22400, type: 'angular_contact', manufacturer: 'SKF' },
        { designation: '7209', d: 45, D: 85, B: 19, C: 39700, C0: 25500, type: 'angular_contact', manufacturer: 'SKF' },
        { designation: '7210', d: 50, D: 90, B: 20, C: 42300, C0: 27500, type: 'angular_contact', manufacturer: 'SKF' },

        // TAPERED ROLLER BEARINGS (302 series)
        { designation: '30202', d: 15, D: 35, B: 11.75, C: 12700, C0: 10200, type: 'tapered_roller', manufacturer: 'SKF' },
        { designation: '30203', d: 17, D: 40, B: 13.25, C: 15600, C0: 13000, type: 'tapered_roller', manufacturer: 'SKF' },
        { designation: '30204', d: 20, D: 47, B: 15.25, C: 20800, C0: 18000, type: 'tapered_roller', manufacturer: 'SKF' },
        { designation: '30205', d: 25, D: 52, B: 16.25, C: 24500, C0: 22400, type: 'tapered_roller', manufacturer: 'SKF' },
        { designation: '30206', d: 30, D: 62, B: 17.25, C: 32500, C0: 31000, type: 'tapered_roller', manufacturer: 'SKF' },
        { designation: '30207', d: 35, D: 72, B: 18.25, C: 44000, C0: 43000, type: 'tapered_roller', manufacturer: 'SKF' },
        { designation: '30208', d: 40, D: 80, B: 19.75, C: 50700, C0: 51000, type: 'tapered_roller', manufacturer: 'SKF' },
        { designation: '30209', d: 45, D: 85, B: 20.75, C: 55900, C0: 58500, type: 'tapered_roller', manufacturer: 'SKF' },
        { designation: '30210', d: 50, D: 90, B: 21.75, C: 61200, C0: 66300, type: 'tapered_roller', manufacturer: 'SKF' },

        // SELF-ALIGNING BALL BEARINGS (12 series)
        { designation: '1200', d: 10, D: 30, B: 9, C: 3120, C0: 1250, type: 'self_aligning_ball', manufacturer: 'SKF' },
        { designation: '1201', d: 12, D: 32, B: 10, C: 4160, C0: 1730, type: 'self_aligning_ball', manufacturer: 'SKF' },
        { designation: '1202', d: 15, D: 35, B: 11, C: 4680, C0: 2040, type: 'self_aligning_ball', manufacturer: 'SKF' },
        { designation: '1203', d: 17, D: 40, B: 12, C: 5720, C0: 2600, type: 'self_aligning_ball', manufacturer: 'SKF' },
        { designation: '1204', d: 20, D: 47, B: 14, C: 7540, C0: 3650, type: 'self_aligning_ball', manufacturer: 'SKF' },
        { designation: '1205', d: 25, D: 52, B: 15, C: 8190, C0: 4250, type: 'self_aligning_ball', manufacturer: 'SKF' },
        { designation: '1206', d: 30, D: 62, B: 16, C: 11700, C0: 6300, type: 'self_aligning_ball', manufacturer: 'SKF' },
        { designation: '1207', d: 35, D: 72, B: 17, C: 15100, C0: 8500, type: 'self_aligning_ball', manufacturer: 'SKF' },
        { designation: '1208', d: 40, D: 80, B: 18, C: 17500, C0: 10200, type: 'self_aligning_ball', manufacturer: 'SKF' },
        { designation: '1209', d: 45, D: 85, B: 19, C: 19600, C0: 11800, type: 'self_aligning_ball', manufacturer: 'SKF' },
        { designation: '1210', d: 50, D: 90, B: 20, C: 20800, C0: 12700, type: 'self_aligning_ball', manufacturer: 'SKF' },

        // CYLINDRICAL ROLLER BEARINGS (NU2 series)
        { designation: 'NU204', d: 20, D: 47, B: 14, C: 22400, C0: 18000, type: 'cylindrical_roller', manufacturer: 'SKF' },
        { designation: 'NU205', d: 25, D: 52, B: 15, C: 25500, C0: 22400, type: 'cylindrical_roller', manufacturer: 'SKF' },
        { designation: 'NU206', d: 30, D: 62, B: 16, C: 35100, C0: 33000, type: 'cylindrical_roller', manufacturer: 'SKF' },
        { designation: 'NU207', d: 35, D: 72, B: 17, C: 45500, C0: 45000, type: 'cylindrical_roller', manufacturer: 'SKF' },
        { designation: 'NU208', d: 40, D: 80, B: 18, C: 52000, C0: 53000, type: 'cylindrical_roller', manufacturer: 'SKF' },
        { designation: 'NU209', d: 45, D: 85, B: 19, C: 57200, C0: 60000, type: 'cylindrical_roller', manufacturer: 'SKF' },
        { designation: 'NU210', d: 50, D: 90, B: 20, C: 61800, C0: 66300, type: 'cylindrical_roller', manufacturer: 'SKF' },
    ];

    return bearingCatalogCache;
}

/**
 * Find specific bearing by designation
 */
export function findBearing(designation: string): BearingCatalogEntry | undefined {
    return getBearingCatalog().find(b => b.designation === designation);
}

/**
 * Get bearings by shaft diameter
 */
export function getBearingsByDiameter(d: number, type?: BearingType): BearingCatalogEntry[] {
    const catalog = getBearingCatalog();
    return catalog.filter(b => b.d === d && (!type || b.type === type));
}
