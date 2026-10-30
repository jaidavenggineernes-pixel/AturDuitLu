"use client";

import React, { useState, useEffect } from "react";
import { formatDateTimeIndo } from "@/lib/formatters";
import { Button } from "@/components/ui/Button";
import {
  Bell,
  CheckCheck,
  Trash2,
  AlertTriangle,
  AlertOctagon,
  Target,
  Sparkles,
  Info,
  Clock,
} from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");
  const [isLoading, setIsLoading] = useState(true);

  async function loadNotifications() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function markAllRead() {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllAsRead: true }),
      });
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  }

  async function markAsRead(id: string) {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id?: string) {
    try {
      const url = id ? `/api/notifications?id=${id}` : "/api/notifications";
      await fetch(url, { method: "DELETE" });
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  }

  const filtered =
    filter === "UNREAD" ? notifications.filter((n) => !n.isRead) : notifications;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Pusat Notifikasi
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Peringatan batas anggaran, milestone target, dan ringkasan finansial
          </p>
        </div>

        <div className="flex items-center gap-2">
          {notifications.some((n) => !n.isRead) && (
            <Button
              onClick={markAllRead}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <CheckCheck className="w-4 h-4 mr-1 text-brand-600" />
              Tandai Semua Dibaca
            </Button>
          )}

          {notifications.length > 0 && (
            <Button
              onClick={() => handleDelete()}
              variant="ghost"
              size="sm"
              className="text-xs text-rose-600 hover:bg-rose-50"
            >
              <Trash2 className="w-4 h-4 mr-1 text-rose-500" />
              Hapus Semua
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === "ALL"
              ? "bg-brand-500 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200"
          }`}
        >
          Semua ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("UNREAD")}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === "UNREAD"
              ? "bg-brand-500 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200"
          }`}
        >
          Belum Dibaca ({notifications.filter((n) => !n.isRead).length})
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Memuat notifikasi...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Bell className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-semibold">Tidak ada notifikasi.</p>
            <p className="text-xs mt-1">Anda sudah mendapatkan informasi terkini.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((item) => {
              const isUnread = !item.isRead;
              let icon = <Info className="w-5 h-5 text-blue-500" />;
              let iconBg = "bg-blue-50";

              if (item.type === "BUDGET_EXCEEDED") {
                icon = <AlertOctagon className="w-5 h-5 text-rose-600" />;
                iconBg = "bg-rose-50";
              } else if (item.type === "BUDGET_WARNING") {
                icon = <AlertTriangle className="w-5 h-5 text-amber-600" />;
                iconBg = "bg-amber-50";
              } else if (item.type === "GOAL_MILESTONE") {
                icon = <Target className="w-5 h-5 text-purple-600" />;
                iconBg = "bg-purple-50";
              } else if (item.type === "REMINDER") {
                icon = <Clock className="w-5 h-5 text-brand-600" />;
                iconBg = "bg-brand-50";
              }

              return (
                <div
                  key={item.id}
                  className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                    isUnread ? "bg-brand-50/30" : "hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}
                    >
                      {icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">
                          {item.title}
                        </h3>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-brand-500" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {item.message}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-2 block">
                        {formatDateTimeIndo(item.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {isUnread && (
                      <button
                        onClick={() => markAsRead(item.id)}
                        className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Tandai dibaca"
                      >
                        <CheckCheck className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
