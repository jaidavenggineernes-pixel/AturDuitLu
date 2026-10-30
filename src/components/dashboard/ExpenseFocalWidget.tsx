"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/formatters";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ExpenseFocalWidgetProps {
  totalExpense: number;
  totalBudget?: number;
  activeTab: "spends" | "categories";
  setActiveTab: (tab: "spends" | "categories") => void;
}

export function ExpenseFocalWidget({
  totalExpense,
  totalBudget = 3500000,
  activeTab,
  setActiveTab,
}: ExpenseFocalWidgetProps) {
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  const now = new Date();
  const currentMonthName = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(now);

  // Generate weekday headers and days
  const daysInWeek = [
    { name: "Min", day: 25 },
    { name: "Sen", day: 26 },
    { name: "Sel", day: 27 },
    { name: "Rab", day: 28 },
    { name: "Kam", day: 29 },
    { name: "Jum", day: 30 },
    { name: "Sab", day: 31 },
  ];

  const budgetUsage =
    totalBudget > 0 ? Math.min(100, Math.round((totalExpense / totalBudget) * 100)) : 0;

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card">
      {/* Month Navigator Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Bulan sebelumnya"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-bold text-slate-800 capitalize">
          {currentMonthName}
        </span>
        <button
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Bulan berikutnya"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday Strip */}
      <div className="flex items-center justify-between gap-1 mb-6">
        {daysInWeek.map((item, idx) => {
          const isToday = item.day === selectedDay;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedDay(item.day)}
              className="flex-1 flex flex-col items-center py-1.5 rounded-2xl hover:bg-slate-50 transition-colors"
            >
              <span className="text-[11px] font-semibold text-slate-400 mb-1">
                {item.name}
              </span>
              <span
                className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold transition-all ${
                  isToday
                    ? "bg-brand-500 text-white shadow-md shadow-brand-500/30"
                    : "text-slate-700"
                }`}
              >
                {item.day}
              </span>
            </button>
          );
        })}
      </div>

      {/* Centered Circular Focal Widget (Matches Monex $1,600 focal circle) */}
      <div className="flex flex-col items-center justify-center my-4">
        <div className="w-40 h-40 rounded-full bg-brand-500 text-white flex flex-col items-center justify-center shadow-floating ring-8 ring-brand-50 animate-in zoom-in-95 duration-200">
          <span className="text-[11px] font-bold text-white/80 uppercase tracking-widest mb-1">
            Pengeluaran
          </span>
          <span className="text-xl sm:text-2xl font-black text-white px-2 text-center tracking-tight">
            {formatCurrency(totalExpense)}
          </span>
        </div>

        {/* Budget Status Sentence */}
        <p className="mt-4 text-xs font-medium text-slate-500 text-center max-w-xs">
          Kamu telah menggunakan{" "}
          <span className="font-bold text-brand-600">{budgetUsage}%</span> dari total
          anggaran bulan ini.
        </p>
      </div>

      {/* Segmented Tabs: Spends vs Categories */}
      <div className="flex border-b border-slate-100 mt-6">
        <button
          type="button"
          onClick={() => setActiveTab("spends")}
          className={`flex-1 pb-3 text-xs font-bold transition-all relative ${
            activeTab === "spends"
              ? "text-brand-600"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Daftar Pengeluaran
          {activeTab === "spends" && (
            <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-brand-500 rounded-full" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("categories")}
          className={`flex-1 pb-3 text-xs font-bold transition-all relative ${
            activeTab === "categories"
              ? "text-brand-600"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Kategori
          {activeTab === "categories" && (
            <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-brand-500 rounded-full" />
          )}
        </button>
      </div>
    </div>
  );
}
