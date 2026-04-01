import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Need, Volunteer, User, ResourceInventory, TaskAssignment, Announcement, RiskZone, Scenario, NGO, PulseEvent } from './types';
import { calculateTriageScore } from './triage';

// Singleton BroadcastChannel for reactive situational awareness
const syncChannel = typeof window !== 'undefined' ? new BroadcastChannel('disaster_relief_channel') : null;

interface AppState {
  currentUser: User | null;
  users: User[];
  needs: Need[];
  volunteers: Volunteer[];
  ngos: NGO[];
  inventory: ResourceInventory[];
  tasks: TaskAssignment[];
  announcements: Announcement[];
  riskZones: RiskZone[];
  scenarios: Scenario[];
  events: PulseEvent[];
  activeIncident: Scenario | null;
  isMassPanicActive: boolean;
  
  // 🏛️ PERSISTENT ACTIONS
  setActiveIncident: (incident: Scenario | null) => void;
  setCurrentUser: (user: User | null) => void;
  setScenarios: (scenarios: Scenario[]) => void;
  addNeed: (need: Need) => Promise<void>;
  updateNeed: (id: string, updates: Partial<Need>) => Promise<void>;
  addAnnouncement: (announcement: Announcement) => void;
  updateVolunteerStatus: (id: string, status: Partial<Volunteer>) => void;
  assignTask: (task: TaskAssignment) => void;
  updateTask: (id: string, updates: Partial<TaskAssignment>) => void;
  addEvent: (event: PulseEvent) => void;
  setMassPanicActive: (active: boolean) => void;
  triggerPanic: (origin: Need) => Promise<void>;
  escalateDistress: (needId: string) => Promise<void>;
  
  // 🏛️ DATABASE SYNC
  rehydrateFromDB: () => Promise<void>;
  installMockData: (force?: boolean) => void;
  hardReset: () => void;
  resetSimulation: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      needs: [],
      volunteers: [],
      ngos: [],
      inventory: [],
      tasks: [],
      announcements: [],
      riskZones: [],
      scenarios: [],
      events: [],
      activeIncident: null,
      isMassPanicActive: false,

      rehydrateFromDB: async () => {
         try {
            const res = await fetch('/api/needs');
            if (res.ok) {
               const needs = await res.json();
               set({ needs });
            }
         } catch (e) {
            console.error("DB_REHYDRATION_FAILED:", e);
         }
      },

      setActiveIncident: (activeIncident) => set((state) => {
        syncChannel?.postMessage({ type: 'SET_ACTIVE_INCIDENT', payload: activeIncident });
        return { activeIncident };
      }),

      setCurrentUser: (user) => set({ currentUser: user }),
      setScenarios: (scenarios) => set({ scenarios }),
      
      addNeed: async (need) => {
        // AI Triage Check
        const triage = calculateTriageScore(need, get().needs);
        const scoredNeed = { ...need, triage_score: triage.score, urgency_label: triage.priority };
        
        // 1. Optimistic UI Update
        set((state) => ({ needs: [...state.needs, scoredNeed] }));
        
        // 2. Persistent Push to Prisma
        try {
           const res = await fetch('/api/needs', {
              method: 'POST',
              body: JSON.stringify(need)
           });
           if (!res.ok) throw new Error("DB_PUSH_FAILED");
           
           // Situational Awareness Relay
           const event: PulseEvent = {
              id: `pulse_${Date.now()}`,
              type: 'emergency',
              message: `NEW DISTRESS SIGNAL: ${need.need_type.toUpperCase()} - ${need.urgency_label.toUpperCase()} priority detected and PERSISTED.`,
              location: need.location,
              timestamp: new Date().toISOString(),
              severity: need.urgency_label === 'critical' ? 'critical' : 'warning'
           };
           syncChannel?.postMessage({ type: 'ADD_NEED', payload: need });
           syncChannel?.postMessage({ type: 'ADD_EVENT', payload: event });
           
           set(state => ({ events: [event, ...state.events].slice(0, 50) }));
        } catch (e) {
           console.error("DATABASE_SYNC_FAILED:", e);
        }
      },

      setMassPanicActive: (active) => set({ isMassPanicActive: active }),

