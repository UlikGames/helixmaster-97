

export enum MaterialCategory {
  Gear = 'Disli',
  General = 'Genel'
}

export interface Material {
  name: string; // Ad
  category: MaterialCategory; // Tip
  sigmaK: number; // Kopma Mukavemeti (N/mm2)
  sigmaAk: number; // Akma Mukavemeti (N/mm2)
  sigmaD: number; // Sürekli Mukavemet (N/mm2) - Sadece Dişli için
  elasticModulus: number; // E (N/mm2)
  shearModulus: number; // G (N/mm2)
  hardness: number; // HB Brinell
  surfacePressure: number; // PhD (N/mm2) - Sadece Dişli için
  poisson?: number; // Poisson Oranı - Sadece Genel için
}

export interface BearingData {
  code: string; // Kod (6004 etc)
  d: number; // Inner Diameter (mm)
  D: number; // Outer Diameter (mm)
  B: number; // Width (mm)
  C: number; // Dynamic Load Capacity (N)
  C0: number; // Static Load Capacity (N)
  type: 'Ball' | 'Roller';
  limitingSpeedGrease?: number; // rpm
  limitingSpeedOil?: number; // rpm
}

export interface Keyway {
  dMin: number;
  dMax: number;
  b: number; // Width
  h: number; // Height
  t1: number; // Shaft depth
  t2: number; // Hub depth
}

// Tekil Dişli Hesabı Girdisi (Internal use for stages)
export interface SingleStageInput {
  power: number; // kW
  inputSpeed: number; // rpm
  ratio: number; // i
  helixAngle: number; // beta
  pressureAngle: number; // alpha
  material: Material;
  safetyFactor: number;
  widthFactor: number;
  workingFactor: number;
}

// 2 Kademeli Redüktör Ana Girdisi
export interface ReducerInput {
  totalPower: number; // Motor Gücü (kW)
  inputSpeed: number; // Giriş Devri Ng (rpm)
  outputSpeed: number; // Çıkış Devri Nc (rpm)
  totalRatio: number; // Toplam Çevrim (i_top)

  // Ratio Distribution (Optional - auto-calculated if not provided)
  stage1Ratio?: number; // i12 (1. kademe çevrim oranı)
  stage2Ratio?: number; // i34 (2. kademe çevrim oranı)

  // Pinion Tooth Counts (Optional - defaults to 20)
  stage1PinionTeeth?: number; // z1 (1. kademe pinyon diş sayısı)
  stage2PinionTeeth?: number; // z3 (2. kademe pinyon diş sayısı)

  // Efficiency (Verim)
  efficiency?: number; // Default 0.95

  // 1. Kademe (Hızlı) Özellikleri
  stage1HelixAngle: number;
  stage1Material: Material;
  stage1WidthFactor: number; // psi_d

  // 2. Kademe (Yavaş) Özellikleri
  stage2HelixAngle: number;
  stage2Material: Material;
  stage2WidthFactor: number; // psi_d

  workingFactor: number; // Ko (Ortak)
  safetyFactor: number; // S (Ortak)
}

export interface GearForces {
  Ft: number; // Tangential Force (N)
  Fr: number; // Radial Force (N)
  Fa: number; // Axial Force (N)
  d: number; // Pitch Diameter (mm)
}

export interface SingleStageResult {
  stageName: string;
  power: number;
  speed: number;
  ratio: number;
  torque: number; // Mb (Nm)
  helixAngle?: number; // beta
  module: number; // mn (mm)
  centerDistance: number; // a (mm)
  z1: number; // Pinion teeth
  z2: number; // Gear teeth
  d1: number; // Pinion diameter
  d2: number; // Gear diameter
  b: number; // Face width
  forces: GearForces;
  factors: {
    Kf: number; // Form Factor
    Kv: number; // Dynamic Factor
    Kn: number; // Speed Factor (if applicable, usually Kv covers this)
    Ke: number; // Material Factor
    Kb: number; // Helix Angle Factor
    Kalpha: number; // Ratio Factor
  };
  safetyFactors: {
    strength: number; // Mukavemet Emniyet Katsayısı
    surfacePressure: number; // Yüzey Basıncı Emniyet Katsayısı
  };
}

export interface ReducerResult {
  stage1: SingleStageResult;
  stage2: SingleStageResult;
  totalRatioActual: number;
  outputTorque: number;

  // Ratio Analysis
  ratioAnalysis: {
    targetRatio: number;        // ITop = Ng / Nc (hedef)
    stage1Ratio: number;        // i12_actual (gerçek)
    stage2Ratio: number;        // i34_actual (gerçek)
    actualRatio: number;        // ITopGercek = i12 × i34
    errorPercentage: number;    // Hata % = |ITop - ITopGercek| / ITop × 100
  };

  // Speed Cascade
  speeds: {
    input: number;              // Ng (giriş)
    intermediate: number;       // N2 (ara)
    output: number;             // Nc (çıkış)
  };

  // Tooth Counts
  toothCounts: {
    stage1Pinion: number;       // z1
    stage1Gear: number;         // z2
    stage2Pinion: number;       // z3
    stage2Gear: number;         // z4
  };
}

export interface BearingInput {
  radialLoad: number; // Fr (N)
  axialLoad: number; // Fa (N)
  speed: number; // n (rpm)
  desiredLife: number; // Lh (hours)
  selectedBearing?: BearingData; // Optional selection from catalog
  mountingType: 'Single' | 'Paired'; // Tekil veya Tertibleme
}

export interface BearingResult {
  equivalentLoad: number; // P (N)
  requiredDynamicLoad: number; // C_req (N)
  lifeStatus: string;
  isAdequate: boolean; // Ömür yeterli mi
  calculatedLife: number; // If bearing selected
  selectedBearing?: BearingData; // Seçilen katalog rulmanı
  staticCheck?: {
    P0: number;
    C0: number;
    safetyFactor: number;
    isSafe: boolean;
  };
  speedCheck?: {
    greaseLimit?: number;
    oilLimit?: number;
    isSafeGrease: boolean;
    isSafeOil: boolean;
  };
}

export interface ShaftInput {
  power: number; // kW
  speed: number; // rpm
  material: Material;
  gearForces: GearForces;
  lengthL1: number; // Distance Bearing A to Gear
  lengthL2: number; // Distance Bearing B to Gear
  safetyFactor: number;
  keywayType: 'A' | 'B'; // A: Round ends, B: Square ends
}

export interface ShaftResult {
  torque: number; // Nm
  reactionA_H: number; // Horizontal Reaction A
  reactionA_V: number; // Vertical Reaction A
  reactionB_H: number; // Horizontal Reaction B
  reactionB_V: number; // Vertical Reaction B
  maxBendingMoment: number; // Mb_max (Nm)
  equivalentMoment: number; // Mv (Nm)
  minDiameter: number; // d_min (mm)
  standardDiameter: number; // d_std (mm)
  keyway: Keyway;
  shearStress: number; // Tau (N/mm2)
  bendingStress: number; // Sigma (N/mm2)
  equivalentStress: number; // Sigma_v (N/mm2)
  safetyCheck: boolean;
  extension?: {
    dc: number; // Extension Diameter
    lc: number; // Extension Length
  };
  keywayCheck?: {
    pressure: number; // Calculated Pressure
    pem: number; // Allowable Pressure
    safety: number; // Safety Factor
    length: number; // Effective Length
  };
}