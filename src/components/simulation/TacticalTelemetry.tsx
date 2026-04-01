"use client";

import React, { useState, useEffect } from 'react';
import { Wifi, Battery, MapPin, Radio, Zap, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TacticalTelemetry() {
  const [time, setTime] = useState(new Date());
  const [battery, setBattery] = useState(98);
  const [signal, setSignal] = useState(4);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    const b = setInterval(() => setBattery(prev => Math.max(5, prev - (Math.random() > 0.9 ? 1 : 0))), 60000);
    return () => { clearInterval(t); clearInterval(b); };
  }, []);

  return (
    <div className="h-8 bg-black border-t border-[#2D3139] flex items-center px-4 justify-between font-mono-data overflow-hidden shrink-0 z-50 relative">
      {/* Left side: System Clock & Signal */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
           <Radio size={12} className="text-emerald-500 animate-pulse" />
           <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Link: SAT-COMM-Alpha</span>
        </div>
        <div className="flex items-center gap-1.5 h-3">
           {[1, 2, 3, 4, 5].map((bar) => (
             <div 
               key={bar} 
               className={`w-1 rounded-sm transition-all ${bar <= signal ? 'bg-emerald-500' : 'bg-white/10'}`} 
               style={{ height: `${bar * 20}%` }}
             />
           ))}
        </div>
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
          HDOP: <span className="text-white">0.82 (EXCELLENT)</span>
        </div>
      </div>

      {/* Center side: Scrolling Ticker (Optional/Static for now) */}
      <div className="hidden lg:flex items-center gap-4 text-[9px] text-slate-500 font-black uppercase tracking-widest overflow-hidden">
        <div className="flex gap-8 whitespace-nowrap animate-marquee">
           <span>FIELD_UNIT_ACTIVE: NEXUS-SENTINEL-14</span>
           <span className="text-emerald-500">ENCRYPTED_TUNNEL: ESTABLISHED</span>
           <span>ZONE_THREAT_LEVEL: MODERATE</span>
           <span className="text-red-500">SECTOR: KILO-ALPHA-7</span>
        </div>
      </div>

      {/* Right side: Battery & Time */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
           <Zap size={12} className={battery < 20 ? "text-red-500 animate-bounce" : "text-yellow-500"} />
           <span className={`text-[10px] font-black ${battery < 20 ? "text-red-500" : "text-white"}`}>{battery}%</span>
        </div>
        <div className="w-px h-3 bg-white/10" />
        <div className="text-[10px] font-black text-white tabular-nums tracking-widest">
          {time.toLocaleTimeString('en-US', { hour12: false })}
        </div>
        <div className="flex items-center gap-1.5 ml-2">
           <Globe size={12} className="text-blue-500" />
           <span className="text-[10px] font-bold text-slate-400">UTC+5:30</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
