
import { Material, MaterialCategory, BearingData, Keyway } from './types';

// ==========================================
// DİŞLİ MALZEME KÜTÜPHANESİ
// ==========================================
export const GEAR_MATERIALS: Material[] = [
  // İmalat Çelikleri
  { name: "DIN 17 100, St 50", category: MaterialCategory.Gear, sigmaK: 540, sigmaAk: 290, sigmaD: 216, elasticModulus: 211000, shearModulus: 81000, hardness: 160, surfacePressure: 352 },
  { name: "DIN 17 100, St 60", category: MaterialCategory.Gear, sigmaK: 650, sigmaAk: 330, sigmaD: 260, elasticModulus: 211000, shearModulus: 81000, hardness: 195, surfacePressure: 429 },
  { name: "DIN 17 100, St 70", category: MaterialCategory.Gear, sigmaK: 770, sigmaAk: 360, sigmaD: 308, elasticModulus: 211000, shearModulus: 81000, hardness: 205, surfacePressure: 451 },

  // Dökme Demirler
  { name: "DIN 1693, GGG 70", category: MaterialCategory.Gear, sigmaK: 700, sigmaAk: 440, sigmaD: 210, elasticModulus: 172000, shearModulus: 67200, hardness: 300, surfacePressure: 600 },
  { name: "DIN 1681, GS 38", category: MaterialCategory.Gear, sigmaK: 380, sigmaAk: 200, sigmaD: 133, elasticModulus: 205000, shearModulus: 79000, hardness: 100, surfacePressure: 200 },
  { name: "DIN 1681, GS 45", category: MaterialCategory.Gear, sigmaK: 450, sigmaAk: 230, sigmaD: 158, elasticModulus: 205000, shearModulus: 79000, hardness: 125, surfacePressure: 250 },
  { name: "DIN 1681, GS 52", category: MaterialCategory.Gear, sigmaK: 520, sigmaAk: 260, sigmaD: 182, elasticModulus: 205000, shearModulus: 79000, hardness: 150, surfacePressure: 300 },
  { name: "DIN 1681, GS 60", category: MaterialCategory.Gear, sigmaK: 600, sigmaAk: 300, sigmaD: 210, elasticModulus: 205000, shearModulus: 79000, hardness: 175, surfacePressure: 350 },

  // Islah Çelikleri
  { name: "DIN 17 200, Ck 35", category: MaterialCategory.Gear, sigmaK: 565, sigmaAk: 275, sigmaD: 226, elasticModulus: 211000, shearModulus: 81000, hardness: 183, surfacePressure: 366 },
  { name: "DIN 17 200, Ck 45", category: MaterialCategory.Gear, sigmaK: 700, sigmaAk: 420, sigmaD: 350, elasticModulus: 211000, shearModulus: 81000, hardness: 205, surfacePressure: 410 },
  { name: "DIN 17 200, Ck 55", category: MaterialCategory.Gear, sigmaK: 740, sigmaAk: 500, sigmaD: 296, elasticModulus: 211000, shearModulus: 81000, hardness: 229, surfacePressure: 458 },
  { name: "DIN 17 200, Ck 60", category: MaterialCategory.Gear, sigmaK: 860, sigmaAk: 520, sigmaD: 344, elasticModulus: 211000, shearModulus: 81000, hardness: 241, surfacePressure: 482 },
  { name: "DIN 17 200, 28 Mn 6", category: MaterialCategory.Gear, sigmaK: 780, sigmaAk: 490, sigmaD: 312, elasticModulus: 211000, shearModulus: 81000, hardness: 223, surfacePressure: 446 },
  { name: "DIN 17 200, 38 Cr 2", category: MaterialCategory.Gear, sigmaK: 775, sigmaAk: 450, sigmaD: 310, elasticModulus: 211000, shearModulus: 81000, hardness: 207, surfacePressure: 414 },
  { name: "DIN 17 200, 46 Cr 2", category: MaterialCategory.Gear, sigmaK: 875, sigmaAk: 550, sigmaD: 350, elasticModulus: 211000, shearModulus: 81000, hardness: 223, surfacePressure: 446 },
  { name: "DIN 17 200, 34 Cr 4", category: MaterialCategory.Gear, sigmaK: 875, sigmaAk: 590, sigmaD: 350, elasticModulus: 211000, shearModulus: 81000, hardness: 223, surfacePressure: 446 },
  { name: "DIN 17 200, 37 Cr 4", category: MaterialCategory.Gear, sigmaK: 925, sigmaAk: 630, sigmaD: 370, elasticModulus: 211000, shearModulus: 81000, hardness: 235, surfacePressure: 470 },
  { name: "DIN 17 200, 41 Cr 4", category: MaterialCategory.Gear, sigmaK: 1000, sigmaAk: 660, sigmaD: 400, elasticModulus: 211000, shearModulus: 81000, hardness: 241, surfacePressure: 482 },
  { name: "DIN 17 200, 25 CrMo 4", category: MaterialCategory.Gear, sigmaK: 875, sigmaAk: 600, sigmaD: 350, elasticModulus: 211000, shearModulus: 81000, hardness: 212, surfacePressure: 424 },
  { name: "DIN 17 200, 34 CrMo 4", category: MaterialCategory.Gear, sigmaK: 1000, sigmaAk: 650, sigmaD: 400, elasticModulus: 211000, shearModulus: 81000, hardness: 223, surfacePressure: 446 },
  { name: "DIN 17 200, 42 CrMo 4", category: MaterialCategory.Gear, sigmaK: 1100, sigmaAk: 750, sigmaD: 550, elasticModulus: 211000, shearModulus: 81000, hardness: 241, surfacePressure: 482 },
  { name: "DIN 17 200, 50 CrMo 4", category: MaterialCategory.Gear, sigmaK: 1100, sigmaAk: 780, sigmaD: 550, elasticModulus: 211000, shearModulus: 81000, hardness: 248, surfacePressure: 496 },
  { name: "DIN 17 200, 50 CrV 4", category: MaterialCategory.Gear, sigmaK: 1100, sigmaAk: 800, sigmaD: 550, elasticModulus: 211000, shearModulus: 81000, hardness: 248, surfacePressure: 496 },

  // Sementasyon Çelikleri
  { name: "DIN 17 210, 17 Cr 3", category: MaterialCategory.Gear, sigmaK: 785, sigmaAk: 440, sigmaD: 314, elasticModulus: 211000, shearModulus: 81000, hardness: 174, surfacePressure: 348 },
  { name: "DIN 17 210, 20 Cr 4", category: MaterialCategory.Gear, sigmaK: 830, sigmaAk: 440, sigmaD: 332, elasticModulus: 211000, shearModulus: 81000, hardness: 197, surfacePressure: 394 },
  { name: "DIN 17 210, 16 MnCr 5", category: MaterialCategory.Gear, sigmaK: 880, sigmaAk: 440, sigmaD: 352, elasticModulus: 211000, shearModulus: 81000, hardness: 207, surfacePressure: 414 },
  { name: "DIN 17 210, 20 MnCr 5", category: MaterialCategory.Gear, sigmaK: 1130, sigmaAk: 540, sigmaD: 452, elasticModulus: 211000, shearModulus: 81000, hardness: 217, surfacePressure: 434 },
  { name: "DIN 17 210, 20 MoCr 4", category: MaterialCategory.Gear, sigmaK: 930, sigmaAk: 590, sigmaD: 372, elasticModulus: 211000, shearModulus: 81000, hardness: 207, surfacePressure: 414 },
  { name: "DIN 17 210, 15 CrNi 6", category: MaterialCategory.Gear, sigmaK: 1030, sigmaAk: 540, sigmaD: 412, elasticModulus: 211000, shearModulus: 81000, hardness: 217, surfacePressure: 434 },
  { name: "DIN 17 210, 18 CrNi 8", category: MaterialCategory.Gear, sigmaK: 1180, sigmaAk: 785, sigmaD: 472, elasticModulus: 211000, shearModulus: 81000, hardness: 248, surfacePressure: 496 },
  { name: "DIN 17 440, 17 CrNiMo 6", category: MaterialCategory.Gear, sigmaK: 1200, sigmaAk: 785, sigmaD: 480, elasticModulus: 211000, shearModulus: 81000, hardness: 248, surfacePressure: 496 },
];

