

import { SingleStageInput, SingleStageResult, ReducerInput, ReducerResult, BearingInput, BearingResult, ShaftInput, ShaftResult, BearingData } from '../types';
import { STANDARD_MODULES, KF_BASE, STANDARD_SHAFT_DIAMETERS, STANDARD_KEYWAYS, FORM_FACTOR_TABLE, HELIX_ANGLE_FACTOR_TABLE } from '../constants';

// --- Helper Functions ---

/**
 * Interpolates Form Factor (Kf) from Table 2.4
 */
const getFormFactor = (z: number): number => {
  // If z > 100, use the last value (infinity)
  if (z >= 100) return 2.20;

  // Find range
  for (let i = 0; i < FORM_FACTOR_TABLE.length - 1; i++) {
    const lower = FORM_FACTOR_TABLE[i];
    const upper = FORM_FACTOR_TABLE[i + 1];
    if (z >= lower.z && z <= upper.z) {
      // Linear interpolation
      const percent = (z - lower.z) / (upper.z - lower.z);
      return lower.kf + percent * (upper.kf - lower.kf);
    }
  }
  return 3.70; // Default for small z
};

/**
 * Interpolates Helix Angle Factor (Kb) from Table 2.6
 */
const getHelixAngleFactor = (beta: number): number => {
  if (beta >= 35) return 0.855;

  for (let i = 0; i < HELIX_ANGLE_FACTOR_TABLE.length - 1; i++) {
    const lower = HELIX_ANGLE_FACTOR_TABLE[i];
    const upper = HELIX_ANGLE_FACTOR_TABLE[i + 1];
    if (beta >= lower.beta && beta <= upper.beta) {
      const percent = (beta - lower.beta) / (upper.beta - lower.beta);
      return lower.kb + percent * (upper.kb - lower.kb);
    }
  }
  return 1.0;
};

/**
 * Calculates Material Factor (Ke) (Formula 2.11)
 */
const getMaterialFactor = (E1: number, E2: number): number => {
  const E_eq = (2 * E1 * E2) / (E1 + E2);
  return 0.59 * Math.sqrt(E_eq);
};

// --- RDKTR.FRM: 2-Stage Ratio Distribution Logic ---

/**
 * Calculates optimal gear ratio distribution for 2-stage reducer
 * Based on VB6 RDKTR.FRM Sub chkCevrimOrani_Click (PDF page 90)
 * 
 * @param inputSpeed Ng - Input speed (rpm)
 * @param outputSpeed Nc - Output speed (rpm)
 * @param stage1PinionTeeth z1 - 1st stage pinion teeth (default 20)
 * @param stage2PinionTeeth z3 - 2nd stage pinion teeth (default 20)
 * @returns Ratio analysis with tooth counts and error percentage
 */
export function calculateRatioDistribution(
  inputSpeed: number,
  outputSpeed: number,
  stage1PinionTeeth: number = 20,
  stage2PinionTeeth: number = 20
): {
  targetRatio: number;
  stage1Ratio: number;
  stage2Ratio: number;
  actualRatio: number;
  errorPercentage: number;
  intermediateSpeed: number;
  toothCounts: { z1: number; z2: number; z3: number; z4: number };
} {
  // VB6: ITop = (Ng / Nc)
  const ITop = inputSpeed / outputSpeed;

  // VB6: i12 = (ITop * 0.5) - Equal distribution (50/50 split)
  const i12_theoretical = ITop * 0.5;

  // VB6: i34 = ITop / i12
  const i34_theoretical = ITop / i12_theoretical;

  // VB6: z2 = Int(z1 * i12) - Integer tooth count
  const z1 = stage1PinionTeeth;
  const z2 = Math.round(z1 * i12_theoretical);

  // VB6: z4 = Int(z3 * i34) - Integer tooth count
  const z3 = stage2PinionTeeth;
  const z4 = Math.round(z3 * i34_theoretical);

  // VB6: i12 = z2 / z1 - Actual ratio (real)
  const i12_actual = z2 / z1;

  // VB6: i34 = z4 / z3 - Actual ratio (real)
  const i34_actual = z4 / z3;

  // VB6: ITopGercek = i12 * i34
  const ITopActual = i12_actual * i34_actual;

  // VB6: Hata = Abs((ITop - ITopGercek) / ITop) * 100
  const errorPercentage = Math.abs((ITop - ITopActual) / ITop) * 100;

  // VB6: N2 = Ng / i12
  const N2 = inputSpeed / i12_actual;

  return {
    targetRatio: ITop,
    stage1Ratio: i12_actual,
    stage2Ratio: i34_actual,
    actualRatio: ITopActual,
    errorPercentage,
    intermediateSpeed: N2,
    toothCounts: { z1, z2, z3, z4 }
  };
}


