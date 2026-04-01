"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Target, ShieldCheck, Zap, Activity } from 'lucide-react';
import clsx from 'clsx';

interface OracleInsight {
  label: string;
  value: string | number;
  confidence: number;
  status: 'critical' | 'warning' | 'nominal';
}

export default function OracleTacticalScanner() {
  const [isScanning, setIsScanning] = useState(true);
  const [insights, setInsights] = useState<OracleInsight[]>([
    { label: 'RESCUE_PROBABILITY', value: '87%', confidence: 0.87, status: 'nominal' },
    { label: 'SUPPLY_OPTIMIZATION', value: '+142%', confidence: 0.92, status: 'nominal' },
    { label: 'UNMET_DEMAND_VECTORS', value: '03', confidence: 0.65, status: 'warning' },
    { label: 'CASUALTY_PREVENTION', value: '47', confidence: 0.78, status: 'critical' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsScanning(true);
      setTimeout(() => setIsScanning(false), 800);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#050607] border border-[#2D3139] p-4 industrial-border font-mono-data relative overflow-hidden h-full">
      {/* SCANNING OVERLAY */}
      <AnimatePresence>
        {isScanning && (
          <motion.div 
            initial={{ top: '-10%' }}
            animate={{ top: '110%' }}
            exit={{ top: '110%' }}
            transition={{ duration: 0.8, ease: "linear" }}
            className="absolute left-0 right-0 h-1 bg-[#0077FF] shadow-[0_0_20px_#0077FF] z-10 opacity-50"
          />
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
         <div className="flex items-center gap-2">
            <BrainCircuit size={18} className="text-[#0077FF] animate-pulse" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0077FF] italic">ORACLE_AI_SENTINEL</h2>
         </div>
         <div className="flex items-center gap-1.5 bg-[#0077FF]/10 px-2 py-0.5 border border-[#0077FF]/30">
            <div className="w-1.5 h-1.5 bg-[#0077FF] rounded-full animate-pulse" />
            <span className="text-[8px] font-black text-[#0077FF] uppercase tracking-widest italic">NEURAL_SYNC_ESTABLISHED</span>
         </div>
      </div>

      {/* DATA GRID */}
      <div className="grid grid-cols-2 gap-3 mb-6">
         {insights.map((insight, i) => (
           <div key={i} className="bg-white/5 p-3 border border-white/5 relative">
              <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1">{insight.label}</p>
              <div className="flex items-end justify-between">
                 <span className={clsx("text-xl font-black tabular-nums tracking-tighter leading-none italic", 
                    insight.status === 'critical' ? 'text-red-500' : insight.status === 'warning' ? 'text-yellow-500' : 'text-white'
                 )}>{insight.value}</span>
                 
                 {/* MINI GAUGE */}
                 <div className="w-8 h-8 relative flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                       <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/10" />
                       <motion.circle 
                         cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2"
                         strokeDasharray={88}
                         strokeDashoffset={88 - (88 * insight.confidence)}
                         className={clsx(
                            insight.status === 'critical' ? 'text-red-500' : insight.status === 'warning' ? 'text-yellow-500' : 'text-[#0077FF]'
                         )}
                       />
                    </svg>
                    <span className="absolute text-[6px] font-black text-slate-400">{(insight.confidence * 100).toFixed(0)}</span>
                 </div>
              </div>
           </div>
         ))}
      </div>

      {/* TACTICAL SUMMARY */}
      <div className="space-y-2 border-t border-[#2D3139] pt-4">
         <div className="flex items-start gap-3">
            <Target size={14} className="text-[#0077FF] shrink-0 mt-0.5" />
            <div>
               <p className="text-[8px] font-black text-[#0077FF] uppercase tracking-widest mb-0.5 italic">PRIMARY_OBJECTIVE</p>
               <p className="text-[10px] font-bold text-slate-300 leading-snug">DEPLOY_MEDICAL_UNIT_TO_SECTOR_7_IMMEDIATELY. RISK_SCALE_9.1/10.</p>
            </div>
         </div>
         <div className="flex items-start gap-3">
            <Zap size={14} className="text-yellow-500 shrink-0 mt-0.5" />
            <div>
               <p className="text-[8px] font-black text-yellow-500 uppercase tracking-widest mb-0.5 italic">STRATEGIC_INSIGHT</p>
               <p className="text-[10px] font-bold text-slate-300 leading-snug italic font-mono-data uppercase">REDEPLOYING_RESOURCES_FROM_BUFFER_ZONES... IMPACT_EST_LIVES_SAVED_12%</p>
            </div>
         </div>
      </div>

      {/* DECORATIVE SCANLINES */}
      <div className="absolute inset-x-0 bottom-0 h-[20%] opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to bottom, transparent, #0077FF10)' }} />
    </div>
  );
}
