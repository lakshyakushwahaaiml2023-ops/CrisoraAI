"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { useAppStore } from '@/lib/store';
import { useState, useEffect, useRef } from 'react';
import {
  Play, Square, Timer, Activity, Users, CloudRainWind,
  Wind, Thermometer, AlertTriangle, Zap, Flame, Droplets,
  ShieldAlert, Radio, CheckCircle2, Clock, SkipForward,
  ChevronRight, Info, ChevronLeft
} from 'lucide-react';
import { MOCK_SCENARIOS } from '@/lib/mock-data';
import { Scenario } from '@/lib/types';
import clsx from 'clsx';
import { LiveMap } from '@/components/Map';

// ─────────────────────────────────────────────────────────────────────────────
// HISTORICAL FACTS for each scenario
// ─────────────────────────────────────────────────────────────────────────────
const HISTORICAL_FACTS: Record<string, { year: number; deaths: string; displaced: string; damage: string; landmark: string; color: string }> = {
  monsoon_jaipur_2025:       { year: 2025, deaths: '~12', displaced: '2,147',   damage: '₹140 Cr',   landmark: 'Mansarovar Colony, Jaipur', color: 'blue' },
  kerala_floods_2018:         { year: 2018, deaths: '483', displaced: '1.4M',    damage: '₹31,000 Cr', landmark: 'Periyar River, Ernakulam',  color: 'blue' },
  cyclone_fani_2019:          { year: 2019, deaths: '89',  displaced: '1.5M',    damage: '₹24,201 Cr', landmark: 'Puri Coastline, Odisha',    color: 'purple' },
  kedarnath_floods_2013:      { year: 2013, deaths: '5,700+', displaced: '1L+', damage: '₹4,200 Cr', landmark: 'Kedarnath Temple, Uttarakhand', color: 'cyan' },
  bhuj_earthquake_2001:       { year: 2001, deaths: '20,023', displaced: '6L+', damage: '₹21,000 Cr', landmark: 'Bhuj Old City, Gujarat',      color: 'orange' },
  cyclone_michaung_2023:      { year: 2023, deaths: '17',  displaced: '2L+',    damage: '₹8,000 Cr',  landmark: 'Velachery, Chennai',          color: 'teal' },
  bhopal_gas_tragedy_1984:    { year: 1984, deaths: '16,000+', displaced: '5L+', damage: '₹15,000 Cr', landmark: 'Union Carbide Plant, Bhopal', color: 'red' },
  vizag_gas_leak_2020:        { year: 2020, deaths: '13',  displaced: '3,000+', damage: '₹500 Cr',   landmark: 'LG Polymers, Vizag, AP',      color: 'yellow' },
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

const urgencyColor: Record<string, string> = {
  critical: 'text-red-400 border-red-500/50 bg-red-500/10',
  high:     'text-orange-400 border-orange-500/50 bg-orange-500/10',
  medium:   'text-yellow-400 border-yellow-500/50 bg-yellow-500/10',
  low:      'text-green-400 border-green-500/50 bg-green-500/10',
};

export default function ScenarioDashboard() {
  const { needs, addNeed, updateNeed, setScenarios, scenarios } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [simulationTime, setSimulationTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [liveLog, setLiveLog] = useState<LiveLogEntry[]>([]);
  const [stats, setStats] = useState<SimStats>({ totalInjected: 0, critical: 0, inProgress: 0, completed: 0 });
  const [activeTab, setActiveTab] = useState<'scenarios' | 'archive'>('scenarios');
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
    setStats({ totalInjected: 0, critical: 0, inProgress: 0, completed: 0 });
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    setActiveScenario(null);
    setSimulationTime(0);
    setLiveLog([]);
    // Clear all timers
    inProgressTimersRef.current.forEach(t => clearTimeout(t));
    inProgressTimersRef.current.clear();
  };

  const currentScenario = scenarios.find(s => s.id === activeScenario);
  const currentFact = activeScenario ? HISTORICAL_FACTS[activeScenario] : null;

  const naturalDisasters = scenarios.filter(s => s.disasterType !== 'industrial');
  const industrialDisasters = scenarios.filter(s => s.disasterType === 'industrial');

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
            {/* Tabs */}
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
                <p className="text-slate-500 text-sm mb-6">All simulation data is grounded in real events. Sources: NDMA, MHA, WHO, UNDRR.</p>
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
                  <Info size={11} /> Data from NDMA Annual Reports, Ministry of Home Affairs, and published disaster assessments.
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

            {/* Main simulation area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4" style={{ height: '550px' }}>

              {/* LEFT: Live Map */}
              <div className="lg:col-span-7 glass-panel border border-red-500/30 rounded-2xl relative overflow-hidden p-2">
                <div className="absolute top-4 left-4 z-20 glass-panel px-3 py-1.5 rounded-lg border border-red-500/40 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Live Incident Map</span>
                </div>
                <LiveMap
                  needs={needs.filter(n => n.reported_by === 'system')}
                  volunteers={[]}
                  ngos={[]}
                  center={currentScenario?.location}
                  zoom={11}
                />
              </div>

              {/* RIGHT: Panels */}
              <div className="lg:col-span-5 flex flex-col gap-3 overflow-hidden">

                {/* Weather Data */}
                {currentScenario && (
                  <div className="glass-panel p-4 rounded-xl border border-white/10">
                    <h3 className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-3">Simulated Conditions</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex flex-col gap-1 items-center bg-blue-500/10 rounded-lg p-2">
                        <CloudRainWind size={16} className="text-blue-400" />
                        <span className="text-base font-bold text-white">{currentScenario.weatherCondition.rainfall}</span>
                        <span className="text-[9px] text-slate-500 uppercase">mm/hr</span>
                      </div>
                      <div className="flex flex-col gap-1 items-center bg-slate-500/10 rounded-lg p-2">
                        <Wind size={16} className="text-slate-300" />
                        <span className="text-base font-bold text-white">{currentScenario.weatherCondition.windSpeed}</span>
                        <span className="text-[9px] text-slate-500 uppercase">km/h</span>
                      </div>
                      <div className="flex flex-col gap-1 items-center bg-orange-500/10 rounded-lg p-2">
                        <Thermometer size={16} className="text-orange-400" />
                        <span className="text-base font-bold text-white">{currentScenario.weatherCondition.temperature}°</span>
                        <span className="text-[9px] text-slate-500 uppercase">Celsius</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Event Timeline */}
                <div className="glass-panel p-4 rounded-xl border border-white/10 flex flex-col" style={{ height: '160px' }}>
                  <h3 className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2 flex justify-between">
                    <span>Event Timeline</span>
                    <span className="text-emerald-400">T+{simulationTime}m</span>
                  </h3>
                  <div className="overflow-y-auto flex flex-col gap-2 custom-scrollbar pr-1">
                    {currentScenario?.timeline.map((evt, idx) => (
                      <div key={idx} className={clsx(
                        "flex gap-2 text-xs rounded p-1.5 border-l-2 transition-all",
                        simulationTime >= evt.minute
                          ? "bg-emerald-500/10 border-emerald-500 opacity-100"
                          : "bg-white/5 border-slate-700 opacity-30"
                      )}>
                        <span className={clsx("font-mono font-bold min-w-[36px]", simulationTime >= evt.minute ? "text-emerald-400" : "text-slate-600")}>
                          T+{evt.minute}
                        </span>
                        <span className={simulationTime >= evt.minute ? "text-slate-200" : "text-slate-500"}>{evt.event}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Event Feed */}
                <div className="glass-panel p-4 rounded-xl border border-white/10 flex flex-col flex-1 overflow-hidden">
                  <h3 className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2 flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      Live Distress Feed
                    </span>
                    <span className="text-blue-400">{liveLog.length} signals</span>
                  </h3>
                  <div ref={logRef} className="flex-1 overflow-y-auto flex flex-col gap-1.5 custom-scrollbar pr-1">
                    {liveLog.length === 0 && (
                      <div className="flex-1 flex items-center justify-center text-slate-600 text-xs">
                        Waiting for events...
                      </div>
                    )}
                    {liveLog.map((entry, i) => (
                      <div
                        key={entry.id}
                        className={clsx(
                          "rounded-lg p-2 border text-xs flex items-start gap-2 transition-all",
                          urgencyColor[entry.urgency] ?? urgencyColor.medium
                        )}
                        style={{ animation: 'slideIn 0.3s ease-out' }}
                      >
                        <ChevronRight size={10} className="mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 mb-0.5">
                            <span className="font-bold uppercase text-[10px]">{entry.urgency}</span>
                            <span className="text-slate-500">•</span>
                            <span className="uppercase text-[10px]">{entry.needType}</span>
                            <span className="text-slate-500">•</span>
                            <span className="text-[10px]">{entry.people} people</span>
                          </div>
                          <div className="text-slate-400 truncate text-[10px]">{entry.event}</div>
                        </div>
                        <div className="font-mono text-[10px] text-slate-600 flex-shrink-0">T+{entry.time}</div>
                      </div>
                    ))}
                  </div>
                </div>

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