/**
 * Calculates Ratio Factor (Ki) (Formula 2.13)
 */
const getRatioFactor = (ratio: number): number => {
  return (ratio + 1) / ratio;
};

// --- Main Calculation Functions ---

/**
 * Calculates a Single Stage Helical Gear
 */
export const calculateSingleStage = (input: SingleStageInput, stageName: string): SingleStageResult => {
  const { power, inputSpeed, ratio, helixAngle, pressureAngle, material, safetyFactor, widthFactor, workingFactor } = input;

  const torqueInput = (9550 * power) / inputSpeed; // Nm
  const torqueNmm = torqueInput * 1000; // Nmm

  // 1. Factors
  const z1 = 20; // Standard pinion teeth
  const z2 = Math.round(z1 * ratio);
  const actualRatio = z2 / z1;

  const betaRad = (helixAngle * Math.PI) / 180;
  const cosBeta = Math.cos(betaRad);

  // Equivalent teeth number for Form Factor
  const z_eq = z1 / (Math.pow(cosBeta, 3));
  const Kf = getFormFactor(z_eq);

  const Kb = getHelixAngleFactor(helixAngle);
  const Kv = 1.2; // Dynamic factor (Standard approx from thesis)
  const Ko = workingFactor;

  // Material Factor Ke (Assuming steel-steel if E not provided, but we have it in material)
  // For simplicity, assuming pinion and gear have same material E
  const Ke = getMaterialFactor(material.elasticModulus, material.elasticModulus);

  const Ki = getRatioFactor(actualRatio);
  const Kalpha = 1.76; // Rolling factor (Yuvarlanma faktörü) - fixed in thesis

  // 2. Module Calculation

  // A. Strength Based (Mukavemet) - Formula 2.12
  // Mn = [ (2 * Mt * Cos^2(beta) * Kf * Ko * Kv) / (z1^2 * psi_d * sigma_em) ]^(1/3)
  const sigmaEm = material.sigmaD / safetyFactor;
  const termStrength = (2 * torqueNmm * Math.pow(cosBeta, 2) * Kf * Ko * Kv) / (Math.pow(z1, 2) * widthFactor * sigmaEm);
  const Mnm = Math.pow(termStrength, 1 / 3);

  // B. Surface Pressure Based (Yüzey Basıncı) - Formula 2.14
  // Mny = (Cos(beta) / z1) * [ (2 * Mt * Ke^2 * Kalpha^2 * Kb^2 * Ki^2 * Ko * Kv) / (psi_d * Pem^2) ]^(1/3)
  const Pem = material.surfacePressure / safetyFactor; // Surface safety factor usually different, but using S for now
  const termSurface = (2 * torqueNmm * Math.pow(Ke, 2) * Math.pow(Kalpha, 2) * Math.pow(Kb, 2) * Math.pow(Ki, 2) * Ko * Kv) / (widthFactor * Math.pow(Pem, 2));
  const Mny = (cosBeta / z1) * Math.pow(termSurface, 1 / 3);

  // Select Maximum Module
  const moduleTheoretical = Math.max(Mnm, Mny);

  // Select Standard Module
  let selectedModule = STANDARD_MODULES[STANDARD_MODULES.length - 1];
  for (const m of STANDARD_MODULES) {
    if (m >= moduleTheoretical) {
      selectedModule = m;
      break;
    }
  }

  // 3. Geometric Dimensions
  const d1 = (selectedModule * z1) / cosBeta;
  const d2 = (selectedModule * z2) / cosBeta;
  const centerDistance = (d1 + d2) / 2;
  const b = widthFactor * d1;

  // 4. Forces
  const alphaRad = (pressureAngle * Math.PI) / 180;
  const tanAlpha = Math.tan(alphaRad);
  const tanBeta = Math.tan(betaRad);

  const Ft = (2000 * torqueInput) / d1;
  const Fr = (Ft * tanAlpha) / cosBeta;
  const Fa = Ft * tanBeta;

  // 5. Safety Factors Back-Calculation
  // Strength Safety
  // sigma = (2 * Mt * Cos^2(beta) * Kf * Ko * Kv) / (z1^2 * psi_d * Mn^3)
  // S_strength = S_required * (Mn / Mnm)^3
  const S_strength = safetyFactor * Math.pow(selectedModule / Mnm, 3);

  // Surface Safety
  const S_surface = safetyFactor * Math.pow(selectedModule / Mny, 3); 

  return {
    stageName,
    power,
    speed: inputSpeed,
    ratio: actualRatio,
    torque: parseFloat(torqueInput.toFixed(2)),
    helixAngle,
    module: selectedModule,
    centerDistance: parseFloat(centerDistance.toFixed(2)),
    z1,
    z2,
    d1: parseFloat(d1.toFixed(2)),
    d2: parseFloat(d2.toFixed(2)),
    b: parseFloat(b.toFixed(2)),
    forces: {
      Ft: parseFloat(Ft.toFixed(1)),
      Fr: parseFloat(Fr.toFixed(1)),
      Fa: parseFloat(Fa.toFixed(1)),
      d: parseFloat(d1.toFixed(2))
    },
    factors: {
      Kf: parseFloat(Kf.toFixed(2)),
      Kv,
      Kn: 1, // Not used separately
      Ke: parseFloat(Ke.toFixed(1)),
      Kb: parseFloat(Kb.toFixed(3)),
      Kalpha
    },
    safetyFactors: {
      strength: parseFloat(S_strength.toFixed(2)),
      surfacePressure: parseFloat(S_surface.toFixed(2))
    }
  };
};

