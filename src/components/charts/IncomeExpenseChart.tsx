"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/formatters";

interface TrendItem {
  monthName?: string;
  dayName?: string;
  income: number;
  expense: number;
}

export function IncomeExpenseChart({
  data = [],
  title = "Pemasukan vs Pengeluaran",
}: {
  data: TrendItem[];
  title?: string;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card flex items-center justify-center h-64 text-slate-400 text-sm">
        Belum ada data aktivitas keuangan.
      </div>
    );
  }

  // Calculate highest value for relative scaling
  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.income, d.expense)),
    100000
  );

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">Grafik perbandingan riil transaksi</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600">Pemasukan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
            <span className="text-slate-600">Pengeluaran</span>
          </div>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 border-b border-slate-100">
        {data.map((item, idx) => {
          const incHeight = Math.max(4, Math.round((item.income / maxVal) * 100));
          const expHeight = Math.max(4, Math.round((item.expense / maxVal) * 100));
          const isHovered = hoveredIdx === idx;
          const label = item.monthName || item.dayName || `#${idx + 1}`;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-14 z-20 bg-slate-900 text-white text-[11px] py-1.5 px-3 rounded-xl shadow-lg whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-90 duration-150">
                  <div className="text-slate-300 font-bold mb-0.5">{label}</div>
                  <div className="text-emerald-400">+{formatCurrency(item.income)}</div>
                  <div className="text-rose-400">-{formatCurrency(item.expense)}</div>
                </div>
              )}

              {/* Dual Bars Container */}
              <div className="w-full max-w-[28px] flex items-end justify-center gap-1 h-full">
                {/* Income Bar */}
                <div
                  style={{ height: `${incHeight}%` }}
                  className="w-1/2 bg-emerald-500 rounded-t-md hover:bg-emerald-600 transition-all duration-300"
                />
                {/* Expense Bar */}
                <div
                  style={{ height: `${expHeight}%` }}
                  className="w-1/2 bg-brand-500 rounded-t-md hover:bg-brand-600 transition-all duration-300"
                />
              </div>

              {/* Label */}
              <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-700 mt-2">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
