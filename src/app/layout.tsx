import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AturDuitLu - Personal Finance Management & Expense Tracking Platform",
  description:
    "Platform manajemen keuangan pribadi modern untuk mencatat pengeluaran, memantau anggaran, menetapkan target tabungan, dan menganalisis kesehatan finansial.",
  authors: [{ name: "AturDuitLu Team" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1E5BF6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full">
      <body className="min-h-full flex flex-col antialiased text-slate-900 bg-slate-50 selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
