"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  ChevronLeft,
  Mail,
  Lock,
  CheckCircle2,
  Smartphone,
  Check,
} from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Password rules validation
  const notContainsEmail =
    !email || !newPassword || !newPassword.toLowerCase().includes(email.split("@")[0].toLowerCase());
  const hasMinLength = newPassword.length >= 8;
  const hasSymbolOrNum = /[\d\W]/.test(newPassword);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!hasMinLength) {
      setError("Password minimal 8 karakter.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengatur ulang password.");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  // SCREEN 6: Password updated! (Matching reference image)
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-sm bg-white rounded-3xl border border-slate-100 shadow-2xl p-8 text-center space-y-6">
          {/* Phone Illustration Badge */}
          <div className="w-24 h-24 mx-auto relative flex items-center justify-center">
            <div className="w-20 h-20 rounded-3xl bg-brand-50 border-2 border-brand-100 flex items-center justify-center">
              <Smartphone className="w-10 h-10 text-brand-500" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center ring-4 ring-white shadow-md">
              <Check className="w-5 h-5 stroke-[3]" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Password updated!
            </h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Your password has been setup successfully. Silakan gunakan password baru untuk masuk ke akun Anda.
            </p>
          </div>

          <Link href="/login" className="block w-full">
            <Button variant="primary" size="lg" className="w-full uppercase tracking-wider">
              BACK TO LOGIN
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // SCREEN 5: Create Your New Password (Matching reference image)
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Back Link */}
        <Link
          href="/login"
          className="inline-flex items-center text-slate-400 hover:text-slate-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 -ml-1" />
        </Link>

        {/* Title & Subtitle */}
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Create Your New Password
          </h1>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Your new password must be different from previous password.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <Input
            label="Email Akun"
            type="email"
            placeholder="demo@aturduitlu.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Password Baru"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            required
          />

          {/* Password Checklist matching Screen 5 */}
          <div className="space-y-2 pt-1 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2
                className={`w-4 h-4 ${
                  newPassword && notContainsEmail ? "text-brand-500" : "text-slate-300"
                }`}
              />
              <span
                className={
                  newPassword && notContainsEmail ? "text-slate-900 font-semibold" : ""
                }
              >
                Must not contain your name or email
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2
                className={`w-4 h-4 ${
                  hasMinLength ? "text-brand-500" : "text-slate-300"
                }`}
              />
              <span className={hasMinLength ? "text-slate-900 font-semibold" : ""}>
                At least 8 characters
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2
                className={`w-4 h-4 ${
                  hasSymbolOrNum ? "text-brand-500" : "text-slate-300"
                }`}
              />
              <span className={hasSymbolOrNum ? "text-slate-900 font-semibold" : ""}>
                Contains a symbol or a number
              </span>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full uppercase tracking-wider shadow-md shadow-brand-500/25"
              isLoading={isLoading}
            >
              RESET PASSWORD
            </Button>
          </div>
        </form>
      </div>

      {/* Watermark */}
      <div className="text-center mt-6 text-xs text-slate-400 font-medium tracking-wider">
        AturDuit-Lu Design by JNext AI @jaidav
      </div>
    </div>
  );
}
