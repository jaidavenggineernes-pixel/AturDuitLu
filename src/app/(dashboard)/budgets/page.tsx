"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/formatters";
import { AddBudgetModal } from "@/components/budgets/AddBudgetModal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CategoryIcon } from "@/lib/icons";
import {
  PieChart,
  Plus,
  AlertTriangle,
  CheckCircle,
  AlertOctagon,
  Trash2,
  Edit2,
  TrendingDown,
} from "lucide-react";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState<any>(null);

  async function loadBudgets() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/budgets");
      const data = await res.json();
      if (data.success) {
        setBudgets(data.budgets);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadBudgets();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Hapus batasan anggaran ini?")) return;
    try {
      const res = await fetch(`/api/budgets/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        loadBudgets();
      }
    } catch (err) {
      console.error(err);
    }
  }

  const overallBudget = budgets.find((b) => !b.categoryId);
  const categoryBudgets = budgets.filter((b) => !!b.categoryId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Manajemen Anggaran
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Kendalikan pengeluaran dengan batas anggaran harian, mingguan, dan bulanan
          </p>
        </div>

        <Button
          onClick={() => {
            setBudgetToEdit(null);
            setIsModalOpen(true);
          }}
          variant="primary"
          size="md"
          className="shadow-md shadow-brand-500/25"
        >
          <Plus className="w-4 h-4 mr-1" />
          Atur Anggaran Baru
        </Button>
      </div>

      {/* Overall Budget Focal Banner (if configured) */}
      {overallBudget && (
        <div className="bg-gradient-to-br from-brand-500 to-brand-700 text-white p-6 sm:p-8 rounded-3xl shadow-floating relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white/80 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  Anggaran Keseluruhan ({overallBudget.periodType})
                </span>
                {overallBudget.status === "SAFE" && (
                  <span className="text-xs font-bold text-emerald-200 bg-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Aman
                  </span>
                )}
                {overallBudget.status === "WARNING" && (
                  <span className="text-xs font-bold text-amber-200 bg-amber-500/40 px-3 py-1 rounded-full flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Perhatian
                  </span>
                )}
                {overallBudget.status === "EXCEEDED" && (
                  <span className="text-xs font-bold text-rose-200 bg-rose-500/40 px-3 py-1 rounded-full flex items-center gap-1">
                    <AlertOctagon className="w-3.5 h-3.5" /> Melebihi Batas
                  </span>
                )}
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
                {formatCurrency(overallBudget.amount)}
              </h2>
              <p className="text-xs text-white/80 mt-1">
                Terpakai: {formatCurrency(overallBudget.usedAmount)} • Sisa:{" "}
                {formatCurrency(overallBudget.remainingAmount)}
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-2">
              <div className="flex justify-between text-xs font-bold text-white/90">
                <span>Penggunaan Anggaran</span>
                <span>{overallBudget.usagePercentage}%</span>
              </div>
              <div className="w-full h-3 bg-white/25 rounded-full overflow-hidden p-0.5 backdrop-blur-sm">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    overallBudget.usagePercentage >= 100
                      ? "bg-rose-400"
                      : overallBudget.usagePercentage >= 80
                      ? "bg-amber-300"
                      : "bg-white"
                  }`}
                  style={{ width: `${Math.min(100, overallBudget.usagePercentage)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Budgets Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">
            Anggaran Berdasarkan Kategori
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            {categoryBudgets.length} Kategori Dibatasi
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Memuat anggaran...
          </div>
        ) : categoryBudgets.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-card text-center">
            <PieChart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-800">
              Belum ada batas anggaran per kategori
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Tetapkan batas anggaran untuk pos pengeluaran seperti Makanan, Belanja, atau Transportasi agar keuangan lebih disiplin.
            </p>
            <Button
              onClick={() => {
                setBudgetToEdit(null);
                setIsModalOpen(true);
              }}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              + Tambah Anggaran Kategori
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryBudgets.map((budget) => {
              const cat = budget.category || {};
              const isOver = budget.status === "EXCEEDED";
              const isWarning = budget.status === "WARNING";

              return (
                <div
                  key={budget.id}
                  className="bg-white p-5 rounded-3xl border border-slate-100 shadow-card hover:shadow-card-hover transition-all space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
                        style={{ backgroundColor: cat.color || "#1E5BF6" }}
                      >
                        <CategoryIcon name={cat.icon || "Tag"} className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          {cat.name || "Kategori"}
                        </h3>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {budget.periodType}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setBudgetToEdit(budget);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-50 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(budget.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Amounts */}
                  <div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xl font-black text-slate-900 tracking-tight">
                        {formatCurrency(budget.amount)}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          isOver
                            ? "text-rose-600"
                            : isWarning
                            ? "text-amber-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {budget.usagePercentage}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                      <span>Terpakai: {formatCurrency(budget.usedAmount)}</span>
                      <span>
                        Sisa:{" "}
                        <strong
                          className={budget.remainingAmount < 0 ? "text-rose-600" : "text-slate-800"}
                        >
                          {formatCurrency(budget.remainingAmount)}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOver
                          ? "bg-rose-500"
                          : isWarning
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min(100, budget.usagePercentage)}%` }}
                    />
                  </div>

                  {/* Status Indicator Pill */}
                  <div className="pt-1 flex items-center justify-between">
                    {budget.status === "SAFE" && (
                      <Badge variant="success" size="sm">
                        <CheckCircle className="w-3 h-3 mr-1" /> Anggaran Aman
                      </Badge>
                    )}
                    {budget.status === "WARNING" && (
                      <Badge variant="warning" size="sm">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Perhatian: Hampir Habis
                      </Badge>
                    )}
                    {budget.status === "EXCEEDED" && (
                      <Badge variant="danger" size="sm">
                        <AlertOctagon className="w-3 h-3 mr-1" /> Melebihi Batas Anggaran!
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AddBudgetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setBudgetToEdit(null);
        }}
        onSuccess={loadBudgets}
        budgetToEdit={budgetToEdit}
      />
    </div>
  );
}
