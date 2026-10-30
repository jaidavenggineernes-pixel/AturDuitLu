"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency, formatDateIndo } from "@/lib/formatters";
import { CategoryIcon } from "@/lib/icons";
import { TransactionFormModal } from "@/components/transactions/TransactionFormModal";
import { Button } from "@/components/ui/Button";
import {
  Search,
  Filter,
  Plus,
  FileDown,
  Trash2,
  Edit2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 15, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [type, setType] = useState("ALL");
  const [categoryId, setCategoryId] = useState("ALL");
  const [paymentMethod, setPaymentMethod] = useState("ALL");
  const [sortBy, setSortBy] = useState("date_desc");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<any>(null);

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

  async function loadTransactions(page = 1) {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(pagination.limit));
      if (search) params.set("search", search);
      if (type !== "ALL") params.set("type", type);
      if (categoryId !== "ALL") params.set("categoryId", categoryId);
      if (paymentMethod !== "ALL") params.set("paymentMethod", paymentMethod);
      if (sortBy) params.set("sortBy", sortBy);
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);

      const res = await fetch(`/api/transactions?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setTransactions(data.transactions);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTransactions(1);
    }, 200);
    return () => clearTimeout(timer);
  }, [search, type, categoryId, paymentMethod, sortBy, startDate, endDate]);

  async function handleDelete(id: string) {
    if (!confirm("Hapus transaksi ini secara permanen?")) return;
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        loadTransactions(pagination.page);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Riwayat Transaksi
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Kelola seluruh aktivitas pemasukan dan pengeluaran secara akurat
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Export button */}
          <a
            href={`/api/reports/export?format=csv${type !== "ALL" ? `&type=${type}` : ""}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all shadow-sm"
          >
            <FileDown className="w-4 h-4 text-emerald-600" />
            Export CSV
          </a>

          <Button
            onClick={() => {
              setTransactionToEdit(null);
              setIsFormModalOpen(true);
            }}
            variant="primary"
            size="md"
            className="shadow-md shadow-brand-500/25"
          >
            <Plus className="w-4 h-4 mr-1" />
            Tambah Transaksi
          </Button>
        </div>
      </div>

      {/* Filter and Search Box */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari transaksi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand-500 focus:bg-white transition-all"
            />
          </div>

          {/* Type Filter */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 outline-none focus:border-brand-500 focus:bg-white transition-all"
          >
            <option value="ALL">Semua Jenis Transaksi</option>
            <option value="EXPENSE">💸 Pengeluaran (Expense)</option>
            <option value="INCOME">💰 Pemasukan (Income)</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 outline-none focus:border-brand-500 focus:bg-white transition-all"
          >
            <option value="ALL">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 outline-none focus:border-brand-500 focus:bg-white transition-all"
          >
            <option value="date_desc">📅 Tanggal Terbaru</option>
            <option value="date_asc">📅 Tanggal Terlama</option>
            <option value="amount_desc">💎 Nominal Tertinggi</option>
            <option value="amount_asc">🪙 Nominal Terendah</option>
          </select>
        </div>

        {/* Date range filter strip */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <span className="font-semibold text-slate-500">Rentang Tanggal:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 outline-none"
          />
          <span className="text-slate-400">s/d</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 outline-none"
          />
          {(startDate || endDate || search || type !== "ALL" || categoryId !== "ALL") && (
            <button
              onClick={() => {
                setSearch("");
                setType("ALL");
                setCategoryId("ALL");
                setPaymentMethod("ALL");
                setStartDate("");
                setEndDate("");
              }}
              className="text-xs font-bold text-rose-500 hover:text-rose-600 underline ml-auto"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Transactions Table / List (Responsive) */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Memuat transaksi...
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <p className="text-sm font-semibold">Tidak ada transaksi ditemukan.</p>
            <p className="text-xs mt-1">Coba sesuaikan kata kunci pencarian atau filter Anda.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {transactions.map((tx) => {
              const isIncome = tx.type === "INCOME";
              const cat = tx.category || {};
              const catColor = cat.color || (isIncome ? "#10B981" : "#1E5BF6");

              return (
                <div
                  key={tx.id}
                  className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors group"
                >
                  {/* Left: Category Icon, Name, Date, Payment Badge */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
                      style={{ backgroundColor: catColor }}
                    >
                      <CategoryIcon
                        name={cat.icon || "MoreHorizontal"}
                        className="w-5 h-5"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {tx.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-400">
                          {formatDateIndo(tx.transactionDate)}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-xs font-medium text-slate-500">
                          {cat.name || "Lainnya"}
                        </span>
                        <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                          {tx.paymentMethod || "Cash"}
                        </span>
                      </div>
                      {tx.notes && (
                        <p className="text-[11px] text-slate-400 mt-0.5 italic truncate">
                          &quot;{tx.notes}&quot;
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Amount & Actions */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <p
                        className={`text-base font-black tracking-tight ${
                          isIncome ? "text-emerald-600" : "text-slate-900"
                        }`}
                      >
                        {isIncome ? "+" : "-"}
                        {formatCurrency(tx.amount)}
                      </p>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {tx.type === "INCOME" ? "Pemasukan" : "Pengeluaran"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setTransactionToEdit(tx);
                          setIsFormModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
                        title="Edit Transaksi"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Hapus Transaksi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination bar */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>
              Menampilkan Halaman {pagination.page} dari {pagination.totalPages} ({pagination.total} total transaksi)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => loadTransactions(pagination.page - 1)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => loadTransactions(pagination.page + 1)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Form Modal */}
      <TransactionFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setTransactionToEdit(null);
        }}
        onSuccess={() => loadTransactions(pagination.page)}
        transactionToEdit={transactionToEdit}
      />
    </div>
  );
}
