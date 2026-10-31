import React from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardClientWrapper } from "./DashboardClientWrapper";
import { SettingsProvider } from "@/context/SettingsContext";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <SettingsProvider initialSettings={user.settings}>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar user={user} />
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-full overflow-x-hidden">
            <DashboardClientWrapper>{children}</DashboardClientWrapper>
          </main>
        </div>
      </div>
    </SettingsProvider>
  );
}
