"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  Plus,
  Target,
  Settings,
} from "lucide-react";

export function MobileNav({ onOpenAddTransaction }: { onOpenAddTransaction: () => void }) {
  const pathname = usePathname();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 px-6 py-2 pb-safe">
      <div className="flex items-center justify-between max-w-md mx-auto relative">
        {/* 1. Dashboard */}
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${
            pathname === "/dashboard" ? "text-brand-500 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </Link>

        {/* 2. Transactions */}
        <Link
          href="/transactions"
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${
            pathname.startsWith("/transactions") ? "text-brand-500 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Receipt className="w-5 h-5" />
          <span className="text-[10px]">Transaksi</span>
        </Link>

        {/* 3. CENTER FLOATING PLUS BUTTON */}
        <div className="relative -top-4">
          <button
            onClick={onOpenAddTransaction}
            className="w-14 h-14 rounded-full bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center shadow-fab shadow-brand-500/40 ring-4 ring-white active:scale-95 transition-all duration-200"
            aria-label="Tambah Transaksi"
          >
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </button>
        </div>

        {/* 4. Savings */}
        <Link
          href="/savings"
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${
            pathname.startsWith("/savings") ? "text-brand-500 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Target className="w-5 h-5" />
          <span className="text-[10px]">Tabungan</span>
        </Link>

        {/* 5. Settings */}
        <Link
          href="/settings"
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${
            pathname.startsWith("/settings") ? "text-brand-500 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px]">Setelan</span>
        </Link>
      </div>
    </div>
  );
}
