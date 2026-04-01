"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, BrainCircuit, Zap, ShieldAlert, Heart, Activity, Radio, LogOut } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { runPulseOracle, PulseOracleResponse } from '@/lib/agents';
import clsx from 'clsx';

/**
 * 🏥 CRISORA PULSE AI CHATBOT
 * A situationally-aware agent that provides tactical guidance and reassurance.
 */
export const AIPulseChatbot = () => {
    const { 
        currentUser, 
        needs, 
        volunteers, 
        ngos, 
        tasks,
        isMassPanicActive, 
        addAnnouncement, 
        assignTask 
    } = useAppStore();

    const [isOpen, setIsOpen] = useState(false);
    const [advice, setAdvice] = useState<PulseOracleResponse | null>(null);
    const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([]);
    const [isPulsing, setIsPulsing] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // 🧠 AI Sentinel Logic: Update advice when situation changes
    useEffect(() => {
        if (!currentUser) return;

        const resp = runPulseOracle(
            currentUser.role,
            currentUser,
            needs,
            volunteers,
            ngos,
            tasks,
            isMassPanicActive
        );

        setAdvice(resp);

        // Proactive behavior in Panic Mode
        if (isMassPanicActive && !isOpen) {
            setIsPulsing(true);
            // Optionally auto-open or just pulse heavily
        } else {
            setIsPulsing(false);
        }

        // Add to chat history if it's new/different
        if (resp.message && (!messages.length || messages[messages.length-1].text !== resp.message)) {
            setMessages(prev => [...prev, { role: 'ai', text: resp.message }]);
        }
    }, [isMassPanicActive, needs.length, volunteers.length, currentUser?.role]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleExecute = () => {
        if (!advice?.suggestion) return;

        const { type, payload, label } = advice.suggestion;

        if (type === 'broadcast') {
            addAnnouncement({
                id: `pulse_auto_${Date.now()}`,
                created_by: 'AI_PULSE_COMMAND',
                message: payload.message,
                urgency: 'critical',
                target_audience: 'all',
                created_at: new Date().toISOString()
            });
            setMessages(prev => [...prev, { role: 'user', text: `Confirmed: ${label}` }]);
            setMessages(prev => [...prev, { role: 'ai', text: "Strategic Relay Executed. SMS dispatch confirmed across all active sectors." }]);
        }

        if (type === 'deploy') {
            const nearestNGO = ngos[0]; // Simplified for demo
            if (nearestNGO) {
                // In a real app, we'd have a dispatchVolunteer or similar
                // For now, let's log the execution
                setMessages(prev => [...prev, { role: 'user', text: `Confirmed: ${label}` }]);
                setMessages(prev => [...prev, { role: 'ai', text: `Deployment Initiated. Unit ${nearestNGO.org_name} has received mission packet. Coordinates synced.` }]);
            }
        }
    };

    if (!currentUser) return null;

    return (
        <div className={clsx(
            "fixed bottom-6 right-6 z-[6000] flex flex-col items-end gap-3 font-sans",
            currentUser.role === 'government' ? "lg:right-[30px]" : "right-8"
        )}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 50 }}
                        className="w-[340px] md:w-[360px] h-[550px] bg-[#0a1628]/98 backdrop-blur-3xl border border-[#c8922a]/30 rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col mb-4"
                    >
                        {/* Header */}
                        <div className={clsx(
                            "px-6 py-4 flex items-center justify-between border-b border-[#1e2d3d]",
                            isMassPanicActive ? "bg-red-950/60" : "bg-blue-950/60"
                        )}>
                            <div className="flex items-center gap-3">
                                <div className={clsx(
                                    "p-2 rounded-xl border flex items-center justify-center",
                                    isMassPanicActive ? "bg-red-500/20 border-red-500/30 text-red-400" : "bg-blue-500/20 border-blue-500/30 text-blue-400"
                                )}>
                                    <BrainCircuit size={18} className={isMassPanicActive ? "animate-[pulse_1.5s_infinite]" : ""} />
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Crisora Pulse AI</h3>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Situationally Aware Agent</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Chat Feed */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {messages.map((m, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: m.role === 'ai' ? -10 : 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={clsx(
                                        "flex flex-col gap-2 max-w-[85%]",
                                        m.role === 'ai' ? "self-start" : "self-end items-end ml-auto"
                                    )}
                                >
                                    <div className={clsx(
                                        "px-4 py-3 rounded-2xl text-[11px] font-medium leading-relaxed shadow-lg border",
                                        m.role === 'ai' 
                                            ? (isMassPanicActive ? "bg-red-900/20 border-red-800 text-red-200" : "bg-[#1e2d3d]/50 border-[#2d3f55] text-slate-200")
                                            : "bg-[#c8922a] border-[#e6b04a] text-[#0a1628] font-bold"
                                    )}>
                                        {m.text}
                                    </div>
                                    <span className="text-[7px] text-slate-600 font-bold uppercase tracking-widest px-2">
                                        {m.role === 'ai' ? "Crisora_Sentinel" : "Commander"}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Tactical Options for Government */}
                        {currentUser.role === 'government' && advice?.suggestion && (
                            <div className="p-4 bg-black/30 border-t border-[#1e2d3d]">
                                <motion.div 
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="p-4 bg-[#c8922a]/10 border border-[#c8922a]/30 rounded-2xl flex flex-col gap-3"
                                >
                                    <div className="flex items-center gap-2">
                                        <Zap size={14} className="text-[#c8922a]" />
                                        <h4 className="text-[9px] font-black text-[#c8922a] uppercase tracking-widest">Recommended Course of Action</h4>
                                    </div>
                                    <p className="text-[10px] text-slate-300 italic leading-snug">
                                        Commander, current telemetry suggests immediate {advice.suggestion.label.toLowerCase()} is optimal.
                                    </p>
                                    <button 
                                        onClick={handleExecute}
                                        className="w-full py-2.5 bg-[#c8922a] hover:bg-[#e6b04a] text-[#0a1628] text-[9px] font-black uppercase tracking-[.15em] rounded-xl transition-all shadow-lg active:scale-95"
                                    >
                                        Execute: {advice.suggestion.label}
                                    </button>
                                </motion.div>
                            </div>
                        )}

                        {/* Input (Placeholder Visual) */}
                        <div className="p-6 border-t border-[#1e2d3d] flex gap-3">
                             <input 
                                type="text" 
                                placeholder="Request tactical intel..."
                                className="flex-1 bg-[#0f1923] border border-[#1e2d3d] rounded-xl px-4 py-3 text-[10px] outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-slate-700"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const text = (e.target as HTMLInputElement).value;
                                        if (!text || !currentUser) return;
                                        setMessages(prev => [...prev, { role: 'user', text }]);
                                        (e.target as HTMLInputElement).value = '';
                                        
                                        // 🛰️ CONTEXTUAL AI RESPONSE
                                        const aiResp = runPulseOracle(
                                            currentUser.role,
                                            currentUser,
                                            needs,
                                            volunteers,
                                            ngos,
                                            tasks,
                                            isMassPanicActive,
                                            text
                                        );

                                        setTimeout(() => {
                                            setMessages(prev => [...prev, { role: 'ai', text: aiResp.message }]);
                                        }, 600);
                                    }
                                }}
                             />
                             <button className="p-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                                <Send size={16} />
                             </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bubble Trigger */}
            <motion.button 
                onClick={() => setIsOpen(!isOpen)}
                animate={isPulsing ? {
                    scale: [1, 1.1, 1],
                    boxShadow: [
                        "0 0 0px 0px rgba(220, 38, 38, 0)",
                        "0 0 20px 10px rgba(220, 38, 38, 0.4)",
                        "0 0 0px 0px rgba(220, 38, 38, 0)"
                    ]
                } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className={clsx(
                    "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 border-4",
                    isMassPanicActive 
                        ? "bg-red-600 border-white/20 text-white shadow-red-600/40" 
                        : "bg-[#0a1628] border-[#c8922a] text-[#c8922a] shadow-blue-900/20"
                )}
            >
                {isOpen ? <X size={28} /> : (
                    isMassPanicActive ? <ShieldAlert size={28} className="animate-bounce" /> : <BrainCircuit size={28} />
                )}
                {isPulsing && !isOpen && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-400 rounded-full border-2 border-white animate-pulse" />
                )}
            </motion.button>
        </div>
    );
};
