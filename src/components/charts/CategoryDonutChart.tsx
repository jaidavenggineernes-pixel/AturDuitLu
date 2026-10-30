"use client";

import React from "react";
import { formatCurrency } from "@/lib/formatters";
import { CategoryIcon } from "@/lib/icons";

interface CategoryStat {
  id: string;
  name: string;
  icon: string;
  color: string;
  amount: number;
  percentage: number;
}

export function CategoryDonutChart({
  categories = [],
  title = "Pengeluaran Berdasarkan Kategori",
}: {
  categories: CategoryStat[];
  title?: string;
}) {
  if (!categories || categories.length === 0) {
    return (
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card flex items-center justify-center h-64 text-slate-400 text-sm">
        Belum ada catatan pengeluaran pada periode ini.
      </div>
    );
  }

  const totalAmount = categories.reduce((sum, c) => sum + c.amount, 0);

  // Take top 5 and others
  const topCategories = categories.slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card">
      <div className="mb-5">
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-400 mt-0.5">Distribusi proporsi pengeluaran</p>
      </div>

      <div className="space-y-4">
        {topCategories.map((cat) => (
          <div key={cat.id} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: cat.color || "#1E5BF6" }}
                >
                  <CategoryIcon name={cat.icon} className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-slate-800">{cat.name}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900">{formatCurrency(cat.amount)}</span>
                <span className="text-slate-400 ml-1.5 text-[11px]">({cat.percentage}%)</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(2, cat.percentage)}%`,
                  backgroundColor: cat.color || "#1E5BF6",
                }}
              />
            </div>
          </div>
        ))}

        {categories.length > 5 && (
          <div className="pt-2 text-center">
            <span className="text-xs text-slate-400 font-medium">
              +{categories.length - 5} kategori lainnya
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
