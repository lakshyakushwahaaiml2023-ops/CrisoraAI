"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { useAppStore } from '@/lib/store';
import { useState, useEffect, useRef } from 'react';
import { 
  Play, Square, Timer, Activity, Users, CloudRainWind,
  Wind, Thermometer, AlertTriangle, Zap, Flame, Droplets,
  ShieldAlert, Radio, CheckCircle2, Clock, SkipForward,
  ChevronRight, Info, ChevronLeft, BrainCircuit, ShieldCheck, ShieldX, 
  Target, TrendingDown, TrendingUp, Skull, Globe, Database
} from 'lucide-react';
import { MOCK_SCENARIOS } from '@/lib/mock-data';
import { Scenario, AITacticalNode } from '@/lib/types';
import clsx from 'clsx';
import { LiveMap } from '@/components/Map';

// ─────────────────────────────────────────────────────────────────────────────
// HISTORICAL FACTS for each scenario
// ─────────────────────────────────────────────────────────────────────────────
const HISTORICAL_FACTS: Record<string, { year: number; deaths: string; displaced: string; damage: string; landmark: string; color: string }> = {
  bhopal_gas_tragedy_1984:    { year: 1984, deaths: '16,000+', displaced: '5L+',    damage: '₹15,000 Cr', landmark: 'Union Carbide Plant', color: 'red' },
  latur_earthquake_1993:      { year: 1993, deaths: '9,748',   displaced: '1.5L+',  damage: '₹1,100 Cr',  landmark: 'Killari, Maharashtra', color: 'orange' },
  odisha_super_cyclone_1999:  { year: 1999, deaths: '9,887',   displaced: '15M+',   damage: '₹20,000 Cr', landmark: 'Paradip, Odisha',    color: 'purple' },
  bhuj_earthquake_2001:       { year: 2001, deaths: '20,023',  displaced: '6L+',    damage: '₹21,000 Cr', landmark: 'Bhuj, Gujarat',      color: 'orange' },
  indian_ocean_tsunami_2004:  { year: 2004, deaths: '16,279',  displaced: '6L+',    damage: '₹11,500 Cr', landmark: 'Tamil Nadu Coast',   color: 'blue' },
  kedarnath_floods_2013:      { year: 2013, deaths: '5,700+',  displaced: '1L+',    damage: '₹4,200 Cr',  landmark: 'Kedarnath, Uttarakhand', color: 'cyan' },
  uttarakhand_wildfires_2016: { year: 2016, deaths: '9',       displaced: '5,000+', damage: '₹500 Cr+',   landmark: 'Pauri Garhwal',      color: 'red' },
  kerala_floods_2018:         { year: 2018, deaths: '483',     displaced: '1.4M',   damage: '₹31,000 Cr', landmark: 'Idukki / Ernakulam',  color: 'blue' },
  cyclone_fani_2019:          { year: 2019, deaths: '89',      displaced: '1.5M',   damage: '₹24,201 Cr', landmark: 'Puri, Odisha',       color: 'purple' },
  cyclone_amphan_2020:        { year: 2020, deaths: '128',     displaced: '4.9M',   damage: '₹1.03 L Cr', landmark: 'Sundarbans/Kolkata', color: 'teal' },
};

const DISASTER_ICON: Record<string, React.ReactNode> = {
  flood:      <Droplets size={14} />,
  cyclone:    <Wind size={14} />,
  flash_flood:<Droplets size={14} />,
  earthquake: <Activity size={14} />,
  industrial: <AlertTriangle size={14} />,
};

const colorClass: Record<string,{badge:string; glow:string; border:string; text:string; bg:string}> = {
  red:    { badge:'bg-red-500/20 text-red-400',    glow:'shadow-[0_0_30px_rgba(239,68,68,0.2)]',   border:'border-red-500/40',   text:'text-red-400',    bg:'bg-red-500/10' },
  blue:   { badge:'bg-blue-500/20 text-blue-400',  glow:'shadow-[0_0_30px_rgba(59,130,246,0.2)]',  border:'border-blue-500/40',  text:'text-blue-400',   bg:'bg-blue-500/10' },
  purple: { badge:'bg-purple-500/20 text-purple-400', glow:'shadow-[0_0_30px_rgba(168,85,247,0.2)]', border:'border-purple-500/40', text:'text-purple-400', bg:'bg-purple-500/10' },
  cyan:   { badge:'bg-cyan-500/20 text-cyan-400',  glow:'shadow-[0_0_30px_rgba(6,182,212,0.2)]',   border:'border-cyan-500/40',  text:'text-cyan-400',   bg:'bg-cyan-500/10' },
  orange: { badge:'bg-orange-500/20 text-orange-400', glow:'shadow-[0_0_30px_rgba(249,115,22,0.2)]', border:'border-orange-500/40', text:'text-orange-400', bg:'bg-orange-500/10' },
  teal:   { badge:'bg-teal-500/20 text-teal-400',  glow:'shadow-[0_0_30px_rgba(20,184,166,0.2)]',  border:'border-teal-500/40',  text:'text-teal-400',   bg:'bg-teal-500/10' },
  yellow: { badge:'bg-yellow-500/20 text-yellow-400', glow:'shadow-[0_0_30px_rgba(234,179,8,0.2)]', border:'border-yellow-500/40', text:'text-yellow-400', bg:'bg-yellow-500/10' },
};

