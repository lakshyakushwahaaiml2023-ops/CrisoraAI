import { RiskZone, Scenario } from "./types";

export interface PrognosticResult {
  score: number;
  breakdown: {
    weather: number;
    geospatial: number;
    intelligence: number;
  };
  latestIntel: string[];
}

/**
 * 🛰️ NDRS PROGNOSTIC SENTINEL
 * Analyzes multi-dimensional data to predict disaster risk.
 */
export const calculateRiskScore = (
  activeScenario: Scenario | null,
  riskZones: RiskZone[],
  newsKeywords: string[] = []
): PrognosticResult => {
  // 1. WEATHER ANALYSIS (40%)
  // Rainfall > 100mm is a high-risk trigger
  const rainfall = activeScenario?.weatherCondition.rainfall || 15; // Baseline 15mm
  const wind = activeScenario?.weatherCondition.windSpeed || 10;
  const weatherScore = Math.min(40, (rainfall / 200) * 30 + (wind / 100) * 10);

  // 2. GEOSPATIAL VULNERABILITY (30%)
  // 'Red' risk zones in the area significantly increase the score
  const redZones = riskZones.filter(z => z.risk_level === 'red').length;
  const geoScore = Math.min(30, redZones * 15);

  // 3. INTELLIGENCE / NEWS (30%)
  // Simulated news scanning for pre-disaster signals
  const intelSignals = [
    { key: 'breach', weight: 15, msg: "INTEL: Satellite telemetry suggests embankment structural breach upstream." },
    { key: 'level', weight: 10, msg: "NEWS: Narmada water levels currently 0.5m above danger mark." },
    { key: 'rain', weight: 5, msg: "WEATHER: IMD issues Orange Alert for Indore region." },
    { key: 'landslide', weight: 15, msg: "CITIZEN_REPORTS: Soil movement detected in Khargone-Indore belt." },
    { key: 'power', weight: 5, msg: "UTILITY: Periodic grid failures reported in low-lying sectors." }
  ];

  let intelScore = 0;
  const latestIntel: string[] = [];

  intelSignals.forEach(signal => {
    if (newsKeywords.includes(signal.key)) {
      intelScore += signal.weight;
      latestIntel.push(signal.msg);
    }
  });

  // Ensure at least some baseline "Nominal" intel if the score is low
  if (latestIntel.length === 0) {
    latestIntel.push("SENTINEL: Regional telemetry nominal. Monitoring baseline geospatial shifts.");
  }

  const totalScore = Math.round(weatherScore + geoScore + intelScore);

  return {
    score: Math.min(100, totalScore),
    breakdown: {
      weather: Math.round(weatherScore),
      geospatial: Math.round(geoScore),
      intelligence: Math.round(intelScore)
    },
    latestIntel: latestIntel.slice(0, 5)
  };
};

/**
 * 📡 SIMULATED NEWS FEED
 * Returns a list of keywords currently "trending" in the region.
 */
export const getSimulatedIntelligence = (isPanic: boolean): string[] => {
  if (isPanic) return ['breach', 'level', 'rain', 'landslide', 'power'];
  
  // Baseline / Pre-panic signals
  const pool = ['level', 'rain', 'grid', 'cloud'];
  return pool.slice(0, Math.floor(Math.random() * pool.length));
};
