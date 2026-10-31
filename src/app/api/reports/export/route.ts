import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "csv"; // "csv" or "xlsx"
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const typeParam = searchParams.get("type");

    const where: any = { userId: user.id };
    if (typeParam && typeParam !== "ALL") {
      where.type = typeParam.toUpperCase();
    }
    if (startDateParam || endDateParam) {
      where.transactionDate = {};
      if (startDateParam) where.transactionDate.gte = new Date(startDateParam);
      if (endDateParam) {
        const end = new Date(endDateParam);
        if (endDateParam.length <= 10) end.setHours(23, 59, 59, 999);
        where.transactionDate.lte = end;
      }
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: { transactionDate: "desc" },
    });

    const currency = user.settings?.currency || "IDR";
    const timezone = user.settings?.timezone || "Asia/Jakarta";
    const timestamp = new Date().toISOString().split("T")[0];

    if (format === "csv") {
      // Build RFC-4180 CSV
      const headers = [
        "ID",
        "Tanggal",
        "Nama Transaksi",
        "Jenis",
        "Kategori",
        `Nominal (${currency})`,
        "Metode Pembayaran",
        "Catatan",
      ];

      const rows = transactions.map((t) => [
        `"${t.id}"`,
        `"${new Date(t.transactionDate).toISOString().replace("T", " ").substring(0, 19)}"`,
        `"${(t.name || "").replace(/"/g, '""')}"`,
        `"${t.type === "INCOME" ? "Pemasukan" : "Pengeluaran"}"`,
        `"${(t.category?.name || "Lainnya").replace(/"/g, '""')}"`,
        t.amount,
        `"${(t.paymentMethod || "Cash").replace(/"/g, '""')}"`,
        `"${(t.notes || "").replace(/"/g, '""')}"`,
      ]);

      const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="Laporan_Keuangan_AturDuitLu_${timestamp}.csv"`,
        },
      });
    }

    // Excel Format (HTML-based spreadsheet table XML compatible with MS Excel, LibreOffice, Google Sheets)
    const totalIncome = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0);
    const netFlow = totalIncome - totalExpense;

    const htmlSpreadsheet = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">
        <style>
          body { font-family: Arial, sans-serif; }
          table { border-collapse: collapse; width: 100%; }
          th { background-color: #1E5BF6; color: white; border: 1px solid #ddd; padding: 10px; text-align: left; }
          td { border: 1px solid #ddd; padding: 8px; }
          .income { color: #10B981; font-weight: bold; }
          .expense { color: #EF4444; font-weight: bold; }
          .header-box { margin-bottom: 20px; }
          .total-row { font-weight: bold; background-color: #F8FAFC; }
        </style>
      </head>
      <body>
        <div class="header-box">
          <h2>AturDuitLu - Laporan Keuangan</h2>
          <p>Pengguna: ${user.name} (${user.email})</p>
          <p>Tanggal Cetak: ${new Date().toLocaleString("id-ID", { timeZone: timezone })}</p>
          <p>Total Pemasukan: ${currency} ${new Intl.NumberFormat("id-ID").format(totalIncome)} | Total Pengeluaran: ${currency} ${new Intl.NumberFormat("id-ID").format(totalExpense)} | Arus Kas Bersih: ${currency} ${new Intl.NumberFormat("id-ID").format(netFlow)}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Tanggal</th>
              <th>Nama Transaksi</th>
              <th>Jenis</th>
              <th>Kategori</th>
              <th>Nominal (${currency})</th>
              <th>Metode Pembayaran</th>
              <th>Catatan</th>
            </tr>
          </thead>
          <tbody>
            ${transactions
              .map(
                (t, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td>${new Date(t.transactionDate).toLocaleDateString("id-ID", { timeZone: timezone })}</td>
                <td>${t.name}</td>
                <td class="${t.type === "INCOME" ? "income" : "expense"}">${
                  t.type === "INCOME" ? "Pemasukan" : "Pengeluaran"
                }</td>
                <td>${t.category?.name || "Lainnya"}</td>
                <td>${t.amount}</td>
                <td>${t.paymentMethod || "Cash"}</td>
                <td>${t.notes || "-"}</td>
              </tr>
            `
              )
              .join("")}
            <tr class="total-row">
              <td colspan="5" style="text-align: right;">TOTAL PEMASUKAN</td>
              <td class="income">${currency} ${new Intl.NumberFormat("id-ID").format(totalIncome)}</td>
              <td colspan="2"></td>
            </tr>
            <tr class="total-row">
              <td colspan="5" style="text-align: right;">TOTAL PENGELUARAN</td>
              <td class="expense">${currency} ${new Intl.NumberFormat("id-ID").format(totalExpense)}</td>
              <td colspan="2"></td>
            </tr>
            <tr class="total-row">
              <td colspan="5" style="text-align: right;">ARUS KAS BERSIH</td>
              <td>${currency} ${new Intl.NumberFormat("id-ID").format(netFlow)}</td>
              <td colspan="2"></td>
            </tr>
          </tbody>
        </table>
      </body>
      </html>
    `;

    return new NextResponse(htmlSpreadsheet, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.ms-excel; charset=utf-8",
        "Content-Disposition": `attachment; filename="Laporan_Keuangan_AturDuitLu_${timestamp}.xls"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Gagal mengekspor laporan keuangan." },
      { status: 500 }
    );
  }
}