/**
 * 2-Stage Helical Reducer Calculation
 * EK O: REDÜKTÖR HESAP FORMU (RDKTR.FRM)
 */
export const calculateReducer = (input: ReducerInput): ReducerResult => {
  // RDKTR.FRM: Calculate ratio distribution first
  const ratioAnalysis = calculateRatioDistribution(
    input.inputSpeed,
    input.outputSpeed,
    input.stage1PinionTeeth || 20,
    input.stage2PinionTeeth || 20
  );

  // Efficiency (verim) - default 95%
  const efficiency = input.efficiency || 0.95;

  // Stage 1 Calculation
  const stage1Input: SingleStageInput = {
    power: input.totalPower,
    inputSpeed: input.inputSpeed,
    ratio: ratioAnalysis.stage1Ratio,  // Use calculated i12
    helixAngle: input.stage1HelixAngle,
    pressureAngle: 20,
    material: input.stage1Material,
    safetyFactor: input.safetyFactor,
    widthFactor: input.stage1WidthFactor,
    workingFactor: input.workingFactor
  };
  const stage1Result = calculateSingleStage(stage1Input, "1. Kademe (Giriş)");

  // Override z1, z2 with calculated values
  stage1Result.z1 = ratioAnalysis.toothCounts.z1;
  stage1Result.z2 = ratioAnalysis.toothCounts.z2;

  // Stage 2 Calculation
  // VB6: frmMb.TxtP.Text = CSng(TxtP.Text) * verim
  const power2 = input.totalPower * efficiency;
  const speed2 = ratioAnalysis.intermediateSpeed; // Use N2!

  const stage2Input: SingleStageInput = {
    power: power2,
    inputSpeed: speed2,
    ratio: ratioAnalysis.stage2Ratio,  // Use calculated i34
    helixAngle: input.stage2HelixAngle,
    pressureAngle: 20,
    material: input.stage2Material,
    safetyFactor: input.safetyFactor,
    widthFactor: input.stage2WidthFactor,
    workingFactor: input.workingFactor
  };
  const stage2Result = calculateSingleStage(stage2Input, "2. Kademe (Çıkış)");

  // Override z3, z4 with calculated values
  stage2Result.z1 = ratioAnalysis.toothCounts.z3;
  stage2Result.z2 = ratioAnalysis.toothCounts.z4;

  // Output calculations
  const totalRatioActual = ratioAnalysis.actualRatio;
  const powerOut = power2 * efficiency;
  const speedOut = input.outputSpeed;
  const outputTorque = (9550 * powerOut) / speedOut;

  return {
    stage1: stage1Result,
    stage2: stage2Result,
    totalRatioActual: parseFloat(totalRatioActual.toFixed(2)),
    outputTorque: parseFloat(outputTorque.toFixed(1)),

    // NEW: RDKTR.FRM additions
    ratioAnalysis: {
      targetRatio: ratioAnalysis.targetRatio,
      stage1Ratio: ratioAnalysis.stage1Ratio,
      stage2Ratio: ratioAnalysis.stage2Ratio,
      actualRatio: ratioAnalysis.actualRatio,
      errorPercentage: ratioAnalysis.errorPercentage
    },

    speeds: {
      input: input.inputSpeed,
      intermediate: ratioAnalysis.intermediateSpeed,
      output: input.outputSpeed
    },

    toothCounts: {
      stage1Pinion: ratioAnalysis.toothCounts.z1,
      stage1Gear: ratioAnalysis.toothCounts.z2,
      stage2Pinion: ratioAnalysis.toothCounts.z3,
      stage2Gear: ratioAnalysis.toothCounts.z4
    }
  };
};


