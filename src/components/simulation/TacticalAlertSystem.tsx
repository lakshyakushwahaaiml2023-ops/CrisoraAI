"use client";

import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Activity } from 'lucide-react';
import clsx from 'clsx';

export default function TacticalAlertSystem() {
  const { activeIncident } = useAppStore();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!activeIncident) return;
    const interval = setInterval(() => setPulse(p => !p), 2000);
    return () => clearInterval(interval);
  }, [activeIncident]);

  return (
    <AnimatePresence>
      {activeIncident && (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
          {/* VIEWPORT BORDER PULSE */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: pulse ? 0.4 : 0.1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 border-[10px] border-red-600 box-border shadow-[inset_0_0_100px_rgba(220,38,38,0.2)]"
          />

          {/* TOP OVERRIDE BANNER */}
          <motion.div 
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            exit={{ y: -50 }}
            className="absolute top-0 left-0 right-0 h-6 bg-red-600 flex items-center overflow-hidden border-b border-black shadow-lg"
          >
             <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap gap-10 items-center">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 text-black font-black text-[10px] uppercase tracking-[0.2em] italic">
                     <ShieldAlert size={12} />
                     CRITICAL_MISSION_OVERRIDE // ACTIVE_INCIDENT: {activeIncident.name.toUpperCase()} // SEVERITY: {activeIncident.severity.toUpperCase()} // STATUS: RED_ALERT
                  </div>
                ))}
             </div>
          </motion.div>

          {/* BOTTOM OVERRIDE BANNER (REVERSED) */}
          <motion.div 
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
            className="absolute bottom-0 left-0 right-0 h-6 bg-red-600 flex items-center overflow-hidden border-t border-black shadow-lg"
          >
             <div className="flex animate-[marquee_reversed_30s_linear_infinite] whitespace-nowrap gap-10 items-center">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 text-black font-black text-[10px] uppercase tracking-[0.2em] italic">
                     <Activity size={12} />
                     TACTICAL_FOCUS_MODE_ENABLED // LOCAL_SURVIVAL_PROTOCOL_ACTIVE // ALL_ROLES_IN_SYNC // NEXUS_COMMAND_OVERRIDE
                  </div>
                ))}
             </div>
          </motion.div>

          <style jsx>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            @keyframes marquee_reversed {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0); }
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  );
}
