"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transaksi", href: "/transactions", icon: Receipt },
  { name: "Anggaran", href: "/budgets", icon: PieChart },
  { name: "Target Tabungan", href: "/savings", icon: Target },
  { name: "Kategori", href: "/categories", icon: Layers },
  { name: "Analisis", href: "/analytics", icon: TrendingUp },
  { name: "Laporan", href: "/reports", icon: FileText },
  { name: "Notifikasi", href: "/notifications", icon: Bell },
  { name: "Pengaturan", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-slate-100 min-h-[calc(100vh-4rem)] p-4">
      <div className="space-y-1">
        {navigationItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                }`}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Pro tip card on sidebar */}
      <div className="mt-auto p-4 rounded-3xl bg-brand-50 border border-brand-100">
        <p className="text-xs font-bold text-brand-900 mb-1">💡 Tips Atur Keuangan</p>
        <p className="text-[11px] text-brand-700 leading-relaxed">
          Gunakan aturan 50/30/20: 50% kebutuhan, 30% keinginan, 20% tabungan masa depan.
        </p>
      </div>
    </aside>
  );
}