/**
 * Calculates Bearing Life (EK D: Partas.Frm & RLM.BAS)
 */
export const calculateBearing = (input: BearingInput): BearingResult => {
  const { radialLoad, axialLoad, speed, desiredLife, selectedBearing, mountingType } = input;

  if (!selectedBearing) {
    throw new Error("Rulman hesaplaması yapabilmek için listeden bir rulman seçilmelidir.");
  }

  let X = 0.56;
  let Y = 1.5; // Default fallback

  // Paired mounting shares axial yük; basit yaklaşım: Fa/2
  const axialEffective = mountingType === 'Paired' ? axialLoad / 2 : axialLoad;

  // Logic from RLM.BAS
  // selectedBearing is now guaranteed to exist
  const type = selectedBearing.type;
  const C0 = selectedBearing.C0;
  const Fa = axialEffective;
  const Fr = radialLoad;
  const ratio = Fa / C0;
  const ratioLoad = Fa / Fr;

  if (type === 'Ball') { // Sabit Bilyalı
    // Interpolate 'e' based on Fa/C0
    let e = 0.22;
    if (ratio > 0.025) e = 0.24;
    if (ratio > 0.04) e = 0.27;
    if (ratio > 0.07) e = 0.31;
    if (ratio > 0.13) e = 0.37;
    if (ratio > 0.25) e = 0.44;
    if (ratio > 0.5) e = 0.56;

    if (ratioLoad <= e) {
      X = 1; Y = 0;
    } else {
      X = 0.56;
      // Interpolate Y based on e
      if (e === 0.22) Y = 2.0;
      else if (e === 0.24) Y = 1.8; // Approx
      else if (e === 0.27) Y = 1.6; // Approx
      else if (e === 0.31) Y = 1.4; // Approx
      else if (e === 0.37) Y = 1.2; // Approx
      else if (e === 0.44) Y = 1.0; // Approx
      else Y = 1.0;
    }
  } else if (type === 'Roller') { // Silindirik Makaralı
    if (Fa === 0) {
      X = 1; Y = 0;
    } else {
      X = 0.92; Y = 0.6; // Typical values for cylindrical with axial load capability
    }
  }
  // Add more types here (Tapered, Angular) as needed

  const P = (X * radialLoad) + (Y * axialEffective);

  const bearingType = selectedBearing.type;
  const p = bearingType === 'Ball' ? 3 : 10 / 3;

  const lifeFactor = (desiredLife * speed) / 1000000;
  const requiredC = P * Math.pow(lifeFactor, 1 / p);

  let calculatedLife;
  // Equivalent Dynamic Load (P)
  const equivalentLoad = X * radialLoad + Y * axialEffective;

  // Static Load Check (C0 vs C0h) - Based on RLM.BAS "statik yük hesabı"
  const P0_calc = 0.6 * radialLoad + 0.5 * axialEffective;
  const P0 = Math.max(P0_calc, radialLoad);
  const staticSafetyFactor = selectedBearing.C0 / P0;
  const staticCheck = staticSafetyFactor >= 1.5;

  // Life Calculation (L10h)
  const exponent = selectedBearing.type === 'Ball' ? 3 : 10 / 3;
  const L10 = Math.pow(selectedBearing.C / equivalentLoad, exponent); // million revs
  const L10h = (1000000 / (60 * speed)) * L10;
  const isAdequate = L10h >= desiredLife;

  // Speed Check
  const speedCheckGrease = selectedBearing.limitingSpeedGrease ? speed <= selectedBearing.limitingSpeedGrease : true;
  const speedCheckOil = selectedBearing.limitingSpeedOil ? speed <= selectedBearing.limitingSpeedOil : true;

  return {
    equivalentLoad: parseFloat(equivalentLoad.toFixed(1)),
    requiredDynamicLoad: parseFloat((equivalentLoad * Math.pow((60 * speed * desiredLife) / 1000000, 1 / exponent)).toFixed(1)),
    lifeStatus: isAdequate ? "SEÇİLEN RULMAN UYGUN" : "RULMAN ÖMRÜ YETERSİZ",
    isAdequate,
    calculatedLife: Math.floor(L10h),
    selectedBearing: selectedBearing,
    staticCheck: {
      P0: parseFloat(P0.toFixed(1)),
      C0: selectedBearing.C0,
      safetyFactor: parseFloat(staticSafetyFactor.toFixed(2)),
      isSafe: staticCheck
    },
    speedCheck: {
      greaseLimit: selectedBearing.limitingSpeedGrease,
      oilLimit: selectedBearing.limitingSpeedOil,
      isSafeGrease: speedCheckGrease,
      isSafeOil: speedCheckOil
    }
  };
};

