import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles, TrendingUp, ShieldCheck, Target } from "lucide-react";

export default async function HomePage() {
  const user = await getSessionUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="max-w-6xl w-full mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/30">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 18L18 6M6 12L18 12M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">
            Atur<span className="text-brand-500">DuitLu</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-bold text-slate-700 hover:text-brand-600 px-4 py-2 transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-2xl shadow-md shadow-brand-500/20 transition-all"
          >
            Daftar Gratis
          </Link>
        </div>
      </header>

      {/* Main Hero & Onboarding Features (Matches Screens 2, 3, 4 of reference image) */}
      <main className="max-w-5xl mx-auto px-4 py-12 text-center space-y-12">
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold animate-in fade-in slide-in-from-top-2">
            <Sparkles className="w-4 h-4 text-brand-500" />
            Platform Personal Finance Management #1
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Kendalikan Keuanganmu, Raih Impian Masa Depan.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            AturDuitLu membantu kamu mencatat pengeluaran harian, memantau batas anggaran,
            mengalokasikan tabungan impian, dan menganalisis kondisi finansial dengan kalkulasi otomatis yang akurat.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold shadow-floating shadow-brand-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 uppercase tracking-wider"
            >
              LET&apos;S GO
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold shadow-sm transition-all"
            >
              Buka Akun Demo
            </Link>
          </div>
        </div>

        {/* Feature Cards matching Monex Onboarding sequence */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Card 1: Note Down Expenses */}
          <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-card hover:shadow-card-hover transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Note Down Expenses
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Catat pengeluaran harianmu dengan cepat melalui form cerdas, kategori berwarna, dan metode pembayaran otomatis.
            </p>
          </div>

          {/* Card 2: Simple Money Management */}
          <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-card hover:shadow-card-hover transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Simple Money Management
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dapatkan peringatan instan ketika pengeluaran mendekati atau melampaui batas anggaran (budget warning).
            </p>
          </div>

          {/* Card 3: Easy to Track and Analyze */}
          <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-card hover:shadow-card-hover transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Easy to Track & Analyze
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Visualisasi grafik komparatif pemasukan vs pengeluaran, rasio tabungan, dan rekomendasi finansial cerdas.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-6 text-center text-xs text-slate-400">
        © 2026 AturDuitLu. Platform Personal Finance Management & Expense Tracking. Seluruh hak cipta dilindungi.
      </footer>
    </div>
  );
}
