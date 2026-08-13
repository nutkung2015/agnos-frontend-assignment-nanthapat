"use client";

import { PatientStatus } from "@/types/patient";
import { CheckCircle2, Clock, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status?: PatientStatus | null;
  className?: string;
}

export function StatusBadge({ status = "filling", className }: StatusBadgeProps) {
  if (status === "submitted") {
    return (
      <Badge
        variant="success"
        className={`gap-1.5 px-3 py-1 text-xs font-bold border-emerald-300 bg-emerald-100 text-emerald-800 shadow-sm ${className || ""}`}
        role="status"
        aria-label="สถานะ: ส่งข้อมูลเรียบร้อยแล้ว"
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>SUBMITTED (ส่งแล้ว)</span>
      </Badge>
    );
  }

  if (status === "inactive") {
    return (
      <Badge
        variant="secondary"
        className={`gap-1.5 px-3 py-1 text-xs font-semibold border-slate-300 bg-slate-100 text-slate-700 ${className || ""}`}
        role="status"
        aria-label="สถานะ: ไม่มีความเคลื่อนไหว"
      >
        <Clock className="w-3.5 h-3.5 text-slate-500" />
        <span>INACTIVE (หยุดพิมพ์)</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant="warning"
      className={`gap-1.5 px-3 py-1 text-xs font-bold border-amber-300 bg-amber-100 text-amber-900 shadow-sm ${className || ""}`}
      role="status"
      aria-label="สถานะ: กำลังกรอกข้อมูล"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
      </span>
      <Activity className="w-3.5 h-3.5 text-amber-700" />
      <span>ACTIVELY FILLING (กำลังกรอก)</span>
    </Badge>
  );
}
