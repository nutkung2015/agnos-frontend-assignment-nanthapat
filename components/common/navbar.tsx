"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Activity,
  UserPen,
  LayoutDashboard,
  SplitSquareVertical,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const patientId = searchParams.get("id") || "patient-demo-001";

  const navItems = [
    {
      href: `/forms`,
      label: "Forms Directory",
      labelTh: "รายการฟอร์ม",
      icon: ClipboardList,
      active: pathname === "/forms",
    },
    {
      href: `/patient-form?id=${patientId}`,
      label: "Patient Form",
      labelTh: "ฟอร์มคนไข้",
      icon: UserPen,
      active: pathname === "/patient-form",
    },
    {
      href: `/staff-view?id=${patientId}`,
      label: "Staff View",
      labelTh: "จอเจ้าหน้าที่",
      icon: LayoutDashboard,
      active: pathname === "/staff-view",
    },
    {
      href: `/demo?id=${patientId}`,
      label: "Split-Screen Demo",
      labelTh: "เดโม 2 จอ",
      icon: SplitSquareVertical,
      active: pathname === "/demo",
      highlight: true,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white shadow-sm shadow-teal-600/20 group-hover:bg-teal-700 transition">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-sm text-slate-900 tracking-tight block leading-tight">
              AGNOS <span className="text-teal-600 font-semibold">HEALTH</span>
            </span>
            <span className="text-[10px] text-slate-400 block leading-none">
              Real-Time Patient Intake
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition-all duration-150",
                  item.active
                    ? "bg-teal-50 text-teal-700 border border-teal-200 shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  item.highlight &&
                    !item.active &&
                    "bg-gradient-to-r from-teal-500/10 to-emerald-500/10 text-teal-800 border border-teal-200/70 hover:from-teal-500/20 hover:to-emerald-500/20"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.labelTh}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
