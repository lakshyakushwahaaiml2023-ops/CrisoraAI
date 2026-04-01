"use client";

import { useAppStore } from '@/lib/store';
import { AlertCircle, Activity, ShieldAlert, Navigation, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';

export default function VictimMiniView() {
  const { needs, addNeed, currentUser } = useAppStore();
  const [panicActive, setPanicActive] = useState(false);
  const [panicCountdown, setPanicCountdown] = useState(5);

  const myNeeds = needs.filter(n => n.reported_by === currentUser?.id || n.reported_by === 'vic1')
    .sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (panicActive && panicCountdown > 0) {
       timer = setTimeout(() => setPanicCountdown(p => p - 1), 1000);
    } else if (panicActive && panicCountdown === 0) {
      const location = currentUser?.location || { lat: 22.7196, lng: 75.8577 };
      addNeed({
        id: `panic_${Date.now()}`,
        reported_by: currentUser?.id || 'vic1',
        need_type: 'rescue',
        urgency_level: 99,
        urgency_label: 'critical',
        people_affected: 1,
        description: 'PANIC BUTTON PRESSED. IMMEDIATE HELP.',
        location,
        status: 'pending',
        triage_score: 99,
        created_at: new Date().toISOString()
      });
      setPanicActive(false);
      setPanicCountdown(5);

      // Trigger Twilio SMS to nearby officer
      fetch('/api/notify/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
           type: 'panic', 
           location,
           message: 'CITIZEN PANIC TRIGGERED. IMMEDIATE EXTRACTION REQUESTED.'
        })
      }).catch(e => console.error('Panic SMS Failed', e));
    }
    return () => clearTimeout(timer);
  }, [panicActive, panicCountdown, addNeed, currentUser]);

  return (
    <div className="h-full flex flex-col bg-[#0F1117] border border-red-500/30 rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-red-600/20 px-4 py-2 border-b border-red-500/30 flex justify-between items-center">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#E24B4A] flex items-center gap-2">
          <Activity size={14} /> Affected Citizen View
        </h3>
        <span className="text-[10px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full font-bold">
          {myNeeds.length} Reports
        </span>
      </div>

      <div className="p-4 bg-red-900/10 border-b border-red-500/20 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[140px]">
        {panicActive && <div className="absolute inset-0 bg-red-600/20 animate-pulse" />}
        <div 
           className="relative z-10 w-24 h-24 flex items-center justify-center"
           onMouseDown={() => setPanicActive(true)}
           onMouseUp={() => { setPanicActive(false); setPanicCountdown(5); }}
           onMouseLeave={() => { setPanicActive(false); setPanicCountdown(5); }}
           onTouchStart={() => setPanicActive(true)}
           onTouchEnd={() => { setPanicActive(false); setPanicCountdown(5); }}
        >
          <button 
             className={clsx(
              "w-20 h-20 rounded-full shadow-[0_0_30px_rgba(226,75,74,0.4)] flex items-center justify-center transition-all bg-[#E24B4A] pointer-events-none",
              panicActive ? "bg-red-800 scale-95" : "hover:bg-red-500 hover:scale-105"
             )}
          >
            <ShieldAlert className="w-10 h-10 text-white" />
          </button>
        </div>
        <div className="mt-3 font-bold text-[10px] uppercase tracking-widest h-4 z-10">
          {panicActive 
            ? <span className="text-red-400 animate-pulse">HOLDING: {panicCountdown}s</span>
            : <span className="text-slate-500">Hold 5s to Panic</span>
          }
        </div>
      </div>

      {/* Trackers */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 flex flex-col gap-2">
        <h4 className="text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-widest">My Help Status</h4>
        {myNeeds.length === 0 ? (
          <div className="text-center text-slate-700 text-[10px] py-4 uppercase font-bold tracking-widest">No active requests</div>
        ) : (
          myNeeds.map(need => (
            <div key={need.id} className="bg-white/5 border border-white/10 p-2 rounded-lg">
               <div className="flex justify-between items-start mb-1 text-[10px]">
                 <span className="font-bold text-white uppercase">{need.need_type}</span>
                 <span className="font-bold uppercase text-[#10B981]">{need.status.replace('_',' ')}</span>
               </div>
               {/* Progress Bar */}
               <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-1 mb-2">
                 <div className={clsx("h-full transition-all duration-1000", 
                    need.status === 'pending' ? 'w-1/4 bg-orange-400' :
                    need.status === 'accepted' ? 'w-1/2 bg-blue-400' :
                    need.status === 'in_progress' ? 'w-3/4 bg-[#10B981]' : 'w-full bg-emerald-500'
                 )} />
               </div>
               <div className="flex justify-between items-center mt-2">
                  <span className="text-[9px] text-slate-500 uppercase flex items-center gap-1">
                    <Clock size={10} /> {formatDistanceToNow(new Date(need.created_at))} ago
                  </span>
                  {need.status === 'in_progress' && (
                    <span className="text-[9px] text-emerald-400 font-bold uppercase animate-pulse">Volunteer Arriving</span>
                  )}
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
