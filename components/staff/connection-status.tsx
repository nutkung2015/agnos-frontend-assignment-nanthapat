"use client";

import { Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ConnectionStatusProps {
  isConnected: boolean;
  socketId?: string | null;
  transport?: string | null;
}

export function ConnectionStatus({
  isConnected,
  socketId,
  transport,
}: ConnectionStatusProps) {
  if (!isConnected) {
    return (
      <Badge
        variant="destructive"
        className="gap-1.5 px-2.5 py-1 text-xs font-mono"
        role="status"
        aria-label="การเชื่อมต่อ Socket: ออฟไลน์"
      >
        <WifiOff className="w-3.5 h-3.5" />
        <span>DISCONNECTED (กำลังต่อใหม่...)</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="gap-1.5 px-2.5 py-1 text-xs border-teal-200 bg-teal-50/50 text-teal-800 font-mono shadow-2xs"
      role="status"
      aria-label="การเชื่อมต่อ Socket: ออนไลน์"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
      </span>
      <Wifi className="w-3.5 h-3.5 text-teal-600" />
      <span>LIVE ({transport || "websocket"})</span>
      {socketId && (
        <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
          #{socketId.slice(0, 6)}
        </span>
      )}
    </Badge>
  );
}
