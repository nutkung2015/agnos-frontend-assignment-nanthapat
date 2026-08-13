"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";

interface LastUpdatedTimerProps {
  updatedAt?: string | null;
}

export function LastUpdatedTimer({ updatedAt }: LastUpdatedTimerProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    // Tick every 1 second to update relative time
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!updatedAt) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
        <Clock className="w-3 h-3" />
        <span>ยังไม่มีข้อมูล</span>
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium"
      title={new Date(updatedAt).toLocaleString("th-TH")}
    >
      <Clock className="w-3.5 h-3.5 text-teal-600" />
      <span>อัปเดต: {formatTimeAgo(updatedAt)}</span>
    </span>
  );
}
