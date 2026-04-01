"use client";

import { useAppStore } from '@/lib/store';
import { useState, useEffect, useRef } from 'react';
import { 
  Activity, Shield, Users, HeartHandshake, Database, 
  Play, Square, Timer, AlertTriangle, Zap, Radio, CheckCircle2,
  ChevronRight, Info, MapPin, Globe, Compass, Target, 
  Box, Map as MapIcon, Siren, ChevronLeft
} from 'lucide-react';
import clsx from 'clsx';

// Components
import GovernmentMiniView from '@/components/simulation/GovernmentMiniView';
import NGOMiniView from '@/components/simulation/NGOMiniView';
import VolunteerMiniView from '@/components/simulation/VolunteerMiniView';
import VictimMiniView from '@/components/simulation/VictimMiniView';
import NexusOracle from '@/components/simulation/NexusOracle';
import { LiveMap } from '@/components/Map';

export default function CommandCenter() {
  const { needs, addNeed, updateNeed, installMockData, resetSimulation } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationTime, setSimulationTime] = useState(0);
  const [eventParams, setEventParams] = useState({ 
    type: 'Flood', 
    severity: 7, 
    location: { lat: 22.7196, lng: 75.8577, name: 'Indore Central' } 
  });
  const [liveTicker, setLiveTicker] = useState<{id: string, msg: string, time: number}[]>([]);
  const [demoPhase, setDemoPhase] = useState<'idle' | 'detect' | 'triage' | 'dispatch' | 'success'>('idle');
  const [showInsight, setShowInsight] = useState<string | null>(null);
  const [latestNeedId, setLatestNeedId] = useState<string | null>(null);
  
  const tickerRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef(0);
  const { volunteers, ngos } = useAppStore();

  useEffect(() => {
    setMounted(true);
    installMockData();
  }, [installMockData]);

  // Auto-scroll ticker
  useEffect(() => {
    if (tickerRef.current) {
      tickerRef.current.scrollTop = tickerRef.current.scrollHeight;
    }
  }, [liveTicker]);

  // Procedural Simulation Engine & Story Sequencer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => {
        timeRef.current += 1;
        const newTime = timeRef.current;
        setSimulationTime(newTime);
        
        // --- STORY MODE SEQUENCER ---
        if (newTime === 2) setDemoPhase('detect');
        if (newTime === 12) setDemoPhase('triage');
        if (newTime === 22) setDemoPhase('dispatch');
        if (newTime === 45) setDemoPhase('success');

        // Logic-driven highlights
        if (newTime === 15) setShowInsight('govt');
        if (newTime === 25) setShowInsight('vol');
        if (newTime === 35) setShowInsight('ngo');
        if (newTime === 55) setShowInsight(null);

        // --- PROCEDURAL INJECTION ---
        const probability = eventParams.severity / 12; 
        if (Math.random() < probability) {
          const type = ['medical', 'food', 'water', 'shelter', 'rescue'][Math.floor(Math.random() * 5)];
          const urgency = Math.random() > 0.7 ? 'critical' : 'high';
          const people = Math.floor(Math.random() * 15) + 1;
          const offsetLat = (Math.random() - 0.5) * 0.05;
          const offsetLng = (Math.random() - 0.5) * 0.05;
          const id = `proc_${Date.now()}`;

          addNeed({
            id,
            reported_by: 'system_proc',
            need_type: type as any,
            urgency_label: urgency as any,
            urgency_level: urgency === 'critical' ? 95 : 75,
            people_affected: people,
            description: `[LIVE] Distress call from ${eventParams.location.name} Sector ${Math.floor(Math.random()*10)}`,
            location: { lat: eventParams.location.lat + offsetLat, lng: eventParams.location.lng + offsetLng },
            status: 'pending',
            triage_score: urgency === 'critical' ? 92 + Math.floor(Math.random() * 7) : 60 + Math.floor(Math.random() * 20),
            created_at: new Date().toISOString()
          });
          
          setLatestNeedId(id);

          // Auto-match after bypass delay to show dispatcher lines
          if (newTime > 20) {
             const delay = 2000 + Math.random() * 3000;
             setTimeout(() => {
                const vol = volunteers.find(v => v.online && !needs.some(n => n.assigned_to === v.id));
                if (vol) updateNeed(id, { status: 'accepted', assigned_to: vol.id });
             }, delay);
          }

          setLiveTicker(prev => [...prev, {
            id: `t_${Date.now()}`,
            msg: `EVENT: ${type.toUpperCase()} alert - Sector ${Math.floor(Math.random()*10)}`,
            time: newTime
          }]);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, addNeed, updateNeed, eventParams, volunteers, needs]);

  if (!mounted) return null;

  const handleStart = () => {
    resetSimulation();
    timeRef.current = 0;
    setSimulationTime(0);
    setDemoPhase('idle');
    setLatestNeedId(null);
    setLiveTicker([{ id: 'start', msg: `COMMENCING MISSION: ${eventParams.type} at ${eventParams.location.name}`, time: 0 }]);
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  return (
    <div className="h-screen bg-[#07080B] text-white flex flex-col overflow-hidden font-sans">
      
      {/* ── TOP NAVIGATION BAR ── */}
      <header className="h-16 border-b border-white/10 bg-[#0F1117] flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.location.href = '/'}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors group border border-white/5 bg-white/5"
            title="Return to Hub"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div className="h-8 w-px bg-white/10 mx-1" />
          <div className="bg-red-600/20 p-2 rounded-lg border border-red-500/40 animate-pulse">
            <Radio size={20} className="text-red-400" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter uppercase leading-none">
              Live Mission <span className="text-red-500">Command Control</span>
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Multi-Stakeholder Sync Console • v2.4 Proc-Sim</p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-4">
          <div className="flex bg-black/40 border border-white/10 rounded-xl p-1">
             <button 
               onClick={() => setEventParams({...eventParams, type: 'Flood'})}
               className={clsx("px-3 py-1.5 text-xs font-bold rounded-lg transition-all", eventParams.type === 'Flood' ? "bg-blue-600 text-white" : "text-slate-500 hover:text-white")}
             >Flood</button>
             <button 
               onClick={() => setEventParams({...eventParams, type: 'Quake'})}
               className={clsx("px-3 py-1.5 text-xs font-bold rounded-lg transition-all", eventParams.type === 'Quake' ? "bg-orange-600 text-white" : "text-slate-500 hover:text-white")}
             >Quake</button>
             <button 
               onClick={() => setEventParams({...eventParams, type: 'Industrial'})}
               className={clsx("px-3 py-1.5 text-xs font-bold rounded-lg transition-all", eventParams.type === 'Industrial' ? "bg-red-600 text-white" : "text-slate-500 hover:text-white")}
             >Industrial</button>
          </div>

          <div className="h-10 w-px bg-white/10 mx-2" />

          {isRunning ? (
            <div className="flex items-center gap-3">
              <div className="font-mono text-2xl font-bold bg-white/5 border border-white/10 px-4 py-1 rounded-xl">
                 T+{Math.floor(simulationTime/60)}:{String(simulationTime%60).padStart(2,'0')}
              </div>
              <button 
                onClick={handleStop}
                className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.4)] active:scale-95 transition-all"
              >
                <Square size={16} fill="white" /> Terminate Operation
              </button>
            </div>
          ) : (
            <button 
              onClick={handleStart}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-95 transition-all"
            >
              <Play size={16} fill="white" /> Begin Live Operations
            </button>
          )}
        </div>
      </header>

      {/* ── MAIN CONTENT: STORYTELLING LAYOUT ── */}
      <div className="flex-1 flex flex-col lg:flex-row h-full min-h-0 relative">
        
        {/* LEFT: Massive Command Map (70%) */}
        <div className="flex-1 lg:flex-[3] relative h-full group">
           {/* PHASE OVERLAYS */}
           {demoPhase !== 'idle' && (
             <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
                <div className={clsx(
                  "px-8 py-3 rounded-2xl border-2 backdrop-blur-xl flex items-center gap-4 transition-all duration-700 shadow-2xl",
                  demoPhase === 'detect' ? "bg-red-600/30 border-red-500 scale-110 animate-bounce" :
                  demoPhase === 'triage' ? "bg-blue-600/30 border-blue-400" :
                  demoPhase === 'dispatch' ? "bg-emerald-600/30 border-emerald-400" :
                  demoPhase === 'success' ? "bg-emerald-500 border-white" : "bg-black/40 border-white/20"
                )}>
                   <Siren className={clsx("w-6 h-6", demoPhase === 'success' ? 'text-white' : 'text-red-500 animate-pulse')} />
                   <div className="text-center">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-black opacity-60">Operations Status</p>
                      <h2 className="text-xl font-black uppercase tracking-tighter">
                        {demoPhase === 'detect' && "Incident Detected • Awaiting Comms"}
                        {demoPhase === 'triage' && "AI Triage Engine Engaged"}
                        {demoPhase === 'dispatch' && "Autonomous Dispatch Active"}
                        {demoPhase === 'success' && "Mission Objective Achieved"}
                      </h2>
                   </div>
                </div>
             </div>
           )}

           {/* INSIGHT CARDS (Floating Perspective) */}
           <div className="absolute bottom-6 left-6 z-40 flex flex-col gap-4 max-w-sm pointer-events-none">
              {showInsight === 'govt' && (
                <div className="glass-panel border-blue-500/50 p-4 rounded-2xl animate-slide-in shadow-blue-500/20 shadow-2xl">
                   <div className="flex items-center gap-3 mb-2">
                      <Shield className="text-blue-400" size={20} />
                      <h4 className="font-bold uppercase text-xs">Gov Intel Dispatch</h4>
                   </div>
                   <p className="text-[10px] text-blue-100 leading-relaxed italic opacity-80">
                     "System is identifying hotspots and prioritizing life-critical requests using historical severity weighted algorithms."
                   </p>
                </div>
              )}
              {showInsight === 'vol' && (
                <div className="glass-panel border-emerald-500/50 p-4 rounded-2xl animate-slide-in shadow-emerald-500/20 shadow-2xl">
                   <div className="flex items-center gap-3 mb-2">
                      <HeartHandshake className="text-emerald-400" size={20} />
                      <h4 className="font-bold uppercase text-xs">Responder Sync</h4>
                   </div>
                   <p className="text-[10px] text-emerald-100 leading-relaxed italic opacity-80">
                     "3 verified medics matched to Sectors 4 and 9. AI Pathfinding active to avoid flood blockages."
                   </p>
                </div>
              )}
           </div>

           {/* LIVE MAP */}
           <LiveMap 
             needs={needs} 
             volunteers={volunteers} 
             ngos={ngos} 
             showEpicenter={demoPhase !== 'idle' ? { ...eventParams.location, radius: 1500 } : undefined}
             showDispatchLines={demoPhase === 'dispatch' || demoPhase === 'success'}
             center={eventParams.location}
             zoom={13}
           />
        </div>

        {/* RIGHT: High-Speed Intelligence Sidebar (25% / 300px) */}
        <div className="w-full lg:w-[400px] border-l border-white/10 bg-[#0F1117]/80 backdrop-blur-md flex flex-col min-h-0">
           <div className="p-4 border-b border-white/10 bg-black/40 flex justify-between items-center">
              <div className="flex items-center gap-2 text-emerald-400">
                 <Zap size={14} className="animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">Intel Feed</span>
              </div>
              <div className="bg-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-400">6.2ms Latency</div>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {/* STAKEHOLDER MINI-WIDGETS */}
              <div className="grid grid-cols-2 gap-2">
                 <div className="glass-panel p-3 border-blue-500/20">
                    <h5 className="text-[9px] uppercase font-bold text-blue-400 mb-1">Government</h5>
                    <div className="text-lg font-black">{needs.length}</div>
                    <div className="text-[8px] uppercase opacity-40">Active Cases</div>
                 </div>
                 <div className="glass-panel p-3 border-emerald-500/20">
                    <h5 className="text-[9px] uppercase font-bold text-emerald-400 mb-1">Resources</h5>
                    <div className="text-lg font-black">{needs.filter(n => n.status === 'completed').length}</div>
                    <div className="text-[8px] uppercase opacity-40">Resolved</div>
                 </div>
              </div>

              {/* ACTION FEED */}
              <div className="flex-1 flex flex-col min-h-0">
                 <h5 className="text-[10px] uppercase font-bold text-slate-500 mb-3 tracking-widest flex items-center gap-2">
                    <Radio size={12} /> Unit Dispatch Log
                 </h5>
                 <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                    {liveTicker.slice().reverse().map(t => (
                      <div key={t.id} className="flex gap-3 border-l-2 border-emerald-500/20 pl-3 py-1 group hover:border-emerald-500 transition-all">
                         <span className="text-[10px] font-mono text-emerald-500 font-bold shrink-0">{String(t.time).padStart(3,'0')}s</span>
                         <p className="text-[11px] text-slate-300 font-bold uppercase tracking-tighter leading-tight group-hover:text-white">{t.msg}</p>
                      </div>
                    ))}
                    {liveTicker.length === 0 && (
                      <div className="h-40 flex flex-col items-center justify-center text-center opacity-20">
                         <Compass className="w-8 h-8 mb-2 animate-spin-slow" />
                         <p className="text-[10px] uppercase font-bold tracking-widest">Awaiting Pulse</p>
                      </div>
                    )}
                 </div>
              </div>

              {/* NEXUS ORACLE: AI STRATEGIC DISPATCHER */}
              <div className="flex-1 glass-panel border-emerald-500/10 p-4 flex flex-col min-h-0 bg-emerald-500/5">
                 <NexusOracle latestNeedId={latestNeedId} isRunning={isRunning} />
              </div>
           </div>
        </div>

      </div>

      {/* ── FOOTER: LIVE TICKER ── */}
      <footer className="h-14 bg-[#0F1117] border-t border-white/10 flex items-center px-6 gap-6">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Live Global Ticker</span>
        </div>
        <div ref={tickerRef} className="flex-1 h-full overflow-hidden flex items-center">
           <div className="flex gap-10 animate-ticker whitespace-nowrap">
              {liveTicker.length === 0 && <span className="text-xs text-slate-700 uppercase font-bold tracking-widest">Waiting for simulation deployment...</span>}
              {liveTicker.slice(-5).map(t => (
                <div key={t.id} className="flex items-center gap-3">
                   <span className="text-[#10B981] font-mono text-[10px]">T+{t.time}</span>
                   <span className="text-xs text-slate-300 font-bold uppercase">{t.msg}</span>
                   <div className="w-1 h-1 bg-white/20 rounded-full" />
                </div>
              ))}
           </div>
        </div>
        <div className="shrink-0 flex items-center gap-4 border-l border-white/10 pl-6 h-full">
           <div className="flex items-center gap-2">
              <Globe size={14} className="text-blue-400" />
              <span className="text-[10px] font-bold text-slate-300 uppercase">{eventParams.location.name} Radar</span>
           </div>
           <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-orange-400" />
              <span className="text-[10px] font-bold text-slate-300 uppercase">SEV-LVL {eventParams.severity}</span>
           </div>
        </div>
      </footer>

      <style jsx>{`
        .animate-ticker {
          animation: slideTicker 10s linear infinite;
        }
        @keyframes slideTicker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-10%); }
        }
      `}</style>
    </div>
  );
}
