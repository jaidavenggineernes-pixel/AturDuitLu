"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/formatters";
import { CategoryIcon } from "@/lib/icons";
import { AddCategoryModal } from "@/components/categories/AddCategoryModal";
import { Button } from "@/components/ui/Button";
import { Layers, Plus, Trash2, Edit2, Lock } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<any>(null);

  async function loadCategories() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
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

  async function handleDelete(id: string) {
    if (!confirm("Hapus kategori ini?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || "Gagal menghapus kategori.");
        return;
      }
      loadCategories();
    } catch (err) {
      console.error(err);
    }
  }

  const filteredCategories = categories.filter((c) => c.type === activeTab);
  const totalAmountForTab = filteredCategories.reduce(
    (sum, c) => sum + (c.totalAmount || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Manajemen Kategori
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Kelola pos kategori transaksi bawaan sistem dan kategori kustom buatanmu
          </p>
        </div>

        <Button
          onClick={() => {
            setCategoryToEdit(null);
            setIsModalOpen(true);
          }}
          variant="primary"
          size="md"
          className="shadow-md shadow-brand-500/25"
        >
          <Plus className="w-4 h-4 mr-1" />
          Tambah Kategori Baru
        </Button>
      </div>

      {/* Tabs: Pengeluaran vs Pemasukan */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("EXPENSE")}
          className={`pb-3 px-6 text-sm font-bold transition-all relative ${
            activeTab === "EXPENSE"
              ? "text-rose-600 border-b-2 border-rose-500"
              : "text-slate-400 hover:text-slate-700"
          }`}
        >
          💸 Kategori Pengeluaran (
          {categories.filter((c) => c.type === "EXPENSE").length})
        </button>
        <button
          onClick={() => setActiveTab("INCOME")}
          className={`pb-3 px-6 text-sm font-bold transition-all relative ${
            activeTab === "INCOME"
              ? "text-emerald-600 border-b-2 border-emerald-500"
              : "text-slate-400 hover:text-slate-700"
          }`}
        >
          💰 Kategori Pemasukan (
          {categories.filter((c) => c.type === "INCOME").length})
        </button>
      </div>

      {/* Grid of categories */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 text-sm">
          Memuat kategori...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((cat) => {
            const percentage =
              totalAmountForTab > 0
                ? Math.round(((cat.totalAmount || 0) / totalAmountForTab) * 100)
                : 0;

            return (
              <div
                key={cat.id}
                className="bg-white p-5 rounded-3xl border border-slate-100 shadow-card hover:shadow-card-hover transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: cat.color || "#1E5BF6" }}
                    >
                      <CategoryIcon
                        name={cat.icon || "MoreHorizontal"}
                        className="w-6 h-6"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {cat.name}
                      </h3>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {cat.transactionCount || 0} Transaksi Tercatat
                      </span>
                    </div>
                  </div>

                  <div>
                    {cat.isDefault ? (
                      <span
                        className="p-1.5 text-slate-300 flex items-center"
                        title="Kategori Bawaan Sistem (Tidak dapat dihapus)"
                      >
                        <Lock className="w-4 h-4" />
                      </span>
                    ) : (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setCategoryToEdit(cat);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-50 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Total amount and percentage progress */}
                <div className="pt-2 border-t border-slate-50">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-500">
                      Total Nominal:
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {formatCurrency(cat.totalAmount || 0)}
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(2, percentage)}%`,
                        backgroundColor: cat.color || "#1E5BF6",
                      }}
                    />
                  </div>
                  <div className="text-right mt-1">
                    <span className="text-[10px] font-semibold text-slate-400">
                      {percentage}% dari total {activeTab === "EXPENSE" ? "pengeluaran" : "pemasukan"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCategoryToEdit(null);
        }}
        onSuccess={loadCategories}
        categoryToEdit={categoryToEdit}
      />
    </div>
  );
}