      triggerPanic: async (origin) => {
        const { addNeed, setMassPanicActive, addAnnouncement } = get();
        
        // 🚨 SELECT A RANDOM CONFIGURED SCENARIO
        const scenarios = [
          { type: 'rescue', label: 'FLASH FLOOD EMERGENCY', desc: '⚠️ [RIVER_BREACH] Extreme water levels. Civilians trapped in ground floors. High current risk.' },
          { type: 'medical', label: 'CHEMICAL ACCIDENT', desc: '☣️ [GAS_LEAK] Suspected industrial release. Respiratory distress reported. Oxygen required.' },
          { type: 'rescue', label: 'STRUCTURAL FAILURE', desc: '🏗️ [BUILDING_COLLAPSE] Multiple survivors trapped under debris. Heavy machinery requested.' },
          { type: 'medical', label: 'MASS CASUALTY EVENT', desc: '🚨 [TRANSIT_COLLISION] Multiple injuries in high-density zone. Immediate triage needed.' },
        ];
        const activeScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        
        await addNeed(origin);
        setMassPanicActive(true);

        const clusterCount = 10;
        const names = ['Sunit B.', 'Meera K.', 'Vikram T.', 'Lakshya G.', 'Ananya S.', 'Rohan D.', 'Priya S.', 'Arjun V.', 'Kavita N.', 'Deepak C.'];
        
        // Sequential creation for DB stability
        for (let i = 0; i < clusterCount; i++) {
            const latOffset = (Math.random() - 0.5) * 0.05; 
            const lngOffset = (Math.random() - 0.5) * 0.05;
            
            const newNeed: Need = {
               id: `cluster_${Date.now()}_${i}`,
               reported_by: `vic_cluster_${i}`,
               need_type: activeScenario.type as any,
               urgency_level: 99,
               urgency_label: 'critical',
               people_affected: Math.floor(Math.random() * 5) + 3,
               description: `${activeScenario.desc} - Victim: ${names[i]}.`,
               location: { lat: origin.location.lat + latOffset, lng: origin.location.lng + lngOffset },
               status: 'pending',
               created_at: new Date().toISOString()
            };
            
            // AI Triage Check
            const triage = calculateTriageScore(newNeed, get().needs);
            const scoredNeed = { ...newNeed, triage_score: triage.score, urgency_label: triage.priority };
            
            // This triggers the POST /api/needs behind the scenes
            await addNeed(scoredNeed);
        }

        addAnnouncement({
            id: `ann_${Date.now()}`,
            created_by: 'NDRS_ALPHA_LINK',
            message: `⚠️ [DATABASE_CLUSTER_SYNC] MASS DISTRESS DETECTED. 10+ signals committed to ledger at ${origin.location.lat.toFixed(2)}.`,
            urgency: 'critical',
            target_audience: 'all',
            created_at: new Date().toISOString()
        });
      },

      escalateDistress: async (id) => {
        const { needs, updateNeed, addAnnouncement, addEvent } = get();
        const need = needs.find(n => n.id === id);
        if (!need || need.status === 'completed') return;

        await updateNeed(id, { 
          urgency_level: 100, 
          urgency_label: 'critical',
          description: `🚨 [AUTO_ESCALATION] PERSISTENT_LEAD_MISSION. UNRESPONSIVE_VICTIM. ${need.description}`
        });

        const event: PulseEvent = {
           id: `pulse_esc_${Date.now()}`,
           type: 'system',
           message: `[AUTO_DB_ESCALATION] Signal escalated and recorded as ALPHA PRIORITY.`,
           location: need.location,
           timestamp: new Date().toISOString(),
           severity: 'critical'
        };
        addEvent(event);
      },
      
      updateNeed: async (id, updates) => {
        // 1. Optimistic Update
        set((state) => ({
          needs: state.needs.map(n => n.id === id ? { ...n, ...updates } : n)
        }));

        // 2. Persistent Sync
        try {
           await fetch(`/api/needs/${id}`, {
              method: 'PATCH',
              body: JSON.stringify(updates)
           });
           syncChannel?.postMessage({ type: 'UPDATE_NEED', payload: { id, updates } });
        } catch (e) {
           console.error("DB_UPDATE_FAILED:", e);
        }
      },
      
      addAnnouncement: (announcement) => set((state) => {
        syncChannel?.postMessage({ type: 'ADD_ANNOUNCEMENT', payload: announcement });
        return { announcements: [announcement, ...state.announcements] };
      }),

      updateVolunteerStatus: (id, updates) => set((state) => {
        syncChannel?.postMessage({ type: 'UPDATE_VOLUNTEER', payload: { id, updates } });
        return { volunteers: state.volunteers.map(v => v.id === id ? { ...v, ...updates } : v) };
      }),

