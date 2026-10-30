"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency, formatDateIndo } from "@/lib/formatters";
import { AddGoalModal } from "@/components/savings/AddGoalModal";
import { AddContributionModal } from "@/components/savings/AddContributionModal";
import { Button } from "@/components/ui/Button";
import {
  Target,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  CheckCircle2,
  PlusCircle,
  History,
  Smartphone,
  Bike,
  ShieldCheck,
} from "lucide-react";

export default function SavingsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [totalTarget, setTotalTarget] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [selectedGoalForContribution, setSelectedGoalForContribution] = useState<any>(null);
  const [selectedGoalForHistory, setSelectedGoalForHistory] = useState<any>(null);

  async function loadSavings() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/savings");
      const data = await res.json();
      if (data.success) {
        setGoals(data.goals);
        setTotalSavings(data.totalSavings);
        setTotalTarget(data.totalTarget);
        setOverallProgress(data.overallProgress);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadSavings();
  }, []);

  async function handleDeleteGoal(id: string) {
    if (!confirm("Hapus target tabungan ini beserta riwayat setorannya?")) return;
    try {
      const res = await fetch(`/api/savings/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        loadSavings();
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
            Target Tabungan & Impian
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Pantau dan alokasikan dana untuk setiap tujuan masa depanmu
          </p>
        </div>

        <Button
          onClick={() => setIsAddGoalModalOpen(true)}
          variant="primary"
          size="md"
          className="shadow-md shadow-brand-500/25"
        >
          <Plus className="w-4 h-4 mr-1" />
          Tambah Target Baru
        </Button>
      </div>

      {/* Screen 10 Style: Big Circular Focal Badge for Current Savings */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-card flex flex-col items-center justify-center text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Total Tabungan Terkumpul
        </span>

        {/* Circular Blue Focal Widget (Matching Monex Screen 10 $800 circle) */}
        <div className="w-36 h-36 rounded-full bg-brand-500 text-white flex flex-col items-center justify-center shadow-floating ring-8 ring-brand-50">
          <span className="text-xs font-medium text-white/80">Tabungan</span>
          <span className="text-xl sm:text-2xl font-black text-white px-2 tracking-tight">
            {formatCurrency(totalSavings)}
          </span>
        </div>

        {/* Target summary sentence */}
        <div className="mt-5 max-w-sm">
          <p className="text-xs text-slate-500">
            Terkumpul <span className="font-bold text-slate-800">{formatCurrency(totalSavings)}</span> dari total target{" "}
            <span className="font-bold text-brand-600">{formatCurrency(totalTarget)}</span> ({overallProgress}%).
          </p>
          <div className="w-full h-2.5 bg-slate-100 rounded-full mt-2.5 overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, overallProgress)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Goals List (Matches Monex Screen 11 "Your Goals" & "All Goals") */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">
            Daftar Seluruh Target ({goals.length})
          </h2>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Memuat target tabungan...
          </div>
        ) : goals.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-card text-center">
            <Target className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-800">
              Belum ada target tabungan yang dibuat
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Buat target pertama seperti Beli Gadget Baru, Liburan, Dana Darurat, atau Kendaraan Impian.
            </p>
            <Button
              onClick={() => setIsAddGoalModalOpen(true)}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              + Buat Target Sekarang
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => {
              const isFinished = goal.currentAmount >= goal.targetAmount;
              const deadlineDate = new Date(goal.deadline);
              const daysLeft = Math.ceil(
                (deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div
                  key={goal.id}
                  className="bg-white p-5 rounded-3xl border border-slate-100 shadow-card hover:shadow-card-hover transition-all space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-sm"
                        style={{ backgroundColor: goal.color || "#1E5BF6" }}
                      >
                        <Target className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          {goal.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDateIndo(goal.deadline)}
                          </span>
                          <span className="text-[11px] text-slate-400">•</span>
                          <span className="text-[11px] font-semibold text-brand-600">
                            {daysLeft > 0 ? `${daysLeft} hari lagi` : "Tenggat Lewat"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition-colors"
                        title="Hapus Target"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Amounts & Percentage */}
                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <div className="text-slate-900 font-black text-lg">
                        {formatCurrency(goal.currentAmount)}
                        <span className="text-xs font-semibold text-slate-400 ml-1">
                          / {formatCurrency(goal.targetAmount)}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold ${
                          isFinished ? "text-emerald-600" : "text-brand-600"
                        }`}
                      >
                        {goal.progressPercentage}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, goal.progressPercentage)}%`,
                          backgroundColor: isFinished ? "#10B981" : goal.color || "#1E5BF6",
                        }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons: Setor Tabungan & View History */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() =>
                        setSelectedGoalForHistory(
                          selectedGoalForHistory?.id === goal.id ? null : goal
                        )
                      }
                      className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <History className="w-3.5 h-3.5" />
                      Riwayat ({goal.contributions?.length || 0})
                    </button>

                    <Button
                      onClick={() => {
                        setSelectedGoalForContribution(goal);
                        setIsContributeModalOpen(true);
                      }}
                      variant="primary"
                      size="sm"
                      className="shadow-sm"
                    >
                      <PlusCircle className="w-3.5 h-3.5 mr-1" />
                      Setor Tabungan
                    </Button>
                  </div>

                  {/* Accordion History List */}
                  {selectedGoalForHistory?.id === goal.id && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 max-h-48 overflow-y-auto">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Riwayat Setoran:
                      </p>
                      {goal.contributions?.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">Belum ada setoran dicatat.</p>
                      ) : (
                        goal.contributions.map((c: any) => (
                          <div
                            key={c.id}
                            className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-xl"
                          >
                            <div>
                              <span className="font-bold text-emerald-600">
                                +{formatCurrency(c.amount)}
                              </span>
                              {c.notes && (
                                <p className="text-[10px] text-slate-400">{c.notes}</p>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {formatDateIndo(c.contributionDate)}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Goal Modal (Matches Monex Screen 12) */}
      <AddGoalModal
        isOpen={isAddGoalModalOpen}
        onClose={() => setIsAddGoalModalOpen(false)}
        onSuccess={loadSavings}
      />

      {/* Add Contribution Modal */}
      <AddContributionModal
        isOpen={isContributeModalOpen}
        onClose={() => {
          setIsContributeModalOpen(false);
          setSelectedGoalForContribution(null);
        }}
        onSuccess={loadSavings}
        goal={selectedGoalForContribution}
      />
    </div>
  );
}