/**
 * Determines Standard Shaft Extension Length (lc) and Diameter (dc)
 * Based on EK F: CIZ.BAS "Sub Cikis_mili"
 */
const getStandardShaftExtension = (d: number): { dc: number, lc: number } => {
  let dc = d;
  let lc = 0;

  // Logic from CIZ.BAS (Page 58)
  if (d <= 12) { dc = 12; lc = 30; }
  else if (d <= 14) { dc = 14; lc = 30; }
  else if (d <= 16) { dc = 16; lc = 40; }
  else if (d <= 19) { dc = 19; lc = 40; }
  else if (d <= 20) { dc = 20; lc = 50; }
  else if (d <= 22) { dc = 22; lc = 50; }
  else if (d <= 24) { dc = 24; lc = 60; }
  else if (d <= 25) { dc = 25; lc = 60; }
  else if (d <= 28) { dc = 28; lc = 60; }
  else if (d <= 30) { dc = 30; lc = 80; }
  else if (d <= 32) { dc = 32; lc = 80; }
  else if (d <= 35) { dc = 35; lc = 80; }
  else if (d <= 38) { dc = 38; lc = 80; }
  else if (d <= 40) { dc = 40; lc = 110; }
  else if (d <= 42) { dc = 42; lc = 110; }
  else if (d <= 45) { dc = 45; lc = 110; }
  else if (d <= 48) { dc = 48; lc = 110; }
  else if (d <= 50) { dc = 50; lc = 110; }
  else if (d <= 55) { dc = 55; lc = 110; }
  else if (d <= 60) { dc = 60; lc = 140; }
  else if (d <= 65) { dc = 65; lc = 140; }
  else if (d <= 70) { dc = 70; lc = 140; }
  else if (d <= 75) { dc = 75; lc = 140; }
  else if (d <= 80) { dc = 80; lc = 170; }
  else if (d <= 85) { dc = 85; lc = 170; }
  else if (d <= 90) { dc = 90; lc = 170; }
  else if (d <= 95) { dc = 95; lc = 170; }
  else if (d <= 100) { dc = 100; lc = 210; }
  else if (d <= 110) { dc = 110; lc = 210; }
  else if (d <= 120) { dc = 120; lc = 210; }
  else if (d <= 140) { dc = 140; lc = 250; }
  else if (d <= 160) { dc = 160; lc = 300; }
  else if (d <= 180) { dc = 180; lc = 300; }
  else { dc = d; lc = 350; }

  return { dc, lc };
};

/**
 * Calculates Shaft Strength (EK J: Mil.Bas & EK M: Kama.Frm)
 */
