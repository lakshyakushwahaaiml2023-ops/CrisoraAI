"use client";

import { useAppStore } from "@/lib/store";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Navigation, 
  ShieldAlert, 
  User as UserIcon,
  Activity,
  HeartHandshake,
  BrainCircuit,
  Terminal,
  Zap,
  Info,
  Users
} from "lucide-react";
import { runAegisFieldAgent, FieldDirective } from "@/lib/agents";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import clsx from "clsx";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Need, Volunteer } from "@/lib/types";

// Dynamic Map import to avoid SSR issues
const LiveMap = dynamic(() => import("@/components/Map/LiveMap"), { ssr: false });

const haversineKm = (l1?: { lat: number; lng: number }, l2?: { lat: number; lng: number }) => {
  if (!l1 || !l2 || typeof l1.lat !== 'number' || typeof l2.lat !== 'number') return 9999;
  const R = 6371;
  const dLat = (l2.lat - l1.lat) * Math.PI / 180;
  const dLng = (l2.lng - l1.lng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(l1.lat * Math.PI / 180) * Math.cos(l2.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function VolunteerDashboard() {
  const { currentUser, needs, volunteers, ngos, updateNeed } = useAppStore();
  const vUser = currentUser as Volunteer;

  if (!currentUser || currentUser.role !== 'volunteer') {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f5f6f7]">
         <div className="text-center p-8 bg-white border border-slate-200 rounded-xl shadow-sm">
            <ShieldAlert size={48} className="mx-auto text-red-600 mb-4" />
            <h1 className="text-xl font-bold text-[#1a3a6b]">Access Restricted</h1>
            <p className="text-slate-500 mt-2">Only verified Field Volunteers can access this command level.</p>
            <Link href="/" className="mt-6 inline-block bg-[#1a3a6b] text-white px-6 py-2 rounded-lg font-bold">Return Home</Link>
         </div>
      </div>
    );
  }

  // Filter tasks
  const myActiveTasks = needs.filter(n => n.assigned_to === currentUser.id && n.status !== 'completed' && n.status !== 'closed');
  const availableNearby = needs.filter(n => 
    n.status === 'pending' && 
    !n.assigned_to && 
    n.location && 
    haversineKm(currentUser?.location, n.location) < 10 // Within 10km
  ).sort((a, b) => haversineKm(currentUser?.location, a.location) - haversineKm(currentUser?.location, b.location));

  const stats = [
    { label: 'Missions Completed', value: vUser.tasks_completed || 0, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Lives Impacted', value: vUser.people_helped || 0, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Response Rating', value: `${vUser.rating || 5.0}/5`, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Nearby Signals', value: availableNearby.length, icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  const handleAction = (needId: string, status: Need['status']) => {
    updateNeed(needId, { 
      status, 
      assigned_to: currentUser.id,
      completed_at: status === 'completed' ? new Date().toISOString() : undefined
    });
  };

  return (
    <DashboardLayout role="volunteer">
      <div className="p-8 max-w-7xl mx-auto space-y-8 pb-32">
        
        {/* 🏛️ INSTITUTIONAL HEADER */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
             <HeartHandshake size={120} className="text-[#1a3a6b]" />
          </div>
          <div className="flex gap-6 items-center">
            <div className="w-20 h-20 rounded-2xl bg-[#1a3a6b] flex items-center justify-center text-[#c8922a] font-black text-2xl shadow-xl border-4 border-white">
               {currentUser.name.charAt(0)}
            </div>
            <div>
               <div className="flex items-center gap-3 mb-1">
                 <h1 className="text-2xl font-black text-[#1a3a6b] tracking-tight">{currentUser.name}</h1>
                 <span className="px-3 py-1 bg-blue-50 text-[#1a3a6b] text-[10px] font-bold uppercase tracking-widest border border-blue-100 rounded-full">Field Unit 09</span>
               </div>
               <p className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                 <MapPin size={14} className="text-[#c8922a]" />
                 Current Sector: {currentUser.location.lat.toFixed(3)}, {currentUser.location.lng.toFixed(3)}
               </p>
               <div className="flex flex-wrap gap-2 mt-3">
                  {vUser.skills?.map(skill => (
                    <span key={skill} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[9px] font-bold uppercase tracking-wider rounded-sm border border-slate-200">{skill}</span>
                  ))}
               </div>
            </div>
          </div>

          <div className="flex items-center gap-4 border-l border-slate-100 pl-8">
             <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unit_Status</p>
                <p className="text-emerald-600 font-black text-lg tracking-widest italic uppercase">Operational</p>
             </div>
             <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
             </div>
          </div>
        </section>

        {/* 📊 STATS CORE */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
               <div className="flex items-center justify-between mb-4">
                  <div className={clsx("p-3 rounded-lg border", stat.bg, stat.color.replace('text', 'border'))}>
                     <stat.icon size={20} />
                  </div>
                  <span className="text-slate-300 font-mono text-[10px] tracking-tighter">METRIC_0{i+1}</span>
               </div>
               <p className="text-3xl font-black text-[#1a3a6b] tracking-tighter tabular-nums">{stat.value}</p>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 📡 FIELD TASKS (LEFT COLUMN: 7/12) */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* ACTIVE MISSIONS */}
            <div>
               <div className="flex items-center justify-between mb-6 border-b-2 border-slate-200 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <h3 className="text-sm font-bold text-[#1a3a6b] uppercase tracking-[0.2em]">Active Field Deployments</h3>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">{myActiveTasks.length} Assigned</span>
               </div>

               {myActiveTasks.length === 0 ? (
                 <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
                    <HeartHandshake size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No active deployments</p>
                    <p className="text-slate-400 text-[10px] mt-1">Accept missions from the 'Available' registry below.</p>
                 </div>
               ) : (
                 <div className="space-y-4">
                    {myActiveTasks.map(task => (
                      <div key={task.id} className="bg-white border-l-8 border-l-emerald-500 border border-slate-200 rounded-xl p-6 shadow-sm group">
                         <div className="flex justify-between items-start mb-6">
                            <div>
                               <div className="flex items-center gap-3 mb-1">
                                  <span className={clsx(
                                    "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border",
                                    task.urgency_label === 'critical' ? 'bg-red-50 border-red-200 text-red-600' :
                                    task.urgency_label === 'high' ? 'bg-amber-50 border-amber-200 text-amber-600' :
                                    'bg-blue-50 border-blue-200 text-blue-600'
                                  )}>
                                     {task.urgency_label} Urgency
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-300">TK_{task.id.slice(-6).toUpperCase()}</span>
                               </div>
                               <h4 className="text-lg font-black text-[#1a3a6b] leading-tight capitalize">{task.need_type} Request</h4>
                               <p className="text-slate-500 text-xs mt-2 italic">"{task.description}"</p>
                            </div>
                            <div className="text-right">
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Reported</p>
                               <p className="text-xs font-bold text-slate-900">{formatDistanceToNow(new Date(task.created_at))} ago</p>
                            </div>
                         </div>

                         <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                            <div className="flex items-center gap-3">
                               <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                  <Navigation size={16} />
                               </div>
                               <div>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Proximity</p>
                                  <p className="text-xs font-black text-[#1a3a6b]">{haversineKm(currentUser.location, task.location).toFixed(1)} KM Away</p>
                               </div>
                            </div>
                            <div className="flex gap-2 justify-end">
                               {task.status === 'accepted' ? (
                                  <button 
                                    onClick={() => handleAction(task.id, 'in_progress')}
                                    className="px-6 py-3 bg-[#1a3a6b] text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-lg hover:shadow-xl transition-all active:scale-95"
                                  >
                                     Mark On-Site
                                  </button>
                               ) : (
                                  <button 
                                    onClick={() => handleAction(task.id, 'completed')}
                                    className="px-6 py-3 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2"
                                  >
                                     <CheckCircle2 size={14} /> Mission Accomplished
                                  </button>
                               )}
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>

            {/* AVAILABLE MISSIONS */}
            <div className="pt-10 border-t border-slate-200">
               <div className="flex items-center justify-between mb-6 border-b-2 border-slate-200 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-slate-300" />
                    <h3 className="text-sm font-bold text-[#1a3a6b] uppercase tracking-[0.2em]">Nearby Pending Registry</h3>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">{availableNearby.length} Signals</span>
               </div>

               <div className="space-y-4">
                  {availableNearby.slice(0, 5).map(task => (
                    <div key={task.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-[#1a3a6b]/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                       <div className="flex gap-5 items-center">
                          <div className={clsx(
                            "w-12 h-12 rounded-xl flex items-center justify-center border",
                            task.urgency_label === 'critical' ? 'bg-red-50 border-red-200 text-red-600' :
                            task.urgency_label === 'high' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                            'bg-blue-50 border-blue-100 text-blue-600'
                          )}>
                             <ShieldAlert size={20} />
                          </div>
                          <div>
                             <h4 className="text-sm font-black text-[#1a3a6b] uppercase tracking-tighter">{task.need_type} Assistant Required</h4>
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                {haversineKm(currentUser.location, task.location).toFixed(1)} KM • District Sector 04
                             </p>
                          </div>
                       </div>
                       <button 
                         onClick={() => handleAction(task.id, 'accepted')}
                         className="px-6 py-2.5 bg-slate-50 border border-slate-200 text-[#1a3a6b] hover:bg-[#1a3a6b] hover:text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all"
                       >
                          Accept Mission
                       </button>
                    </div>
                  ))}
               </div>
            </div>

          </div>

          {/* 🗺️ STRATEGIC RADAR & TEAMS (RIGHT COLUMN: 5/12) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* 🤖 AEGIS FIELD ASSISTANT (AI AGENT) */}
            <div className="bg-[#12141C] border-2 border-blue-600 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(37,99,235,0.2)]">
               <div className="p-4 bg-blue-600 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <BrainCircuit size={16} className="text-white animate-pulse" />
                     <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Aegis-Unit-Assistant</h3>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/30 rounded-full">
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                     <span className="text-[8px] font-black text-white uppercase">Sector_Sync</span>
                  </div>
               </div>
               
               <div className="p-6 flex flex-col gap-5">
                  <div className="bg-black/40 border border-blue-500/20 p-4 rounded-xl font-mono relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-2 opacity-10">
                        <Terminal size={40} className="text-blue-400" />
                     </div>
                     <p className="text-[11px] font-bold text-blue-100 leading-relaxed relative z-10">
                        {runAegisFieldAgent(vUser, needs).message}
                     </p>
                     <div className="mt-3 flex items-center gap-2 text-[8px] font-black text-emerald-500 uppercase tracking-widest relative z-10">
                        <Zap size={10} />
                        {runAegisFieldAgent(vUser, needs).etaLabel || "RECALCULATING_TRAJECTORY"}
                     </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[8px] font-black text-blue-500 uppercase tracking-widest opacity-60">Field_Mission_Directives:</label>
                     <div className="space-y-2">
                        {runAegisFieldAgent(vUser, needs).checklist.map((item, idx) => (
                           <div key={idx} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/5 hover:border-blue-500/20 transition-all">
                              <div className="w-4 h-4 rounded bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-[8px] font-black text-blue-400">{idx + 1}</div>
                              <span className="text-[10px] font-bold text-blue-50/80 uppercase tracking-tighter">{item}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  <button 
                     onClick={() => {
                        const rec = runAegisFieldAgent(vUser, needs).recommendationId;
                        if (rec) handleAction(rec, 'accepted');
                     }}
                     disabled={!runAegisFieldAgent(vUser, needs).recommendationId}
                     className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all uppercase text-[11px] tracking-[0.15em] shadow-xl active:scale-95 border border-blue-400/20"
                  >
                     Accept Aegis Recommendation
                  </button>
               </div>
            </div>

            {/* RADAR */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-[600px]">
               <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="text-xs font-bold text-[#1a3a6b] uppercase tracking-widest flex items-center gap-2">
                    <Activity size={14} className="text-red-500" /> Tactical Field Radar
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">AUTO_REFRESH: 3s</span>
               </div>
               <div className="flex-1 bg-slate-50 relative opacity-90 contrast-125">
                  <LiveMap 
                    needs={needs} 
                    volunteers={volunteers} 
                    center={currentUser.location} 
                    zoom={15} 
                    ngos={ngos} 
                  />
               </div>
               <div className="p-4 bg-[#1a3a6b] text-white flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <div className="flex gap-4">
                     <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500" /> Need</span>
                     <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Unit</span>
                  </div>
                  <span className="text-blue-300">Sector Clear</span>
               </div>
            </div>

            {/* NEARBY UNITS */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
               <h3 className="text-xs font-bold text-[#1a3a6b] uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Users size={16} className="text-blue-500" /> Proximity Deployment Teams
               </h3>
               <div className="space-y-4">
                  {volunteers.filter(v => v.id !== currentUser.id && v.online).slice(0, 3).map(v => (
                    <div key={v.id} className="flex items-center justify-between gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center font-bold text-blue-600 border border-blue-100">
                             {v.name.charAt(0)}
                          </div>
                          <div>
                             <p className="text-xs font-bold text-slate-800 tracking-tight">{v.name}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{v.skills[0]} Support</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[9px] font-bold text-emerald-600 uppercase">Deployed</p>
                          <p className="text-[8px] font-mono text-slate-400">{haversineKm(currentUser?.location, v.location).toFixed(1)} KM</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

          </div>

        </div>

      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </DashboardLayout>
  );
}
