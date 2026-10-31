"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CategoryIcon } from "@/lib/icons";
import { useSettings } from "@/context/SettingsContext";

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transactionToEdit?: any;
}

export function TransactionFormModal({
  isOpen,
  onClose,
  onSuccess,
  transactionToEdit,
}: TransactionFormModalProps) {
  const { currencySymbol } = useSettings();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [categoryId, setCategoryId] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [notes, setNotes] = useState("");

  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
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

  // Pre-populate if editing
  useEffect(() => {
    if (transactionToEdit) {
      setName(transactionToEdit.name || "");
      setAmount(String(transactionToEdit.amount || ""));
      setType(transactionToEdit.type === "INCOME" ? "INCOME" : "EXPENSE");
      setCategoryId(transactionToEdit.categoryId || "");
      setTransactionDate(
        transactionToEdit.transactionDate
          ? new Date(transactionToEdit.transactionDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0]
      );
      setPaymentMethod(transactionToEdit.paymentMethod || "Cash");
      setNotes(transactionToEdit.notes || "");
    } else {
      setName("");
      setAmount("");
      setType("EXPENSE");
      setCategoryId("");
      setTransactionDate(new Date().toISOString().split("T")[0]);
      setPaymentMethod("Cash");
      setNotes("");
    }
    setError("");
  }, [transactionToEdit, isOpen]);

  // Set default category when type changes
  useEffect(() => {
    if (!categoryId && categories.length > 0) {
      const match = categories.find((c) => c.type === type);
      if (match) setCategoryId(match.id);
    }
  }, [type, categories, categoryId]);

  const filteredCategories = categories.filter((c) => c.type === type);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Nama transaksi tidak boleh kosong.");
      return;
    }

    const numericAmount = parseFloat(amount.replace(/[^0-9.-]+/g, ""));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Nominal transaksi harus lebih dari 0.");
      return;
    }

    if (!categoryId) {
      setError("Silakan pilih kategori transaksi.");
      return;
    }

    setIsLoading(true);
    try {
      const url = transactionToEdit
        ? `/api/transactions/${transactionToEdit.id}`
        : "/api/transactions";
      const method = transactionToEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          amount: numericAmount,
          type,
          categoryId,
          transactionDate: new Date(transactionDate).toISOString(),
          paymentMethod,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menyimpan transaksi.");
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
      title={transactionToEdit ? "Edit Transaksi" : "Tambah Transaksi Baru"}
      subtitle="Catat pengeluaran atau pemasukan secara manual"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        {/* Type Segmented Toggle */}
        <div className="flex p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setType("EXPENSE");
              const firstExp = categories.find((c) => c.type === "EXPENSE");
              if (firstExp) setCategoryId(firstExp.id);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-150 ${
              type === "EXPENSE"
                ? "bg-white text-rose-600 shadow-sm shadow-slate-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            💸 Pengeluaran (Expense)
          </button>
          <button
            type="button"
            onClick={() => {
              setType("INCOME");
              const firstInc = categories.find((c) => c.type === "INCOME");
              if (firstInc) setCategoryId(firstInc.id);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-150 ${
              type === "INCOME"
                ? "bg-white text-emerald-600 shadow-sm shadow-slate-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            💰 Pemasukan (Income)
          </button>
        </div>

        {/* Transaction Name */}
        <Input
          label="Nama Transaksi"
          placeholder="Contoh: Makan Siang Resto Padang"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Amount */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Nominal Transaksi ({currencySymbol})
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

        {/* Category Selector Grid */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
            Kategori
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-100 rounded-2xl bg-slate-50/50">
            {filteredCategories.map((cat) => {
              const isSelected = categoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-brand-50 border-brand-500 text-brand-700 shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: cat.color || "#1E5BF6" }}
                  >
                    <CategoryIcon name={cat.icon} className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium truncate">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date & Payment Method Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Tanggal Transaksi
            </label>
            <input
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Metode Pembayaran
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all"
            >
              <option value="Cash">Tunai / Cash</option>
              <option value="Bank Transfer">Transfer Bank</option>
              <option value="E-Wallet">E-Wallet / QRIS</option>
              <option value="Credit Card">Kartu Kredit / Debit</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Catatan Tambahan (Opsional)
          </label>
          <textarea
            rows={2}
            placeholder="Catatan belanja, keterangan, dll."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
          >
            {transactionToEdit ? "Simpan Perubahan" : "Tambah Transaksi"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
