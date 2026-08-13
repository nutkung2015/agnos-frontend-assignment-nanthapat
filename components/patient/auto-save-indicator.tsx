"use client";

import { Cloud, CloudOff, RefreshCw, CheckCircle2 } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";

interface AutoSaveIndicatorProps {
  isConnected: boolean;
  isSaving: boolean;
  isDirty: boolean;
  lastSavedAt: Date | null;
}

export function AutoSaveIndicator({
  isConnected,
  isSaving,
  isDirty,
  lastSavedAt,
}: AutoSaveIndicatorProps) {
  if (!isConnected) {
    return (
      <div
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200"
        role="status"
        aria-live="polite"
      >
        <CloudOff className="w-3.5 h-3.5 text-rose-500" />
        <span>ออฟไลน์ (กำลังเชื่อมต่อใหม่...)</span>
      </div>
    );
  }

  if (isSaving || isDirty) {
    return (
      <div
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200"
        role="status"
        aria-live="polite"
      >
        <RefreshCw className="w-3.5 h-3.5 text-amber-500 animate-spin" />
        <span>กำลังซิงค์ข้อมูล...</span>
      </div>
    );
  }

  if (lastSavedAt) {
    return (
      <div
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200/80 transition-all duration-300"
        role="status"
        aria-live="polite"
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
        <span>บันทึกอัตโนมัติแล้ว ({formatTimeAgo(lastSavedAt.toISOString())})</span>
      </div>
    );
  }

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200"
      role="status"
      aria-live="polite"
    >
      <Cloud className="w-3.5 h-3.5 text-slate-400" />
      <span>พร้อมบันทึกอัตโนมัติ</span>
    </div>
  );
}
