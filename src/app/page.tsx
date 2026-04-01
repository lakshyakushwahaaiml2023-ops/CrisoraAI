"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { MOCK_USERS } from "@/lib/mock-data";
import { User } from "@/lib/types";
import { Database, HardDrive, Shield, Activity, HeartHandshake, Users } from "lucide-react";

// Role display metadata
const ROLE_CONFIG: Record<string, {
  label: string;
  badgeColor: string;
  dotColor: string;
  sectionBorder: string;
  tagBg: string;
  tagText: string;
  abbr: string;
}> = {
  government: {
    label: "Government Authority",
    badgeColor: "#1d4ed8",
    dotColor: "bg-blue-500",
    sectionBorder: "border-blue-700",
    tagBg: "bg-blue-950",
    tagText: "text-blue-300",
    abbr: "GOV",
  },
  volunteer: {
    label: "Field Volunteer",
    badgeColor: "#15803d",
    dotColor: "bg-emerald-500",
    sectionBorder: "border-emerald-700",
    tagBg: "bg-emerald-950",
    tagText: "text-emerald-300",
    abbr: "VOL",
  },
  ngo: {
    label: "NGO / Organisation",
    badgeColor: "#b45309",
    dotColor: "bg-amber-500",
    sectionBorder: "border-amber-700",
    tagBg: "bg-amber-950",
    tagText: "text-amber-300",
    abbr: "ORG",
  },
  victim: {
    label: "Registered Civilian",
    badgeColor: "#6d28d9",
    dotColor: "bg-violet-500",
    sectionBorder: "border-violet-700",
    tagBg: "bg-violet-950",
    tagText: "text-violet-300",
    abbr: "CIV",
  },
};

const SECTIONS: { role: keyof typeof ROLE_CONFIG; heading: string }[] = [
  { role: "government",  heading: "State Authorities" },
  { role: "ngo",         heading: "Registered Organisations" },
  { role: "volunteer",   heading: "Field Response Units" },
  { role: "victim",      heading: "Registered Civilians" },
];