// ==========================================
// GENEL MALZEME KÜTÜPHANESİ
// ==========================================
export const GENERAL_MATERIALS: Material[] = [
  // İmalat Çelikleri
  { name: "DIN 17 100, St 33", category: MaterialCategory.General, sigmaK: 320, sigmaAk: 180, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 100, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 17 100, St 37", category: MaterialCategory.General, sigmaK: 360, sigmaAk: 230, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 120, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 17 100, St 44", category: MaterialCategory.General, sigmaK: 410, sigmaAk: 275, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 140, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 17 100, St 50", category: MaterialCategory.General, sigmaK: 490, sigmaAk: 290, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 160, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 17 100, St 52", category: MaterialCategory.General, sigmaK: 510, sigmaAk: 350, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 200, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 17 100, St 60", category: MaterialCategory.General, sigmaK: 590, sigmaAk: 330, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 195, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 17 100, St 70", category: MaterialCategory.General, sigmaK: 690, sigmaAk: 360, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 205, surfacePressure: 0, poisson: 0.3 },

  // Dökme Demirler
  { name: "DIN 1691, GG 15", category: MaterialCategory.General, sigmaK: 150, sigmaAk: 150, sigmaD: 0, elasticModulus: 100000, shearModulus: 40000, hardness: 205, surfacePressure: 0, poisson: 0.26 },
  { name: "DIN 1691, GG 20", category: MaterialCategory.General, sigmaK: 200, sigmaAk: 200, sigmaD: 0, elasticModulus: 100000, shearModulus: 40000, hardness: 230, surfacePressure: 0, poisson: 0.26 },
  { name: "DIN 1691, GG 25", category: MaterialCategory.General, sigmaK: 250, sigmaAk: 250, sigmaD: 0, elasticModulus: 100000, shearModulus: 40000, hardness: 250, surfacePressure: 0, poisson: 0.26 },
  { name: "DIN 1691, GG 30", category: MaterialCategory.General, sigmaK: 300, sigmaAk: 300, sigmaD: 0, elasticModulus: 100000, shearModulus: 40000, hardness: 275, surfacePressure: 0, poisson: 0.26 },
  { name: "DIN 1691, GG 35", category: MaterialCategory.General, sigmaK: 315, sigmaAk: 315, sigmaD: 0, elasticModulus: 100000, shearModulus: 40000, hardness: 285, surfacePressure: 0, poisson: 0.26 },
  { name: "DIN 1691, GG 40", category: MaterialCategory.General, sigmaK: 400, sigmaAk: 400, sigmaD: 0, elasticModulus: 100000, shearModulus: 40000, hardness: 310, surfacePressure: 0, poisson: 0.26 },

  // Küresel Grafitli (GGG)
  { name: "DIN 1693, GGG 40", category: MaterialCategory.General, sigmaK: 400, sigmaAk: 250, sigmaD: 0, elasticModulus: 172000, shearModulus: 67200, hardness: 180, surfacePressure: 0, poisson: 0.28 },
  { name: "DIN 1693, GGG 50", category: MaterialCategory.General, sigmaK: 500, sigmaAk: 350, sigmaD: 0, elasticModulus: 172000, shearModulus: 67200, hardness: 240, surfacePressure: 0, poisson: 0.28 },
  { name: "DIN 1693, GGG 60", category: MaterialCategory.General, sigmaK: 600, sigmaAk: 420, sigmaD: 0, elasticModulus: 172000, shearModulus: 67200, hardness: 260, surfacePressure: 0, poisson: 0.28 },
  { name: "DIN 1693, GGG 70", category: MaterialCategory.General, sigmaK: 700, sigmaAk: 500, sigmaD: 0, elasticModulus: 172000, shearModulus: 67200, hardness: 300, surfacePressure: 0, poisson: 0.28 },

  // Çelik Döküm (GS)
  { name: "DIN 1681, GS 38", category: MaterialCategory.General, sigmaK: 380, sigmaAk: 190, sigmaD: 0, elasticModulus: 205000, shearModulus: 79000, hardness: 150, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 1681, GS 45", category: MaterialCategory.General, sigmaK: 450, sigmaAk: 230, sigmaD: 0, elasticModulus: 205000, shearModulus: 79000, hardness: 150, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 1681, GS 52", category: MaterialCategory.General, sigmaK: 520, sigmaAk: 260, sigmaD: 0, elasticModulus: 205000, shearModulus: 79000, hardness: 150, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 1681, GS 60", category: MaterialCategory.General, sigmaK: 600, sigmaAk: 300, sigmaD: 0, elasticModulus: 205000, shearModulus: 79000, hardness: 150, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 1681, GS 70", category: MaterialCategory.General, sigmaK: 700, sigmaAk: 350, sigmaD: 0, elasticModulus: 205000, shearModulus: 79000, hardness: 150, surfacePressure: 0, poisson: 0.3 },

  // Islah Çelikleri (Genel)
  { name: "DIN 17 200, Ck 25", category: MaterialCategory.General, sigmaK: 490, sigmaAk: 290, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 155, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 17 200, Ck 35", category: MaterialCategory.General, sigmaK: 540, sigmaAk: 320, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 183, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 17 200, Ck 45", category: MaterialCategory.General, sigmaK: 620, sigmaAk: 370, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 205, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 17 200, Ck 55", category: MaterialCategory.General, sigmaK: 660, sigmaAk: 420, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 229, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 17 200, Ck 60", category: MaterialCategory.General, sigmaK: 740, sigmaAk: 450, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 241, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 17 200, 28 Mn 6", category: MaterialCategory.General, sigmaK: 690, sigmaAk: 490, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 223, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 17 200, 38 Cr 2", category: MaterialCategory.General, sigmaK: 700, sigmaAk: 450, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 207, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 17 200, 46 Cr 2", category: MaterialCategory.General, sigmaK: 800, sigmaAk: 550, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 223, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 17 200, 34 Cr 4", category: MaterialCategory.General, sigmaK: 800, sigmaAk: 590, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 223, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 17 200, 37 Cr 4", category: MaterialCategory.General, sigmaK: 850, sigmaAk: 630, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 235, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 17 200, 41 Cr 4", category: MaterialCategory.General, sigmaK: 690, sigmaAk: 460, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 241, surfacePressure: 0, poisson: 0.3 },

  // Krom Molibden Alaşımları
  { name: "DIN 17 200, 25 CrMo 4", category: MaterialCategory.General, sigmaK: 690, sigmaAk: 460, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 212, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 17 200, 34 CrMo 4", category: MaterialCategory.General, sigmaK: 800, sigmaAk: 590, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 223, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 17 200, 42 CrMo 4", category: MaterialCategory.General, sigmaK: 880, sigmaAk: 630, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 241, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 17 200, 50 CrMo 4", category: MaterialCategory.General, sigmaK: 880, sigmaAk: 680, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 248, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 17 200, 50 CrV 4", category: MaterialCategory.General, sigmaK: 1000, sigmaAk: 800, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 248, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 17 200, 36 CrNiMo 4", category: MaterialCategory.General, sigmaK: 1000, sigmaAk: 800, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 248, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 17 200, 34 CrNiMo 4", category: MaterialCategory.General, sigmaK: 1100, sigmaAk: 900, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 248, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 17 200, 30 CrNiMo 8", category: MaterialCategory.General, sigmaK: 1250, sigmaAk: 920, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 248, surfacePressure: 0, poisson: 0.3 },

  // Sementasyon Çelikleri (Genel)
  { name: "DIN 17 210, Ck 10", category: MaterialCategory.General, sigmaK: 490, sigmaAk: 300, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 131, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 17 210, Ck 15", category: MaterialCategory.General, sigmaK: 590, sigmaAk: 360, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 143, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 17 210, 17 Cr 3", category: MaterialCategory.General, sigmaK: 690, sigmaAk: 440, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 174, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 17 210, 20 Cr 4", category: MaterialCategory.General, sigmaK: 730, sigmaAk: 440, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 197, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 17 210, 16 MnCr 5", category: MaterialCategory.General, sigmaK: 780, sigmaAk: 440, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 207, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 17 210, 20 MnCr 5", category: MaterialCategory.General, sigmaK: 980, sigmaAk: 540, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 217, surfacePressure: 0, poisson: 0.3 },
  { name: "DIN 17 210, 20 MoCr 4", category: MaterialCategory.General, sigmaK: 780, sigmaAk: 590, sigmaD: 0, elasticModulus: 211000, shearModulus: 81000, hardness: 207, surfacePressure: 0, poisson: 0.3 },
];

// ==========================================
// RULMAN VERİ TABANI
// ==========================================
export const BEARING_DATABASE: BearingData[] = [
  // Sabit Bilyalı Rulmanlar (Deep Groove Ball)
  { code: "6004", d: 20, D: 42, B: 12, C: 9400, C0: 5000, type: 'Ball', limitingSpeedGrease: 19000, limitingSpeedOil: 24000 },
  { code: "6204", d: 20, D: 47, B: 14, C: 12800, C0: 6600, type: 'Ball', limitingSpeedGrease: 17000, limitingSpeedOil: 22000 },
  { code: "6304", d: 20, D: 52, B: 15, C: 15900, C0: 7800, type: 'Ball', limitingSpeedGrease: 16000, limitingSpeedOil: 19000 },
  { code: "6005", d: 25, D: 47, B: 12, C: 10100, C0: 5850, type: 'Ball', limitingSpeedGrease: 16000, limitingSpeedOil: 20000 },
  { code: "6205", d: 25, D: 52, B: 15, C: 14000, C0: 7800, type: 'Ball', limitingSpeedGrease: 15000, limitingSpeedOil: 18000 },
  { code: "6305", d: 25, D: 62, B: 17, C: 22500, C0: 11600, type: 'Ball', limitingSpeedGrease: 13000, limitingSpeedOil: 16000 },
  { code: "6006", d: 30, D: 55, B: 13, C: 13200, C0: 8300, type: 'Ball', limitingSpeedGrease: 14000, limitingSpeedOil: 17000 },
  { code: "6206", d: 30, D: 62, B: 16, C: 19500, C0: 11200, type: 'Ball', limitingSpeedGrease: 12000, limitingSpeedOil: 15000 },
  { code: "6306", d: 30, D: 72, B: 19, C: 28100, C0: 16000, type: 'Ball', limitingSpeedGrease: 11000, limitingSpeedOil: 13000 },
  { code: "6007", d: 35, D: 62, B: 14, C: 16000, C0: 10300, type: 'Ball', limitingSpeedGrease: 12000, limitingSpeedOil: 15000 },
  { code: "6207", d: 35, D: 72, B: 17, C: 25500, C0: 15300, type: 'Ball', limitingSpeedGrease: 10000, limitingSpeedOil: 13000 },
  { code: "6008", d: 40, D: 68, B: 15, C: 16800, C0: 11500, type: 'Ball', limitingSpeedGrease: 11000, limitingSpeedOil: 13000 },
  { code: "6208", d: 40, D: 80, B: 18, C: 29100, C0: 17900, type: 'Ball', limitingSpeedGrease: 9000, limitingSpeedOil: 11000 },
  { code: "6308", d: 40, D: 90, B: 23, C: 41000, C0: 24000, type: 'Ball', limitingSpeedGrease: 8500, limitingSpeedOil: 10000 },
  { code: "6009", d: 45, D: 75, B: 16, C: 21000, C0: 15100, type: 'Ball', limitingSpeedGrease: 9500, limitingSpeedOil: 12000 },
  { code: "6209", d: 45, D: 85, B: 19, C: 31500, C0: 20500, type: 'Ball', limitingSpeedGrease: 8500, limitingSpeedOil: 10000 },
  { code: "6010", d: 50, D: 80, B: 16, C: 21800, C0: 16600, type: 'Ball', limitingSpeedGrease: 9000, limitingSpeedOil: 11000 },
  { code: "6210", d: 50, D: 90, B: 20, C: 35100, C0: 23200, type: 'Ball', limitingSpeedGrease: 7500, limitingSpeedOil: 9000 },
  { code: "6310", d: 50, D: 110, B: 27, C: 62000, C0: 38000, type: 'Ball', limitingSpeedGrease: 7000, limitingSpeedOil: 8500 },

  // Silindirik Makaralı Rulmanlar (Cylindrical Roller)
  { code: "NU 205", d: 25, D: 52, B: 15, C: 28600, C0: 27000, type: 'Roller', limitingSpeedGrease: 11000, limitingSpeedOil: 14000 },
  { code: "NU 206", d: 30, D: 62, B: 16, C: 38000, C0: 36500, type: 'Roller', limitingSpeedGrease: 9500, limitingSpeedOil: 12000 },
  { code: "NU 208", d: 40, D: 80, B: 18, C: 56000, C0: 50000, type: 'Roller', limitingSpeedGrease: 7500, limitingSpeedOil: 9000 },
  { code: "NU 210", d: 50, D: 90, B: 20, C: 72000, C0: 69000, type: 'Roller', limitingSpeedGrease: 6300, limitingSpeedOil: 7500 },
];

// Standard Modul Series
export const STANDARD_MODULES = [1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20];

// Shaft Standard Diameters (R10 Series preferred)
export const STANDARD_SHAFT_DIAMETERS = [
  15, 17, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 110, 120
];

// DIN 6885 Parallel Keyways based on Shaft Diameter
// dMin <= d <= dMax
export const STANDARD_KEYWAYS: Keyway[] = [
  { dMin: 12, dMax: 17, b: 5, h: 5, t1: 3.0, t2: 2.3 },
  { dMin: 17, dMax: 22, b: 6, h: 6, t1: 3.5, t2: 2.8 },
  { dMin: 22, dMax: 30, b: 8, h: 7, t1: 4.0, t2: 3.3 },
  { dMin: 30, dMax: 38, b: 10, h: 8, t1: 5.0, t2: 3.3 },
  { dMin: 38, dMax: 44, b: 12, h: 8, t1: 5.0, t2: 3.3 },
  { dMin: 44, dMax: 50, b: 14, h: 9, t1: 5.5, t2: 3.8 },
  { dMin: 50, dMax: 58, b: 16, h: 10, t1: 6.0, t2: 4.3 },
  { dMin: 58, dMax: 65, b: 18, h: 11, t1: 7.0, t2: 4.4 },
  { dMin: 65, dMax: 75, b: 20, h: 12, t1: 7.5, t2: 4.9 },
  { dMin: 75, dMax: 85, b: 22, h: 14, t1: 9.0, t2: 5.4 },
  { dMin: 85, dMax: 95, b: 25, h: 14, t1: 9.0, t2: 5.4 },
  { dMin: 95, dMax: 110, b: 28, h: 16, t1: 10.0, t2: 6.4 },
  { dMin: 110, dMax: 130, b: 32, h: 18, t1: 11.0, t2: 7.4 },
];

export const WORKING_FACTORS = [
  { label: 'Düzgün (Elektrik Motoru)', value: 1.0 },
  { label: 'Orta Darbeli (Çok Silindirli)', value: 1.25 },
  { label: 'Ağır Darbeli (Tek Silindirli)', value: 1.50 },
];

export const KF_BASE = 2.8;

// Sıfır dişliler için form faktörü (Form Factor Kf)
// z -> Kf
export const FORM_FACTOR_TABLE: { z: number; kf: number }[] = [
  { z: 12, kf: 3.70 }, { z: 14, kf: 3.33 }, { z: 15, kf: 3.23 }, { z: 16, kf: 3.15 },
  { z: 17, kf: 3.08 }, { z: 18, kf: 3.00 }, { z: 19, kf: 2.98 }, { z: 20, kf: 2.95 },
  { z: 21, kf: 2.90 }, { z: 22, kf: 2.86 }, { z: 23, kf: 2.82 }, { z: 24, kf: 2.78 },
  { z: 25, kf: 2.73 }, { z: 26, kf: 2.70 }, { z: 27, kf: 2.67 }, { z: 28, kf: 2.64 },
  { z: 29, kf: 2.62 }, { z: 30, kf: 2.60 }, { z: 35, kf: 2.51 }, { z: 40, kf: 2.45 },
  { z: 45, kf: 2.41 }, { z: 50, kf: 2.37 }, { z: 65, kf: 2.29 }, { z: 70, kf: 2.28 },
  { z: 80, kf: 2.25 }, { z: 90, kf: 2.23 }, { z: 100, kf: 2.21 }, { z: 1000, kf: 2.20 } // >100
];

// Eğim açısı faktörü (Helix Angle Factor Kb)
// beta -> Kb
export const HELIX_ANGLE_FACTOR_TABLE: { beta: number; kb: number }[] = [
  { beta: 0, kb: 1.0 }, { beta: 10, kb: 0.99 }, { beta: 12, kb: 0.985 },
  { beta: 14, kb: 0.98 }, { beta: 16, kb: 0.97 }, { beta: 18, kb: 0.964 },
  { beta: 20, kb: 0.954 }, { beta: 22, kb: 0.94 }, { beta: 24, kb: 0.933 },
  { beta: 26, kb: 0.922 }, { beta: 30, kb: 0.905 }, { beta: 32, kb: 0.894 },
  { beta: 35, kb: 0.855 }
];