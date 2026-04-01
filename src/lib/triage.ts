import { Need } from "./types";

export interface TriageResult {
  score: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  reasons: string[];
  breakdown: {
    needType: number;
    vulnerability: number;
    timeDensity: number;
    geoCluster: number;
  };
}

const haversineKm = (l1?: { lat: number; lng: number }, l2?: { lat: number; lng: number }) => {
  if (!l1 || !l2 || typeof l1.lat !== 'number' || typeof l2.lat !== 'number') return 999999; // Safe fallback
  const R = 6371;
  const dLat = (l2.lat - l1.lat) * Math.PI / 180;
  const dLng = (l2.lng - l1.lng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(l1.lat * Math.PI / 180) * Math.cos(l2.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const calculateTriageScore = (need: Need, allNeeds: Need[]): TriageResult => {
  let score = 0;
  const reasons: string[] = [];
  
  // 1. NeedType (Max: 40)
  let ntScore = 10;
  if (need.need_type === 'medical') { ntScore = 40; reasons.push("CRITICAL_MEDICAL_EMERGENCY"); }
  else if (need.need_type === 'rescue') { ntScore = 35; reasons.push("SEARCH_&_RESCUE_PROTOCOL"); }
  else if (need.need_type === 'shelter') { ntScore = 30; reasons.push("SHELTER_REQUIREMENT"); }
  else if (need.need_type === 'food' || need.need_type === 'water') { ntScore = 20; reasons.push("BASIC_SUSTENANCE_NEED"); }
  score += ntScore;

  // 2. Vulnerable Population (Max: 30)
  let vScore = 0;
  const desc = (need.description || "").toLowerCase();
  const keywords = ['child', 'elderly', 'pregnant', 'infant', 'baby', 'senior', 'disabled', 'handicapped', 'heart', 'bleeding', 'unconscious'];
  const matched = keywords.filter(k => desc.includes(k));
  
  if (matched.length > 0) {
    vScore = 30;
    reasons.push(`VULNERABLE_POPULATION_TRIGGER: ${matched.slice(0, 2).join(', ').toUpperCase()}`);
  } else if (need.people_affected > 5) {
    vScore = 15;
    reasons.push("HIGH_DENSITY_VICTIM_CLUSTER");
  }
  score += vScore;

  // 3. Time Density (Max: 20)
  const minutesElapsed = (new Date().getTime() - new Date(need.created_at).getTime()) / (1000 * 60);
  const tScore = Math.min(20, Math.floor(minutesElapsed / 10)); // +1 point every 10 min
  if (tScore > 10) reasons.push("EXTENDED_WAIT_TIME");
  score += tScore;

  // 4. Geo Cluster (Max: 10)
  const nearby = allNeeds.filter(n => n.id !== need.id && n.status === 'pending' && haversineKm(need.location, n.location) < 1.0);
  const gScore = Math.min(10, nearby.length * 2); // +2 for each nearby pending need
  if (gScore > 5) reasons.push("ZONE_STRESS_CONTRIBUTOR");
  score += gScore;

  // Handle final priority
  let priority: TriageResult['priority'] = 'low';
  if (score >= 80) priority = 'critical';
  else if (score >= 60) priority = 'high';
  else if (score >= 40) priority = 'medium';

  return {
    score: Math.min(100, score),
    priority,
    reasons,
    breakdown: {
      needType: ntScore,
      vulnerability: vScore,
      timeDensity: tScore,
      geoCluster: gScore
    }
  };
};
