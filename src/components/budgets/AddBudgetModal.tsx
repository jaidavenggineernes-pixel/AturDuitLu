"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useSettings } from "@/context/SettingsContext";

interface AddBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  budgetToEdit?: any;
}

export function AddBudgetModal({
  isOpen,
  onClose,
  onSuccess,
  budgetToEdit,
}: AddBudgetModalProps) {
  const { currencySymbol } = useSettings();
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("ALL");
  const [periodType, setPeriodType] = useState("MONTHLY");
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories?type=EXPENSE");
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error(err);
      }
    }
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (budgetToEdit) {
      setAmount(String(budgetToEdit.amount || ""));
      setCategoryId(budgetToEdit.categoryId || "ALL");
      setPeriodType(budgetToEdit.periodType || "MONTHLY");
    } else {
      setAmount("");
      setCategoryId("ALL");
      setPeriodType("MONTHLY");
    }
    setError("");
  }, [budgetToEdit, isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Nominal anggaran harus lebih dari 0.");
      return;
    }

    setIsLoading(true);
    try {
      const url = budgetToEdit ? `/api/budgets/${budgetToEdit.id}` : "/api/budgets";
      const method = budgetToEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numericAmount,
          categoryId: categoryId === "ALL" ? null : categoryId,
          periodType,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menyimpan anggaran.");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={budgetToEdit ? "Edit Batas Anggaran" : "Atur Batas Anggaran"}
      subtitle="Tetapkan batas pengeluaran agar keuangan tetap terkendali"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Nominal Batas Anggaran ({currencySymbol})
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center font-bold text-slate-400 text-sm">
              {currencySymbol}
            </span>
            <input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 py-3 text-sm font-semibold text-slate-900 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Kategori Anggaran
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all"
          >
            <option value="ALL">🌟 Seluruh Pengeluaran (Total Budget)</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Periode Waktu
          </label>
          <select
            value={periodType}
            onChange={(e) => setPeriodType(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all"
          >
            <option value="MONTHLY">Bulanan (Monthly)</option>
            <option value="WEEKLY">Mingguan (Weekly)</option>
            <option value="DAILY">Harian (Daily)</option>
          </select>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
          >
            {budgetToEdit ? "Simpan Perubahan" : "Tetapkan Anggaran"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
