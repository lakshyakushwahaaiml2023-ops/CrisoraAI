import { Need, Volunteer, NGO, ResourceInventory } from "./types";

export interface FieldDirective {
  message: string;
  recommendationId?: string;
  checklist: string[];
  etaLabel?: string;
}

export interface InventoryOracle {
  message: string;
  alerts: string[];
  recommendation?: {
    type: 'transfer' | 'deploy' | 'request';
    orgId: string;
    item: string;
  };
}

const haversineKm = (l1?: { lat: number; lng: number }, l2?: { lat: number; lng: number }) => {
  if (!l1 || !l2) return 9999;
  const R = 6371;
  const dLat = (l2.lat - l1.lat) * Math.PI / 180;
  const dLng = (l2.lng - l1.lng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(l1.lat * Math.PI / 180) * Math.cos(l2.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const runAegisFieldAgent = (volunteer: Volunteer, needs: Need[]): FieldDirective => {
  const pending = needs.filter(n => n.status === 'pending' && !n.assigned_to);
  if (pending.length === 0) return { message: "System Standby. No unassigned distress signals in sector.", checklist: ["Maintain readiness", "Monitor supply levels"] };

  // Sort by Distance and Skill Match
  const scored = pending.map(need => {
     let score = 0;
     const dist = haversineKm(volunteer.location, need.location);
     score += (10 - Math.min(10, dist)) * 10; // Max 100 for dist
     
     // Skill Match (NeedType vs Skills)
     if (volunteer.skills.map(s => s.toLowerCase()).includes(need.need_type.toLowerCase())) score += 50;
     if (need.triage_score && need.triage_score > 80) score += 40;
     
     return { need, score, dist };
  }).sort((a,b) => b.score - a.score);

  const top = scored[0].need;
  const d = scored[0].dist;
  
  const directive: FieldDirective = {
    message: `Unit ${volunteer.name.split(' ')[0]}, Tactical Priority: ${top.need_type.toUpperCase()} alert at Sector ${top.id.slice(-4)}. Proximity: ${d.toFixed(1)}km. Skill Match: HIGH.`,
    recommendationId: top.id,
    checklist: [],
    etaLabel: `${Math.ceil(d * 3)}m response time estimate.`
  };

  if (top.need_type === 'medical') directive.checklist = ["Confirm vitals", "Hemostatic application", "Radiology referral"];
  else if (top.need_type === 'rescue') directive.checklist = ["Secure perimeter", "Thermal scan", "Structure stabilization"];
  else directive.checklist = ["Verify identity", "Distribute kit", "Log completion"];

  return directive;
};

export const runLogosOracle = (ngo: NGO, allInventory: ResourceInventory[], needs: Need[]): InventoryOracle => {
  const myStock = allInventory.filter(i => i.ngo_id === ngo.id);
  const criticalNeeds = needs.filter(n => n.status === 'pending' && (n.triage_score || 0) > 70);
  
  const alerts: string[] = [];
  
  // 1. Stock Out Analysis
  const needTypes = Array.from(new Set(criticalNeeds.map(n => n.need_type)));
  needTypes.forEach(type => {
     const hasStock = myStock.some(s => s.resource_type.toLowerCase().includes(type.toLowerCase()) && s.available);
     if (!hasStock && criticalNeeds.some(n => n.need_type === type)) {
        alerts.push(`CRITICAL_MISMATCH: No local stock for ${type.toUpperCase()} in Sector.`);
     }
  });

  // 2. Transfer Suggestions
  const otherNGOStock = allInventory.filter(i => i.ngo_id !== ngo.id && i.available);
  let transferRecommendation: InventoryOracle['recommendation'];
  
  if (alerts.length > 0) {
     const match = otherNGOStock.find(s => alerts[0].includes(s.resource_type.toUpperCase()));
     if (match) {
        transferRecommendation = {
           type: 'request',
           orgId: match.ngo_id,
           item: match.item_name
        };
     }
  }

  return {
    message: alerts.length > 0 ? "Logistics Alert: Predictive shortage detected in immediate sector." : "Logistics Hub: Supply chain stable for current mission load.",
    alerts,
    recommendation: transferRecommendation
  };
};
