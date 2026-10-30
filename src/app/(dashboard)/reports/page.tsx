"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency, formatDateIndo } from "@/lib/formatters";
import { Button } from "@/components/ui/Button";
import {
  FileText,
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Filter,
} from "lucide-react";

export default function ReportsPage() {
  const [period, setPeriod] = useState<
    "daily" | "weekly" | "monthly" | "yearly" | "custom"
  >("monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadReport() {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.set("period", period);
      if (period === "custom" && startDate && endDate) {
        params.set("startDate", startDate);
        params.set("endDate", endDate);
      }

      const res = await fetch(`/api/reports?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setReportData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadReport();
  }, [period, startDate, endDate]);

  function handlePrint() {
    window.print();
  }

  const transactions = reportData?.transactions || [];
  const categoryBreakdown = reportData?.categoryBreakdown || [];

  return (
    <div className="space-y-6">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Laporan Keuangan
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Unduh dan cetak rekapitulasi data keuangan berkala
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* CSV Export */}
          <a
            href={`/api/reports/export?format=csv&period=${period}${
              startDate ? `&startDate=${startDate}` : ""
            }${endDate ? `&endDate=${endDate}` : ""}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            Download CSV
          </a>

          {/* Excel Export */}
          <a
            href={`/api/reports/export?format=xlsx&period=${period}${
              startDate ? `&startDate=${startDate}` : ""
            }${endDate ? `&endDate=${endDate}` : ""}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-brand-600" />
            Download Excel (.XLS)
          </a>

          {/* Print / PDF */}
          <Button
            onClick={handlePrint}
            variant="primary"
            size="md"
            className="shadow-md shadow-brand-500/25"
          >
            <Printer className="w-4 h-4 mr-1.5" />
            Cetak / PDF
          </Button>
        </div>
      </div>

      {/* Period Selection Controls */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-card space-y-3 print:hidden">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-700 mr-2">Pilih Periode:</span>
          {[
            { id: "daily", label: "Hari Ini" },
            { id: "weekly", label: "Minggu Ini" },
            { id: "monthly", label: "Bulan Ini" },
            { id: "yearly", label: "Tahun Ini" },
            { id: "custom", label: "Kustom Tanggal" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPeriod(tab.id as any)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                period === tab.id
                  ? "bg-brand-500 text-white shadow-sm"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {period === "custom" && (
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs">
            <span className="font-semibold text-slate-500">Rentang:</span>
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
          </div>
        )}
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-card print:shadow-none print:border-none print:p-0">
        {/* Printable Header */}
        <div className="border-b border-slate-200 pb-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                AturDuitLu Financial Report
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Laporan Keuangan Personal • Periode:{" "}
                <span className="font-bold text-slate-700 uppercase">
                  {reportData?.period}
                </span>{" "}
                ({formatDateIndo(reportData?.startDate || new Date())} -{" "}
                {formatDateIndo(reportData?.endDate || new Date())})
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-400 block">
                Dicetak pada
              </span>
              <span className="text-xs font-bold text-slate-700">
                {new Date().toLocaleDateString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        {/* Financial Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              Total Pemasukan
            </span>
            <p className="text-xl font-black text-emerald-600">
              {formatCurrency(reportData?.totalIncome || 0)}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block mb-1">
              Total Pengeluaran
            </span>
            <p className="text-xl font-black text-rose-600">
              {formatCurrency(reportData?.totalExpense || 0)}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
            <span className="text-xs font-bold text-brand-800 uppercase tracking-wider block mb-1">
              Arus Kas Bersih
            </span>
            <p className="text-xl font-black text-brand-600">
              {formatCurrency(reportData?.netCashFlow || 0)}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
            <span className="text-xs font-bold text-purple-800 uppercase tracking-wider block mb-1">
              Rasio Tabungan
            </span>
            <p className="text-xl font-black text-purple-600">
              {reportData?.savingsRate || 0}%
            </p>
          </div>
        </div>

        {/* Category Breakdown Table */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">
            Rincian Pengeluaran per Kategori
          </h3>
          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Jumlah Transaksi</th>
                  <th className="p-3 text-right">Nominal</th>
                  <th className="p-3 text-right">Persentase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {categoryBreakdown.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-slate-400">
                      Tidak ada catatan pengeluaran pada periode ini.
                    </td>
                  </tr>
                ) : (
                  categoryBreakdown.map((cat: any) => (
                    <tr key={cat.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-semibold">{cat.name}</td>
                      <td className="p-3">{cat.count} kali</td>
                      <td className="p-3 text-right font-bold">
                        {formatCurrency(cat.amount)}
                      </td>
                      <td className="p-3 text-right">{cat.percentage}%</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Full Itemized Transaction Table */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">
            Rincian Seluruh Transaksi ({transactions.length})
          </h3>
          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Nama Transaksi</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Metode</th>
                  <th className="p-3 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-400">
                      Tidak ada transaksi pada periode yang dipilih.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx: any) => {
                    const isIncome = tx.type === "INCOME";
                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-medium text-slate-500">
                          {formatDateIndo(tx.transactionDate)}
                        </td>
                        <td className="p-3 font-semibold text-slate-900">
                          {tx.name}
                        </td>
                        <td className="p-3">{tx.category?.name || "Lainnya"}</td>
                        <td className="p-3">
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-medium">
                            {tx.paymentMethod || "Cash"}
                          </span>
                        </td>
                        <td
                          className={`p-3 text-right font-bold ${
                            isIncome ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {isIncome ? "+" : "-"}
                          {formatCurrency(tx.amount)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
