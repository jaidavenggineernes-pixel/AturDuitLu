"use client";

import React from "react";
import Link from "next/link";
import { PlusCircle, Target, PieChart, FileDown } from "lucide-react";

export function QuickActionsBar({ onOpenAddTransaction }: { onOpenAddTransaction: () => void }) {
  return (
    <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
      <button
        onClick={onOpenAddTransaction}
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-500/20 shrink-0 transition-all active:scale-95"
      >
        <PlusCircle className="w-4 h-4" />
        Tambah Transaksi
      </button>

      <Link
        href="/savings"
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shrink-0 transition-all"
      >
        <Target className="w-4 h-4 text-purple-500" />
        Target Tabungan
      </Link>

      <Link
        href="/budgets"
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shrink-0 transition-all"
      >
        <PieChart className="w-4 h-4 text-amber-500" />
        Atur Anggaran
      </Link>

      <Link
        href="/reports"
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shrink-0 transition-all"
      >
        <FileDown className="w-4 h-4 text-emerald-500" />
        Export Laporan
      </Link>
    </div>
  );
}
