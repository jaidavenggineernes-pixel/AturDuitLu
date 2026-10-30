"use client";

import React from "react";
import { formatCurrency } from "@/lib/formatters";
import { Briefcase, Wallet, CreditCard, PiggyBank } from "lucide-react";

interface MetricsCarouselProps {
  totalIncome: number;
  totalExpense: number;
  currentBalance: number;
  totalSavings: number;
}

export function MetricsCarousel({
  totalIncome,
  totalExpense,
  currentBalance,
  totalSavings,
}: MetricsCarouselProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
      {/* 1. Total Income Card */}
      <div className="min-w-[240px] sm:min-w-[260px] p-5 rounded-3xl bg-white border border-slate-100 shadow-card flex flex-col justify-between shrink-0 hover:shadow-card-hover transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Pemasukan
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Briefcase className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {formatCurrency(totalIncome)}
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <span>●</span> Sumber pendapatan aktif
          </div>
        </div>
      </div>

      {/* 2. Total Expense Card (Highlighted Vibrant Royal Blue - matches Monex reference!) */}
      <div className="min-w-[240px] sm:min-w-[260px] p-5 rounded-3xl bg-brand-500 text-white shadow-floating flex flex-col justify-between shrink-0 hover:bg-brand-600 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-white/80 uppercase tracking-wider">
            Total Pengeluaran
          </span>
          <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center backdrop-blur-sm">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-white tracking-tight">
            {formatCurrency(totalExpense)}
          </div>
          <div className="mt-1 text-[11px] text-white/80 font-medium">
            Bulan berjalan
          </div>
        </div>
      </div>

      {/* 3. Total Balance Card */}
      <div className="min-w-[240px] sm:min-w-[260px] p-5 rounded-3xl bg-white border border-slate-100 shadow-card flex flex-col justify-between shrink-0 hover:shadow-card-hover transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Saldo Tersedia
          </span>
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-600 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {formatCurrency(currentBalance)}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-medium">
            Kas saat ini
          </div>
        </div>
      </div>

      {/* 4. Total Savings Card */}
      <div className="min-w-[240px] sm:min-w-[260px] p-5 rounded-3xl bg-white border border-slate-100 shadow-card flex flex-col justify-between shrink-0 hover:shadow-card-hover transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Tabungan
          </span>
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <PiggyBank className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {formatCurrency(totalSavings)}
          </div>
          <div className="mt-1 text-[11px] text-purple-600 font-semibold">
            Target masa depan
          </div>
        </div>
      </div>
    </div>
  );
}