export const calculateShaft = (input: ShaftInput): ShaftResult => {
  const { power, speed, gearForces, lengthL1, lengthL2, material, safetyFactor } = input;
  const { Ft, Fr, Fa, d } = gearForces;

  const torque = (9550 * power) / speed;
  const torqueNmm = torque * 1000;

  const L = lengthL1 + lengthL2;

  // Reaction Forces
  const Ma = Fa * (d / 2);
  const reactionB_V = (Fr * lengthL1 + Ma) / L;
  const reactionA_V = Fr - reactionB_V;
  const reactionB_H = (Ft * lengthL1) / L;
  const reactionA_H = Ft - reactionB_H;

  // Moments
  const M_vert = reactionA_V * lengthL1;
  const M_horiz = reactionA_H * lengthL1;
  const Mb_max = Math.sqrt(Math.pow(M_vert, 2) + Math.pow(M_horiz, 2));
  const Mv = Math.sqrt(Math.pow(Mb_max, 2) + 0.75 * Math.pow(torqueNmm, 2));

  // Diameter Calculation
  const sigmaEm = material.sigmaAk / safetyFactor;
  const dMinRaw = Math.pow((32 * Mv) / (Math.PI * sigmaEm), 1 / 3);

  // Standard Diameter (Bearing Seat)
  let dStd = STANDARD_SHAFT_DIAMETERS[STANDARD_SHAFT_DIAMETERS.length - 1];
  for (const ds of STANDARD_SHAFT_DIAMETERS) {
    if (ds >= dMinRaw) {
      dStd = ds;
      break;
    }
  }

  // Output Shaft Extension (Çıkış Mili Ucu)
  const extension = getStandardShaftExtension(dStd);

  // Keyway (EK M)
  const keyway = STANDARD_KEYWAYS.find(k => dStd > k.dMin && dStd <= k.dMax) || STANDARD_KEYWAYS[STANDARD_KEYWAYS.length - 1];

  // Keyway Pressure Check
  // P = 2000 * T / (d * h * L) <= Pem
  // Pem = sigma_Ak / S (Approx from screenshot)
  const Pem = material.sigmaAk / safetyFactor; // Using same safety factor
  // Assume effective key length L_eff = Hub length ~ 1.2 * d
  const L_hub = 1.2 * dStd;
  
  let keyPressureCalc = 0;
  let keySafety = 0;
  let Leff = L_hub;

  if (keyway) {
    // Adjust for Keyway Type
    if (input.keywayType === 'A') {
      Leff = L_hub - keyway.b;
    } else {
      Leff = L_hub;
    }

    const F_tangential = (2000 * torque) / dStd;
    const contactArea = Leff * keyway.t2;

    keyPressureCalc = F_tangential / contactArea;
    keySafety = Pem / keyPressureCalc;
  }

  // Stress Check
  const W = (Math.PI * Math.pow(dStd, 3)) / 32;
  const bendingStress = Mb_max / W;
  const equivalentStress = Mv / W; // NEW: Calculate Equivalent Stress on chosen diameter
  const Wp = (Math.PI * Math.pow(dStd, 3)) / 16;
  const shearStress = torqueNmm / Wp;

  return {
    torque: parseFloat(torque.toFixed(1)),
    reactionA_H: parseFloat(reactionA_H.toFixed(1)),
    reactionA_V: parseFloat(reactionA_V.toFixed(1)),
    reactionB_H: parseFloat(reactionB_H.toFixed(1)),
    reactionB_V: parseFloat(reactionB_V.toFixed(1)),
    maxBendingMoment: parseFloat((Mb_max / 1000).toFixed(1)),
    equivalentMoment: parseFloat((Mv / 1000).toFixed(1)),
    minDiameter: parseFloat(dMinRaw.toFixed(2)),
    standardDiameter: dStd,
    keyway: keyway || { b: 0, h: 0, t1: 0, t2: 0, dMin: 0, dMax: 0 },
    bendingStress: parseFloat(bendingStress.toFixed(1)),
    equivalentStress: parseFloat(equivalentStress.toFixed(1)), // NEW
    shearStress: parseFloat(shearStress.toFixed(1)),
    safetyCheck: bendingStress < sigmaEm,
    extension: extension,
    keywayCheck: {
      pressure: parseFloat(keyPressureCalc.toFixed(1)),
      pem: parseFloat(Pem.toFixed(1)),
      safety: parseFloat(keySafety.toFixed(2)),
      length: parseFloat(Leff.toFixed(1))
    }
  };
};
