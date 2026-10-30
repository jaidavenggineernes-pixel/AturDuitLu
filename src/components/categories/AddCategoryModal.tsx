"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ICON_MAP, CategoryIcon } from "@/lib/icons";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categoryToEdit?: any;
}

export function AddCategoryModal({
  isOpen,
  onClose,
  onSuccess,
  categoryToEdit,
}: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [icon, setIcon] = useState("Utensils");
  const [color, setColor] = useState("#1E5BF6");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const availableIcons = Object.keys(ICON_MAP);
  const colorOptions = [
    "#1E5BF6",
    "#10B981",
    "#EF4444",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#64748B",
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Nama kategori tidak boleh kosong.");
      return;
    }

    setIsLoading(true);
    try {
      const url = categoryToEdit
        ? `/api/categories/${categoryToEdit.id}`
        : "/api/categories";
      const method = categoryToEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          icon,
          color,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menyimpan kategori.");
      }

      setName("");
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
      title={categoryToEdit ? "Edit Kategori" : "Tambah Kategori Baru"}
      subtitle="Kustomisasi pengelompokan transaksi sesuai kebutuhan"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        {/* Type toggle */}
        <div className="flex p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setType("EXPENSE")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-150 ${
              type === "EXPENSE"
                ? "bg-white text-rose-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            💸 Kategori Pengeluaran
          </button>
          <button
            type="button"
            onClick={() => setType("INCOME")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-150 ${
              type === "INCOME"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            💰 Kategori Pemasukan
          </button>
        </div>

        <Input
          label="Nama Kategori"
          placeholder="Contoh: Skincare & Perawatan / Royalti Buku"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Icon picker */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
            Pilih Ikon Kategori
          </label>
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-2 border border-slate-100 rounded-2xl bg-slate-50 max-h-36 overflow-y-auto">
            {availableIcons.map((icName) => {
              const isSelected = icon === icName;
              return (
                <button
                  key={icName}
                  type="button"
                  onClick={() => setIcon(icName)}
                  className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-brand-500 text-white shadow-sm ring-2 ring-brand-500 ring-offset-1"
                      : "bg-white text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <CategoryIcon name={icName} className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Color picker */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
            Pilih Warna Ikon
          </label>
          <div className="flex items-center gap-3">
            {colorOptions.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={{ backgroundColor: c }}
                className={`w-7 h-7 rounded-full transition-transform ${
                  color === c ? "ring-4 ring-offset-2 ring-brand-500 scale-110" : "hover:scale-105"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
          >
            {categoryToEdit ? "Simpan Perubahan" : "Buat Kategori"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
