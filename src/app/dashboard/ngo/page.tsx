"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { useAppStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import { NGO, ResourceInventory } from '@/lib/types';
import { 
  Package, Truck, Database, ActivitySquare, Plus, 
  Check, Map as MapIcon, Boxes, ArrowRightLeft, 
  ShieldCheck, AlertTriangle, TrendingUp, Activity,
  Zap, Bell
} from 'lucide-react';
import clsx from 'clsx';
import { LiveMap } from '@/components/Map';
import { motion, AnimatePresence } from 'framer-motion';
import { runLogosOracle, InventoryOracle } from '@/lib/agents';
import { BrainCircuit, Terminal, ArrowRight, Info, Send } from 'lucide-react';

export default function NGODashboard() {
  const { currentUser, inventory, ngos, needs, riskZones, announcements } = useAppStore();
  const [activeTab, setActiveTab] = useState<'inventory' | 'map'>('inventory');
  const [mounted, setMounted] = useState(false);
  const [clusterAlert, setClusterAlert] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // 1. Detect Cluster Signal Burst for Logistics Mobilization
    const massDistressAlert = announcements.find(a => 
      a.urgency === 'critical' && a.message.includes('MASS_DISTRESS_CLUSTER')
    );
    if (massDistressAlert) {
       setClusterAlert(massDistressAlert.message);
       // Auto-clear after 12 seconds
       setTimeout(() => setClusterAlert(null), 12000);
    }
  }, [announcements]);

  if (!mounted) return null;

  const me = ngos.find(n => n.id === currentUser?.id) as NGO | undefined;
  const myInventory = inventory.filter(i => i.ngo_id === currentUser?.id);
  const otherInventory = inventory.filter(i => i.ngo_id !== currentUser?.id);

  return (
    <DashboardLayout role="ngo">
      <div className="flex flex-col gap-6 w-full h-full bg-[#0A0C10] font-sans p-8 overflow-y-auto">
        
        {/* LOGISTICS MOBILIZATION ALERT (Coordination Proof) */}
        <AnimatePresence>
          {clusterAlert && (
            <motion.div 
               initial={{ y: -100, opacity: 0 }} 
               animate={{ y: 0, opacity: 1 }} 
               exit={{ y: -100, opacity: 0 }}
               className="bg-amber-600 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_50px_rgba(217,119,6,0.4)] border-2 border-amber-400 relative overflow-hidden z-[100]"
            >
               <div className="absolute inset-0 bg-white/10 animate-pulse" />
               <div className="flex items-center gap-6 relative z-10">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-amber-600 shadow-2xl">
                     <Truck size={32} className="animate-bounce" />
                  </div>
                  <div>
                     <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic leading-none">LOGISTICS_MOBILIZATION: CLUSTER_BURST</h2>
                     <p className="text-[10px] font-bold text-white/80 uppercase tracking-[0.2em] mt-2 underline decoration-white/20 underline-offset-4">{clusterAlert}</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 relative z-10">
                  <div className="text-right hidden md:block">
                     <p className="text-[9px] font-black text-white/60 uppercase tracking-widest italic">Inter-Agency_Supply_Chain</p>
                     <p className="text-sm font-black text-white uppercase tracking-tighter italic">RELEASING_STRATEGIC_RESERVES</p>
                  </div>
                  <button className="bg-white text-amber-600 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-100 transition-all active:scale-95">SYNC_LOGISTICS</button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* OPERATIONAL LOGISTICS MATRIX */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
           <div className="bg-[#12141C] p-6 rounded-2xl border border-[#2D3139] shadow-2xl transition-all hover:bg-[#161922]">
              <div className="flex justify-between items-start mb-5">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Active_Inventory_Units</p>
                 <Package size={20} className="text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
              </div>
              <div className="flex items-baseline gap-3">
                 <span className="text-4xl font-black text-white tabular-nums tracking-tighter">0{myInventory.length}</span>
                 <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest italic">FIELD_STOCK</span>
              </div>
           </div>

           <div className="bg-[#12141C] p-6 rounded-2xl border border-[#2D3139] shadow-2xl transition-all hover:bg-[#161922]">
              <div className="flex justify-between items-start mb-5">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Supply_Convoy_Status</p>
                 <Truck size={20} className="text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]" />
              </div>
              <div className="flex items-baseline gap-3">
                 <span className="text-4xl font-black text-white tabular-nums tracking-tighter">12</span>
                 <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest italic">IN_TRANSIT</span>
              </div>
           </div>

           <div className="bg-[#12141C] p-6 rounded-2xl border border-[#2D3139] shadow-2xl transition-all hover:bg-[#161922]">
              <div className="flex justify-between items-start mb-5">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Mission_Operational_Load</p>
                 <Activity size={20} className="text-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]" />
              </div>
              <div className="flex items-baseline gap-3">
                 <span className="text-4xl font-black text-white tabular-nums tracking-tighter">03</span>
                 <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest italic">ACTIVE_SORTIE</span>
              </div>
           </div>

           <div className="bg-emerald-600/10 p-6 rounded-2xl border border-emerald-500/30 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 transition-all group-hover:opacity-10 scale-150">
                 <ShieldCheck size={100} className="text-emerald-500" />
              </div>
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] italic mb-5">Agency_Readiness</p>
              <div className="flex items-baseline gap-3">
                 <span className="text-4xl font-black text-white tabular-nums tracking-tighter">{me?.staff_count || 50}</span>
                 <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest italic">CERTIFIED_UNITS</span>
              </div>
           </div>
        </div>

        {/* LOGISTICS INTERFACE CONTROL */}
        <div className="flex justify-between items-center bg-[#0D0F14] border border-[#2D3139] px-8 py-4 rounded-2xl shadow-xl shrink-0">
            <div className="flex items-center gap-10">
               <button 
                 onClick={() => setActiveTab('inventory')}
                 className={clsx(
                   "text-[11px] font-black uppercase tracking-[0.25em] transition-all border-b-2 py-1",
                   activeTab === 'inventory' ? 'text-blue-500 border-blue-500' : 'text-slate-600 border-transparent hover:text-slate-300'
                 )}
               >
                 MISSION_INVENTORY_HUB
               </button>
               <button 
                 onClick={() => setActiveTab('map')}
                 className={clsx(
                   "text-[11px] font-black uppercase tracking-[0.25em] transition-all border-b-2 py-1",
                   activeTab === 'map' ? 'text-blue-500 border-blue-500' : 'text-slate-600 border-transparent hover:text-slate-300'
                 )}
               >
                 DISTRIBUTION_RADAR_MAP
               </button>
            </div>
        </div>

        {/* MAIN LOGISTICS CENTER */}
        <div className="flex-1 min-h-0">
          <AnimatePresence mode="wait">
            {activeTab === 'map' ? (
              <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full rounded-2xl overflow-hidden border border-[#2D3139] shadow-inner p-2 bg-[#12141C] grayscale contrast-125 brightness-75">
                <LiveMap needs={needs} volunteers={[]} ngos={ngos} riskZones={riskZones} center={me?.hq_location} showHeatmap={true} />
              </motion.div>
            ) : (
              <motion.div key="inventory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                
                {/* 🤖 LOGOS RESOURCE ORACLE (AI AGENT) */}
                <div className="lg:col-span-12 xl:col-span-4 space-y-6">
                  <div className="bg-[#12141C] border-2 border-amber-600/50 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                     <div className="p-4 bg-amber-600 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <BrainCircuit size={16} className="text-white animate-pulse" />
                           <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Logos-Resource-Oracle</h3>
                        </div>
                        <span className="text-[8px] font-black text-white/80 uppercase">Logistics_Core</span>
                     </div>
                     
                     <div className="p-6 flex flex-col gap-5">
                        <div className="bg-black/40 border border-amber-500/20 p-4 rounded-xl font-mono relative overflow-hidden group min-h-[100px]">
                           <div className="absolute top-0 right-0 p-2 opacity-10">
                              <Terminal size={40} className="text-amber-400" />
                           </div>
                           <p className="text-[11px] font-bold text-amber-100 leading-relaxed relative z-10">
                              {runLogosOracle(me!, inventory, needs).message}
                           </p>
                        </div>

                        {runLogosOracle(me!, inventory, needs).alerts.length > 0 && (
                          <div className="space-y-2">
                             <label className="text-[8px] font-black text-amber-500 uppercase tracking-widest opacity-60">Critical_Shortage_Predictor:</label>
                             {runLogosOracle(me!, inventory, needs).alerts.map((alert, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-red-600/10 rounded-lg border border-red-500/20">
                                   <AlertTriangle size={14} className="text-red-500 shrink-0" />
                                   <span className="text-[10px] font-bold text-red-200 uppercase tracking-tighter">{alert}</span>
                                </div>
                             ))}
                          </div>
                        )}

                        {runLogosOracle(me!, inventory, needs).recommendation && (
                          <div className="pt-4 border-t border-white/5">
                             <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-3">Suggested_Logistics_Action:</p>
                             <div className="bg-emerald-600/5 border border-emerald-500/20 p-4 rounded-xl flex items-center justify-between gap-4">
                                <div>
                                   <p className="text-[10px] font-black text-white uppercase tracking-tighter">Request {runLogosOracle(me!, inventory, needs).recommendation?.item}</p>
                                   <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">From Partner NGO Hub</p>
                                </div>
                                <button className="p-2 bg-emerald-600 text-white rounded-lg shadow-lg active:scale-95 transition-all">
                                   <ArrowRight size={16} />
                                </button>
                             </div>
                          </div>
                        )}
                     </div>
                  </div>

                  {/* HUB METRICS (MOVED) */}
                  <div className="bg-[#12141C] border border-[#2D3139] p-6 rounded-2xl">
                     <div className="flex items-center gap-3 mb-4">
                        <TrendingUp size={16} className="text-blue-500" />
                        <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Supply Chain Velocity</h3>
                     </div>
                     <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px]">
                           <span className="text-slate-500 uppercase font-bold">Burn Rate</span>
                           <span className="text-blue-400 font-black tracking-tighter">2.4 Units/Hr</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                           <div className="bg-blue-500 h-full w-[65%]" />
                        </div>
                     </div>
                  </div>
                </div>

                {/* HUB INVENTORY (ADAPTED COLUMN) */}
                <div className="lg:col-span-12 xl:col-span-8 bg-[#12141C] border border-[#2D3139] p-10 rounded-2xl flex flex-col h-full shadow-2xl overflow-hidden relative">
                   <div className="absolute top-0 right-0 p-10 opacity-5">
                      <Boxes size={120} className="text-slate-500" />
                   </div>
                   <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
                      <div>
                         <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-4 italic uppercase underline decoration-white/5 underline-offset-8">
                            Hub_Resource_Registry
                         </h2>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-3 italic underline decoration-blue-500/20 underline-offset-4">Last Updated: Just Now (Auto-Sync: ENABLED)</p>
                      </div>
                      <Database size={32} className="text-blue-500/40" />
                   </div>
                   
                   <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar flex-1 pr-3">
                    {myInventory.map(item => (
                      <div key={item.id} className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-blue-500/40 hover:bg-slate-800/40 transition-all shadow-xl">
                         <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-[#161922] rounded-xl flex items-center justify-center border border-[#2D3139] shadow-inner text-slate-500 group-hover:text-blue-500 transition-colors">
                               <Package size={22} />
                            </div>
                            <div>
                              <h3 className="font-black uppercase text-sm text-white italic tracking-tight mb-1 underline decoration-white/5 underline-offset-4">{item.item_name}</h3>
                              <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em] italic">CATEGORY: {item.resource_type} • EXP: {item.expiry_date || 'N/A'}</p>
                            </div>
                         </div>
                         <div className="text-right">
                           <div className="text-2xl text-blue-400 font-black tracking-tighter uppercase tabular-nums">{item.quantity} {item.unit}</div>
                           <span className={clsx(
                              "text-[9px] uppercase font-black tracking-[0.2em] px-2.5 py-1 rounded-lg mt-2 inline-block italic border",
                              item.available ? 'bg-emerald-600/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 'bg-red-600/10 text-red-500 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
                           )}>
                             {item.available ? 'DEPLOYMENT_READY' : 'STOCK_X_CRITICAL'}
                           </span>
                         </div>
                      </div>
                    ))}
                   </div>
                </div>

                {/* NATIONAL EXCHANGE */}
                <div className="lg:col-span-5 bg-blue-900/15 border border-blue-500/20 p-10 rounded-2xl flex flex-col h-full shadow-2xl relative overflow-hidden backdrop-blur-sm">
                   <div className="absolute top-0 right-0 p-10 opacity-5">
                      <ArrowRightLeft size={100} className="text-blue-500 rotate-45" />
                   </div>
                   
                   <div className="mb-10 border-b border-blue-500/20 pb-6">
                      <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-4 italic uppercase underline decoration-blue-500/10 underline-offset-8">
                         Resource_Exchange
                      </h2>
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mt-3 italic">Inter-Agency Distribution Logistics</p>
                   </div>
                   
                   <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar flex-1 pr-3">
                    {otherInventory.map(item => {
                       const org = ngos.find(n => n.id === item.ngo_id);
                       return (
                        <div key={item.id} className="bg-white/5 p-6 rounded-2xl border border-white/5 group hover:bg-white/10 hover:border-blue-500/30 transition-all shadow-xl">
                           <div className="flex justify-between items-start mb-4 pb-2 border-b border-white/5">
                             <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest italic underline decoration-blue-500/20 underline-offset-4">{org?.org_name || 'PARTNER_AGENCY'}</span>
                             <span className="text-[9px] font-black text-slate-500 uppercase italic tracking-tighter">DST: ~1.2KM</span>
                           </div>
                           <div className="flex justify-between items-center">
                             <div>
                               <h3 className="font-black uppercase text-xs text-white italic tracking-tight mb-1">{item.item_name}</h3>
                               <p className="text-xl text-white font-black uppercase tracking-tighter tabular-nums">{item.quantity} {item.unit}</p>
                             </div>
                             <button className="bg-blue-600 text-white font-black py-3 px-5 text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-blue-700 rounded-xl shadow-xl active:scale-95 italic">
                               REQ_REDISTRIB
                             </button>
                           </div>
                        </div>
                       );
                    })}
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar { width: 3px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #1C1F26; border-radius: 10px; }
        `}</style>
      </div>
    </DashboardLayout>
  );
}