      assignTask: (task) => set((state) => {
        syncChannel?.postMessage({ type: 'ADD_TASK', payload: task });
        return { tasks: [...state.tasks, task] };
      }),

      updateTask: (id, updates) => set((state) => {
        syncChannel?.postMessage({ type: 'UPDATE_TASK', payload: { id, updates } });
        return { tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t) };
      }),

      addEvent: (event) => set((state) => {
        syncChannel?.postMessage({ type: 'ADD_EVENT', payload: event });
        return { events: [event, ...state.events].slice(0, 50) };
      }),
      
      installMockData: (force = false) => {
        set((state) => {
          const mockData = require('./mock-data');
          
          // Force update if explicitly requested OR if we detect old Jaipur coordinates (26.x)
          const needsUpdate = force || 
            (state.users.length > 0 && state.users[0].location.lat > 25);

          if (state.users.length > 0 && !needsUpdate) return {};

          console.log("INSTALLING_MOCK_DATA [INDORE_CLUSTER]");
          return {
            users: mockData.MOCK_USERS,
            volunteers: mockData.MOCK_VOLUNTEERS,
            ngos: mockData.MOCK_NGOS,
            inventory: mockData.MOCK_INVENTORY,
            needs: mockData.MOCK_NEEDS || [],
            tasks: [],
            announcements: [],
            riskZones: [],
            scenarios: mockData.MOCK_SCENARIOS,
            activeIncident: null
          };
        });
      },

      hardReset: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('ndrs-storage-v2');
        }
        const mockData = require('./mock-data');
        set({
          currentUser: null,
          users: mockData.MOCK_USERS,
          volunteers: mockData.MOCK_VOLUNTEERS,
          ngos: mockData.MOCK_NGOS,
          inventory: mockData.MOCK_INVENTORY,
          needs: mockData.MOCK_NEEDS || [],
          tasks: [],
          announcements: [],
          riskZones: [],
          scenarios: mockData.MOCK_SCENARIOS,
          events: [],
          activeIncident: null
        });
      },

      resetSimulation: () => {
        set({ 
          needs: [], 
          tasks: [], 
          announcements: [], 
          activeIncident: null, 
          events: [],
          isMassPanicActive: false 
        });
        syncChannel?.postMessage({ type: 'RESET_SYSTEM_STATE', payload: null });
      }
    }),
    {
      name: 'ndrs-storage-v2', 
    }
  )
);

// 🏛️ CROSS-TAB AND DB INITIALIZATION
if (typeof window !== 'undefined') {
  // Sync rehydration from storage (native)
  window.addEventListener('storage', (e) => {
     if (e.key === 'ndrs-storage-v2') {
        useAppStore.persist.rehydrate();
     }
  });

  syncChannel?.addEventListener('message', (event) => {
    const { type, payload } = event.data;
    const store = useAppStore.getState();
    
    switch (type) {
      case 'ADD_NEED':
        if (!store.needs.find(n => n.id === payload.id)) {
          useAppStore.setState({ needs: [...store.needs, payload] });
        }
        break;
      case 'UPDATE_NEED':
        useAppStore.setState({
          needs: store.needs.map(n => n.id === payload.id ? { ...n, ...payload.updates } : n)
        });
        break;
      case 'ADD_ANNOUNCEMENT':
        if (!store.announcements.find(a => a.id === payload.id)) {
          useAppStore.setState({ announcements: [payload, ...store.announcements] });
        }
        break;
      case 'UPDATE_VOLUNTEER':
        useAppStore.setState({
          volunteers: store.volunteers.map(v => v.id === payload.id ? { ...v, ...payload.updates } : v)
        });
        break;
      case 'ADD_TASK':
        if (!store.tasks.find(t => t.id === payload.id)) {
           useAppStore.setState({ tasks: [...store.tasks, payload] });
        }
        break;
      case 'UPDATE_TASK':
        useAppStore.setState({
          tasks: store.tasks.map(t => t.id === payload.id ? { ...t, ...payload.updates } : t)
        });
        break;
      case 'ADD_EVENT':
        if (!store.events.find(e => e.id === payload.id)) {
           useAppStore.setState({ events: [payload, ...store.events].slice(0, 50) });
        }
        break;
      case 'SET_ACTIVE_INCIDENT':
        useAppStore.setState({ activeIncident: payload });
        break;
    }
  });
}
