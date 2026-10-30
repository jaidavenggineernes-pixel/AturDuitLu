"use client";

import React from "react";
import Link from "next/link";
import { formatCurrency, formatDateIndo } from "@/lib/formatters";
import { CategoryIcon } from "@/lib/icons";
import { Trash2, Edit2, ArrowRight } from "lucide-react";

interface RecentTransactionsListProps {
  transactions: any[];
  onEdit?: (tx: any) => void;
  onDelete?: (id: string) => void;
  showViewAll?: boolean;
}

export function RecentTransactionsList({
  transactions = [],
  onEdit,
  onDelete,
  showViewAll = true,
}: RecentTransactionsListProps) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-card text-center">
        <p className="text-slate-400 text-sm">Belum ada riwayat transaksi.</p>
        <p className="text-xs text-slate-400 mt-1">Mulai catat transaksi pertamamu sekarang.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900">Transaksi Terbaru</h3>
          <p className="text-xs text-slate-400 mt-0.5">Aktivitas keuangan terkini</p>
        </div>
        {showViewAll && (
          <Link
            href="/transactions"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            Lihat Semua
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>

      <div className="divide-y divide-slate-100">
        {transactions.map((tx) => {
          const isIncome = tx.type === "INCOME";
          const cat = tx.category || {};
          const catColor = cat.color || (isIncome ? "#10B981" : "#1E5BF6");

          return (
            <div
              key={tx.id}
              className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group"
            >
              {/* Left: Icon & Title */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
                  style={{ backgroundColor: catColor }}
                >
                  <CategoryIcon name={cat.icon || "MoreHorizontal"} className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {tx.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-400">
                      {formatDateIndo(tx.transactionDate)}
                    </span>
                    <span className="inline-block w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-[11px] font-medium text-slate-500">
                      {cat.name || "Lainnya"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Amount & Payment Badge & Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <p
                    className={`text-sm font-black tracking-tight ${
                      isIncome ? "text-emerald-600" : "text-slate-900"
                    }`}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </p>
                  <span className="inline-block text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md mt-0.5">
                    {tx.paymentMethod || "Cash"}
                  </span>
                </div>

                {(onEdit || onDelete) && (
                  <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(tx)}
                        className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(tx.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