export default function LandingPage() {
  const router = useRouter();
  const { setCurrentUser, installMockData, rehydrateFromDB, hardReset } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    installMockData();
    rehydrateFromDB();
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, [installMockData, rehydrateFromDB]);

  const loginAs = (user: User) => {
    setCurrentUser(user);
    router.push(`/dashboard/${user.role}`);
  };

  if (!mounted) return null;

  const dateStr = now.toLocaleDateString("en-IN", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-IN", { hour12: false });

  return (
    <div className="min-h-screen bg-[#f5f6f7] text-[#1a1a2e] font-sans">

      {/* ── GOVT HEADER ────────────────────────────────────────────── */}
      <header className="bg-white border-b-4 border-[#1a3a6b] shadow-sm">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Emblem placeholder */}
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden border-2 border-[#c8922a] shadow-lg">
              <img src="/logo.png" alt="Crisora Logo" className="w-full h-full object-cover" />
            </div>
            <div className="border-l border-slate-300 pl-5">
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-[0.22em] mb-0.5">
                Ministry of Home Affairs — Government of India
              </p>
              <h1 className="text-lg font-bold text-[#1a3a6b] tracking-tight leading-none">
                Crisora Intelligence System
              </h1>
              <p className="text-[10px] font-semibold text-slate-500 tracking-wide mt-0.5">
                Integrated Emergency Response Platform · Indore Region
              </p>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-end gap-1 shrink-0">
            <span className="text-xs font-semibold text-slate-500">{dateStr}</span>
            <span className="text-sm font-bold text-[#1a3a6b] tracking-widest tabular-nums">{timeStr} IST</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest">System Operational</span>
            </div>
          </div>
        </div>

        {/* Sub-nav */}
        <div className="bg-[#1a3a6b] px-6">
          <div className="max-w-screen-xl mx-auto flex items-center gap-0 overflow-x-auto">
            {["Dashboard Access", "Incident Reports", "Resource Registry", "Historical Analysis", "National Helpline: 1078"].map((item, i) => (
              <div 
                key={item} 
                onClick={() => {
                   if (item === "Historical Analysis") window.location.href = "/scenarios";
                }}
                className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap border-b-2 transition-colors cursor-pointer select-none ${i === 0 ? "text-white border-[#c8922a]" : "text-blue-200/60 border-transparent hover:text-white"}`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── HERO BAND ───────────────────────────────────────────────── */}
      <div className="bg-[#1a3a6b] text-white px-6 py-8">
        <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="inline-block bg-white/10 border border-white/20 text-blue-100 text-[9px] font-bold uppercase tracking-[0.22em] px-3 py-1 rounded-sm mb-3">
              Controlled Access Environment — Authorised Personnel Only
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
              Emergency Response Command Portal
            </h2>
            <p className="text-sm text-blue-200 max-w-2xl leading-relaxed">
              Select a verified role identity from the registry below to access the corresponding operational dashboard.
              Access is restricted to authenticated personnel. All sessions are recorded per Crisora Protocol 2024-DR-7.
            </p>
          </div>

          {/* Public SOS — no login */}
          <button
            onClick={() => router.push("/emergency")}
            className="shrink-0 bg-red-700 hover:bg-red-600 border-2 border-red-500 text-white px-8 py-4 rounded-sm font-bold text-sm tracking-wide uppercase transition-colors flex flex-col items-center gap-1 active:scale-95"
          >
            <span className="text-lg">🚨</span>
            Public SOS Portal
            <span className="text-[9px] font-semibold text-red-200 tracking-widest normal-case">
              Open access · No authentication required
            </span>
          </button>
        </div>
      </div>

      {/* ── IDENTITY REGISTRY ───────────────────────────────────────── */}
      <main className="max-w-screen-xl mx-auto px-6 py-10 space-y-12 pb-20">

        {SECTIONS.map(({ role, heading }) => {
          const cfg = ROLE_CONFIG[role];
          const users = MOCK_USERS.filter(u => u.role === role);
          if (!users.length) return null;

          return (
            <section key={role}>
              {/* Section Header */}
              <div className={`flex items-center justify-between mb-4 pb-3 border-b-2 ${cfg.sectionBorder}`}>
                <div className="flex items-center gap-3">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${cfg.dotColor}`} />
                  <h3 className="text-sm font-bold text-[#1a3a6b] uppercase tracking-[0.14em]">
                    {heading}
                  </h3>
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border border-slate-200 px-2.5 py-1 rounded bg-white">
                  {users.length} {users.length === 1 ? "record" : "records"}
                </span>
              </div>

              {/* Identity Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {users.map(user => (
                  <button
                    key={user.id}
                    onClick={() => loginAs(user)}
                    className="bg-white border border-slate-200 hover:border-[#1a3a6b] hover:shadow-md p-0 rounded-sm text-left flex flex-col transition-all duration-200 group overflow-hidden"
                  >
                    {/* Card Color Strip */}
                    <div className="h-1 w-full" style={{ backgroundColor: cfg.badgeColor }} />

                    <div className="p-4 flex flex-col gap-3 flex-1">
                      {/* Name + Role Badge */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold text-[#1a1a2e] leading-tight">{user.name}</p>
                          <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
                            {cfg.label}
                          </p>
                        </div>
                        <span className={`shrink-0 text-[9px] font-black tracking-widest px-2 py-0.5 rounded-sm border ${cfg.tagBg} ${cfg.tagText} border-current`}>
                          {cfg.abbr}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="text-[10px] text-slate-500 space-y-1 border-t border-slate-100 pt-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-400 uppercase tracking-wider">Email</span>
                          <span className="font-mono text-slate-600 truncate max-w-[160px]">{user.email}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-400 uppercase tracking-wider">Phone</span>
                          <span className="font-mono text-slate-600">{user.phone}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-400 uppercase tracking-wider">Location</span>
                          <span className="font-mono text-slate-600">
                            {user.location.lat.toFixed(3)}, {user.location.lng.toFixed(3)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-400 uppercase tracking-wider">Region</span>
                          <span className="text-slate-600">Indore, Madhya Pradesh</span>
                        </div>
                      </div>
                    </div>

                    {/* Login CTA */}
                    <div className="mx-4 mb-4 bg-slate-50 group-hover:bg-[#1a3a6b] border border-slate-200 group-hover:border-[#1a3a6b] text-slate-500 group-hover:text-white text-[9px] font-bold uppercase tracking-[0.18em] py-2 text-center transition-all rounded-sm">
                      Authenticate as {user.name.split(" ")[0]}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          );
        })}

        {/* ── HISTORICAL ARCHIVE PROMOTION ───────────────────────────── */}
        <section className="bg-[#0a1628] border border-[#c8922a]/30 rounded-2xl overflow-hidden relative group cursor-pointer" onClick={() => window.location.href = "/scenarios"}>
           <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
              <Database size={120} className="text-[#c8922a]" />
           </div>
           <div className="p-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#c8922a] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(200,146,42,0.3)]">
                 <HardDrive size={32} className="text-[#0a1628]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Mission Intelligence & Historical Archive</h3>
              <p className="text-slate-400 text-sm max-w-xl mb-8 leading-relaxed italic">
                 "Understand the past to safeguard the future." Access the Crisora Tactical Archive containing data on over 8 regional catastrophes including the 1984 Bhopal tragedy and the 2001 Bhuj tremor. 
              </p>
              <div className="flex gap-4">
                 <div className="px-6 py-3 bg-[#c8922a] hover:bg-[#e6b04a] text-[#0a1628] font-black text-[11px] uppercase tracking-[0.2em] rounded transition-all active:scale-95">
                    Launch Tactical Archive
                 </div>
                 <div className="px-6 py-3 border border-slate-700 text-slate-400 font-bold text-[11px] uppercase tracking-[0.2em] rounded">
                    8 Registered Scenarios
                 </div>
              </div>
           </div>
           <div className="h-1.5 w-full bg-[#c8922a]" />
        </section>
      </main>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer className="bg-[#1a3a6b] text-white px-6 py-5 border-t border-[#c8922a]">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
            <p className="text-[9px] font-semibold text-blue-200 uppercase tracking-[0.18em]">
              National Disaster Management Authority · Ministry of Home Affairs · Government of India
            </p>
            <div className="flex items-center gap-4">
              <span className="text-[9px] text-blue-300">Platform v2.1 · Indore Node</span>
              <span className="text-[9px] text-blue-300">|</span>
              <span className="text-[9px] text-blue-300">© 2024 Crisora. All Rights Reserved.</span>
            </div>
          </div>

          <div className="flex gap-4">
             <button 
               onClick={() => {
                 if(confirm("DANGER: This will wipe all session data and hard-reset the system to Indore Command Center defaults. Proceed?")) {
                   hardReset();
                   window.location.reload();
                 }
               }}
               className="text-[9px] font-bold uppercase tracking-widest text-red-300 border border-red-900 bg-red-950/20 px-3 py-1.5 rounded hover:bg-red-900/40 transition-colors"
             >
               ⚠️ System Data Reset
             </button>
          </div>
        </div>
      </footer>
    </div>
  );
}