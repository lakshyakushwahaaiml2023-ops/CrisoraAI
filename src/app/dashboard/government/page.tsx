"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { useAppStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import { BrainCircuit, Send, PhoneCall, Radio, Activity, Users, HeartHandshake, AlertTriangle, Building2, Shield, LogOut, ShieldAlert, Zap, Target, TrendingUp } from 'lucide-react';
import { runPulseOracle, PulseOracleResponse } from '@/lib/agents';
import { LiveMap } from '@/components/Map';
import TacticalSitRep from '@/components/simulation/TacticalSitRep';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_USERS } from '@/lib/mock-data';
import { Need } from '@/lib/types';
import clsx from 'clsx';

export default function GovernmentDashboard() {
  const { currentUser, needs, volunteers, ngos, tasks, activeIncident, riskZones, announcements, addAnnouncement, isMassPanicActive } = useAppStore();
  const [mounted, setMounted] = useState(false);

  // Map layer visibility toggles
  const [showCivilians, setShowCivilians] = useState(true);
  const [showVolunteers, setShowVolunteers] = useState(true);
  const [showNGOs, setShowNGOs] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);

  // 🏛️ MASS PANIC DETECTION (Derived + Remote state)
  const isMassPanic = isMassPanicActive;

  // Convert victim MOCK_USERS into synthetic needs...
  const civilianUsers = MOCK_USERS.filter(u => u.role === 'victim');
  const civilianNeeds = showCivilians ? civilianUsers.map(u => ({
    id: `civ_loc_${u.id}`,
    reported_by: u.id,
    need_type: 'other' as const,
    urgency_level: 10,
    urgency_label: 'low' as const,
    people_affected: 1,
    location: u.location,
    status: 'pending' as const,
    created_at: new Date().toISOString(),
    description: `${u.name} · ${u.phone}`
  })) : [];
  
  // Warning Panel State
  const [msg, setMsg] = useState('');
  const [calling, setCalling] = useState(false);
  const [smsSending, setSmsSending] = useState(false);

  // AI Insights State (NDRS Strategic Advisor)
  const [advice, setAdvice] = useState<PulseOracleResponse | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // 🧠 AI Strategic Analysis Loop
    const resp = runPulseOracle(
      'government',
      currentUser,
      needs,
      volunteers,
      ngos,
      tasks,
      isMassPanicActive
    );
    setAdvice(resp);
  }, [needs.length, volunteers.length, tasks.length, isMassPanicActive, activeIncident]);

  if (!mounted) return null;

  // Broadcast Warning SMS Handlers
  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim() || smsSending) return;
    
    setSmsSending(true);
    
    // Add to local state announcements log
    addAnnouncement({
      id: `alert_${Date.now()}`,
      created_by: currentUser?.id || 'government',
      message: msg,
      urgency: 'critical',
      target_audience: 'all',
      created_at: new Date().toISOString()
    });

    // Output Warning SMS via Twilio endpoint
    try {
      await fetch('/api/notify/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'warning', message: msg })
      });
    } catch (e) {
      console.error('Gov SMS Failed', e);
    } finally {
      setSmsSending(false);
      setMsg('');
    }
  };

  const triggerCall = async () => {
    if (calling) return;
    setCalling(true);
    try {
      await fetch('/api/notify/call', { method: 'POST' });
    } catch (error) {
      console.error('AI Voice Call failed');
    }
    setTimeout(() => setCalling(false), 3000);
  };

  return (
    <DashboardLayout role="government">
      {/* 🏛️ RED ALERT OVERLAY */}
      <AnimatePresence>
        {isMassPanic && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[5000] pointer-events-none border-[20px] border-red-600/40 animate-pulse-slow shadow-[inset_0_0_100px_rgba(220,38,38,0.5)]"
          >
            <div className="absolute top-0 inset-x-0 bg-[#7f1d1d] border-b-2 border-red-600 py-2 px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle size={14} className="text-red-300 shrink-0" />
                <span className="text-[9px] font-bold text-red-200 uppercase tracking-[0.2em]">
                  Critical Mass Distress Detected — Alpha Priority Protocol Active
                </span>
              </div>
              <span className="text-[8px] font-mono text-red-400 uppercase tracking-widest shrink-0">Crisora · Sector 04</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col w-full h-screen overflow-hidden bg-[#0d1117] font-sans">
        
        {/* GOI TOP BAR */}
        <div className="bg-[#0a1628] border-b-4 border-[#c8922a] px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0 border-2 border-[#e6b04a] shadow-lg">
              <img src="/logo.png" alt="Crisora Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-0.5">
                Government of India — Ministry of Home Affairs
              </p>
              <h1 className="text-base font-bold text-slate-100 tracking-wide font-serif">
                Crisora Strategic Command Centre
                <span className="ml-2 text-[#c8922a] font-black text-sm">· NEXUS</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  System Operational · Sector 04
                </span>
              </div>
              <span className="text-[9px] font-mono text-slate-600">
                {currentUser?.name || 'Commander'} · NODE_{currentUser?.id?.slice(0,6) || 'ALPHA'}
              </span>
            </div>
            <button
              onClick={() => { useAppStore.getState().setCurrentUser(null); window.location.href = '/'; }}
              className="px-4 py-2 bg-[#1e2d3d] hover:bg-[#2d3f55] border border-[#2d3f55] text-slate-400 hover:text-white font-bold text-[9px] uppercase tracking-widest rounded transition-colors flex items-center gap-2"
            >
              <LogOut size={13} /> Sign Out
            </button>
          </div>
        </div>

        {/* SECONDARY NAV */}
        <div className="bg-[#101a27] border-b border-[#1e2d3d] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-0 overflow-x-auto">
            {['Situational Map', 'Priority Dispatch', 'Broadcast', 'Field Units', 'Helpline: 1078'].map((item, i) => (
              <div key={item} className={clsx(
                "px-4 py-3 text-[9px] font-bold uppercase tracking-widest whitespace-nowrap border-b-2 transition-colors",
                i === 0 ? "text-[#c8922a] border-[#c8922a]" : "text-slate-600 border-transparent"
              )}>
                {item}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 shrink-0 pl-4">
            <button 
              onClick={() => {
                const dummyNeed = {
                  id: 'sim_trigger',
                  reported_by: 'system',
                  need_type: 'rescue' as const,
                  urgency_level: 95,
                  urgency_label: 'critical' as const,
                  people_affected: 1,
                  location: activeIncident?.location || { lat: 22.7196, lng: 75.8577 }, // Default to Indore cluster
                  status: 'pending' as const,
                  created_at: new Date().toISOString()
                };
                useAppStore.getState().triggerPanic(dummyNeed);
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-950/20 hover:bg-red-900/40 border border-red-900/30 rounded transition-all group"
            >
              <Activity size={13} className="text-red-500 group-hover:scale-110" />
              <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest uppercase">Simulate Crisis</span>
            </button>
            <div className="h-4 w-px bg-[#1e2d3d]" />
            <div className="flex items-center gap-2">
              <BrainCircuit size={13} className="text-blue-400" />
              <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest hidden md:block">AI Advisory Active</span>
            </div>
          </div>
        </div>


        {/* 🗺️ SPLIT COMMAND CENTER (GIS OPTIMIZED) */}
        <div className="flex-1 flex flex-row overflow-hidden">
          
          {/* LARGE COMMAND MAP (PRIMARY DROPORTIONS) */}
          <div className="flex-1 bg-[#080d14] overflow-hidden relative">
             {/* Map Header Overlay */}
             <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-3">
                <div className="bg-[#0a1628]/90 backdrop-blur border border-[#c8922a]/40 px-4 py-2 rounded flex flex-col gap-1">
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.18em]">
                    Ministry of Home Affairs
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-bold text-slate-200 tracking-wide font-serif">
                      Crisora · Sector 04 · Live Feed
                    </span>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {[
                    { active: showCivilians, toggle: () => setShowCivilians(p => !p), label: 'CIV', color: 'text-red-400', activeBg: 'bg-red-900/40 border-red-800' },
                    { active: showVolunteers, toggle: () => setShowVolunteers(p => !p), label: 'VOL', color: 'text-emerald-400', activeBg: 'bg-emerald-900/40 border-emerald-800' },
                    { active: showNGOs, toggle: () => setShowNGOs(p => !p), label: 'NGO', color: 'text-amber-400', activeBg: 'bg-amber-900/40 border-amber-800' },
                  ].map(btn => (
                    <button
                      key={btn.label}
                      onClick={btn.toggle}
                      className={clsx(
                        "px-3 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest border transition-all",
                        btn.active ? `${btn.activeBg} ${btn.color}` : "bg-[#0a1628]/80 border-[#1e2d3d] text-slate-700"
                      )}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

             <div className="w-full h-full grayscale-[40%] contrast-125 brightness-90 saturate-150">
               <LiveMap 
                  needs={[...needs, ...civilianNeeds]}
                  volunteers={showVolunteers ? volunteers : []}
                  ngos={showNGOs ? ngos : []}
                  riskZones={riskZones}
                  center={activeIncident?.location}
                  zoom={14}
               />
             </div>
          </div>

          {/* COMPACT CONTROL HUB */}
          {/* MISSION INTELLIGENCE & CONTROL SIDEBAR */}
          <div className="w-[400px] flex flex-col shrink-0 bg-[#0d1117] border-l border-[#1e2d3d] overflow-y-auto custom-scrollbar">
             
             {/* 🎖️ LIVE STATS TICKER (SIDEBAR VERTICAL) */}
             <div className="grid grid-cols-2 border-b border-[#1e2d3d] bg-[#0c131c]">
                {[
                    { label: 'Active Incidents', value: needs.filter(n => n.urgency_level > 80).length, color: 'text-red-400' },
                    { label: 'Pending Needs', value: needs.filter(n => n.status === 'pending').length, color: 'text-amber-400' },
                    { label: 'Volunteers Ready', value: volunteers.filter(v => v.online).length, color: 'text-emerald-400' },
                    { label: 'NGO Units Active', value: ngos.length, color: 'text-blue-400' },
                ].map((stat, i) => (
                    <div key={i} className="py-4 px-5 border-b border-r border-[#1e2d3d] last:border-b-0 text-center bg-[#0a1628]/40">
                        <div className={clsx("text-lg font-black", stat.color)}>{stat.value}</div>
                        <div className="text-[7px] text-slate-600 uppercase tracking-widest font-black mt-1">{stat.label}</div>
                    </div>
                ))}
             </div>

             {/* 🧠 AI PREDICTIVE INTELLIGENCE (SIDEBAR COMPACT) */}
             <div className="p-5 border-b border-[#1e2d3d] bg-[#0c131c]/50">
                <div className="flex items-center gap-2 mb-5">
                    <BrainCircuit size={14} className="text-[#c8922a]" />
                    <h3 className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Risk Analysis Sentinel</h3>
                </div>
                
                <div className="flex items-center gap-6 mb-6">
                    <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full -rotate-90">
                            <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-800" />
                            <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" 
                                    className={clsx(
                                        "transition-all duration-1000",
                                        useAppStore.getState().prognosticData.score >= 70 ? "text-red-500" : "text-[#c8922a]"
                                    )}
                                    strokeDasharray={226}
                                    strokeDashoffset={226 - (226 * useAppStore.getState().prognosticData.score) / 100}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-lg font-black text-white">{useAppStore.getState().prognosticData.score}%</span>
                        </div>
                    </div>
                    <div className="flex-1 space-y-2">
                        {Object.entries(useAppStore.getState().prognosticData.breakdown).map(([key, val]) => (
                            <div key={key}>
                                <div className="flex justify-between text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1">
                                    <span>{key}</span>
                                    <span>{val}%</span>
                                </div>
                                <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${val}%` }} className="h-full bg-blue-500/40" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-3 mt-4 bg-[#080d14] p-4 rounded-xl border border-blue-500/20">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Target size={12} className="text-blue-400" />
                            <span className="text-[7px] font-black text-blue-500 uppercase tracking-widest">Neural Reasoning Path</span>
                        </div>
                        <span className="text-[6px] font-mono text-slate-700">Sentinel_v4.2</span>
                    </div>
                    <p className="text-[10px] text-slate-300 font-bold italic leading-relaxed border-l-2 border-blue-500/40 pl-3">
                        "{advice?.message || 'Analyzing mission vectors...'}"
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                       <TrendingUp size={10} className="text-emerald-500" />
                       <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">Simulated Impact: +12% Efficiency</span>
                    </div>
                </div>
             </div>

             {/* 📰 AI ADVISORY TICKER (ACTIVE SUGGESTIONS) */}
             <div className="bg-[#0f1923] border-b border-[#1e2d3d] px-5 py-5 flex flex-col gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ShieldAlert size={14} className="text-blue-400 animate-pulse" />
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em]">Strategic AI Suggestion</span>
                    </div>
                </div>
                
                {advice?.suggestion ? (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                    <p className="text-sm font-bold text-slate-200 leading-snug">
                       {advice.suggestion.label} Plan Initialized
                    </p>
                    <button 
                      onClick={() => {
                        const { type, payload } = advice.suggestion!;
                        if (type === 'broadcast') {
                          setMsg(payload.message);
                        }
                        // Manual activation required for safety
                      }}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Zap size={14} /> Stage Action Directive
                    </button>
                  </div>
                ) : (
                  <div className="py-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                       Neural engine at baseline. <br/> No critical deviations suggested.
                    </p>
                  </div>
                )}
             </div>
             
             {/* REGISTRY: MISSION PRIORITY */}
             <div className="flex-1 flex flex-col overflow-hidden border-b border-[#1e2d3d]">
                <div className="px-5 py-3 border-b border-[#1e2d3d] bg-[#0a1628] flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <Radio size={13} className="text-[#c8922a]" />
                    <h3 className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.18em]">
                      Priority Dispatch Registry
                    </h3>
                  </div>
                  <span className="text-[7px] font-bold text-slate-600 bg-[#1e2d3d] px-2 py-0.5 rounded border border-[#2d3f55] uppercase tracking-widest">
                    Auto-Sync
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                  {needs.filter(n => n.status === 'pending').sort((a,b) => (b.triage_score || 0) - (a.triage_score || 0)).slice(0, 6).map(need => (
                    <div key={need.id} className="bg-[#0f1923] border border-[#1e2d3d] hover:border-[#c8922a]/40 p-4 rounded transition-all group">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <div className={clsx(
                            "w-9 h-9 rounded border flex items-center justify-center font-bold text-xs transition-transform group-hover:scale-105",
                            (need.triage_score || 0) >= 80 ? "bg-red-900/40 text-red-400 border-red-800" : "bg-blue-900/40 text-blue-400 border-blue-800"
                          )}>
                            {need.triage_score || '--'}
                          </div>
                          <div>
                            <h4 className="text-[11px] font-bold text-slate-200 uppercase tracking-wide capitalize font-serif">
                              {need.need_type} Assistance
                            </h4>
                            <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">
                              Sector 04 · ID {need.id.slice(-4).toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-200">{need.people_affected} PAX</p>
                        </div>
                      </div>
                      <div className="flex gap-1.5 pt-2 border-t border-[#1e2d3d]">
                        {need.urgency_label === 'critical' && (
                          <span className="px-2 py-0.5 bg-red-900/40 text-red-400 text-[7px] font-bold rounded border border-red-800 uppercase tracking-wider">
                            Alpha Priority
                          </span>
                        )}
                        {(need.triage_score || 0) >= 50 && (
                          <span className="px-2 py-0.5 bg-[#1e3a5f] text-[#7eb3e8] text-[7px] font-bold rounded border border-[#2d5a8e] uppercase tracking-wider">
                            Extrication Req.
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
             </div>

             {/* EMERGENCY TOOLKIT: ACTION DRAWER */}
             <div className="bg-[#0a1628] border-t border-[#1e2d3d] p-5 flex flex-col gap-4 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert size={14} className="text-[#c8922a]" />
                    <h3 className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.18em]">
                      Emergency Broadcast
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {isMassPanic && (
                      <button 
                        onClick={() => useAppStore.getState().setMassPanicActive(false)}
                        className="flex items-center gap-1.5 bg-emerald-900/30 px-2 py-0.5 rounded border border-emerald-800 hover:bg-emerald-800/40 transition-colors"
                      >
                        <Zap size={10} className="text-emerald-400" />
                        <span className="text-[7px] font-bold text-emerald-400 uppercase tracking-widest">Stand Down</span>
                      </button>
                    )}
                    <div className="flex items-center gap-1.5 bg-red-900/30 px-2 py-0.5 rounded border border-red-800">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                      <span className="text-[7px] font-bold text-red-400 uppercase tracking-widest">Armed</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={triggerCall}
                    disabled={calling}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#7f1d1d] hover:bg-[#991b1b] border border-[#dc2626]/40 text-red-300 font-bold text-[9px] uppercase tracking-widest rounded transition-colors disabled:opacity-50"
                  >
                    <PhoneCall size={13} className={calling ? 'animate-spin' : ''} />
                    {calling ? 'Transmitting' : 'Voice Override'}
                  </button>
                  <button
                    onClick={() => { useAppStore.getState().setCurrentUser(null); window.location.href = '/'; }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1e2d3d] hover:bg-[#2d3f55] border border-[#2d3f55] text-slate-400 font-bold text-[9px] uppercase tracking-widest rounded transition-colors"
                  >
                    <LogOut size={13} /> Exit Sim
                  </button>
                </div>

                <textarea
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Enter global broadcast directive..."
                  className="w-full bg-[#0f1923] border border-[#1e2d3d] focus:border-[#c8922a] rounded p-4 text-xs text-slate-300 font-mono min-h-[80px] resize-none outline-none placeholder:text-slate-700 transition-colors"
                />

                <button
                  onClick={handleBroadcast}
                  disabled={!msg.trim() || smsSending}
                  className="w-full bg-[#c8922a] hover:bg-[#e6b04a] disabled:opacity-30 disabled:cursor-not-allowed text-[#0a1628] font-bold py-3 rounded text-[10px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-colors active:scale-95"
                >
                  <Send size={14} /> {smsSending ? 'Broadcasting...' : 'Initiate SMS Relay'}
                </button>
              </div>
          </div>

        </div>
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e2d3d; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #2d3f55; }
      `}</style>
    </DashboardLayout>
  );
}
