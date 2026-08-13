"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Activity,
  UserPen,
  LayoutDashboard,
  SplitSquareVertical,
  ClipboardList,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const patientId = searchParams.get("id") || "patient-demo-001";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      href: `/forms`,
      label: "Forms Directory",
      labelTh: "รายการฟอร์มทั้งหมด",
      desc: "ดูรายการ Session และสถานะภาพรวม",
      icon: ClipboardList,
      active: pathname === "/forms",
    },
    {
      href: `/patient-form?id=${patientId}`,
      label: "Patient Form",
      labelTh: "ฟอร์มลงทะเบียนคนไข้",
      desc: "แบบฟอร์มกรอกข้อมูลพร้อมระบบ Auto-Save",
      icon: UserPen,
      active: pathname === "/patient-form",
    },
    {
      href: `/staff-view?id=${patientId}`,
      label: "Staff View",
      labelTh: "จอเฝ้าดูเจ้าหน้าที่",
      desc: "มอนิเตอร์ข้อมูลแบบเรียลไทม์ Real-Time",
      icon: LayoutDashboard,
      active: pathname === "/staff-view",
    },
    {
      href: `/demo?id=${patientId}`,
      label: "Split-Screen Demo",
      labelTh: "เดโม 2 จอ (Split View)",
      desc: "ทดสอบจอคนไข้และเจ้าหน้าที่พร้อมกัน",
      icon: SplitSquareVertical,
      active: pathname === "/demo",
      highlight: true,
    },
  ];

  const activeItem = navItems.find((item) => item.active);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3.5 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white shadow-sm shadow-teal-600/20 group-hover:bg-teal-700 transition">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-sm text-slate-900 tracking-tight block leading-tight">
              AGNOS <span className="text-teal-600 font-semibold">HEALTH</span>
            </span>
            <span className="text-[10px] text-slate-400 block leading-none hidden sm:block">
              Real-Time Patient Intake
            </span>
          </div>
        </Link>

        {/* Desktop Navigation links (md and up) */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 whitespace-nowrap",
                  item.active
                    ? "bg-teal-50 text-teal-700 border border-teal-200 shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  item.highlight &&
                    !item.active &&
                    "bg-gradient-to-r from-teal-500/10 to-emerald-500/10 text-teal-800 border border-teal-200/70 hover:from-teal-500/20 hover:to-emerald-500/20"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Tablet Navigation (sm to lg) */}
        <nav className="hidden sm:flex lg:hidden items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all duration-150",
                  item.active
                    ? "bg-teal-50 text-teal-700 border border-teal-200 shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.labelTh}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Header Right Controls (< sm) */}
        <div className="flex sm:hidden items-center gap-1.5">
          {/* Active Page Mini Badge on Mobile */}
          {activeItem && (
            <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-md flex items-center gap-1 max-w-[140px] truncate">
              <activeItem.icon className="h-3 w-3 text-teal-600 shrink-0" />
              <span className="truncate">{activeItem.labelTh}</span>
            </span>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition active:scale-95"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Menu Overlay */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 pb-1">
              เมนูนำทาง (Navigation)
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-xl p-2.5 transition-all",
                    item.active
                      ? "bg-teal-50 text-teal-800 border border-teal-200 font-semibold shadow-xs"
                      : "text-slate-700 hover:bg-slate-50 border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        item.active
                          ? "bg-teal-600 text-white"
                          : "bg-slate-100 text-slate-600"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">{item.labelTh}</div>
                      <div className="text-[10px] text-slate-400">{item.desc}</div>
                    </div>
                  </div>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4",
                      item.active ? "text-teal-600" : "text-slate-300"
                    )}
                  />
                </Link>
              );
            })}

            {/* Current Session Info */}
            <div className="mt-2 pt-2 border-t border-slate-100 px-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>Active Session:</span>
              <span className="font-mono font-bold text-teal-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                {patientId}
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
