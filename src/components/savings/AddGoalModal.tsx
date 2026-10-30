"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddGoalModal({ isOpen, onClose, onSuccess }: AddGoalModalProps) {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [contributionType, setContributionType] = useState("MONTHLY");
  const [deadline, setDeadline] = useState("");
  const [color, setColor] = useState("#1E5BF6");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const colorOptions = ["#1E5BF6", "#10B981", "#8B5CF6", "#F59E0B", "#EC4899", "#06B6D4"];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Nama target tidak boleh kosong.");
      return;
    }

    const numericTarget = parseFloat(targetAmount);
    if (isNaN(numericTarget) || numericTarget <= 0) {
      setError("Nominal target harus lebih dari 0.");
      return;
    }

    if (!deadline) {
      setError("Tenggat waktu wajib diisi.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/savings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          targetAmount: numericTarget,
          contributionType,
          deadline,
          color,
          icon: "Target",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal membuat target tabungan.");
      }

      setName("");
      setTargetAmount("");
      setDeadline("");
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
      title="Tambah Target Tabungan"
      subtitle="Tetapkan rencana finansial dan pantau progres pencapaian"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        <Input
          label="Nama Target"
          placeholder="Contoh: Beli Laptop Baru / Rumah Impian"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Target Nominal (Rupiah)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center font-bold text-slate-400 text-sm">
              Rp
            </span>
            <input
              type="number"
              placeholder="0"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 py-3 text-sm font-semibold text-slate-900 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Tipe Setoran
            </label>
            <select
              value={contributionType}
              onChange={(e) => setContributionType(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all"
            >
              <option value="MONTHLY">Bulanan (Monthly)</option>
              <option value="WEEKLY">Mingguan (Weekly)</option>
              <option value="YEARLY">Tahunan (Yearly)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Tenggat Waktu
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Color picker */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
            Warna Tema Target
          </label>
          <div className="flex items-center gap-3">
            {colorOptions.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={{ backgroundColor: c }}
                className={`w-8 h-8 rounded-full transition-transform ${
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
            Simpan Target Tabungan
          </Button>
        </div>
      </form>
    </Modal>
  );
}
