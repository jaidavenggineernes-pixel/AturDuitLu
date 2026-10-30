"use client";

import React, { useState } from "react";
import { MobileNav } from "@/components/layout/MobileNav";
import { TransactionFormModal } from "@/components/transactions/TransactionFormModal";
import { useRouter } from "next/navigation";

export function DashboardClientWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <>
      {children}

      {/* Global Add Transaction Modal triggered from Mobile Nav Floating + or any quick action */}
      <TransactionFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          router.refresh();
        }}
      />

      {/* Mobile Navigation bar with floating plus FAB button */}
      <MobileNav onOpenAddTransaction={() => setIsAddModalOpen(true)} />
    </>
  );
}
