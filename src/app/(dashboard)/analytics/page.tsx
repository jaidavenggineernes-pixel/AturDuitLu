"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import { IncomeExpenseChart } from "@/components/charts/IncomeExpenseChart";
import { CategoryDonutChart } from "@/components/charts/CategoryDonutChart";
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Award,
} from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("monthly");
  const [isLoading, setIsLoading] = useState(true);

  async function loadAnalytics() {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/analytics?period=${selectedPeriod}`);
      const resData = await res.json();
      if (resData.success) {
        setData(resData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  if (isLoading && !data) {
    return (
      <div className="p-12 text-center text-slate-400 text-sm">
        Memuat analisis finansial...
      </div>
    );
  }

  const periods = data?.periods || {};
  const currentPeriodStats =
    selectedPeriod === "daily"
      ? periods.daily?.today
      : selectedPeriod === "weekly"
      ? periods.weekly?.thisWeek
      : selectedPeriod === "yearly"
      ? periods.yearly?.thisYear
      : periods.monthly?.thisMonth;

  const income = currentPeriodStats?.income || 0;
  const expense = currentPeriodStats?.expense || 0;
  const net = currentPeriodStats?.netCashFlow || 0;
  const savingsRate = currentPeriodStats?.savingsRate || 0;
  const highestCategory = data?.highestSpendingCategory;
  const averageDailyExpense = data?.averageDailyExpense || 0;
  const insights = data?.insights || [];

  return (
    <div className="space-y-6">
      {/* Header & Period Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Analisis Finansial
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Evaluasi mendalam mengenai arus kas, rasio tabungan, dan pola belanja
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex p-1 bg-white border border-slate-200 rounded-2xl shadow-sm">
          {[
            { id: "daily", label: "Harian" },
            { id: "weekly", label: "Mingguan" },
            { id: "monthly", label: "Bulanan" },
            { id: "yearly", label: "Tahunan" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedPeriod(tab.id as any)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedPeriod === tab.id
                  ? "bg-brand-500 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Income */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Pemasukan
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 tracking-tight">
            {formatCurrency(income)}
          </div>
          <span className="text-[11px] text-slate-400 font-medium mt-1 block capitalize">
            Periode {selectedPeriod}
          </span>
        </div>

        {/* 2. Total Expense */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Pengeluaran
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 tracking-tight">
            {formatCurrency(expense)}
          </div>
          <span className="text-[11px] text-slate-400 font-medium mt-1 block capitalize">
            Periode {selectedPeriod}
          </span>
        </div>

        {/* 3. Net Cash Flow */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Arus Kas Bersih
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div
            className={`text-2xl font-black tracking-tight ${
              net >= 0 ? "text-slate-900" : "text-rose-600"
            }`}
          >
            {formatCurrency(net)}
          </div>
          <span className="text-[11px] text-slate-400 font-medium mt-1 block">
            Selisih Pemasukan - Pengeluaran
          </span>
        </div>

        {/* 4. Savings Rate */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Rasio Tabungan
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-brand-600 tracking-tight">
            {savingsRate}%
          </div>
          <span className="text-[11px] text-slate-400 font-medium mt-1 block">
            Standar Sehat Finansial &gt; 20%
          </span>
        </div>
      </div>

      {/* Smart Financial Insights Highlight */}
      {insights.length > 0 && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-50 to-indigo-50/60 border border-brand-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-brand-600" />
            <h3 className="text-sm font-bold text-brand-900 uppercase tracking-wider">
              Kesimpulan & Rekomendasi Finansial
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((insight: string, idx: number) => (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-brand-100/60 text-xs text-brand-900 leading-relaxed font-medium"
              >
                {insight}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: 7 Days or 12 Months Chart */}
        {selectedPeriod === "yearly" ? (
          <IncomeExpenseChart
            data={periods.yearly?.monthlyTrends || []}
            title="Tren Finansial 12 Bulan (Tahun Berjalan)"
          />
        ) : (
          <IncomeExpenseChart
            data={periods.weekly?.last7Days || []}
            title="Perbandingan Pemasukan vs Pengeluaran Harian"
          />
        )}

        {/* Right: Category Distribution */}
        <CategoryDonutChart
          categories={data?.categoryBreakdown || []}
          title="Distribusi Pengeluaran per Kategori"
        />
      </div>

      {/* Additional Stats: Highest Spending & Average Daily */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {highestCategory && (
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-card flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Pos Pengeluaran Terbesar
              </span>
              <h4 className="text-lg font-black text-slate-900 mt-0.5">
                {highestCategory.name}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Menyumbang {highestCategory.percentage}% dari total pengeluaran
              </p>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-rose-600">
                {formatCurrency(highestCategory.amount)}
              </span>
            </div>
          </div>
        )}

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Rata-rata Pengeluaran Harian
            </span>
            <h4 className="text-lg font-black text-slate-900 mt-0.5">
              {formatCurrency(averageDailyExpense)} / hari
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Berdasarkan hari transaksi aktif bulan berjalan
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            Rp
          </div>
        </div>
      </div>
    </div>
  );
}
