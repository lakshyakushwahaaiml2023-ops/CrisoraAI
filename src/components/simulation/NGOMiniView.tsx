"use client";

import { useAppStore } from '@/lib/store';
import { Package, Truck, Database, Send, Plus } from 'lucide-react';
import clsx from 'clsx';

export default function NGOMiniView() {
  const { inventory, ngos, currentUser } = useAppStore();

  const myInventory = inventory.filter(i => i.ngo_id === currentUser?.id || i.ngo_id === 'n1');
  const totalItems = myInventory.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="h-full flex flex-col bg-[#0F1117] border border-orange-500/30 rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-orange-600/20 px-4 py-2 border-b border-orange-500/30 flex justify-between items-center">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#EF9F27] flex items-center gap-2">
          <Database size={14} /> NGO Resource Hub
        </h3>
        <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-bold">
          {myInventory.length} SKUs
        </span>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-px bg-white/10">
        <div className="p-3 bg-[#0F1117] flex items-center gap-2">
           <Package size={16} className="text-orange-400" />
           <div>
             <div className="text-sm font-bold text-white">{totalItems}</div>
             <div className="text-[9px] text-slate-500 uppercase tracking-widest leading-none">Units</div>
           </div>
        </div>
        <div className="p-3 bg-[#0F1117] flex items-center gap-2">
           <Truck size={16} className="text-blue-400" />
           <div>
             <div className="text-sm font-bold text-white">12</div>
             <div className="text-[9px] text-slate-500 uppercase tracking-widest leading-none">Fleet</div>
           </div>
        </div>
      </div>

      {/* Inventory List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 flex flex-col gap-2">
        {myInventory.map(item => (
          <div key={item.id} className="bg-white/5 border border-white/10 p-2 rounded-lg flex justify-between items-center group transition-colors hover:bg-white/10">
            <div>
              <p className="text-[10px] font-bold text-slate-200 uppercase tracking-tighter">{item.item_name}</p>
              <div className="flex gap-2 items-center">
                 <span className={clsx("text-[9px] uppercase font-bold", item.quantity < 50 ? 'text-red-400' : 'text-slate-500')}>
                   {item.quantity < 50 ? 'Low Stock' : 'Stable'}
                 </span>
                 <span className="text-[9px] text-slate-500">•</span>
                 <span className="text-[9px] text-slate-500 uppercase">{item.resource_type}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-[#EF9F27] leading-none">{item.quantity}</div>
              <div className="text-[9px] text-slate-500 uppercase">{item.unit}</div>
            </div>
          </div>
        ))}
        {/* Placeholder for sharing */}
        <div className="mt-2 border-t border-white/10 pt-2">
           <button className="w-full flex items-center justify-center gap-2 bg-blue-600/20 text-blue-400 border border-blue-500/40 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest">
             <Plus size={12} /> Share Surplus
           </button>
        </div>
      </div>
    </div>
  );
}
