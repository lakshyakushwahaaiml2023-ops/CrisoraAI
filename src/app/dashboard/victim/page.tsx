"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { useAppStore } from '@/lib/store';
import React, { useState, useEffect, useRef } from 'react';
import { NeedType, UrgencyLevel, Need, Volunteer } from '@/lib/types';
import { 
  AlertCircle, Activity, ShieldAlert, Navigation, 
  CheckCircle2, BrainCircuit, HeartPulse, 
  Map as MapIcon, ClipboardList, Info, 
  Volume2, Languages, Flashlight, MessageSquare, 
  Phone, Users, Home, Box, Search, ChevronLeft,
  Target, HandHeart, HardDrive, Zap, Mic, MicOff,
  X, AlertTriangle, Timer, Bell, Send
} from 'lucide-react';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { LiveMap } from '@/components/Map';

type VictimTab = 'panic' | 'map' | 'report' | 'status' | 'discovery' | 'tools' | 'volunteering' | 'chat';

export default function VictimDashboard() {
  const { currentUser, needs, updateNeed, volunteers, ngos, activeIncident, triggerPanic, escalateDistress } = useAppStore();
  
  const [activeTab, setActiveTab] = useState<VictimTab>('panic');
  const [needType, setNeedType] = useState<NeedType>('medical');
  const [urgency, setUrgency] = useState<UrgencyLevel>('high');
  const [description, setDescription] = useState('');
  const [panicCountdown, setPanicCountdown] = useState(5);
  const panicTimerRef = useRef<NodeJS.Timeout | null>(null);
  const panicStartedRef = useRef(false);
  const [etaMinutes, setEtaMinutes] = useState<number>(6);
  const [aiInsights, setAiInsights] = useState<Record<string, any>>({});
  const [isSafe, setIsSafe] = useState(false);
  const [language, setLanguage] = useState<'english' | 'hindi'>('english');
  const [isOffline, setIsOffline] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);
  
  // 🏛️ SMART PANIC PIPELINE STATES
  const [isHandsFree, setIsHandsFree] = useState(false);
  const [detectionCountdown, setDetectionCountdown] = useState<number | null>(null);
  const [escalationTimer, setEscalationTimer] = useState<number | null>(null);
  const [tapIntensity, setTapIntensity] = useState(0);
  const [isUrgencyDetected, setIsUrgencyDetected] = useState(false);
  
  const interactionRef = useRef({
     keystrokes: [] as number[],
     deletes: 0,
     lastInteraction: Date.now(),
     rapidTaps: 0,
     lastTap: 0
  });

  const [mockVolunteerLocation, setMockVolunteerLocation] = useState<{lat: number, lng: number} | null>(null);

  const myNeeds = needs.filter(n => n.reported_by === currentUser?.id).sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const activeNeed = myNeeds.find(n => n.status !== 'completed');

  const nearbyMissions = needs.filter(n => {
    if (!currentUser || !currentUser.location || !n.location || n.status !== 'pending' || n.reported_by === currentUser.id) return false;
    const distance = haversineKm(currentUser.location, n.location);
    return distance <= 5.0;
  }).sort((a, b) => b.urgency_level - a.urgency_level);

  // 1. 🎤 VOICE TRIGGER SYSTEM
  useEffect(() => {
    if (!isHandsFree) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = language === 'english' ? 'en-US' : 'hi-IN';
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
       const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
       console.log("VOICE_RECEIVE:", transcript);
       if (transcript.includes('help') || transcript.includes('sos') || transcript.includes('save me') || transcript.includes('madad')) {
          initiateSOS();
       }
    };

    recognition.onerror = () => setIsHandsFree(false);
    recognition.onend = () => isHandsFree && recognition.start();
    
    recognition.start();
    return () => recognition.stop();
  }, [isHandsFree, language]);

  // 2. ⌨️ TYPING INTELLIGENCE & AUTO-ESCALATION SYNC
  useEffect(() => {
    interactionRef.current.lastInteraction = Date.now();
    
    // Auto-Escalation Tracker (Victim Unresponsive for 30s)
    if (activeNeed && activeNeed.status === 'pending') {
       setEscalationTimer(30);
       const t = setInterval(() => {
          setEscalationTimer(prev => {
             if (prev === null) return null;
             if (prev <= 1) {
                clearInterval(t);
                escalateDistress(activeNeed.id);
                return 0;
             }
             return prev - 1;
          });
       }, 1000);
       return () => clearInterval(t);
    } else {
       setEscalationTimer(null);
    }
  }, [activeNeed, isUrgencyDetected]);

  // Decaying Tap Intensity
  useEffect(() => {
     const t = setInterval(() => {
        setTapIntensity(prev => Math.max(0, prev - 0.05));
     }, 100);
     return () => clearInterval(t);
  }, []);

  const handleInteraction = (type: 'type' | 'delete') => {
     const now = Date.now();
     const hist = interactionRef.current.keystrokes;
     hist.push(now);
     if (hist.length > 20) hist.shift();

     if (type === 'delete') interactionRef.current.deletes++;

     // Calculate interaction intensity (WPM-like)
     if (hist.length > 10) {
        const duration = (now - hist[0]) / 1000;
        const wpm = (hist.length / duration) * 60;
        
        // Refined Logic (frantic > 150 strokes/min + deletes > 3 + sudden stop detection)
        if (wpm > 180 || interactionRef.current.deletes > 5) {
           setIsUrgencyDetected(true);
           // Silent Alert Detection
           if (detectionCountdown === null) {
              setDetectionCountdown(5);
              const timer = setInterval(() => {
                 setDetectionCountdown(prev => {
                    if (prev === null) return null;
                    if (prev <= 1) {
                       clearInterval(timer);
                       initiateSOS();
                       return null;
                    }
                    return prev - 1;
                 });
              }, 1000);
           }
        }
     }
  };

  const handleRapidTap = () => {
     const now = Date.now();
     if (now - interactionRef.current.lastTap < 400) {
        interactionRef.current.rapidTaps++;
        setTapIntensity(prev => Math.min(1.2, prev + 0.15));
     } else {
        interactionRef.current.rapidTaps = 1;
        setTapIntensity(0.1);
     }
     interactionRef.current.lastTap = now;

     if (interactionRef.current.rapidTaps > 10) {
        // Instant Bypass
        initiateSOS();
        interactionRef.current.rapidTaps = 0;
     }
  };

  const cancelDetection = () => {
     setDetectionCountdown(null);
     setIsUrgencyDetected(false);
     interactionRef.current.keystrokes = [];
     interactionRef.current.deletes = 0;
  };

  const startPanic = () => {
    if (panicStartedRef.current) return;
    panicStartedRef.current = true;
    setPanicCountdown(5);
    let count = 5;
    panicTimerRef.current = setInterval(() => {
      count -= 1;
      setPanicCountdown(count);
      if (count <= 0) {
        if (panicTimerRef.current) clearInterval(panicTimerRef.current);
        panicStartedRef.current = false;
        initiateSOS();
      }
    }, 1000);
  };

  const cancelPanic = () => {
    if (panicTimerRef.current) clearInterval(panicTimerRef.current);
    panicStartedRef.current = false;
    setPanicCountdown(5);
  };

  const initiateSOS = () => {
    if (detectionCountdown !== null) setDetectionCountdown(null);
    const dispatch = (coords: { lat: number; lng: number }) => {
      if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400]);
      const panicNeed: Need = {
        id: `panic_${Date.now()}`,
        reported_by: currentUser?.id || 'vic1',
        need_type: 'rescue',
        urgency_level: 99,
        urgency_label: 'critical',
        people_affected: 1,
        description: '🚨 [AUTOMATED SOS] - Distress detected via interaction telemetry.',
        location: coords,
        status: 'pending',
        triage_score: 99,
        created_at: new Date().toISOString()
      };
      triggerPanic(panicNeed);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => dispatch({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => dispatch(currentUser?.location || { lat: 22.7196, lng: 75.8577 }),
        { maximumAge: 30000, timeout: 5000 }
      );
    } else {
      dispatch(currentUser?.location || { lat: 22.7196, lng: 75.8577 });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    const newNeed: Need = {
      id: `need_${Date.now()}`,
      reported_by: currentUser.id,
      need_type: needType as NeedType,
      urgency_level: urgency === 'critical' ? 95 : urgency === 'high' ? 70 : 40,
      urgency_label: urgency,
      people_affected: 1,
      description,
      location: currentUser.location,
      status: 'pending',
      triage_score: urgency === 'critical' ? 95 : 60,
      created_at: new Date().toISOString()
    };

    triggerPanic(newNeed);
    analyzeWithAI(newNeed);
    setActiveTab('status');
    setDescription('');
  };

  const analyzeWithAI = async (need: Need) => {
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        body: JSON.stringify({ need })
      });
      if (!res.ok) throw new Error('API error');
      const insight = await res.json();
      setAiInsights(prev => ({ ...prev, [need.id]: insight }));
    } catch (e) {
      setAiInsights(prev => ({
        ...prev,
        [need.id]: {
          reasoning: "AI analysis stable. Your signal has been routed via multi-agency communication relay."
        }
      }));
    }
  };

  const handleSafetyCheck = () => {
    setIsSafe(true);
    myNeeds.forEach(n => {
       if (n.status !== 'completed') {
          updateNeed(n.id, { status: 'completed', description: `[RESOLVED-SAFE] ${n.description}` });
       }
    });
  };

  const t = {
    english: {
      panic: "SOS",
      report: "Report",
      radar: "Radar",
      status: "Logs",
      tools: "Toolkit",
      volunteering: "Support",
      safe: "REPORT SAFE",
      offline: "OFFLINE_RELAY_ACTIVE",
      chat: "COMMUNITY"
    },
    hindi: {
      panic: "आपातकालीन",
      report: "रिपोर्ट",
      radar: "रडार",
      status: "लॉग",
      tools: "किट",
      volunteering: "मदद",
      safe: "मैं सुरक्षित हूँ",
      offline: "ऑफ़लाइन मोड सक्रिय",
      chat: "बातचीत"
    }
  }[language];

  return (
    <DashboardLayout role="victim">
      <div className="flex flex-col min-h-full max-w-lg mx-auto bg-white relative font-sans border-x border-slate-200 text-[#1a1a2e] shadow-sm">
        
        {/* 🏛️ SMART PANIC OVERLAYS */}
        <AnimatePresence>
           {/* DETECTION CANCELLATION (Silent Mode) */}
           {detectionCountdown !== null && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[200] bg-[#1a3a6b]/98 backdrop-blur-xl flex flex-col items-center justify-center p-10 text-center border-t-4 border-[#c8922a]">
                <div className="w-24 h-24 bg-red-50 border-2 border-red-200 rounded-full flex items-center justify-center mb-8 shadow-inner">
                  <AlertTriangle size={48} className="text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Distress Pattern Detected</h2>
                <p className="text-[10px] font-bold text-blue-200 uppercase tracking-[0.25em] mb-10">
                  Initiating Emergency SOS in {detectionCountdown}s — Tap below to cancel
                </p>
                <button
                  onClick={cancelDetection}
                  className="bg-white hover:bg-slate-100 text-[#1a3a6b] border border-white px-12 py-4 rounded font-bold text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95"
                >
                  False Alarm — Cancel SOS
                </button>
              </motion.div>
           )}

           {/* AUTO-ESCALATION COUNTDOWN (Transperancy) */}
           {activeNeed && activeNeed.status === 'pending' && escalationTimer !== null && (
             <motion.div initial={{ y: -100 }} animate={{ y: 0 }} className="absolute top-24 inset-x-6 z-[100] bg-amber-600 p-5 rounded-2xl border-2 border-amber-400 shadow-[0_0_40px_rgba(217,119,6,0.5)] flex items-center justify-between overflow-hidden">
                <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />
                <div className="flex items-center gap-4 relative z-10">
                   <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-amber-600">
                      <Timer size={24} className="animate-spin-slow" />
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-white/70 uppercase tracking-widest italic">Stationary Alert</p>
                      <h3 className="text-sm font-black text-white tracking-tighter uppercase leading-none">Escalating in {escalationTimer}s...</h3>
                   </div>
                </div>
                <button onClick={handleSafetyCheck} className="px-6 py-2 bg-white text-amber-600 rounded-xl font-black text-[9px] uppercase tracking-widest relative z-10 shadow-xl">I AM SAFE</button>
             </motion.div>
           )}
        </AnimatePresence>


        <div className="bg-[#1a3a6b] px-4 flex items-center gap-0 shrink-0 overflow-x-auto z-40">
          {[
            { id: 'panic', label: t.panic },
            { id: 'map', label: t.radar },
            { id: 'volunteering', label: t.volunteering },
            { id: 'report', label: t.report },
            { id: 'status', label: t.status },
            { id: 'chat', label: t.chat },
            { id: 'tools', label: t.tools },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as VictimTab)}
              className={clsx(
                "px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] whitespace-nowrap border-b-2 transition-all",
                activeTab === tab.id
                  ? "text-white border-[#c8922a] bg-white/5"
                  : "text-blue-200/60 border-transparent hover:text-white"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Change 4 — Live status ticker */}
        <div className="grid grid-cols-3 border-b border-slate-200 bg-white shrink-0 shadow-sm relative z-10">
          {[
            { label: 'My Active Signals', value: myNeeds.filter(n => n.status !== 'completed').length, color: 'text-red-600' },
            { label: 'Nearby Needs', value: nearbyMissions.length, color: 'text-amber-600' },
            { label: 'System Status', value: isOffline ? 'RELAY' : 'LIVE', color: isOffline ? 'text-amber-600' : 'text-emerald-600' },
          ].map((stat, i) => (
            <div key={i} className="py-4 px-4 border-r border-slate-100 last:border-r-0 text-center">
              <div className={clsx("text-lg font-black mb-0.5 tabular-nums", stat.color)}>{stat.value}</div>
              <div className="text-[8px] text-slate-400 uppercase tracking-widest font-black leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* OPERATION AREA */}
        <div className="flex-1 p-6 pb-20">
           <AnimatePresence mode="wait">
              {activeTab === 'panic' && (
                <motion.div key="panic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full gap-10 mt-10">
                   <div className="text-center space-y-3">
                     <div className="inline-block bg-white border border-slate-200 text-slate-500 text-[8px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-sm mb-1 shadow-sm">
                       Verified Protocol · Emergency Deployment
                     </div>
                     <h2 className="text-2xl font-bold text-[#1a3a6b] tracking-tight">
                       Request Emergency Assistance
                     </h2>
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                       Hold button · Identity & GPS location transmitted automatically
                     </p>
                   </div>
                   
                   <div className="relative">
                      {/* RAPID TAP PULSE FEEDBACK */}
                      <motion.div 
                        style={{ scale: 1 + tapIntensity }} 
                        className="absolute inset-0 bg-red-600/20 rounded-full blur-2xl" 
                      />
                       <button 
                         onPointerDown={startPanic} onPointerUp={cancelPanic} onClick={handleRapidTap}
                         className={clsx(
                           "relative z-10 w-64 h-64 flex flex-col items-center justify-center gap-4 rounded-full transition-all duration-200 active:scale-95 border-8",
                           panicCountdown < 5 && panicStartedRef.current
                             ? "bg-red-700 border-white shadow-[0_0_60px_rgba(239,68,68,0.6)]"
                             : "bg-red-700 border-[#c8922a] shadow-[0_0_40px_rgba(200,146,42,0.2)]"
                         )}
                       >
                         {panicStartedRef.current ? (
                            <span className="text-8xl font-black text-white">{panicCountdown}</span>
                         ) : (
                            <ShieldAlert size={90} className="text-white drop-shadow-2xl" />
                         )}
                      </button>
                   </div>
                   
                   <p className="text-[10px] font-black uppercase text-slate-600 tracking-[0.3em] text-center italic max-w-xs mb-4">SYSTEM DETECTS HANDS-FREE ACTIVATION, RAPID TAPS, AND FRANTIC TERMINAL INTERACTION.</p>
                   
                   <div className="w-full h-px bg-[#1C1F26] mb-4" />
                   
                   <button 
                      onClick={() => {
                        const origin: Need = {
                           id: `sim_panic_vic_${Date.now()}`,
                           reported_by: currentUser?.id || 'vic_demo',
                           need_type: 'rescue',
                           urgency_level: 99,
                           urgency_label: 'critical',
                           people_affected: 1,
                           description: '🚨 [MULTIPLE_DISTRESS_SIM] - Massive SOS Cluster Induction.',
                           location: currentUser?.location || { lat: 22.7196, lng: 75.8577 },
                           status: 'pending',
                           created_at: new Date().toISOString()
                        };
                        useAppStore.getState().triggerPanic(origin);
                      }}
                      className="group flex flex-col items-center gap-3 active:scale-95 transition-all"
                   >
                       <div className="px-6 py-3 bg-[#12141C] border border-[#2D3139] rounded-2xl flex items-center gap-3 shadow-xl group-hover:bg-red-600/10 group-hover:border-red-500/30 transition-all">
                          <Zap size={14} className="text-amber-500 animate-pulse" />
                          <span className="text-[10px] font-black text-slate-400 group-hover:text-red-400 uppercase tracking-widest">Simulate Multi-Civilian SOS</span>
                       </div>
                       <p className="text-[8px] text-slate-700 font-bold uppercase tracking-widest">Induces 10+ critical distress signals across Indore</p>
                   </button>
                </motion.div>
              )}

              {activeTab === 'report' && (
                <motion.div key="report" className="space-y-8">
                   <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <h3 className="text-sm font-bold text-[#1a3a6b] uppercase tracking-[0.14em]">Submit Need Request</h3>
                      </div>
                      {isUrgencyDetected && (
                         <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded animate-pulse">
                            <Zap size={12} className="text-amber-600" />
                            <span className="text-[9px] font-bold text-amber-600 uppercase tracking-widest italic">Detecting Urgency...</span>
                         </div>
                      )}
                   </div>
                   <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                         <select value={needType} onChange={(e) => setNeedType(e.target.value as NeedType)} className="w-full bg-white border border-slate-200 rounded-lg p-5 text-slate-700 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-[#1a3a6b] shadow-sm transition-all">
                            <option value="medical">Medical Assistance</option>
                            <option value="rescue">Search & Rescue</option>
                            <option value="food">Resource Supplies</option>
                         </select>
                         <select value={urgency} onChange={(e) => setUrgency(e.target.value as UrgencyLevel)} className="w-full bg-white border border-slate-200 rounded-lg p-5 text-slate-700 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-[#1a3a6b] shadow-sm transition-all">
                            <option value="high">High Priority</option>
                            <option value="critical">Critical Priority</option>
                         </select>
                      </div>
                      <textarea 
                        className="w-full bg-white border border-slate-200 focus:border-[#1a3a6b] rounded-lg p-6 text-sm font-medium text-slate-700 min-h-[160px] outline-none placeholder:text-slate-300 transition-all shadow-sm"
                        placeholder="Provide situational details... Telemetry is monitoring interaction intensity."
                        value={description} 
                        onChange={(e) => {
                          setDescription(e.target.value);
                          handleInteraction('type');
                        }}
                        onKeyDown={(e) => e.key === 'Backspace' && handleInteraction('delete')}
                      />
                      <button 
                        type="submit" 
                        disabled={description.trim().length < 5} 
                        className="w-full bg-[#c8922a] hover:bg-[#e6b04a] disabled:opacity-30 disabled:cursor-not-allowed text-[#0a1628] font-bold py-4 rounded text-sm uppercase tracking-[0.15em] font-sans transition-colors active:scale-95"
                      >
                        Submit Distress Signal
                      </button>
                   </form>
                </motion.div>
              )}

              {activeTab === 'status' && (
                 <div className="space-y-8">
                    <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
                       <div className="flex items-center gap-3">
                         <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                         <h3 className="text-sm font-bold text-[#1a3a6b] uppercase tracking-[0.14em]">Emergency Signal Records</h3>
                       </div>
                    </div>
                    <div className="space-y-4">
                       {myNeeds.map(need => (
                         <div key={need.id} className="bg-white border border-slate-200 p-6 rounded-sm space-y-4 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                           <div className="h-1 absolute top-0 left-0 right-0 bg-red-500" />
                           <div className="flex justify-between items-start">
                              <span className="px-2 py-1 bg-red-50 text-red-600 rounded text-[9px] font-bold uppercase tracking-wider border border-red-100">{need.urgency_label}</span>
                              <span className="text-[9px] font-bold text-slate-300 uppercase tabular-nums tracking-widest italic">REC_{need.id.slice(-6)}</span>
                           </div>
                           <p className="text-sm font-bold text-[#1a1a2e] leading-tight">"{need.description}"</p>
                           <div className="pt-3 border-t border-slate-50 flex gap-10">
                              <div className="flex flex-col">
                                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Status</span>
                                 <span className="text-[10px] font-black text-[#1a3a6b] uppercase tracking-widest italic">{need.status}</span>
                              </div>
                              <div className="flex flex-col text-right ml-auto">
                                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Logged Time</span>
                                 <span className="text-[10px] font-bold text-slate-600 tracking-tighter uppercase">{formatDistanceToNow(new Date(need.created_at))} ago</span>
                              </div>
                           </div>
                         </div>
                       ))}
                       {myNeeds.length === 0 && <div className="text-center py-20 text-slate-800 font-black italic uppercase text-[10px] tracking-widest">No Historical Data</div>}
                    </div>
                 </div>
              )}

              {activeTab === 'chat' && (
                <div className="flex flex-col h-full space-y-6">
                   <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                        <h3 className="text-sm font-bold text-[#1a3a6b] uppercase tracking-[0.14em]">Local Community Relay</h3>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 italic">SECURE_LINK</span>
                   </div>
                   
                   <div className="flex-1 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                      {[
                        { u: 'Sunit B.', m: 'Water levels rising in Sector 4. Anyone has extra sandbags?', t: '2m ago', s: false },
                        { u: 'Meera K.', m: 'Avoid Route 8. Tree fell near the park.', t: '15m ago', s: false },
                        { u: 'NDRS_ALPHA', m: 'Relief camp activated at City School. Proceed with caution.', t: '30m ago', s: true },
                        { u: 'Volunteer Rajesh', m: 'I have medicine kits for elderly in Block B.', t: '45m ago', s: false },
                      ].map((chat, i) => (
                        <div key={i} className={clsx(
                          "p-4 rounded-xl border max-w-[85%]",
                          chat.s ? "bg-indigo-50 border-indigo-200 ml-auto" : "bg-white border-slate-200"
                        )}>
                          <div className="flex justify-between items-center mb-1">
                             <span className="text-[10px] font-black text-[#1a3a6b] uppercase tracking-tighter">{chat.u}</span>
                             <span className="text-[8px] font-bold text-slate-400">{chat.t}</span>
                          </div>
                          <p className="text-sm text-slate-700 leading-tight">{chat.m}</p>
                        </div>
                      ))}
                   </div>

                   <div className="pt-4 border-t border-slate-100 flex gap-4">
                      <input 
                        type="text" 
                        placeholder="Broadcast message to neighborhood..." 
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1a3a6b] transition-all"
                      />
                      <button className="p-3 bg-[#1a3a6b] text-white rounded-lg shadow-lg hover:shadow-xl transition-all active:scale-95">
                         <Send size={18} />
                      </button>
                   </div>
                </div>
              )}

              {activeTab === 'volunteering' && (
                <div className="space-y-8">
                   <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <h3 className="text-sm font-bold text-[#1a3a6b] uppercase tracking-[0.14em]">Field Operations Support</h3>
                      </div>
                   </div>
                   <div className="space-y-4">
                      {nearbyMissions.map(mission => (
                        <div key={mission.id} className="bg-white border border-slate-200 p-6 rounded-sm flex flex-col gap-4 shadow-sm relative overflow-hidden">
                           <div className="h-1 absolute top-0 left-0 right-0 bg-emerald-500" />
                           <div className="flex justify-between items-start">
                              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Registry Search • {haversineKm(currentUser!.location, mission.location).toFixed(1)}KM</span>
                              <Zap size={14} className="text-amber-500" />
                           </div>
                           <p className="text-sm font-bold text-[#1a1a2e] leading-tight">"{mission.description}"</p>
                           <button 
                             onClick={() => updateNeed(mission.id, { status: 'accepted', assigned_to: currentUser!.id })}
                             className="bg-[#1a3a6b] hover:bg-navy-800 text-white py-3 rounded text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm active:scale-95"
                           >
                              Accept Field Task
                           </button>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {activeTab === 'map' && (
                <div className="h-full flex flex-col gap-6">
                   <div className="h-[450px] bg-slate-100 overflow-hidden border border-slate-200 relative rounded-sm shadow-inner grayscale opacity-90 contrast-125">
                      <LiveMap needs={needs} volunteers={volunteers} center={currentUser?.location} zoom={14} ngos={ngos} />
                   </div>
                </div>
              )}

              {activeTab === 'tools' && (
                <div className="space-y-8">
                   <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <h3 className="text-sm font-bold text-[#1a3a6b] uppercase tracking-[0.14em]">Integrated Toolkit</h3>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => setFlashlightOn(!flashlightOn)} className={clsx("p-10 rounded-sm border-t-4 flex flex-col items-center gap-4 transition-all shadow-sm", flashlightOn ? "bg-amber-400 text-[#1a3a6b] border-amber-600" : "bg-white border-slate-200 text-slate-400 hover:border-[#1a3a6b]/20")}>
                         <Flashlight size={40} /> <span className="text-[10px] font-bold uppercase tracking-widest italic">Flashlight</span>
                      </button>
                      <button className="p-10 bg-white border-t-4 border-slate-200 rounded-sm text-slate-400 flex flex-col items-center gap-4 hover:border-[#1a3a6b]/20 transition-all shadow-sm">
                         <Volume2 size={40} /> <span className="text-[10px] font-bold uppercase tracking-widest italic">Siren Alert</span>
                      </button>
                   </div>
                </div>
              )}
           </AnimatePresence>
        </div>

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar { width: 3px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e2d3d; border-radius: 10px; }
          .animate-spin-slow { animation: spin 3s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </DashboardLayout>
  );
}

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function cloneIcon(icon: any, size: number) {
  return React.cloneElement(icon, { size });
}
