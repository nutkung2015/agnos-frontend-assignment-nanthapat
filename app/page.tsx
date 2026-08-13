"use client";

import { useState } from "react";
import Link from "next/link";
import {
  UserPen,
  LayoutDashboard,
  SplitSquareVertical,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  Database,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/common/navbar";
import { Suspense } from "react";

function LandingContent() {
  const [sessionId, setSessionId] = useState("patient-001");

  const generateNewId = () => {
    const randomId = `patient-${Math.random().toString(36).substring(2, 8)}`;
    setSessionId(randomId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Suspense fallback={<div className="h-14 bg-white border-b border-slate-200" />}>
        <Navbar />
      </Suspense>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-slate-200 bg-white py-12 md:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-50/70 via-transparent to-transparent pointer-events-none" />
          
          <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center space-y-6 relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 shadow-2xs">
              <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
              Agnos Candidate Assignment — Real-Time System
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Patient Intake Form & <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Real-Time Staff Portal
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-600 leading-relaxed">
              ระบบรับข้อมูลผู้ป่วยและหน้าจอเฝ้าดูข้อมูลแบบเรียลไทม์ ซิงค์ข้อมูลทันทีระดับ Keystroke
              พร้อมระบบตรวจจับสถานะ Inactivity และเก็บข้อมูลลง PostgreSQL อย่างปลอดภัย
            </p>

            {/* Session Controller */}
            <div className="mx-auto max-w-md rounded-2xl border border-teal-100 bg-teal-50/40 p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">รหัส Session ผู้ป่วย (Patient ID):</span>
                <button
                  onClick={generateNewId}
                  className="text-teal-700 hover:text-teal-900 font-medium hover:underline cursor-pointer"
                >
                  สุ่มรหัสใหม่ (Generate New)
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value.trim())}
                  placeholder="เช่น patient-001 หรือ uuid"
                  className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            {/* Hero Quick Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link href={`/demo?id=${sessionId}`}>
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-900/10 gap-2 text-sm sm:text-base">
                  <SplitSquareVertical className="h-5 w-5" />
                  เปิดโหมด Split-Screen Demo (แนะนำ)
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/forms">
                <Button size="lg" variant="outline" className="text-slate-700 bg-white shadow-sm gap-2 text-sm sm:text-base border-slate-300">
                  <ClipboardList className="h-5 w-5 text-teal-600" />
                  ดูรายการฟอร์มทั้งหมด (Directory)
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Forms Directory */}
            <Card className="flex flex-col justify-between border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
              <CardHeader>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-bold">1. All Forms Directory</CardTitle>
                <CardDescription className="text-xs">
                  หน้าแดชบอร์ดรวบรวมแบบฟอร์มคนไข้ทุก Session ค้นหา กรองสถานะ และเข้าถึงข้อมูลแบบ Real-Time
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link href="/forms">
                  <Button variant="outline" className="w-full justify-between text-xs text-purple-700 border-purple-200 bg-purple-50/40 hover:bg-purple-100/50">
                    ดูรายการฟอร์มทั้งหมด
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Card 2: Patient Form */}
            <Card className="flex flex-col justify-between border-slate-200 hover:border-teal-300 hover:shadow-md transition-all">
              <CardHeader>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                  <UserPen className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-bold">2. Patient Form</CardTitle>
                <CardDescription className="text-xs">
                  หน้าฟอร์มกรอกข้อมูลผู้ป่วยแบบ Responsive รองรับ Zod Validation, Auto-Save Debounce 300ms และ Inactivity Detection
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link href={`/patient-form?id=${sessionId}`}>
                  <Button variant="outline" className="w-full justify-between text-xs">
                    เข้าสู่หน้า Patient Form
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Card 3: Staff View */}
            <Card className="flex flex-col justify-between border-slate-200 hover:border-sky-300 hover:shadow-md transition-all">
              <CardHeader>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-bold">3. Staff View</CardTitle>
                <CardDescription className="text-xs">
                  หน้าจอเฝ้าดูของเจ้าหน้าที่ แสดงข้อมูลเรียลไทม์ผ่าน WebSocket พร้อมสถานะ Actively Filling, Inactive และ Submitted
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link href={`/staff-view?id=${sessionId}`}>
                  <Button variant="outline" className="w-full justify-between text-xs">
                    เข้าสู่หน้า Staff View
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Card 4: Split-Screen Demo */}
            <Card className="flex flex-col justify-between border-teal-200 bg-gradient-to-b from-teal-50/50 to-white hover:border-teal-400 hover:shadow-md transition-all">
              <CardHeader>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <SplitSquareVertical className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-bold">4. Split Demo</CardTitle>
                  <Badge variant="default" className="text-[10px] py-0 px-2 bg-teal-600 text-white">
                    Live Test
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  ทดสอบจอซ้าย (คนไข้) และจอขวา (เจ้าหน้าที่) ในหน้าเดียวกัน พิมพ์ซ้ายเห็นขวาขยับทันที
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link href={`/demo?id=${sessionId}`}>
                  <Button className="w-full justify-between text-xs bg-teal-600 hover:bg-teal-700 text-white">
                    เปิด Split-Screen Demo
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Architecture Highlights */}
          <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-teal-600" />
              จุดเด่นทางเทคนิคและสถาปัตยกรรมระดับ Production
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-100 space-y-1">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  Real-Time Engine
                </div>
                <p className="text-slate-500">
                  Socket.io Room isolation แยกห้องตาม Patient ID ไม่กวน session กัน
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 border border-slate-100 space-y-1">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5 text-sky-500" />
                  Persistent Storage
                </div>
                <p className="text-slate-500">
                  Prisma ORM + PostgreSQL (Supabase) บันทึกทุก Snapshot ข้อมูลไม่สูญหาย
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 border border-slate-100 space-y-1">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  Strict Type Safety
                </div>
                <p className="text-slate-500">
                  Zod validation + TypeScript strict checks ทั้ง Client และ Server
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 border border-slate-100 space-y-1">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-purple-500" />
                  WCAG Accessibility
                </div>
                <p className="text-slate-500">
                  รองรับ Screen reader, Keyboard navigation, Color contrast ตามมาตรฐาน WCAG 2.1 AA
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
        Agnos Health — Candidate Assignment Demo System
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm text-slate-500">กำลังโหลด...</div>}>
      <LandingContent />
    </Suspense>
  );
}
