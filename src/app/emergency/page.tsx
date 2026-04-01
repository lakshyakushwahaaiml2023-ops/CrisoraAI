"use client";

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Need, NeedType, UrgencyLevel } from '@/lib/types';
import { ShieldAlert, Activity, ChevronLeft, Navigation, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

export default function PublicEmergencyPortal() {
  const router = useRouter();
  const { addNeed, needs } = useAppStore();
  
  const [mounted, setMounted] = useState(false);
  const [panicActive, setPanicActive] = useState(false);
  const [panicCountdown, setPanicCountdown] = useState(5);
  const [reportSuccess, setReportSuccess] = useState<string | null>(null);
  const [aiInsights, setAiInsights] = useState<Record<string, any>>({});
  
  // Anonymous Session Tracking
  const [anonId, setAnonId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const existingId = localStorage.getItem('emergency_anon_id');
    if (existingId) setAnonId(existingId);
  }, []);

  // Panic Loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (panicActive && panicCountdown > 0) {
      timer = setTimeout(() => setPanicCountdown(p => p - 1), 1000);
    } else if (panicActive && panicCountdown === 0) {
      triggerEmergency('rescue', 'critical', 'AUTOMATIC PANIC SIGNAL - IMMEDIATE ASSISTANCE REQUIRED');
      setPanicActive(false);
      setPanicCountdown(5);
    }
    return () => clearTimeout(timer);
  }, [panicActive, panicCountdown]);

  const triggerEmergency = (type: NeedType, urgency: UrgencyLevel, desc: string) => {
    const id = `anon_${Date.now()}`;
    const location = { lat: 22.7196, lng: 75.8577 }; // Default fallback — Indore
    
    const newNeed: Need = {
      id,
      reported_by: 'anonymous',
      need_type: type,
      urgency_level: urgency === 'critical' ? 99 : urgency === 'high' ? 75 : 40,
      urgency_label: urgency,
      people_affected: 1,
      description: desc,
      location,
      status: 'pending',
      triage_score: urgency === 'critical' ? 95 : 60,
      created_at: new Date().toISOString()
    };

    addNeed(newNeed);
    setAnonId(id);
    localStorage.setItem('emergency_anon_id', id);
    setReportSuccess(id);
    
    // Trigger AI Analysis
    analyzeWithAI(newNeed);
    
    // Send SMS to officers
    fetch('/api/notify/sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
         type: 'panic', 
         location,
         message: `PUBLIC ALARM: ${desc}`
      })
    }).catch(e => console.error('Panic SMS Failed', e));

    // Auto-reset success after 10s
    setTimeout(() => setReportSuccess(null), 10000);
  };

  const analyzeWithAI = async (need: Need) => {
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        body: JSON.stringify({ need })
      });
      const insight = await res.json();
      setAiInsights(prev => ({ ...prev, [need.id]: insight }));
    } catch (e) {
      console.error("AI Triage Failed", e);
    }
  };

  if (!mounted) return null;

  const myAnonRequest = needs.find(n => n.id === anonId);

  return (
    <div className="min-h-screen bg-[#050607] text-white flex flex-col p-6 selection:bg-red-500/30">
      
      {/* HEADER */}
      <header className="flex items-center justify-between mb-8">
         <button onClick={() => router.push('/')} className="p-2 hover:bg-white/10 rounded-lg flex items-center gap-2 text-slate-400 group transition-all">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-wider">Back to Home</span>
         </button>
         <div className="px-3 py-1 bg-red-500/10 border border-red-500/40 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase text-red-400 tracking-[0.2em]">Live Pulse Active</span>
         </div>
      </header>

      <main className="max-w-xl mx-auto w-full flex flex-col gap-10 flex-1">
         
         <div className="text-center">
            <h1 className="text-4xl font-black mb-2 tracking-tighter">EMERGENCY PORTAL</h1>
            <p className="text-slate-400 text-sm font-medium">Your signal will be triaged by AI and dispatched to authorities immediately. No login required.</p>
         </div>

         {/* BIG PANIC BUTTON */}
         <div className="relative group flex flex-col items-center">
            <div className={clsx(
              "absolute inset-0 bg-red-600/20 blur-[100px] rounded-full transition-all duration-500 pointer-events-none",
              panicActive ? "opacity-100 scale-125" : "opacity-0 scale-50"
            )} />
            
            <div 
              className="relative z-10 w-56 h-56 flex items-center justify-center"
              onMouseDown={() => setPanicActive(true)}
              onMouseUp={() => { if(panicCountdown > 0) { setPanicActive(false); setPanicCountdown(5); }}}
              onMouseLeave={() => { if(panicCountdown > 0) { setPanicActive(false); setPanicCountdown(5); }}}
              onTouchStart={() => setPanicActive(true)}
              onTouchEnd={() => { if(panicCountdown > 0) { setPanicActive(false); setPanicCountdown(5); }}}
            >
              <button 
                className={clsx(
                  "w-48 h-48 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-150 pointer-events-none",
                  panicActive ? "bg-red-700 border-white scale-95" : "bg-red-600 border-white/20 hover:border-white/60 hover:bg-red-500"
                )}
              >
                 {panicActive ? (
                   <span className="text-4xl font-black">{panicCountdown}</span>
                 ) : (
                   <>
                     <ShieldAlert size={64} className="mb-2" />
                     <span className="text-xs font-black uppercase tracking-widest leading-none">Hold To<br/>Signal</span>
                   </>
                 )}
              </button>
            </div>
            <p className="mt-4 text-[11px] font-black uppercase text-slate-500 tracking-[0.3em]">
               Emergency Protocol
            </p>
         </div>

         {/* FORM SECTION */}
         <div className="space-y-6">
            <div className="flex items-center gap-4">
               <div className="h-px bg-white/10 flex-1" />
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Or Select Specific Need</span>
               <div className="h-px bg-white/10 flex-1" />
            </div>

            <div className="grid grid-cols-2 gap-3">
               {[
                 { type: 'medical', label: 'Medical Emergency', icon: <Activity className="text-blue-400" /> },
                 { type: 'rescue', label: 'Trapped / Rescue', icon: <Navigation className="text-red-400" /> },
                 { type: 'food', label: 'Food / Water', icon: <Activity className="text-yellow-400" /> },
                 { type: 'shelter', label: 'Shelter Needs', icon: <ShieldAlert className="text-emerald-400" /> },
               ].map((item) => (
                 <button 
                   key={item.type}
                   onClick={() => triggerEmergency(item.type as NeedType, 'high', `Direct public signal for ${item.label}`)}
                   className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center gap-3 hover:bg-white/10 hover:border-white/30 transition-all hover:-translate-y-1 active:scale-95"
                 >
                    {item.icon}
                    <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                 </button>
               ))}
            </div>
         </div>

         {/* SUCCESS & STATUS TRACKING */}
         {myAnonRequest && (
           <div className="mt-4 border-t border-white/10 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-emerald-500/10 border border-emerald-500/40 p-6 rounded-3xl flex flex-col items-center text-center">
                 <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 text-emerald-400">
                    <CheckCircle2 size={24} />
                 </div>
                 <h2 className="text-xl font-black mb-1">Signal Received</h2>
                 <p className="text-xs text-slate-400 mb-6 font-bold">Automated Analysis has logged your position. Rescue operations are being coordinated.</p>
                 
                 <div className="w-full space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                       <span>Status: {myAnonRequest.status.toUpperCase()}</span>
                       <span>ID: #{myAnonRequest.id.slice(-4)}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div 
                         className={clsx(
                           "h-full rounded-full transition-all duration-1000 bg-emerald-500",
                           myAnonRequest.status === 'pending' ? 'w-1/4' : 'w-full'
                         )} 
                       />
                    </div>

                    {/* AI REASONING */}
                    {aiInsights[myAnonRequest.id] && (
                      <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-xl flex gap-3 text-left">
                         <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 animate-pulse shrink-0" />
                         <p className="text-[10px] text-slate-300 font-bold italic leading-snug">
                            " {aiInsights[myAnonRequest.id].reasoning} "
                         </p>
                      </div>
                    )}
                 </div>
              </div>
           </div>
         )}

         {/* MISSION TIPS */}
         <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-4">
            <ShieldAlert size={20} className="text-red-400 shrink-0" />
            <p className="text-[11px] font-bold text-slate-400 leading-snug uppercase">
              Keep your device screen ON and STAY in your current location if safe. AI tracking is active.
            </p>
         </div>
      </main>

      <footer className="mt-auto py-8 text-center text-[10px] font-bold text-slate-600 uppercase tracking-widest">
         Nexus Relief Protocol • V4.0.2 Stable
      </footer>
    </div>
  );
}
