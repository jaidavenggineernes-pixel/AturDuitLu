"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  formatCurrency,
  formatDateIndo,
  formatDateTimeIndo,
  getCurrencySymbol,
  setStoredCurrency,
  setStoredTimezone,
  getStoredCurrency,
  getStoredTimezone,
} from "@/lib/formatters";

export interface UserSettingsData {
  startingBalance: number;
  currency: string;
  timezone: string;
  theme: string;
  notifyBudgetAlert: boolean;
  notifyGoalMilestone: boolean;
  notifyDailyReminder: boolean;
}

export interface SettingsContextType {
  settings: UserSettingsData;
  currency: string;
  currencySymbol: string;
  timezone: string;
  updateSettings: (newSettings: Partial<UserSettingsData> & { name?: string }) => Promise<boolean>;
  refreshSettings: () => Promise<void>;
  formatMoney: (amount: number) => string;
  formatDate: (date: string | Date | number) => string;
  formatDateTime: (date: string | Date | number) => string;
}

const defaultSettings: UserSettingsData = {
  startingBalance: 0,
  currency: "IDR",
  timezone: "Asia/Jakarta",
  theme: "light",
  notifyBudgetAlert: true,
  notifyGoalMilestone: true,
  notifyDailyReminder: true,
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  currency: "IDR",
  currencySymbol: "Rp",
  timezone: "Asia/Jakarta",
  updateSettings: async () => false,
  refreshSettings: async () => {},
  formatMoney: (amt) => formatCurrency(amt, "IDR"),
  formatDate: (d) => formatDateIndo(d, "Asia/Jakarta"),
  formatDateTime: (d) => formatDateTimeIndo(d, "Asia/Jakarta"),
});

export function SettingsProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings?: Partial<UserSettingsData> | null;
}) {
  const [settings, setSettings] = useState<UserSettingsData>(() => {
    const curr = initialSettings?.currency || (typeof window !== "undefined" ? getStoredCurrency() : "IDR");
    const tz = initialSettings?.timezone || (typeof window !== "undefined" ? getStoredTimezone() : "Asia/Jakarta");
    return {
      ...defaultSettings,
      ...(initialSettings || {}),
      currency: curr,
      timezone: tz,
    };
  });

  // Keep localStorage synced whenever state changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      setStoredCurrency(settings.currency);
      setStoredTimezone(settings.timezone);
    }
  }, [settings.currency, settings.timezone]);

  // Listen to cross-window or external settings updates
  useEffect(() => {
    function handleSync() {
      const curr = getStoredCurrency();
      const tz = getStoredTimezone();
      setSettings((prev) => ({
        ...prev,
        currency: curr,
        timezone: tz,
      }));
    }

    window.addEventListener("settings_updated", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("settings_updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const refreshSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      const data = await res.json();
      if (data.success && data.user?.settings) {
        const newSettings = {
          ...defaultSettings,
          ...data.user.settings,
        };
        setSettings(newSettings);
        setStoredCurrency(newSettings.currency);
        setStoredTimezone(newSettings.timezone);
        window.dispatchEvent(new Event("settings_updated"));
      }
    } catch (err) {
      console.error("Failed to refresh settings:", err);
    }
  }, []);

  const updateSettings = useCallback(
    async (newSettings: Partial<UserSettingsData> & { name?: string }) => {
      try {
        const res = await fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSettings),
        });
        const data = await res.json();
        if (data.success && data.settings) {
          const merged = {
            ...settings,
            ...data.settings,
          };
          setSettings(merged);
          setStoredCurrency(merged.currency);
          setStoredTimezone(merged.timezone);
          window.dispatchEvent(new Event("settings_updated"));
          return true;
        }
        return false;
      } catch (err) {
        console.error("Update settings error:", err);
        return false;
      }
    },
    [settings]
  );

  const currencySymbol = getCurrencySymbol(settings.currency);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        currency: settings.currency,
        currencySymbol,
        timezone: settings.timezone,
        updateSettings,
        refreshSettings,
        formatMoney: (amt) => formatCurrency(amt, settings.currency),
        formatDate: (d) => formatDateIndo(d, settings.timezone),
        formatDateTime: (d) => formatDateTimeIndo(d, settings.timezone),
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