interface LiveLogEntry {
  id: string;
  time: number;
  event: string;
  needType: string;
  urgency: string;
  people: number;
}

interface SimStats {
  totalInjected: number;
  critical: number;
  inProgress: number;
  completed: number;
}

interface DecisionLogEntry {
  node: AITacticalNode;
  accepted: boolean;
  timestamp: number;
}

const urgencyColor: Record<string, string> = {
  critical: 'text-red-400 border-red-500/50 bg-red-500/10',
  high:     'text-orange-400 border-orange-500/50 bg-orange-500/10',
  medium:   'text-yellow-400 border-yellow-500/50 bg-yellow-500/10',
  low:      'text-green-400 border-green-500/50 bg-green-500/10',
};

const ANALYSIS_PHASES = [
  { label: 'Event Detected', desc: 'Parsing incoming distress vectors...', color: 'text-yellow-400' },
  { label: 'Analyzing Telemetry', desc: 'Cross-referencing geospatial cluster data...', color: 'text-blue-400' },
  { label: 'Historical Pattern Match', desc: 'Querying forensic disaster database...', color: 'text-purple-400' },
  { label: 'Recommendation Ready', desc: 'Neural consensus achieved.', color: 'text-emerald-400' },
];

export default function ScenarioDashboard() {
  const { needs, addNeed, updateNeed, setScenarios, scenarios } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [simulationTime, setSimulationTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [liveLog, setLiveLog] = useState<LiveLogEntry[]>([]);
  const [stats, setStats] = useState<SimStats>({ totalInjected: 0, critical: 0, inProgress: 0, completed: 0 });
  const [activeTab, setActiveTab] = useState<'scenarios' | 'archive'>('scenarios');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [activeSuggestions, setActiveSuggestions] = useState<AITacticalNode[]>([]);
  const [acceptedIds, setAcceptedIds] = useState<Set<string>>(new Set());
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [decisionLog, setDecisionLog] = useState<DecisionLogEntry[]>([]);
  const [analysisPhase, setAnalysisPhase] = useState<number>(-1); // -1 = idle
  const logRef = useRef<HTMLDivElement>(null);
  const injectedNeedsRef = useRef<Set<string>>(new Set());
  const inProgressTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const timeRef = useRef(0);

  useEffect(() => {
    setMounted(true);
    setScenarios(MOCK_SCENARIOS);
  }, []);

  // Auto-scroll live log
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [liveLog]);

  // Update stats whenever needs change
  useEffect(() => {
    const scenNeeds = needs.filter(n => n.reported_by === 'system');
    setStats({
      totalInjected: scenNeeds.length,
      critical: scenNeeds.filter(n => n.urgency_label === 'critical').length,
      inProgress: scenNeeds.filter(n => n.status === 'in_progress').length,
      completed: scenNeeds.filter(n => n.status === 'completed').length,
    });
  }, [needs]);

  // Simulation Loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && activeScenario) {
      timer = setInterval(() => {
        timeRef.current += 1;
        const newTime = timeRef.current;
        setSimulationTime(newTime);
        
        const scenario = scenarios.find(s => s.id === activeScenario);
        if (scenario) {
          // ── CHECK FOR AI SUGGESTIONS (with phased analysis animation) ──
          const suggestion = scenario.aiTacticalNodes?.find(n => n.minute === newTime);
          if (suggestion && !acceptedIds.has(suggestion.id)) {
            // Animate through analysis phases before showing recommendation
            setAnalysisPhase(0);
            const phaseTimers: NodeJS.Timeout[] = [];
            phaseTimers.push(setTimeout(() => setAnalysisPhase(1), 700));
            phaseTimers.push(setTimeout(() => setAnalysisPhase(2), 1500));
            phaseTimers.push(setTimeout(() => setAnalysisPhase(3), 2400));
            phaseTimers.push(setTimeout(() => {
              setActiveSuggestions(prev => [...prev.filter(s => s.id !== suggestion.id), suggestion]);
              setAnalysisPhase(-1);
            }, 3200));
            phaseTimers.forEach(t => inProgressTimersRef.current.set('phase_' + t, t));
          }

          const maxTime = Math.max(...scenario.timeline.map(t => t.minute)) + 60;
          if (newTime >= maxTime) {
            handleStop();
          }

          const timelineEvent = scenario.timeline.find(t => t.minute === newTime);
          if (timelineEvent) {
            // Inject 1–3 needs per event
            const injectCount = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < injectCount; i++) {
              const template = scenario.requestTemplates[Math.floor(Math.random() * scenario.requestTemplates.length)];
              const offsetLat = (Math.random() - 0.5) * 0.06;
              const offsetLng = (Math.random() - 0.5) * 0.06;
              const needId = `scen_${Date.now()}_${i}`;

              if (!injectedNeedsRef.current.has(needId)) {
                injectedNeedsRef.current.add(needId);
                addNeed({
                  id: needId,
                  reported_by: 'system',
                  need_type: template.need,
                  urgency_label: template.urgency,
                  urgency_level: template.urgency === 'critical' ? 92 : template.urgency === 'high' ? 70 : 45,
                  people_affected: template.people + Math.floor(Math.random() * 5),
                  description: `[SIM: ${timelineEvent.event}] Automated distress signal received.`,
                  location: {
                    lat: template.location[0] + offsetLat,
                    lng: template.location[1] + offsetLng
                  },
                  status: 'pending',
                  triage_score: template.urgency === 'critical' ? 90 + Math.floor(Math.random() * 8) : 55 + Math.floor(Math.random() * 20),
                  created_at: new Date().toISOString()
                });

                // Add to live log
                setLiveLog(prev => [...prev, {
                  id: needId,
                  time: newTime,
                  event: timelineEvent.event,
                  needType: template.need,
                  urgency: template.urgency,
                  people: template.people,
                }]);

                // Auto-triage critical needs after 8–15s (simulate AI dispatch)
                if (template.urgency === 'critical') {
                  const delay = 8000 + Math.random() * 7000;
                  const t = setTimeout(() => {
                    updateNeed(needId, { status: 'in_progress' });
                    // Auto-complete after another 20–35s
                    const t2 = setTimeout(() => {
                      updateNeed(needId, { status: 'completed', completed_at: new Date().toISOString() });
                    }, 20000 + Math.random() * 15000);
                    inProgressTimersRef.current.set(needId + '_done', t2);
                  }, delay);
                  inProgressTimersRef.current.set(needId, t);
                }
              }
            }
          }
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, activeScenario, addNeed, updateNeed, scenarios]);

  if (!mounted) return null;

  const handleStart = (id: string) => {
    injectedNeedsRef.current = new Set();
    timeRef.current = 0;
    setActiveScenario(id);
    setSimulationTime(0);
    setLiveLog([]);
    setDecisionLog([]);
    setActiveSuggestions([]);
    setAcceptedIds(new Set());
    setAnalysisPhase(-1);
    setStats({ totalInjected: 0, critical: 0, inProgress: 0, completed: 0 });
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsReportOpen(true);
    inProgressTimersRef.current.forEach(t => clearTimeout(t));
    inProgressTimersRef.current.clear();
  };

  const handleResetSim = () => {
    setIsReportOpen(false);
    setActiveScenario(null);
    setSimulationTime(0);
    setLiveLog([]);
    setActiveSuggestions([]);
    setAcceptedIds(new Set());
    setDecisionLog([]);
    setAnalysisPhase(-1);
  };

  const handleAcceptNode = (node: AITacticalNode) => {
    setAcceptedIds(prev => new Set(prev).add(node.id));
    setActiveSuggestions(prev => prev.filter(s => s.id !== node.id));
    setDecisionLog(prev => [{ node, accepted: true, timestamp: simulationTime }, ...prev]);
  };

  const handleRejectNode = (node: AITacticalNode) => {
    setActiveSuggestions(prev => prev.filter(s => s.id !== node.id));
    setDecisionLog(prev => [{ node, accepted: false, timestamp: simulationTime }, ...prev]);
  };

  const currentScenario = scenarios.find(s => s.id === activeScenario);
  const currentFact = activeScenario ? HISTORICAL_FACTS[activeScenario] : null;

  // 🔍 FILTERING LOGIC
  const filteredScenarios = scenarios.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || s.disasterType === selectedType;
    return matchesSearch && matchesType;
  });

  const naturalDisasters = filteredScenarios.filter(s => s.disasterType !== 'industrial');
  const industrialDisasters = filteredScenarios.filter(s => s.disasterType === 'industrial');

  const disasterTypes = ['all', ...Array.from(new Set(scenarios.map(s => s.disasterType)))];

  const ScenarioCard = ({ s }: { s: Scenario }) => {
    const fact = HISTORICAL_FACTS[s.id];
    const col = fact ? colorClass[fact.color] ?? colorClass.blue : colorClass.blue;
    const isIndustrial = s.disasterType === 'industrial';

    return (
      <div className={clsx(
        "glass-panel rounded-2xl p-6 flex flex-col border relative overflow-hidden group cursor-default",
        "transition-all duration-300 hover:-translate-y-1",
        col.border, col.glow
      )}>
        {/* Glow orb */}
        <div className={clsx("absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-opacity opacity-30 group-hover:opacity-60", col.bg)} />

        {/* Top badges */}
        <div className="flex items-center justify-between mb-4 z-10">
          <div className="flex items-center gap-2">
            <span className={clsx("px-2 py-0.5 text-[10px] font-bold uppercase rounded-full tracking-widest flex items-center gap-1", col.badge)}>
              {DISASTER_ICON[s.disasterType]} {s.disasterType.replace('_', ' ')}
            </span>
            {isIndustrial && (
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-red-900/50 text-red-300 border border-red-500/30 tracking-widest">
                INDUSTRIAL
              </span>
            )}
          </div>
          <span className={clsx("text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
            s.severity === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
          )}>
            {s.severity}
          </span>
        </div>

        <h2 className="text-lg font-bold mb-1 z-10 leading-tight">{s.name}</h2>
        <p className="text-slate-400 text-xs mb-4 z-10 line-clamp-2 flex-1">{s.description}</p>

        {/* Historical facts bar */}
        {fact && (
          <div className="grid grid-cols-3 gap-2 mb-4 z-10">
            <div className={clsx("rounded-lg p-2 text-center", col.bg)}>
              <div className={clsx("text-sm font-bold", col.text)}>{fact.deaths}</div>
              <div className="text-[9px] text-slate-500 uppercase">Deaths</div>
            </div>
            <div className={clsx("rounded-lg p-2 text-center", col.bg)}>
              <div className={clsx("text-sm font-bold", col.text)}>{fact.displaced}</div>
              <div className="text-[9px] text-slate-500 uppercase">Displaced</div>
            </div>
            <div className={clsx("rounded-lg p-2 text-center", col.bg)}>
              <div className={clsx("text-sm font-bold", col.text)}>{fact.damage}</div>
              <div className="text-[9px] text-slate-500 uppercase">Damage</div>
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-4 z-10">
          <div className="flex items-center gap-1 text-xs text-slate-300 bg-black/20 px-2 py-1 rounded">
            <Users size={11} className="text-emerald-400" /> {s.affectedPeople.toLocaleString()} impacted
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-300 bg-black/20 px-2 py-1 rounded">
            <Timer size={11} className="text-blue-400" /> {s.timeline[s.timeline.length - 1].minute}m sim
          </div>
        </div>

        <div className="flex gap-2 w-full z-10 mt-auto">
          <button
            onClick={() => handleStart(s.id)}
            className={clsx(
               "flex-1 font-bold py-2.5 text-[10px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-lg",
               isIndustrial
                 ? "bg-red-600/80 hover:bg-red-500 text-white shadow-red-900/20"
                 : "bg-[#10B981] hover:bg-emerald-500 text-white shadow-emerald-900/20"
            )}
          >
            <Play size={12} fill="currentColor" /> Initialize
          </button>
          <button 
            onClick={() => window.location.href = `/scenarios/simulation?id=${s.id}`}
            className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold py-2.5 text-[10px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Zap size={12} className="text-blue-400" /> 4-View Mode
          </button>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout role="government">
      <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto h-full pb-10">

        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.location.href = '/'}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors group border border-white/5 bg-white/5"
              title="Return to Landing Page"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div className="h-10 w-px bg-white/10 mx-1" />
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-red-400">
                Scenario Simulation Engine
              </h1>
              <p className="text-slate-400 mt-1">
                8 real-world disasters (5 natural + 2 industrial) — simulate multi-phase response operations
              </p>
            </div>
          </div>

          {isRunning && (
            <div className="glass-panel border-red-500/50 bg-red-500/10 px-5 py-3 rounded-2xl flex items-center gap-4 animate-pulse-slow">
              <div className="flex items-center gap-2 text-red-400">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                <span className="font-bold tracking-widest uppercase text-xs">Live Sim</span>
              </div>
              <div className="font-mono text-2xl font-bold text-white">
                T+{String(Math.floor(simulationTime / 60)).padStart(2, '0')}:{String(simulationTime % 60).padStart(2, '0')}
              </div>
              <button
                onClick={handleStop}
                className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Square fill="currentColor" size={10} /> Stop
              </button>
            </div>
          )}
        </div>

        {/* ── IDLE: Tabs + Grid ── */}
        {!isRunning ? (
          <>
            {/* Tabs & Search */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
               <div className="flex gap-2">
                 <button
                   onClick={() => setActiveTab('scenarios')}
                   className={clsx(
                     "px-5 py-2 rounded-xl text-sm font-bold transition-all",
                     activeTab === 'scenarios'
                       ? "bg-[#10B981] text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                       : "glass-panel text-slate-400 hover:text-white"
                   )}
                 >
                   🎮 All Scenarios
                 </button>
                 <button
                   onClick={() => setActiveTab('archive')}
                   className={clsx(
                     "px-5 py-2 rounded-xl text-sm font-bold transition-all",
                     activeTab === 'archive'
                       ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                       : "glass-panel text-slate-400 hover:text-white"
                   )}
                 >
                   📚 Historical Archive
                 </button>
               </div>

               {activeTab === 'scenarios' && (
                  <div className="flex items-center gap-3 bg-[#0d1117] border border-[#1e2d3d] px-4 py-2 rounded-xl focus-within:border-blue-500 transition-colors w-full lg:w-80">
                     <Play size={14} className="text-slate-600 rotate-90" />
                     <input 
                        type="text" 
                        placeholder="Search mission archive..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent text-xs text-white outline-none w-full placeholder:text-slate-700 font-bold uppercase tracking-widest"
                     />
                  </div>
               )}
            </div>

            {/* Filter Pills */}
            {activeTab === 'scenarios' && (
               <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {disasterTypes.map(type => (
                     <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={clsx(
                           "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border shrink-0",
                           selectedType === type 
                             ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]" 
                             : "bg-[#0d1117] border-[#1e2d3d] text-slate-500 hover:text-slate-300"
                        )}
                     >
                        {type.replace('_', ' ')}
                     </button>
                  ))}
               </div>
            )}

            {activeTab === 'scenarios' && (
              <div className="flex flex-col gap-8">
                {/* Natural Disasters */}
                <div>
                  <h2 className="text-xs uppercase font-bold tracking-widest text-blue-400 mb-4 flex items-center gap-2">
                    <Droplets size={14} /> Natural Disasters
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {naturalDisasters.map(s => <ScenarioCard key={s.id} s={s} />)}
                  </div>
                </div>

                {/* Industrial Disasters */}
                <div>
                  <h2 className="text-xs uppercase font-bold tracking-widest text-red-400 mb-4 flex items-center gap-2">
                    <Flame size={14} /> Industrial Disasters
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {industrialDisasters.map(s => <ScenarioCard key={s.id} s={s} />)}
                    {/* LIVE CUSTOM EVENT CREATOR */}
                    <div className="glass-panel rounded-2xl p-6 border-2 border-dashed border-blue-500/30 flex flex-col items-center justify-center min-h-[300px] hover:border-blue-500/60 transition-all group overflow-hidden relative">
                       <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
                       <div className="z-10 flex flex-col items-center text-center">
                         <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 border border-blue-500/30 group-hover:scale-110 transition-transform">
                            <Activity size={32} className="text-blue-400" />
                         </div>
                         <h2 className="text-xl font-bold mb-1">Live Event Creator</h2>
                         <p className="text-slate-400 text-xs mb-6 px-4 uppercase tracking-widest">Procedural Simulation for ANY location</p>
                         
                         <button 
                           onClick={() => window.location.href = '/scenarios/simulation'}
                           className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95"
                         >
                           Launch Custom Mission
                         </button>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'archive' && (
              <div className="glass-panel border border-purple-500/20 rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-1 text-purple-300">📚 Historical Disaster Archive — India</h2>
                <p className="text-slate-500 text-sm mb-6">All simulation data is grounded in real events. Sources: Crisora, MHA, WHO, UNDRR.</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-left text-slate-400 text-xs uppercase tracking-widest">
                        <th className="pb-3 pr-4">Disaster</th>
                        <th className="pb-3 pr-4">Year</th>
                        <th className="pb-3 pr-4">Type</th>
                        <th className="pb-3 pr-4">Deaths</th>
                        <th className="pb-3 pr-4">Displaced</th>
                        <th className="pb-3 pr-4">Economic Loss</th>
                        <th className="pb-3">Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(HISTORICAL_FACTS).map(([id, f]) => {
                        const sc = scenarios.find(s => s.id === id);
                        if (!sc) return null;
                        const col = colorClass[f.color] ?? colorClass.blue;
                        return (
                          <tr key={id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-3 pr-4 font-bold text-white">{sc.name.replace(' ☠️', '').replace(' ⚗️', '')}</td>
                            <td className="py-3 pr-4 font-mono text-slate-300">{f.year}</td>
                            <td className="py-3 pr-4">
                              <span className={clsx("px-2 py-0.5 text-[10px] font-bold uppercase rounded-full", col.badge)}>
                                {sc.disasterType.replace('_', ' ')}
                              </span>
                            </td>
                            <td className={clsx("py-3 pr-4 font-bold", col.text)}>{f.deaths}</td>
                            <td className="py-3 pr-4 text-slate-300">{f.displaced}</td>
                            <td className="py-3 pr-4 text-slate-300">{f.damage}</td>
                            <td className="py-3 text-slate-500 text-xs">{f.landmark}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-slate-600 mt-4 flex items-center gap-1">
                  <Info size={11} /> Data from Crisora Annual Reports, Ministry of Home Affairs, and published disaster assessments.
                </p>
              </div>
            )}
          </>
        ) : (
          /* ── ACTIVE SIMULATION VIEW ── */
          <div className="flex flex-col gap-4">

            {/* Scenario header banner */}
            {currentScenario && currentFact && (
              <div className={clsx(
                "glass-panel rounded-xl p-4 border flex items-center justify-between",
                colorClass[currentFact.color]?.border ?? 'border-white/10'
              )}>
                <div className="flex items-center gap-4">
                  <div className={clsx("p-2 rounded-lg", colorClass[currentFact.color]?.bg)}>
                    <ShieldAlert size={20} className={colorClass[currentFact.color]?.text} />
                  </div>
                  <div>
                    <div className="font-bold text-white">{currentScenario.name}</div>
                    <div className="text-xs text-slate-400">{currentFact.landmark} • {currentFact.year}</div>
                  </div>
                </div>
                <div className="flex gap-6 text-center">
                  <div>
                    <div className={clsx("text-lg font-bold", colorClass[currentFact.color]?.text)}>{currentFact.deaths}</div>
                    <div className="text-[10px] text-slate-500 uppercase">Historical Deaths</div>
                  </div>
                  <div>
                    <div className={clsx("text-lg font-bold", colorClass[currentFact.color]?.text)}>{currentFact.displaced}</div>
                    <div className="text-[10px] text-slate-500 uppercase">Displaced</div>
                  </div>
                  <div>
                    <div className={clsx("text-lg font-bold", colorClass[currentFact.color]?.text)}>{currentFact.damage}</div>
                    <div className="text-[10px] text-slate-500 uppercase">Damage</div>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Bar */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Requests Injected', value: stats.totalInjected, icon: <Radio size={16} />, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { label: 'Critical Needs', value: stats.critical, icon: <AlertTriangle size={16} />, color: 'text-red-400', bg: 'bg-red-500/10' },
                { label: 'AI Dispatched', value: stats.inProgress, icon: <Zap size={16} />, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                { label: 'Resolved', value: stats.completed, icon: <CheckCircle2 size={16} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              ].map(({ label, value, icon, color, bg }) => (
                <div key={label} className={clsx("glass-panel rounded-xl p-3 border border-white/10 flex items-center gap-3", bg)}>
                  <span className={color}>{icon}</span>
                  <div>
                    <div className={clsx("text-2xl font-bold font-mono", color)}>{value}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main simulation area - enhanced layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

              {/* LEFT: Live Map – key forces remount on scenario change to re-center */}
              <div className="lg:col-span-7 glass-panel border border-red-500/30 rounded-2xl relative overflow-hidden" style={{ height: '620px' }}>
                <div className="absolute top-4 left-4 z-20 glass-panel px-3 py-1.5 rounded-lg border border-red-500/40 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Live Incident Map</span>
                </div>
                {currentScenario && (
                  <div className="absolute top-4 right-4 z-20 glass-panel px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                    <Target size={12} className="text-slate-400" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase">{currentScenario.location.lat.toFixed(2)}, {currentScenario.location.lng.toFixed(2)}</span>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3">
                  <div className="glass-panel px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                    <Wind size={11} className="text-slate-400" />
                    <span className="text-[9px] font-bold text-slate-300">{currentScenario?.weatherCondition.windSpeed} km/h</span>
                  </div>
                  <div className="glass-panel px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                    <Thermometer size={11} className="text-orange-400" />
                    <span className="text-[9px] font-bold text-slate-300">{currentScenario?.weatherCondition.temperature}°C</span>
                  </div>
                  <div className="glass-panel px-3 py-1.5 rounded-lg border border-blue-500/30 flex items-center gap-2">
                    <CloudRainWind size={11} className="text-blue-400" />
                    <span className="text-[9px] font-bold text-blue-300">{currentScenario?.weatherCondition.rainfall}mm/hr</span>
                  </div>
                </div>
                <LiveMap
                  key={activeScenario || 'default'}
                  needs={needs.filter(n => n.reported_by === 'system')}
                  volunteers={[]}
                  ngos={[]}
                  center={currentScenario?.location}
                  zoom={currentScenario?.disasterType === 'earthquake' ? 9 : currentScenario?.disasterType === 'cyclone' ? 8 : 11}
                  showEpicenter={currentScenario?.location}
                />
              </div>

              {/* RIGHT: AI Neural Engine Command Panel */}
              <div className="lg:col-span-5 flex flex-col gap-3" style={{ height: '620px', overflowY: 'auto' }}>

                {/* Event Timeline Progress */}
                <div className="glass-panel p-4 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[10px] uppercase font-bold text-slate-500 tracking-widest flex items-center gap-1.5">
                      <Clock size={11} /> Mission Timeline
                    </h3>
                    <span className="text-emerald-400 font-mono text-xs font-bold">T+{simulationTime}m</span>
                  </div>
                  <div className="flex flex-col gap-1.5 max-h-[130px] overflow-y-auto custom-scrollbar pr-1">
                    {currentScenario?.timeline.map((evt, idx) => (
                      <div key={idx} className={clsx(
                        "flex gap-3 text-xs rounded-lg px-3 py-2 border-l-2 transition-all duration-500",
                        simulationTime >= evt.minute
                          ? "bg-emerald-500/10 border-emerald-500"
                          : "bg-white/3 border-slate-800 opacity-30"
                      )}>
                        <span className={clsx("font-mono font-bold min-w-[40px] shrink-0", simulationTime >= evt.minute ? "text-emerald-400" : "text-slate-600")}>
                          T+{evt.minute}m
                        </span>
                        <span className={clsx("leading-snug", simulationTime >= evt.minute ? "text-slate-200" : "text-slate-600")}>{evt.event}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ─── AI NEURAL ENGINE ─────────────────────────────── */}
                <div className="glass-panel rounded-2xl border border-blue-500/40 flex flex-col bg-[#050d1a] relative overflow-hidden flex-1">
                  {/* Ambient glow */}
                  <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Header */}
                  <div className="px-5 py-4 border-b border-blue-500/20 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
                        <BrainCircuit size={16} className="text-blue-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.25em]">Crisora Neural Engine</p>
                        <p className="text-[8px] text-slate-600 uppercase tracking-widest">Step-by-Step Decision Core</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-[8px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/30">
                        ✓ {decisionLog.filter(d => d.accepted).length} Accepted
                      </div>
                      <div className="text-[8px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 px-2 py-1 rounded-lg border border-red-500/30">
                        ✗ {decisionLog.filter(d => !d.accepted).length} Rejected
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar" style={{ minHeight: 0 }}>

                    {/* ─ PHASE ANIMATION: AI Thinking ─ */}
                    {analysisPhase >= 0 && (
                      <div className="bg-[#0a1628] border border-blue-500/30 rounded-2xl p-4 space-y-3 animate-in fade-in duration-300">
                        <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.25em] flex items-center gap-2">
                          <Activity size={10} className="animate-pulse" /> Neural Processing...
                        </p>
                        {ANALYSIS_PHASES.map((phase, i) => (
                          <div key={i} className={clsx(
                            "flex items-center gap-3 transition-all duration-500",
                            i <= analysisPhase ? 'opacity-100' : 'opacity-20'
                          )}>
                            <div className={clsx(
                              "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black border shrink-0 transition-all duration-300",
                              i < analysisPhase ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' :
                              i === analysisPhase ? 'bg-blue-500/20 border-blue-500 text-blue-400 animate-pulse' :
                              'bg-white/5 border-white/10 text-slate-600'
                            )}>
                              {i < analysisPhase ? '✓' : i + 1}
                            </div>
                            <div>
                              <p className={clsx("text-[10px] font-bold", i <= analysisPhase ? phase.color : 'text-slate-600')}>{phase.label}</p>
                              {i === analysisPhase && <p className="text-[9px] text-slate-500 italic">{phase.desc}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ─ ACTIVE SUGGESTIONS ─ */}
                    {activeSuggestions.length > 0 && analysisPhase < 0 && (
                      <div className="space-y-4">
                        <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2">
                          <Zap size={10} /> Pending Command Decisions
                        </p>
                        {activeSuggestions.map(node => (
                          <div key={node.id} className="border border-blue-500/30 rounded-2xl overflow-hidden animate-in slide-in-from-right-4 fade-in duration-500">
                            {/* Node header */}
                            <div className="px-4 py-3 bg-blue-950/40 border-b border-blue-500/20 flex items-center justify-between">
                              <span className={clsx(
                                "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg",
                                node.category === 'medical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                node.category === 'rescue' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                                node.category === 'evacuation' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                                'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              )}>
                                {node.category}
                              </span>
                              <span className="text-[8px] font-mono text-slate-600">T+{node.minute}m</span>
                            </div>

                            <div className="p-4 space-y-3">
                              {/* AI Recommendation */}
                              <div>
                                <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                  <ShieldCheck size={9} /> AI Recommends
                                </p>
                                <p className="text-xs font-bold text-white leading-relaxed bg-blue-500/10 border border-blue-500/20 rounded-xl px-3 py-2">
                                  "{node.suggestion}"
                                </p>
                              </div>

                              {/* Historical Reality comparison */}
                              <div>
                                <p className="text-[8px] font-black text-red-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                  <Skull size={9} /> What Actually Happened
                                </p>
                                <p className="text-[10px] text-red-200/70 leading-relaxed bg-red-500/5 border border-red-500/20 rounded-xl px-3 py-2 italic">
                                  {node.historicalReality}
                                </p>
                              </div>

                              {/* Predicted Impact */}
                              <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-3 py-2">
                                <TrendingUp size={12} className="text-emerald-400 shrink-0" />
                                <p className="text-[9px] font-bold text-emerald-300">{node.predictedImpact}</p>
                              </div>

                              {/* Accept/Reject */}
                              <div className="flex gap-2 pt-1">
                                <button
                                  onClick={() => handleAcceptNode(node)}
                                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest py-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-900/30"
                                >
                                  <ShieldCheck size={11} /> Accept & Execute
                                </button>
                                <button
                                  onClick={() => handleRejectNode(node)}
                                  className="px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 rounded-xl transition-all text-[9px] font-black uppercase tracking-widest"
                                >
                                  <ShieldX size={13} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ─ IDLE STATE ─ */}
                    {activeSuggestions.length === 0 && analysisPhase < 0 && decisionLog.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                          <Activity size={28} className="text-blue-500/40 animate-pulse" />
                        </div>
                        <p className="text-[10px] text-slate-600 uppercase tracking-widest leading-relaxed">
                          Neural engine monitoring...<br/>
                          <span className="text-slate-700">AI decisions will appear as events unfold</span>
                        </p>
                      </div>
                    )}

                    {/* ─ DECISION CHRONICLE ─ */}
                    {decisionLog.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                          <Globe size={10} /> Decision Chronicle
                        </p>
                        {decisionLog.map((entry, idx) => (
                          <div key={idx} className={clsx(
                            "rounded-xl border px-4 py-3 flex items-start gap-3 transition-all",
                            entry.accepted
                              ? "bg-emerald-500/5 border-emerald-500/20"
                              : "bg-red-500/5 border-red-500/20 opacity-70"
                          )}>
                            <div className={clsx(
                              "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                              entry.accepted ? 'bg-emerald-500/20' : 'bg-red-500/20'
                            )}>
                              {entry.accepted
                                ? <ShieldCheck size={13} className="text-emerald-400" />
                                : <ShieldX size={13} className="text-red-400" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className={clsx(
                                  "text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded",
                                  entry.node.category === 'medical' ? 'bg-red-500/20 text-red-400' :
                                  entry.node.category === 'rescue' ? 'bg-orange-500/20 text-orange-400' :
                                  entry.node.category === 'evacuation' ? 'bg-purple-500/20 text-purple-400' :
                                  'bg-blue-500/20 text-blue-400'
                                )}>
                                  {entry.node.category}
                                </span>
                                <span className="text-[8px] font-mono text-slate-600">T+{entry.timestamp}m</span>
                              </div>
                              <p className="text-[10px] text-slate-300 leading-snug line-clamp-2">{entry.node.suggestion}</p>
                              {entry.accepted && (
                                <p className="text-[9px] text-emerald-500 mt-1 font-bold">{entry.node.predictedImpact}</p>
                              )}
                              {!entry.accepted && (
                                <p className="text-[9px] text-slate-600 mt-1 italic line-clamp-1">Historical: {entry.node.historicalReality}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ── AFTER-ACTION REPORT MODAL ────────────────────────────── */}
        {isReportOpen && currentScenario && currentFact && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
            <div className="glass-panel w-full max-w-5xl h-[85vh] border-2 border-white/20 rounded-[40px] overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 delay-150 duration-700">
              {/* Header */}
              <div className="bg-[#0a1628] p-10 border-b border-white/10 flex items-center justify-between relative">
                <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                  <Database size={240} className="text-blue-500" />
                </div>
                <div className="z-10">
                  <h2 className="text-7xl font-black text-white tracking-tighter mb-2">SCENARIO REPORT</h2>
                  <p className="text-blue-400 font-bold uppercase tracking-[0.4em] flex items-center gap-2">
                    <span className="inline-block w-4 h-1 bg-blue-500 rounded-full" />
                    Crisora Forensic Simulation Analysis
                  </p>
                </div>
                <div className="z-10 bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-md">
                   <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Mission Identifier</div>
                   <div className="text-xl font-mono font-bold text-white uppercase">{currentScenario.id.slice(0, 12)}...</div>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-10">
                <div className="grid grid-cols-2 gap-12">
                  
                  {/* Historical Column */}
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-10 h-10 rounded-2xl bg-red-950/40 flex items-center justify-center border border-red-500/30">
                          <Skull size={20} className="text-red-500" />
                       </div>
                       <h3 className="text-2xl font-bold text-white italic">Historical Reality</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl">
                        <div className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Confirmed Deaths</div>
                        <div className="text-5xl font-black text-white">{currentScenario.historicalStats?.deaths.toLocaleString() ?? currentFact.deaths}</div>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-6 rounded-3xl grid grid-cols-2 gap-6">
                         <div>
                            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Response Lag</div>
                            <div className="text-xl font-bold text-white italic">{currentScenario.historicalStats?.responseLag ?? "Unknown"}</div>
                         </div>
                         <div>
                            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Economic Loss</div>
                            <div className="text-xl font-bold text-white italic">{currentScenario.historicalStats?.economicLoss ?? currentFact.damage}</div>
                         </div>
                      </div>
                    </div>

                    <div className="mt-4 p-6 border border-white/5 bg-white/2 rounded-3xl">
                       <p className="text-sm text-slate-400 leading-relaxed">
                          "Historical protocols relied on siloed communication and delayed response windows. The critical failure node was identified as lack of real-time geospatial intelligence."
                       </p>
                    </div>
                  </div>

                  {/* NDRS Optimized Column */}
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-10 h-10 rounded-2xl bg-blue-950/40 flex items-center justify-center border border-blue-500/30 animate-pulse">
                          <ShieldCheck size={20} className="text-blue-500" />
                       </div>
                       <h3 className="text-2xl font-bold text-white italic">Crisora Optimized Prognosis</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-blue-600 border-2 border-blue-400 p-6 rounded-3xl shadow-[0_0_50px_rgba(37,99,235,0.3)]">
                        <div className="text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Optimized Outcome</div>
                        <div className="text-5xl font-black text-white">
                          {~~(Math.max(0, (currentScenario.historicalStats?.deaths ?? 1000) * (1 - (Array.from(acceptedIds).length * 0.15)))).toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="bg-blue-950/20 border border-blue-500/30 p-6 rounded-3xl flex items-center justify-between">
                         <div>
                            <div className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Neural Impact</div>
                            <div className="text-4xl font-bold text-white">+{Array.from(acceptedIds).length * 15}% <span className="text-sm text-slate-500 font-normal ml-2">Lives Saved</span></div>
                         </div>
                         <div className="w-16 h-16 rounded-full border-4 border-blue-500/30 border-t-blue-500 flex items-center justify-center">
                            <BrainCircuit size={24} className="text-blue-500" />
                         </div>
                      </div>
                    </div>

                    {/* Suggestions Accepted */}
                    <div className="mt-4 space-y-3">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">AI Strategic Interventions</h4>
                       {currentScenario.aiTacticalNodes?.map(node => (
                         <div key={node.id} className={clsx(
                           "p-4 rounded-2xl border transition-all flex items-center justify-between gap-4",
                           acceptedIds.has(node.id) ? "bg-emerald-500/10 border-emerald-500/40" : "bg-red-500/10 border-red-500/40 opacity-60"
                         )}>
                            <div className="flex flex-col gap-1">
                               <div className="text-[9px] font-bold uppercase tracking-widest opacity-60">{node.category}</div>
                               <div className="text-xs font-bold text-white">{node.suggestion}</div>
                            </div>
                            <div className={acceptedIds.has(node.id) ? "text-emerald-500" : "text-red-500"}>
                               {acceptedIds.has(node.id) ? <ShieldCheck size={20}/> : <ShieldX size={20}/>}
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-10 bg-white/2 border-t border-white/10 flex items-center justify-between">
                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-emerald-500" />
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Report Verified by AI Sentinel</span>
                    </div>
                 </div>
                 <button 
                   onClick={handleResetSim}
                   className="px-10 py-5 bg-white text-[#0a1628] font-black text-xs uppercase tracking-[0.3em] rounded-[20px] hover:bg-slate-200 transition-all active:scale-95 shadow-xl shadow-white/10"
                 >
                   Mission Debrief Complete
                 </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </DashboardLayout>
  );
}
