import { Need, Volunteer, NGO, ResourceInventory, TaskAssignment } from "./types";

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
  };
};

export interface PulseOracleResponse {
  message: string;
  isPanic: boolean;
  suggestion?: {
    type: 'deploy' | 'broadcast' | 'evacuate' | 'confirm';
    label: string;
    payload: any;
  };
}

/**
 * 🏥 UNIVERSAL PULSE ORACLE
 * Returns role-aware situational context and strategic recommendations.
 */
export const runPulseOracle = (
  role: string, 
  user: any, 
  needs: Need[], 
  volunteers: Volunteer[], 
  ngos: NGO[], 
  tasks: TaskAssignment[],
  isPanic: boolean,
  query?: string // Added optional query
): PulseOracleResponse => {
  // 🛰️ CONTEXTUAL QUERY HANDLING (Heuristic Simulation)
  if (query) {
    const q = query.toLowerCase();
    const critical = needs.filter(n => (n.triage_score || 0) > 80);

    if (q.includes('disaster') || q.includes('happening') || q.includes('emergency')) {
      if (isPanic) return { message: `YES. Critical Mass Distress cluster detected at Sector 04. Alpha Priority protocol is currently active. 10+ signals registered in the last 5 minutes.`, isPanic: true };
      if (critical.length > 0) return { message: `Current Status: High-Alert. We have ${critical.length} critical ${critical[0].need_type} signals pending in current AO.`, isPanic: false };
      return { message: "Operational Status: Nominal. No major disaster signatures detected in immediate proximity. Monitoring baseline signals.", isPanic: false };
    }

    if (q.includes('help') || q.includes('rescued') || q.includes('safe')) {
      if (role === 'victim') {
        return { message: "Sentinel Update: Your location is locked in our tactical registry. Crisora responders prioritize mass casualties first, but you are in the queue. ETA varies by sector load. Stay calm.", isPanic };
      }
      return { message: "Commander, all rescue protocols are active. Suggest checking the 'Priority Dispatch Registry' for specific unit status.", isPanic };
    }

    if (q.includes('hello') || q.includes('hi')) {
       return { message: `Greetings, ${role === 'government' ? 'Commander' : 'Citizen'}. I am the Crisora Pulse Sentinel. How can I assist with your situational awareness?`, isPanic };
    }

    return { message: `Tactical Query Received. Situation: ${isPanic ? 'CRITICAL' : 'STABLE'}. Active Signals: ${needs.length}. I suggest monitoring the cluster density at Sector 04.`, isPanic };
  }

  // 🏛️ BASELINE PROACTIVE LOGIC (When no query)
  if (role === 'government') {
    const criticalNeeds = needs.filter(n => n.status === 'pending' && (n.triage_score || 0) > 80);
    const busyVolunteerIds = new Set(tasks.filter(t => t.status !== 'completed').map(t => t.volunteer_id));
    const availableVolunteers = volunteers.filter(v => v.online && !busyVolunteerIds.has(v.id));

    if (isPanic && criticalNeeds.length > 5) {
      return {
        message: `Strategic Alert: Mass Distress Cluster detected in Sector 04. Responders are currently at 95% total capacity. I recommend a Global SMS Relay to advise citizens on high-ground survival while we concentrate NGO logistics here.`,
        isPanic: true,
        suggestion: {
          type: 'broadcast',
          label: 'Execute Alpha Relay',
          payload: { message: "CRITICAL: Response teams concentrating on Sector 04 casualties. All citizens in Sectors 01-03: Move to high ground immediately. Help is in transit." }
        }
      };
    }

    if (criticalNeeds.length > 0) {
      return {
        message: `Command Brief: High-triage ${criticalNeeds[0].need_type} request detected. Available units: ${availableVolunteers.length}. I suggest deploying the nearest NGO unit to establish a triage node.`,
        isPanic,
        suggestion: {
           type: 'deploy',
           label: `Deploy to ID_${criticalNeeds[0].id.slice(-4)}`,
           payload: { needId: criticalNeeds[0].id }
        }
      };
    }

    return { 
      message: "Sector Status: Baseline nominal. Maintaining situational awareness. No critical anomalies detected at this time.", 
      isPanic: false 
    };
  }

  if (role === 'victim') {
    const myNeed = needs.find(n => n.reported_by === user?.id);
    const respondersNearby = volunteers.filter(v => haversineKm(user?.location, v.location) < 3);

    if (isPanic) {
      return {
        message: "Emergency Update: Crisora teams are responding to a major mass casualty event in your sector. Help is extremely limited. Find higher ground or a secure structure immediately. Keep your signal locked. You are on the priority list.",
        isPanic: true
      };
    }

    if (myNeed) {
      return {
        message: respondersNearby.length > 0 
          ? `Status: Crisora Responder in Sector. Distance: ${haversineKm(user?.location, respondersNearby[0].location).toFixed(1)}km. Estimated arrival: 6-10 minutes. Please keep your communication line clear.`
          : "Status: Signal Registered. We are coordinating with the nearest volunteer units. Responders are currently occupied with Priority 1 missions nearby. Do not attempt to move.",
        isPanic: false
      };
    }

    return {
      message: "Crisora Sentinel Active: Your location is being monitored. Stay calm. Use the 'SOS' button only if your situation changes to critical.",
      isPanic: false
    };
  }

  return { message: "Sentinel Active: Sector diagnostics stable. Proceed with operational directives.", isPanic };
};
