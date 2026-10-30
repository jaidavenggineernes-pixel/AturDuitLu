"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/formatters";

interface AddContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  goal: any;
}

export function AddContributionModal({
  isOpen,
  onClose,
  onSuccess,
  goal,
}: AddContributionModalProps) {
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!goal) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Nominal setoran harus lebih dari 0.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/savings/${goal.id}/contribute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numericAmount,
          notes,
          contributionDate: new Date().toISOString(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menyetor tabungan.");
      }

      setAmount("");
      setNotes("");
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
      title="Setor Tabungan"
      subtitle={`Alokasikan dana untuk impian: ${goal.name}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        <div className="p-4 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-brand-700 font-semibold">Terkumpul Saat Ini</span>
            <p className="text-base font-black text-brand-900">{formatCurrency(goal.currentAmount)}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-brand-700 font-semibold">Target Akhir</span>
            <p className="text-base font-black text-brand-900">{formatCurrency(goal.targetAmount)}</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Nominal Setoran (Rupiah)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center font-bold text-slate-400 text-sm">
              Rp
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
            Catatan / Keterangan (Opsional)
          </label>
          <input
            type="text"
            placeholder="Contoh: Sisihan gaji bulan Oktober"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all"
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
          >
            Konfirmasi Setor Tabungan
          </Button>
        </div>
      </form>
    </Modal>
  );
}
