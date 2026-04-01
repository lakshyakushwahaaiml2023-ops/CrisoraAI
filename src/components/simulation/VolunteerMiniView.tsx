"use client";

import { useAppStore } from '@/lib/store';
import { MapPin, Navigation, CheckCircle2, HeartHandshake, Award } from 'lucide-react';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';

export default function VolunteerMiniView() {
  const { needs, updateNeed, currentUser } = useAppStore();

  const pendingRequests = needs.filter(n => n.status === 'pending').sort((a,b) => (b.triage_score || 0) - (a.triage_score || 0));
  const myTasks = needs.filter(n => ['accepted', 'in_progress'].includes(n.status) && n.assigned_to === currentUser?.id);

  const handleStatusChange = (needId: string, currentStatus: string) => {
    let next: any = 'accepted';
    if (currentStatus === 'pending') next = 'accepted';
    else if (currentStatus === 'accepted') next = 'in_progress';
    else if (currentStatus === 'in_progress') next = 'completed';
    
    updateNeed(needId, { 
      status: next, 
      assigned_to: currentUser?.id,
      ...(next === 'completed' ? { completed_at: new Date().toISOString() } : {})
    });
  };

  return (
    <div className="h-full flex flex-col bg-[#0F1117] border border-emerald-500/30 rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-emerald-600/20 px-4 py-2 border-b border-emerald-500/30 flex justify-between items-center">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#10B981] flex items-center gap-2">
          <HeartHandshake size={14} /> Volunteer Missions
        </h3>
        <div className="flex gap-2">
           <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
             {myTasks.length} Active
           </span>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 flex flex-col gap-3">
        {/* Active Task Section */}
        {myTasks.length > 0 && (
          <div className="mb-2">
            <h4 className="text-[10px] uppercase font-bold text-slate-500 mb-2 tracking-widest">Active Orders</h4>
            {myTasks.map(task => (
              <div key={task.id} className="bg-emerald-500/10 border border-emerald-500/30 p-2 rounded-lg mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-emerald-100 uppercase">{task.need_type}</span>
                  <span className="text-[9px] text-emerald-400 font-bold uppercase">{task.status.replace('_', ' ')}</span>
                </div>
                <div className="flex gap-1.5 mt-2">
                  <button onClick={() => handleStatusChange(task.id, task.status)} className="flex-1 bg-emerald-500 text-white font-bold text-[10px] uppercase py-1.5 rounded hover:bg-emerald-600 transition-colors">
                     {task.status === 'accepted' ? 'Start Mission' : 'Finish'}
                  </button>
                  <button className="bg-white/10 p-1.5 rounded hover:bg-white/20 transition-colors">
                    <Navigation size={12} className="text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Available Tasks */}
        <h4 className="text-[10px] uppercase font-bold text-slate-500 mb-2 tracking-widest">Available Matched</h4>
        {pendingRequests.length === 0 ? (
          <div className="text-center text-slate-600 text-[10px] py-4 uppercase font-bold tracking-widest">No matching tasks</div>
        ) : (
          pendingRequests.slice(0, 5).map(need => (
            <div key={need.id} className="bg-white/5 border border-white/10 p-2 rounded-lg group transition-colors hover:bg-white/10">
               <div className="flex justify-between items-start mb-1">
                 <span className="text-[10px] font-bold text-white uppercase">{need.need_type}</span>
                 <span className="text-[9px] text-slate-500 font-mono">ID: {need.id.slice(-4)}</span>
               </div>
               <div className="flex items-center gap-1.5 text-[9px] text-slate-400 mb-2">
                  <MapPin size={10} className="text-blue-400" />
                  Lat: {need.location.lat.toFixed(2)}, Lng: {need.location.lng.toFixed(2)}
                  <span className="ml-auto font-bold text-white">~1.2 km</span>
               </div>
               <button onClick={() => handleStatusChange(need.id, 'pending')} className="w-full bg-white text-black font-bold text-[10px] uppercase py-1.5 rounded hover:bg-slate-200 transition-colors active:scale-95">
                 Accept Task
               </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
