"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MetricsCarousel } from "@/components/dashboard/MetricsCarousel";
import { QuickActionsBar } from "@/components/dashboard/QuickActionsBar";
import { ExpenseFocalWidget } from "@/components/dashboard/ExpenseFocalWidget";
import { RecentTransactionsList } from "@/components/dashboard/RecentTransactionsList";
import { IncomeExpenseChart } from "@/components/charts/IncomeExpenseChart";
import { CategoryDonutChart } from "@/components/charts/CategoryDonutChart";
import { MobileNav } from "@/components/layout/MobileNav";
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Target,
  Layers,
  TrendingUp,
  FileText,
  Settings,
  Bell,
  Sparkles,
  LogIn,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export function ShowcaseDashboard() {
  const router = useRouter();
  const [activeFocalTab, setActiveFocalTab] = useState<"spends" | "categories">("spends");

  // Clicking anywhere redirects to login page
  function handleGlobalClick() {
    router.push("/login");
  }

  const currentDateText = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  // Showcase mock data for unauthenticated preview
  const sampleTransactions = [
    {
      id: "demo-1",
      name: "Gaji Bulanan Oktober",
      amount: 8500000,
      type: "INCOME",
      transactionDate: new Date(),
      paymentMethod: "Bank Transfer",
      category: { name: "Gaji Pokok", icon: "Briefcase", color: "#10B981" },
    },
    {
      id: "demo-2",
      name: "Belanja Bulanan Supermarket",
      amount: 780000,
      type: "EXPENSE",
      transactionDate: new Date(),
      paymentMethod: "Credit Card",
      category: { name: "Belanja", icon: "ShoppingBag", color: "#EC4899" },
    },
    {
      id: "demo-3",
      name: "Honor Desain Landing Page",
      amount: 2500000,
      type: "INCOME",
      transactionDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      paymentMethod: "Bank Transfer",
      category: { name: "Freelance", icon: "Laptop", color: "#8B5CF6" },
    },
    {
      id: "demo-4",
      name: "Makan Siang Resto Padang",
      amount: 35000,
      type: "EXPENSE",
      transactionDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      paymentMethod: "Cash",
      category: { name: "Makanan & Minuman", icon: "Utensils", color: "#EF4444" },
    },
    {
      id: "demo-5",
      name: "Tagihan Listrik & Internet",
      amount: 770000,
      type: "EXPENSE",
      transactionDate: new Date(Date.now() - 48 * 60 * 60 * 1000),
      paymentMethod: "Bank Transfer",
      category: { name: "Tagihan", icon: "Receipt", color: "#F59E0B" },
    },
  ];

  const sample7Days = [
    { dayName: "Sen", income: 0, expense: 185000 },
    { dayName: "Sel", income: 0, expense: 95000 },
    { dayName: "Rab", income: 2500000, expense: 340000 },
    { dayName: "Kam", income: 0, expense: 220000 },
    { dayName: "Jum", income: 8500000, expense: 780000 },
    { dayName: "Sab", income: 650000, expense: 550000 },
    { dayName: "Min", income: 0, expense: 120000 },
  ];

  const sampleCategories = [
    { id: "1", name: "Makanan & Minuman", icon: "Utensils", color: "#EF4444", amount: 1450000, percentage: 34 },
    { id: "2", name: "Belanja Pokok", icon: "ShoppingBag", color: "#EC4899", amount: 1230000, percentage: 29 },
    { id: "3", name: "Tagihan & Utilitas", icon: "Receipt", color: "#F59E0B", amount: 770000, percentage: 18 },
    { id: "4", name: "Transportasi", icon: "Car", color: "#3B82F6", amount: 480000, percentage: 11 },
    { id: "5", name: "Hiburan", icon: "Film", color: "#8B5CF6", amount: 320000, percentage: 8 },
  ];

  return (
    <div
      onClick={handleGlobalClick}
      className="min-h-screen bg-slate-50 flex flex-col cursor-pointer select-none relative"
      title="Klik di mana saja untuk Masuk ke Akun Anda"
    >
      {/* Top Floating Notification Banner */}
      <div className="bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 text-white text-xs font-bold py-2.5 px-4 text-center flex items-center justify-center gap-2 shadow-sm sticky top-0 z-50">
        <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
        <span>Mode Pratinjau • <strong>Klik di mana saja</strong> di layar ini untuk Masuk / Login ke Akun Anda</span>
        <ChevronRight className="w-4 h-4" />
      </div>

      {/* Main App Navbar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-9 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-md shadow-brand-500/20">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M6 18L18 6M6 12L18 12M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900">
                Atur<span className="text-brand-500">DuitLu</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-50 text-brand-600">
                Fintech
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGlobalClick}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-brand-500 text-white text-xs font-bold hover:bg-brand-600 shadow-md shadow-brand-500/20 transition-all"
            >
              <LogIn className="w-4 h-4" />
              Masuk Akun
            </button>
          </div>
        </div>
      </header>

      {/* App Body (Sidebar + Content) */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar Preview */}
        <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-slate-100 min-h-[calc(100vh-6.5rem)] p-4">
          <div className="space-y-1">
            {[
              { name: "Dashboard", icon: LayoutDashboard, active: true },
              { name: "Transaksi", icon: Receipt, active: false },
              { name: "Anggaran", icon: PieChart, active: false },
              { name: "Target Tabungan", icon: Target, active: false },
              { name: "Kategori", icon: Layers, active: false },
              { name: "Analisis", icon: TrendingUp, active: false },
              { name: "Laporan", icon: FileText, active: false },
              { name: "Notifikasi", icon: Bell, active: false },
              { name: "Pengaturan", icon: Settings, active: false },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    item.active
                      ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-auto p-4 rounded-3xl bg-brand-50 border border-brand-100">
            <p className="text-xs font-bold text-brand-900 mb-1">💡 Tips Atur Keuangan</p>
            <p className="text-[11px] text-brand-700 leading-relaxed">
              Aturan 50/30/20: 50% kebutuhan, 30% keinginan, 20% tabungan masa depan.
            </p>
          </div>
        </aside>

        {/* Dashboard Main Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-full overflow-x-hidden space-y-6">
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

          {/* 1. Metrics Horizontal Carousel */}
          <MetricsCarousel
            totalIncome={11650000}
            totalExpense={4250000}
            currentBalance={12400000}
            totalSavings={35000000}
          />

          {/* 2. Quick Actions Bar */}
          <QuickActionsBar onOpenAddTransaction={handleGlobalClick} />

          {/* 3. Main 2-Column Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Focal Widget */}
            <div className="lg:col-span-5 space-y-6">
              <ExpenseFocalWidget
                totalExpense={4250000}
                totalBudget={6500000}
                activeTab={activeFocalTab}
                setActiveTab={setActiveFocalTab}
              />

              {activeFocalTab === "spends" ? (
                <RecentTransactionsList
                  transactions={sampleTransactions.filter((t) => t.type === "EXPENSE")}
                  showViewAll={true}
                />
              ) : (
                <CategoryDonutChart
                  categories={sampleCategories}
                  title="Kategori Pengeluaran Bulan Ini"
                />
              )}

              {/* Financial Smart Insights Card */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-brand-50 to-blue-50/50 border border-brand-100/80 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-brand-600" />
                  <h4 className="text-xs font-bold text-brand-900 uppercase tracking-wider">
                    Analisis Finansial Cerdas
                  </h4>
                </div>
                <ul className="space-y-2">
                  <li className="text-xs text-brand-800 leading-relaxed flex items-start gap-2">
                    <span className="text-brand-500 font-bold mt-0.5">•</span>
                    <span>Kategori pengeluaran terbesar bulan ini adalah Makanan & Minuman sebesar Rp 1.450.000 (34% dari total pengeluaran).</span>
                  </li>
                  <li className="text-xs text-brand-800 leading-relaxed flex items-start gap-2">
                    <span className="text-brand-500 font-bold mt-0.5">•</span>
                    <span>Bagus! Pengeluaran bulan ini lebih hemat 12% dibandingkan bulan lalu.</span>
                  </li>
                  <li className="text-xs text-brand-800 leading-relaxed flex items-start gap-2">
                    <span className="text-brand-500 font-bold mt-0.5">•</span>
                    <span>Tingkat tabungan (Savings Rate) kamu bulan ini mencapai 63.5%, berada di atas standar ideal kesehatan finansial (20%).</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Comparative Charts & Entries */}
            <div className="lg:col-span-7 space-y-6">
              <IncomeExpenseChart
                data={sample7Days}
                title="Tren Aktivitas Keuangan 7 Hari Terakhir"
              />

              <RecentTransactionsList
                transactions={sampleTransactions}
                showViewAll={true}
              />

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-xs text-slate-400 font-semibold block mb-1">
                    Arus Kas Bersih
                  </span>
                  <p className="text-base font-black text-slate-900">
                    Rp 7.400.000
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold block mb-1">
                    Rasio Tabungan
                  </span>
                  <p className="text-base font-black text-brand-600">
                    63.5%
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold block mb-1">
                    Rata-rata Harian
                  </span>
                  <p className="text-base font-black text-slate-900">
                    Rp 141.667
                  </p>
                </div>
              </div>

              {/* Watermark in Showcase */}
              <div className="pt-4 text-center text-xs text-slate-400 font-medium tracking-wider">
                AturDuit-Lu Design by JNext AI @jaidav
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Action Pill Guide */}
      <div className="fixed bottom-20 sm:bottom-6 right-6 z-50 bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-bounce">
        <Sparkles className="w-4 h-4 text-brand-400" />
        <span>Klik di mana saja untuk Masuk</span>
      </div>

      {/* Mobile Nav Bar */}
      <MobileNav onOpenAddTransaction={handleGlobalClick} />
    </div>
  );
}
