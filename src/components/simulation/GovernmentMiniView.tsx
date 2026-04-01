"use client";

import { useAppStore } from '@/lib/store';
import { Shield, AlertTriangle, Send, Clock, PhoneCall } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';

export default function GovernmentMiniView() {
  const { needs, addAnnouncement, currentUser, updateNeed } = useAppStore();
  const [msg, setMsg] = useState('');
  const [calling, setCalling] = useState(false);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;
    addAnnouncement({
      id: `alert_${Date.now()}`,
      created_by: currentUser?.id || 'govt',
      message: msg,
      urgency: 'critical',
      target_audience: 'all',
      created_at: new Date().toISOString()
    });

    // Output Warning SMS via Twilio
    try {
      await fetch('/api/notify/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'warning', message: msg })
      });
    } catch (e) {
      console.error('Gov SMS Failed', e);
    }

    setMsg('');
  };

  const triggerCall = async () => {
    if (calling) return;
    setCalling(true);
    try {
      await fetch('/api/notify/call', { method: 'POST' });
    } catch (error) {
      console.error('AI Voice Call failed');
    }
    setTimeout(() => setCalling(false), 3000);
  };

  const activeNeeds = needs.filter(n => n.status !== 'completed').sort((a,b) => (b.triage_score || 0) - (a.triage_score || 0));

  return (
    <div className="h-full flex flex-col bg-[#0F1117] border border-blue-500/30 rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-blue-600/20 px-4 py-2 border-b border-blue-500/30 flex justify-between items-center">
        <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400 flex items-center gap-2">
          <Shield size={14} /> Command Center
        </h3>
        <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">
          {activeNeeds.length} Pending
        </span>
      </div>

      {/* Broadcast Bar */}
      <div className="flex flex-col border-b border-white/5 bg-white/5 p-3 gap-2">
        <form onSubmit={handleBroadcast} className="flex gap-2">
          <input 
            type="text" 
            value={msg} 
            onChange={e => setMsg(e.target.value)}
            placeholder="Global SMS Notification..." 
            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-red-500"
          />
          <button type="submit" className="bg-red-600 hover:bg-red-500 text-white p-1.5 rounded-lg transition-colors">
            <Send size={14} />
          </button>
        </form>
        <button 
          onClick={triggerCall}
          className="bg-blue-600/20 border border-blue-500 hover:bg-blue-500 transition-colors rounded-lg px-3 py-1.5 flex justify-center items-center gap-2 text-xs text-white"
        >
          <PhoneCall size={12} className={calling ? 'animate-pulse' : ''} />
          {calling ? 'Calling Target...' : 'Trigger AI Voice Warning'}
        </button>
      </div>

      {/* Queue */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 flex flex-col gap-2">
        {activeNeeds.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-slate-600 text-[10px] uppercase font-bold tracking-widest">No active cases</div>
        ) : (
          activeNeeds.map(need => (
            <div key={need.id} className={clsx(
              "p-2 rounded-lg border flex flex-col gap-1 transition-all",
              need.urgency_label === 'critical' ? 'bg-red-900/20 border-red-500/40' : 'bg-white/5 border-white/10'
            )}>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase text-slate-300">{need.need_type} Emergency</span>
                <span className="font-mono text-[10px] font-bold text-red-400">{need.triage_score}% priority</span>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-1">{need.people_affected} affected at {need.location.lat.toFixed(2)}, {need.location.lng.toFixed(2)}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-[9px] text-slate-500 uppercase flex items-center gap-1"><Clock size={10} /> {formatDistanceToNow(new Date(need.created_at))} ago</span>
                <button 
                  onClick={() => updateNeed(need.id, { status: 'completed', completed_at: new Date().toISOString() })}
                  className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded hover:bg-emerald-500 hover:text-white transition-colors uppercase font-bold"
                >
                  Force Resolve
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
