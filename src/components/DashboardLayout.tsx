"use client";

import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  Activity, Shield, Users, HeartHandshake, LogOut, 
  Map as MapIcon, Database, Bell, LayoutDashboard,
  Settings, HelpCircle, HardDrive
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import TacticalAlertSystem from './simulation/TacticalAlertSystem';
import { AIPulseChatbot } from './AIPulseChatbot';
import { AnimatePresence } from 'framer-motion';

export default function DashboardLayout({ children, role }: { children: React.ReactNode, role: string }) {
  const router = useRouter();
  const { currentUser, setCurrentUser, announcements } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [showAnnouncements, setShowAnnouncements] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [currentUser, role, router]);

  if (!mounted) return null;

  const NavItem = ({ href, icon: Icon, label, active = false }: any) => (
    <Link 
      href={href} 
      className={clsx(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
        active 
          ? "bg-blue-50 text-[#1a3a6b] border border-blue-100 shadow-sm" 
          : "text-slate-500 hover:text-[#1a3a6b] hover:bg-slate-50"
      )}
    >
      <Icon size={18} className={active ? "text-[#1a3a6b]" : "text-slate-400"} />
      <span className="font-bold text-[10px] uppercase tracking-[0.12em]">{label}</span>
    </Link>
  );

  const getRoleIcon = () => {
    switch (role) {
      case 'victim': return <Activity size={20} className="text-red-500" />;
      case 'volunteer': return <HeartHandshake size={20} className="text-emerald-500" />;
      case 'ngo': return <Users size={20} className="text-amber-500" />;
      case 'government': return <Shield size={20} className="text-blue-500" />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f6f7] text-[#1a1a2e] font-sans">
      
      {/* PROFESSIONAL SIDEBAR (Mission Control Dark) - Hidden for Government 'War Room' */}
      {role !== 'government' && (
        <aside className="hidden md:flex flex-col w-72 h-full border-r border-slate-200 bg-white shadow-sm relative z-50">
          <div className="p-8 border-b border-slate-100 flex items-center gap-4">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 shadow-inner">
               {getRoleIcon()}
            </div>
            <div>
              <h1 className="font-black text-2xl leading-none tracking-tighter text-[#1a3a6b]">Crisora</h1>
              <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.25em] mt-1 italic leading-tight">AI Disaster Intelligence</p>
            </div>
          </div>

          <div className="flex-1 px-6 py-10 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4 px-2">Operational_Directives</p>
            <NavItem href={`/dashboard/${role}`} icon={LayoutDashboard} label="Strategic Overview" active={true} />
            {role === 'government' && (
              <NavItem href={`/scenarios`} icon={HardDrive} label="Advanced GIS Analytics" />
            )}
            {role === 'ngo' && (
              <NavItem href={`/dashboard/${role}/inventory`} icon={Database} label="Logistics Exchange" />
            )}
            <NavItem href="#" icon={MapIcon} label="Real-time Radar" />
            
            <div className="mt-10">
               <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4 px-2">Support_Services</p>
               <NavItem href="#" icon={Settings} label="System Config" />
               <NavItem href="#" icon={HelpCircle} label="Resource Library" />
            </div>
          </div>

          <div className="p-8 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-[#1a3a6b] flex items-center justify-center font-black text-[#c8922a] shadow-lg border border-white/20">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-[#1a3a6b] truncate uppercase tracking-tighter leading-tight">{currentUser?.name || 'Personnel_AD'}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                   <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest">Active_Session</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => { setCurrentUser(null); router.push('/'); }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 rounded-xl transition-all text-[10px] font-bold uppercase tracking-[0.15em]"
            >
              <LogOut size={14} />
              Secure_Logoff
            </button>
          </div>
        </aside>
      )}

      {/* Main Command Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#f5f6f7]">
        
        {/* Mobile Header (Light) */}
        <header className="md:hidden flex items-center justify-between p-5 border-b border-slate-200 bg-white z-50 shadow-sm">
           <div className="flex items-center gap-3">
              {getRoleIcon()}
              <span className="font-black text-xl text-[#1a3a6b] tracking-tighter">Crisora</span>
           </div>
           <button onClick={() => { setCurrentUser(null); router.push('/'); }} className="p-2 bg-slate-50 border border-slate-200 rounded-xl">
             <LogOut size={18} className="text-slate-400" />
           </button>
        </header>

        <TacticalAlertSystem />

        {/* TOP BAR: GLOBAL BROADCAST RELAY (Professional Light) - Hidden for Government 'War Room' */}
        {role !== 'government' && (
          <div className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="px-8 py-3 flex justify-between items-center">
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                    <span className="text-[9px] font-bold text-blue-700 uppercase tracking-[0.2em]">Relay_Active</span>
                 </div>
                 <div className="hidden md:flex text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Registry_ID: {currentUser?.id || 'UNIDENTIFIED'}
                 </div>
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowAnnouncements(!showAnnouncements)}
                  className={clsx(
                     "relative p-2.5 rounded-xl transition-all border",
                     showAnnouncements 
                      ? "bg-blue-600/20 border-blue-500/50 text-blue-400" 
                      : "bg-[#12141C] border-[#2D3139] text-slate-500 hover:text-blue-400 hover:border-blue-500/30"
                  )}
                >
                  <Bell size={18} />
                  {announcements.length > 0 && (
                     <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                  )}
                </button>

                {/* INSTITUTIONAL BROADCAST DROPDOWN */}
                <AnimatePresence>
                  {showAnnouncements && (
                    <div className="absolute top-14 right-0 w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 overflow-hidden z-50">
                      <div className="flex justify-between items-center mb-5 pb-2 border-b border-slate-100">
                         <h3 className="font-bold text-[10px] text-[#1a3a6b] uppercase tracking-[0.2em]">Regional_Alerts</h3>
                         <span className="text-[9px] font-bold text-blue-600">{announcements.length} ACTIVE</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                        {announcements.length === 0 ? (
                          <div className="flex flex-col items-center py-10 opacity-30">
                             <Bell size={32} />
                             <p className="text-[10px] uppercase font-black tracking-widest mt-3">Registry_Clear</p>
                          </div>
                        ) : announcements.map(a => (
                          <div key={a.id} className={clsx(
                            "p-4 rounded-xl border relative transition-all hover:bg-slate-800/10",
                            a.urgency === 'critical' ? 'bg-red-500/5 border-red-500/30 text-red-200' : 
                            a.urgency === 'warning' ? 'bg-amber-500/5 border-amber-500/30 text-amber-200' : 
                            'bg-blue-500/5 border-blue-500/30 text-blue-100'
                          )}>
                            <p className="font-bold text-[11px] leading-relaxed mb-2 uppercase italic tracking-tight underline underline-offset-4 decoration-current/20">{a.message}</p>
                            <div className="flex justify-between items-center opacity-60">
                               <span className="text-[8px] font-black uppercase tracking-widest">{a.urgency} SIGNAL</span>
                               <span className="text-[8px] font-mono tracking-tighter">[{new Date(a.created_at).toLocaleTimeString()}]</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {/* PAGE CONTENT CONTAINER */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 w-full min-h-0">
           {children}
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
      
      {/* 🏥 UNIVERSAL AI PULSE CHATBOT */}
      <AIPulseChatbot />
    </div>
  );
}

