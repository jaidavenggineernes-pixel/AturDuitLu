"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Settings,
  User,
  Shield,
  Bell,
  Coins,
  Globe,
  CheckCircle2,
} from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [startingBalance, setStartingBalance] = useState("0");
  const [currency, setCurrency] = useState("IDR");
  const [timezone, setTimezone] = useState("Asia/Jakarta");
  const [notifyBudget, setNotifyBudget] = useState(true);
  const [notifyGoal, setNotifyGoal] = useState(true);
  const [notifyDaily, setNotifyDaily] = useState(true);

  // Password change
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  async function loadSettings() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setName(data.user.name || "");
        setEmail(data.user.email || "");
        setStartingBalance(String(data.user.settings?.startingBalance || 0));
        setCurrency(data.user.settings?.currency || "IDR");
        setTimezone(data.user.settings?.timezone || "Asia/Jakarta");
        setNotifyBudget(data.user.settings?.notifyBudgetAlert ?? true);
        setNotifyGoal(data.user.settings?.notifyGoalMilestone ?? true);
        setNotifyDaily(data.user.settings?.notifyDailyReminder ?? true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          startingBalance: parseFloat(startingBalance) || 0,
          currency,
          timezone,
          notifyBudgetAlert: notifyBudget,
          notifyGoalMilestone: notifyGoal,
          notifyDailyReminder: notifyDaily,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMsg("");

    if (newPassword.length < 8) {
      setPasswordMsg("Password minimal 8 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg("Konfirmasi password tidak cocok.");
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setPasswordMsg("✅ Password berhasil diubah.");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMsg(`❌ ${data.error}`);
      }
    } catch (err: any) {
      setPasswordMsg("❌ Gagal memperbarui password.");
    }
  }

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-400 text-sm">
        Memuat pengaturan...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Pengaturan Akun & Finansial
        </h1>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">
          Atur saldo awal, preferensi mata uang, notifikasi, dan keamanan
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Pengaturan berhasil disimpan!
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <User className="w-5 h-5 text-brand-600" />
            <h2 className="text-base font-bold text-slate-900">Profil Pengguna</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Alamat Email"
              value={email}
              disabled
              helperText="Email akun tidak dapat diubah"
            />
          </div>
        </div>

        {/* Financial Preferences Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Coins className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900">
              Konfigurasi Saldo & Finansial
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Saldo Awal (Starting Balance)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-slate-400 text-xs">
                  Rp
                </span>
                <input
                  type="number"
                  value={startingBalance}
                  onChange={(e) => setStartingBalance(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-900 focus:border-brand-500 outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Saldo kas/rekening sebelum pencatatan transaksi dimulai
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Mata Uang
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none"
              >
                <option value="IDR">Rupiah Indonesia (IDR)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="SGD">Singapore Dollar (SGD)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Zona Waktu
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none"
              >
                <option value="Asia/Jakarta">WIB (Asia/Jakarta)</option>
                <option value="Asia/Makassar">WITA (Asia/Makassar)</option>
                <option value="Asia/Jayapura">WIT (Asia/Jayapura)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications Preference Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Bell className="w-5 h-5 text-purple-600" />
            <h2 className="text-base font-bold text-slate-900">
              Preferensi Notifikasi
            </h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/70 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Peringatan Batas Anggaran
                </p>
                <p className="text-[11px] text-slate-500">
                  Kirim notifikasi saat pengeluaran mendekati 80% atau melebihi batas anggaran
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifyBudget}
                onChange={(e) => setNotifyBudget(e.target.checked)}
                className="w-5 h-5 rounded text-brand-500 focus:ring-brand-400"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/70 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Pencapaian Milestone Tabungan
                </p>
                <p className="text-[11px] text-slate-500">
                  Rayakan progres ketika target mencapai 50% dan 100%
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifyGoal}
                onChange={(e) => setNotifyGoal(e.target.checked)}
                className="w-5 h-5 rounded text-brand-500 focus:ring-brand-400"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/70 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Pengingat Pencatatan Harian
                </p>
                <p className="text-[11px] text-slate-500">
                  Pengingat untuk mencatat pengeluaran sebelum hari berganti
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifyDaily}
                onChange={(e) => setNotifyDaily(e.target.checked)}
                className="w-5 h-5 rounded text-brand-500 focus:ring-brand-400"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSaving}
            className="shadow-md shadow-brand-500/25"
          >
            Simpan Perubahan Pengaturan
          </Button>
        </div>
      </form>

      {/* Security & Password Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Shield className="w-5 h-5 text-rose-500" />
          <h2 className="text-base font-bold text-slate-900">Keamanan & Ubah Password</h2>
        </div>

        {passwordMsg && (
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold">
            {passwordMsg}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <Input
            type="password"
            label="Password Baru"
            placeholder="Minimal 8 karakter"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <Input
            type="password"
            label="Konfirmasi Password Baru"
            placeholder="Ulangi password baru"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="secondary" size="md">
            Perbarui Password
          </Button>
        </form>
      </div>
    </div>
  );
}
