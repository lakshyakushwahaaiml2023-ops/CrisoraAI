"use client";

import { useEffect, useState, useRef } from 'react';
import { Zap, Bot, BrainCircuit, Activity, Target, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface AIInsight {
  triage_score: number;
  urgency: string;
  reasoning: string;
  suggestion: string;
}

export default function NexusOracle({ latestNeedId, isRunning }: { latestNeedId: string | null, isRunning: boolean }) {
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState<AIInsight[]>([]);
  
  // Real-time strategic commentary
  useEffect(() => {
    if (!latestNeedId || !isRunning) return;

    const analyzeNeed = async () => {
      setIsAnalyzing(true);
      try {
        // We'll call the actual API route
        const res = await fetch('/api/ai/analyze', {
          method: 'POST',
          body: JSON.stringify({ need: { id: latestNeedId, description: "New distress signal detected on the pulse map." } })
        });
        const data = await res.json();
        setInsight(data);
        setHistory(prev => [data, ...prev].slice(0, 5));
      } catch (e) {
        console.error("AI Strategic Analysis Failed", e);
      } finally {
        setIsAnalyzing(false);
      }
    };

    analyzeNeed();
  }, [latestNeedId, isRunning]);

  return (
    <div className="flex flex-col h-full pointer-events-auto">
      {/* AI CORE STATUS */}
      <div className="glass-panel p-3 border-emerald-500/30 flex items-center justify-between mb-4 bg-emerald-500/5">
         <div className="flex items-center gap-3">
            <div className="relative">
               <div className={clsx("w-8 h-8 bg-emerald-600/20 rounded-full flex items-center justify-center border border-emerald-500/40", isAnalyzing && "animate-pulse")}>
                  <BrainCircuit className="text-emerald-400" size={18} />
               </div>
               {isAnalyzing && (
                 <motion.div 
                   animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                   transition={{ duration: 2, repeat: Infinity }}
                   className="absolute inset-0 bg-emerald-400 rounded-full"
                 />
               )}
            </div>
            <div>
               <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Nexus Sentinel v4.0</p>
               <p className="text-[9px] text-emerald-200/50 uppercase leading-none">Strategic AI Dispatch Core</p>
            </div>
         </div>
         <div className="text-right">
            <div className="text-[10px] font-bold text-white uppercase tabular-nums">Sync: LIVE</div>
            <div className="text-[8px] text-emerald-500 font-black uppercase tracking-tighter">Ready For Mission</div>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
         <AnimatePresence mode="wait">
            {insight ? (
              <motion.div 
                key={latestNeedId}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="space-y-4"
              >
                 {/* REASONING BUBBLE */}
                 <div className="glass-panel p-4 border-l-4 border-l-blue-500 bg-blue-500/5 rounded-r-xl">
                    <div className="flex items-center gap-2 mb-2 text-blue-400">
                       <Target size={14} />
                       <span className="text-[10px] font-bold uppercase tracking-widest">Tactical Reasoning</span>
                    </div>
                    <p className="text-sm font-bold text-slate-200 italic leading-snug">
                       "{insight.reasoning}"
                    </p>
                 </div>

                 {/* SUGGESTED ACTION */}
                 <div className="glass-panel p-4 border-l-4 border-l-emerald-500 bg-emerald-500/5 rounded-r-xl">
                    <div className="flex items-center gap-2 mb-2 text-emerald-400">
                       <ShieldAlert size={14} />
                       <span className="text-[10px] font-bold uppercase tracking-widest">Command Action Recommendation</span>
                    </div>
                    <p className="text-sm font-bold text-emerald-50">
                       {insight.suggestion}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                       <div className="px-2 py-0.5 bg-emerald-500/20 rounded border border-emerald-500/40 text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                          Matched Optimized Resource
                       </div>
                       <button className="text-[9px] font-black uppercase text-emerald-300 hover:text-white underline underline-offset-2">Auto-Deploy</button>
                    </div>
                 </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 opacity-20">
                 <Bot size={48} className="mb-4 animate-bounce" />
                 <p className="text-[10px] font-bold uppercase tracking-[0.2em] max-w-[150px] text-center">Awaiting Live Distress Pulses For Analysis</p>
              </div>
            )}
         </AnimatePresence>

         {/* HISTORY (Mini logs) */}
         {history.length > 1 && (
           <div className="mt-10 pt-4 border-t border-white/5">
              <h5 className="text-[9px] font-bold uppercase text-slate-500 mb-3 tracking-widest flex items-center gap-2">
                 <Activity size={10} /> Strategic Chronology
              </h5>
              <div className="space-y-2">
                 {history.slice(1, 4).map((h, i) => (
                   <div key={i} className="text-[10px] text-slate-400 border-l border-white/10 pl-3 italic line-clamp-1">
                      {h.reasoning}
                   </div>
                 ))}
              </div>
           </div>
         )}
      </div>
    </div>
  );
}
