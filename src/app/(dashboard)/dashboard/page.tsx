"use client";

import React, { useState, useEffect } from "react";
import { MetricsCarousel } from "@/components/dashboard/MetricsCarousel";
import { QuickActionsBar } from "@/components/dashboard/QuickActionsBar";
import { ExpenseFocalWidget } from "@/components/dashboard/ExpenseFocalWidget";
import { RecentTransactionsList } from "@/components/dashboard/RecentTransactionsList";
import { IncomeExpenseChart } from "@/components/charts/IncomeExpenseChart";
import { CategoryDonutChart } from "@/components/charts/CategoryDonutChart";
import { TransactionFormModal } from "@/components/transactions/TransactionFormModal";
import { Sparkles, ArrowUpRight, TrendingUp } from "lucide-react";
import { formatDateIndo } from "@/lib/formatters";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFocalTab, setActiveFocalTab] = useState<"spends" | "categories">("spends");

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<any>(null);

  async function loadDashboardData() {
    try {
      setIsLoading(true);
      const [analyticsRes, txRes] = await Promise.all([
        fetch("/api/analytics?period=monthly"),
        fetch("/api/transactions?limit=6&sortBy=date_desc"),
      ]);

      const analyticsData = await analyticsRes.json();
      const txData = await txRes.json();

      if (analyticsData.success) {
        setData(analyticsData);
      }
      if (txData.success) {
        setRecentTransactions(txData.transactions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function handleDeleteTransaction(id: string) {
    if (!confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) return;
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      const resData = await res.json();
      if (resData.success) {
        loadDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  }

  const currentDateText = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  if (isLoading && !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-2xl w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-32 bg-slate-200 rounded-3xl" />
          <div className="h-32 bg-slate-200 rounded-3xl" />
          <div className="h-32 bg-slate-200 rounded-3xl" />
          <div className="h-32 bg-slate-200 rounded-3xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 h-96 bg-slate-200 rounded-3xl" />
          <div className="lg:col-span-7 h-96 bg-slate-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  const monthlyExpense = data?.periods?.monthly?.thisMonth?.expense || 0;
  const monthlyIncome = data?.periods?.monthly?.thisMonth?.income || 0;
  const currentBalance = data?.currentTotalBalance || 0;
  const totalSavings = data?.totalSavingsCurrent || 0;
  const last7DaysTrend = data?.periods?.weekly?.last7Days || [];
  const categoryBreakdown = data?.categoryBreakdown || [];
  const insights = data?.insights || [];

  return (
    <div className="space-y-6">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Dashboard Keuangan
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            {currentDateText} • Zona Waktu Asia/Jakarta
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Finansial Terkendali
          </span>
        </div>
      </div>

      {/* 1. Metrics Horizontal Carousel (Matches Monex Screen 7 Overview) */}
      <MetricsCarousel
        totalIncome={monthlyIncome}
        totalExpense={monthlyExpense}
        currentBalance={currentBalance}
        totalSavings={totalSavings}
      />

      {/* 2. Quick Actions Bar */}
      <QuickActionsBar
        onOpenAddTransaction={() => {
          setTransactionToEdit(null);
          setIsFormModalOpen(true);
        }}
      />

      {/* 3. Main 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Focal Widget (Matches Monex Screen 8 Total Expenses) */}
        <div className="lg:col-span-5 space-y-6">
          <ExpenseFocalWidget
            totalExpense={monthlyExpense}
            totalBudget={3500000}
            activeTab={activeFocalTab}
            setActiveTab={setActiveFocalTab}
          />

          {/* Conditional Content under Focal Widget based on active tab */}
          {activeFocalTab === "spends" ? (
            <RecentTransactionsList
              transactions={recentTransactions.filter((t) => t.type === "EXPENSE")}
              onEdit={(tx) => {
                setTransactionToEdit(tx);
                setIsFormModalOpen(true);
              }}
              onDelete={handleDeleteTransaction}
              showViewAll={true}
            />
          ) : (
            <CategoryDonutChart
              categories={categoryBreakdown}
              title="Kategori Pengeluaran Bulan Ini"
            />
          )}

          {/* Financial Smart Insights Card */}
          {insights.length > 0 && (
            <div className="p-5 rounded-3xl bg-gradient-to-br from-brand-50 to-blue-50/50 border border-brand-100/80 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <h4 className="text-xs font-bold text-brand-900 uppercase tracking-wider">
                  Analisis Finansial Cerdas
                </h4>
              </div>
              <ul className="space-y-2">
                {insights.map((insight: string, idx: number) => (
                  <li key={idx} className="text-xs text-brand-800 leading-relaxed flex items-start gap-2">
                    <span className="text-brand-500 font-bold mt-0.5">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: Comparative Charts & Entries */}
        <div className="lg:col-span-7 space-y-6">
          {/* Income vs Expense 7 Days Chart */}
          <IncomeExpenseChart
            data={last7DaysTrend}
            title="Tren Aktivitas Keuangan 7 Hari Terakhir"
          />

          {/* Full Recent Entries */}
          <RecentTransactionsList
            transactions={recentTransactions}
            onEdit={(tx) => {
              setTransactionToEdit(tx);
              setIsFormModalOpen(true);
            }}
            onDelete={handleDeleteTransaction}
            showViewAll={true}
          />

          {/* Financial Period Summary Quick Box */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-xs text-slate-400 font-semibold block mb-1">
                Arus Kas Bersih
              </span>
              <p className="text-base font-black text-slate-900">
                Rp{" "}
                {new Intl.NumberFormat("id-ID").format(
                  monthlyIncome - monthlyExpense
                )}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold block mb-1">
                Rasio Tabungan
              </span>
              <p className="text-base font-black text-brand-600">
                {data?.periods?.monthly?.thisMonth?.savingsRate || 0}%
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold block mb-1">
                Rata-rata Harian
              </span>
              <p className="text-base font-black text-slate-900">
                Rp{" "}
                {new Intl.NumberFormat("id-ID").format(
                  data?.averageDailyExpense || 0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Transaction Modal */}
      <TransactionFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setTransactionToEdit(null);
        }}
        onSuccess={loadDashboardData}
        transactionToEdit={transactionToEdit}
      />
    </div>
  );
}
