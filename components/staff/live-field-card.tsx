"use client";

import { useEffect, useState, useRef } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface LiveFieldCardProps {
  label: string;
  labelEn?: string;
  value?: string | null;
  icon?: React.ReactNode;
  isMono?: boolean;
  className?: string;
}

export function LiveFieldCard({
  label,
  labelEn,
  value,
  icon,
  isMono = false,
  className,
}: LiveFieldCardProps) {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [copied, setCopied] = useState(false);
  const prevValueRef = useRef<string | null | undefined>(value);

  useEffect(() => {
    // Only trigger animation when value actually changes from a previous value
    if (prevValueRef.current !== undefined && prevValueRef.current !== value) {
      setIsHighlighted(true);
      const timer = setTimeout(() => {
        setIsHighlighted(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
    prevValueRef.current = value;
  }, [value]);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasValue = value && value.trim().length > 0;

  return (
    <div
      className={cn(
        "group relative rounded-xl border bg-white p-3.5 shadow-xs transition-all duration-200",
        isHighlighted
          ? "border-teal-400 bg-teal-50/40 shadow-md ring-2 ring-teal-300/50 scale-[1.01]"
          : "border-slate-200 hover:border-slate-300",
        className
      )}
    >
      <div className="flex items-center justify-between gap-1 mb-1">
        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
          {icon && <span className="text-teal-600">{icon}</span>}
          <span className="font-semibold text-slate-700">{label}</span>
          {labelEn && <span className="text-[10px] text-slate-400">({labelEn})</span>}
        </div>

        {hasValue && (
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700"
            title="Copy value"
            aria-label={`Copy ${label}`}
          >
            {copied ? (
              <Check className="w-3 h-3 text-emerald-600" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        )}
      </div>

      <div
        className={cn(
          "text-sm font-medium transition-colors break-words min-h-[22px]",
          hasValue ? "text-slate-900" : "text-slate-400 italic text-xs",
          isMono && hasValue && "font-mono text-xs tracking-tight"
        )}
      >
        {hasValue ? value : "ยังไม่ได้ระบุ (Empty)"}
      </div>
    </div>
  );
}
