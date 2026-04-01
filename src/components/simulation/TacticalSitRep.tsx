"use client";

import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertCircle, CheckCircle, Info, MapPin, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';

export default function TacticalSitRep() {
  const { events } = useAppStore();

  return (
    <div className="flex flex-col h-full bg-[#0A0C10] border border-[#2D3139] overflow-hidden">
      <div className="px-4 py-2 bg-black/40 border-b border-[#2D3139] flex items-center justify-between">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Situation Report Feed</h2>
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
           <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Live Sync</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
        <AnimatePresence initial={false}>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              className={clsx(
                "p-3 rounded border-l-2 bg-white/5 group relative overflow-hidden transition-all hover:bg-white/10",
                event.severity === 'critical' ? 'border-red-500 shadow-[2px_0_10px_rgba(239,68,68,0.1)]' : 
                event.severity === 'warning' ? 'border-yellow-500' : 'border-blue-500'
              )}
            >
              <div className="flex justify-between items-start mb-1">
                 <div className="flex items-center gap-2">
                    {getIcon(event.type, event.severity)}
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                       {event.type} • {event.id.slice(-4)}
                    </span>
                 </div>
                 <span className="text-[8px] font-bold text-slate-600 uppercase">
                    {formatDistanceToNow(new Date(event.timestamp))} ago
                 </span>
              </div>
              
              <p className={clsx(
                "text-[11px] font-bold leading-relaxed",
                event.severity === 'critical' ? 'text-red-400' : 'text-slate-300'
              )}>
                {event.message}
              </p>

              {event.location && (
                <div className="mt-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                   <MapPin size={10} className="text-slate-500" />
                   <span className="text-[8px] font-mono text-slate-500">
                      {event.location.lat.toFixed(4)}, {event.location.lng.toFixed(4)}
                   </span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {events.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20 py-10">
             <Zap size={24} className="mb-2" />
             <p className="text-[9px] font-black uppercase tracking-widest">Awaiting records...</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2D3139; border-radius: 10px; }
      `}</style>
    </div>
  );
}

function getIcon(type: string, severity: string) {
  const size = 12;
  const color = severity === 'critical' ? '#EF4444' : severity === 'warning' ? '#F59E0B' : '#3B82F6';
  
  switch (type) {
    case 'emergency': return <AlertCircle size={size} style={{ color }} />;
    case 'success': return <CheckCircle size={size} style={{ color }} />;
    case 'deployment': return <Activity size={size} style={{ color }} />;
    default: return <Info size={size} style={{ color }} />;
  }
}
