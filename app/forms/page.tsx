"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ClipboardList,
  Search,
  Plus,
  RefreshCw,
  LayoutGrid,
  Table as TableIcon,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  Trash2,
  Copy,
  Check,
  SplitSquareVertical,
  Activity,
  CheckCircle2,
  FileText,
  UserPen,
  LayoutDashboard,
  Database,
  X,
  SlidersHorizontal,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
} from "lucide-react";

import { PatientRecord, PatientStatus } from "@/types/patient";
import { useSocket } from "@/hooks/useSocket";
import { Navbar } from "@/components/common/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/staff/status-badge";
import { ConnectionStatus } from "@/components/staff/connection-status";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatRelativeTime } from "@/lib/utils";

function FormsDirectoryContent() {
  const router = useRouter();
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PatientStatus>("all");
  const [sortBy, setSortBy] = useState<"updatedAt" | "name" | "status">("updatedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [newCustomId, setNewCustomId] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);
  const [recentlyUpdatedId, setRecentlyUpdatedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

  // 1. Initial Fetch All Patients from REST API
  useEffect(() => {
    let ignore = false;

    async function loadPatients() {
      try {
        const res = await fetch(`${backendUrl}/api/patients`);
        if (!ignore && res.ok) {
          const data = await res.json();
          const list: PatientRecord[] = Array.isArray(data) ? data : data.data || [];
          setPatients(list);
        }
      } catch (err) {
        console.warn("[Fetch all patients error]:", err);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadPatients();

    return () => {
      ignore = true;
    };
  }, [backendUrl]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`${backendUrl}/api/patients`);
      if (res.ok) {
        const data = await res.json();
        const list: PatientRecord[] = Array.isArray(data) ? data : data.data || [];
        setPatients(list);
        toast.success("รีเฟรชข้อมูลล่าสุดเรียบร้อยแล้ว");
      }
    } catch (err) {
      console.warn("[Fetch all patients error]:", err);
      toast.error("ไม่สามารถดึงข้อมูลจาก Server ได้");
    } finally {
      setIsRefreshing(false);
    }
  };

  // 2. Real-Time Socket Connection for Live Directory Updates
  const handleLiveUpdate = useCallback((updatedRecord: PatientRecord) => {
    setPatients((prev) => {
      const index = prev.findIndex((p) => p.id === updatedRecord.id);
      if (index >= 0) {
        const copy = [...prev];
        copy[index] = updatedRecord;
        return copy;
      } else {
        return [updatedRecord, ...prev];
      }
    });

    // Flash highlight effect
    setRecentlyUpdatedId(updatedRecord.id);
    setTimeout(() => {
      setRecentlyUpdatedId((curr) => (curr === updatedRecord.id ? null : curr));
    }, 2000);
  }, []);

  const { isConnected, socketId } = useSocket({
    onStaffUpdate: handleLiveUpdate,
  });

  // 3. Delete Patient Handler
  const handleDeletePatient = async (id: string, name: string) => {
    if (!confirm(`คุณต้องการลบแบบฟอร์มของ "${name || id}" ใช่หรือไม่?`)) return;

    try {
      const res = await fetch(`${backendUrl}/api/patients/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPatients((prev) => prev.filter((p) => p.id !== id));
        toast.success(`ลบข้อมูล "${id}" เรียบร้อยแล้ว`);
      } else {
        toast.error("เกิดข้อผิดพลาดในการลบข้อมูล");
      }
    } catch (err) {
      console.error(err);
      toast.error("ไม่สามารถเชื่อมต่อ Server เพื่อลบข้อมูลได้");
    }
  };

  // 4. Seed Demo Sample Data
  const handleSeedDemoPatients = async () => {
    const demoSamples = [
      {
        id: "patient-001",
        firstName: "เอกภณัฐ",
        middleName: "นรา",
        lastName: "ชาแก้ว",
        dateOfBirth: "1995-08-12",
        gender: "ชาย (Male)",
        phoneNumber: "0891234567",
        email: "nanthapat.dev@example.com",
        address: "123 อาคารสุขุมวิททาวเวอร์ ชั้น 15 ถนนสุขุมวิท เขตวัฒนา กรุงเทพฯ 10110",
        preferredLanguage: "ไทย (Thai)",
        nationality: "ไทย (Thai)",
        emergencyName: "วิภา ชาแก้ว",
        emergencyRelation: "มารดา (Mother)",
        religion: "พุทธ (Buddhism)",
        status: "submitted" as PatientStatus,
      },
      {
        id: "patient-002",
        firstName: "สุดารัตน์",
        middleName: "",
        lastName: "มงคลสุข",
        dateOfBirth: "1998-03-24",
        gender: "หญิง (Female)",
        phoneNumber: "0819876543",
        email: "suda.m@gmail.com",
        address: "45/2 หมู่ 3 ถ.พหลโยธิน ต.คลองหนึ่ง อ.คลองหลวง จ.ปทุมธานี 12120",
        preferredLanguage: "ไทย (Thai)",
        nationality: "ไทย (Thai)",
        emergencyName: "สมบูรณ์ มงคลสุข",
        emergencyRelation: "บิดา/มารดา (Parent)",
        religion: "พุทธ (Buddhism)",
        status: "filling" as PatientStatus,
      },
      {
        id: "patient-003",
        firstName: "Alexander",
        middleName: "James",
        lastName: "Smith",
        dateOfBirth: "1989-11-05",
        gender: "ชาย (Male)",
        phoneNumber: "0908765432",
        email: "alex.smith@expataid.org",
        address: "88/12 Sathorn Rd., Silom, Bang Rak, Bangkok 10500",
        preferredLanguage: "อังกฤษ (English)",
        nationality: "อื่นๆ (Other)",
        emergencyName: "Emily Smith",
        emergencyRelation: "คู่สมรส (Spouse)",
        religion: "คริสต์ (Christianity)",
        status: "inactive" as PatientStatus,
      },
    ];

    try {
      setIsRefreshing(true);
      for (const sample of demoSamples) {
        setPatients((prev) => {
          const now = new Date().toISOString();
          const existing = prev.filter((p) => p.id !== sample.id);
          return [
            {
              ...sample,
              createdAt: now,
              updatedAt: now,
            },
            ...existing,
          ];
        });
      }
      toast.success("โหลดข้อมูลตัวอย่างเรียบร้อยแล้ว");
    } catch (err) {
      console.error(err);
      toast.error("ไม่สามารถเพิ่มข้อมูลตัวอย่างได้");
    } finally {
      setIsRefreshing(false);
    }
  };

  // 5. Create / Start New Patient Session
  const handleCreateNewSession = (e: React.FormEvent) => {
    e.preventDefault();
    const id = newCustomId.trim() || `patient-${Math.random().toString(36).substring(2, 7)}`;
    setShowNewModal(false);
    setNewCustomId("");
    router.push(`/patient-form?id=${id}`);
  };

  // 6. Copy Link Helper
  const handleCopyLink = (path: string, id: string) => {
    const fullUrl = `${window.location.origin}${path}?id=${id}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    toast.success(`คัดลอกลิงก์สำหรับ "${id}" แล้ว`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 7. Filtering & Sorting Logic
  const filteredPatients = useMemo(() => {
    return patients
      .filter((p) => {
        // Status filter
        if (statusFilter !== "all" && p.status !== statusFilter) return false;

        // Search query
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase().trim();
        const fullName = `${p.firstName || ""} ${p.middleName || ""} ${p.lastName || ""}`.toLowerCase();
        const id = (p.id || "").toLowerCase();
        const phone = (p.phoneNumber || "").toLowerCase();
        const email = (p.email || "").toLowerCase();

        return fullName.includes(q) || id.includes(q) || phone.includes(q) || email.includes(q);
      })
      .sort((a, b) => {
        if (sortBy === "updatedAt") {
          const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
          const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
          return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        }
        if (sortBy === "name") {
          const nameA = `${a.firstName || ""} ${a.lastName || ""}`;
          const nameB = `${b.firstName || ""} ${b.lastName || ""}`;
          return sortOrder === "desc"
            ? nameB.localeCompare(nameA, "th")
            : nameA.localeCompare(nameB, "th");
        }
        if (sortBy === "status") {
          const statusOrder = { filling: 1, inactive: 2, submitted: 3 };
          const orderA = statusOrder[a.status || "filling"] || 0;
          const orderB = statusOrder[b.status || "filling"] || 0;
          return sortOrder === "desc" ? orderB - orderA : orderA - orderB;
        }
        return 0;
      });
  }, [patients, statusFilter, searchQuery, sortBy, sortOrder]);

  // Metric counts
  const stats = useMemo(() => {
    return {
      total: patients.length,
      filling: patients.filter((p) => p.status === "filling").length,
      inactive: patients.filter((p) => p.status === "inactive").length,
      submitted: patients.filter((p) => p.status === "submitted").length,
    };
  }, [patients]);

  const hasActiveFilters = searchQuery.trim().length > 0 || statusFilter !== "all";

  const clearAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70">
      <Navbar />

      <main className="flex-1 py-5 px-3 sm:px-6">
        <div className="mx-auto max-w-7xl space-y-4">
          {/* Top Page Header Card */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3.5">
            {/* Row 1: Title and Live Connection */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-teal-600 text-white shadow-sm shadow-teal-600/20 shrink-0">
                  <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    ทะเบียนข้อมูลผู้ป่วย (Patient Directory)
                  </h1>
                  <p className="text-[11px] sm:text-xs text-slate-500">
                    ระบบติดตามสถานะและการลงทะเบียนผู้ป่วยแบบ Real-Time
                  </p>
                </div>
              </div>

              {/* Status and Refresh Icon */}
              <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                <ConnectionStatus isConnected={isConnected} socketId={socketId} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualRefresh}
                  disabled={isRefreshing}
                  className="h-8 sm:h-9 px-2.5 text-xs text-slate-700 hover:bg-slate-50"
                  title="รีเฟรชข้อมูลจาก Server"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-teal-600" : "text-slate-500"}`} />
                  <span className="hidden sm:inline">รีเฟรช</span>
                </Button>
              </div>
            </div>

            {/* Row 2: Action Buttons */}
            <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSeedDemoPatients}
                className="h-9 gap-1.5 text-xs text-slate-700 hover:bg-slate-50 w-full sm:w-auto"
                title="โหลดข้อมูลตัวอย่างสำหรับการทดสอบระบบ"
              >
                <Database className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">โหลดข้อมูลตัวอย่าง</span>
              </Button>

              <Button
                size="sm"
                onClick={() => setShowNewModal(true)}
                className="h-9 gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span className="truncate">สร้าง Session ใหม่</span>
              </Button>
            </div>
          </div>

          {/* Metric KPI Overview (Interactive Filter Cards - Responsive Compact) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {/* Total */}
            <button
              onClick={() => setStatusFilter("all")}
              className={`p-2.5 sm:p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                statusFilter === "all"
                  ? "bg-white border-teal-600 shadow-xs ring-1 ring-teal-600"
                  : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] sm:text-xs font-medium text-slate-600">
                <span>ทั้งหมด (All)</span>
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">100%</span>
              </div>
              <div className="mt-1 text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {stats.total}
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">รวมทุกสถานะ</div>
            </button>

            {/* Actively Filling */}
            <button
              onClick={() => setStatusFilter("filling")}
              className={`p-2.5 sm:p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                statusFilter === "filling"
                  ? "bg-amber-50/60 border-amber-500 shadow-xs ring-1 ring-amber-500"
                  : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] sm:text-xs font-medium text-amber-800">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="truncate">กำลังกรอก</span>
                </span>
                <Activity className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              </div>
              <div className="mt-1 text-xl sm:text-2xl font-bold text-amber-900 tracking-tight">
                {stats.filling}
              </div>
              <div className="text-[10px] sm:text-[11px] text-amber-700/80 mt-0.5 truncate">กำลังพิมพ์ข้อมูล</div>
            </button>

            {/* Inactive */}
            <button
              onClick={() => setStatusFilter("inactive")}
              className={`p-2.5 sm:p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                statusFilter === "inactive"
                  ? "bg-slate-100 border-slate-600 shadow-xs ring-1 ring-slate-600"
                  : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] sm:text-xs font-medium text-slate-700">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-slate-400" />
                  <span className="truncate">หยุดพิมพ์</span>
                </span>
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </div>
              <div className="mt-1 text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                {stats.inactive}
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">&gt; 5 วินาที</div>
            </button>

            {/* Submitted */}
            <button
              onClick={() => setStatusFilter("submitted")}
              className={`p-2.5 sm:p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                statusFilter === "submitted"
                  ? "bg-emerald-50/60 border-emerald-600 shadow-xs ring-1 ring-emerald-600"
                  : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] sm:text-xs font-medium text-emerald-800">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-500" />
                  <span className="truncate">ส่งแล้ว</span>
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              </div>
              <div className="mt-1 text-xl sm:text-2xl font-bold text-emerald-900 tracking-tight">
                {stats.submitted}
              </div>
              <div className="text-[10px] sm:text-[11px] text-emerald-700/80 mt-0.5 truncate">บันทึกสมบูรณ์</div>
            </button>
          </div>

          {/* Unified Enterprise Filter & Search Toolbar (Mobile Optimized) */}
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2.5 sm:space-y-3">
            {/* Search Input */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <Input
                placeholder="ค้นหาชื่อ, รหัสคนไข้, เบอร์โทร, อีเมล..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 pr-8 text-xs bg-slate-50/60 focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                  title="ล้างคำค้นหา"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter & View Controls Row */}
            <div className="flex items-center justify-between gap-2">
              {/* Left Controls: Status & Sort */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                {/* Status Dropdown */}
                <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 flex-1 sm:flex-initial min-w-0">
                  <SlidersHorizontal className="w-3 h-3 text-slate-500 shrink-0 hidden sm:inline" />
                  <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">สถานะ:</span>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as "all" | PatientStatus)}
                    className="h-6 py-0 px-0.5 text-xs border-0 bg-transparent font-medium text-slate-800 focus:ring-0 truncate cursor-pointer w-full"
                  >
                    <option value="all">ทั้งหมด ({stats.total})</option>
                    <option value="filling">กำลังกรอก ({stats.filling})</option>
                    <option value="inactive">หยุดพิมพ์ ({stats.inactive})</option>
                    <option value="submitted">ส่งแล้ว ({stats.submitted})</option>
                  </Select>
                </div>

                {/* Sort By Dropdown */}
                <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 flex-1 sm:flex-initial min-w-0">
                  <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">เรียง:</span>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "updatedAt" | "name" | "status")}
                    className="h-6 py-0 px-0.5 text-xs border-0 bg-transparent font-medium text-slate-800 focus:ring-0 truncate cursor-pointer w-full"
                  >
                    <option value="updatedAt">ล่าสุด</option>
                    <option value="name">ชื่อ (ก-ฮ)</option>
                    <option value="status">สถานะ</option>
                  </Select>

                  {/* Sort Direction Toggle */}
                  <button
                    onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                    className="p-0.5 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-200/60 transition cursor-pointer shrink-0"
                    title={sortOrder === "desc" ? "เรียงจากใหม่ไปเก่า (ล่าสุดก่อน)" : "เรียงจากเก่าไปใหม่"}
                  >
                    {sortOrder === "desc" ? (
                      <ArrowDownNarrowWide className="w-3.5 h-3.5 text-teal-700" />
                    ) : (
                      <ArrowUpNarrowWide className="w-3.5 h-3.5 text-teal-700" />
                    )}
                  </button>
                </div>
              </div>

              {/* Right View Switcher */}
              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 shrink-0">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 sm:px-2.5 sm:py-1 rounded-md transition flex items-center gap-1 ${
                    viewMode === "grid"
                      ? "bg-white text-teal-700 shadow-2xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="มุมมองแบบ Card Grid"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-xs">การ์ด</span>
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 sm:px-2.5 sm:py-1 rounded-md transition flex items-center gap-1 ${
                    viewMode === "table"
                      ? "bg-white text-teal-700 shadow-2xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="มุมมองแบบตาราง Table"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-xs">ตาราง</span>
                </button>
              </div>
            </div>

            {/* Active Filter Summary Bar */}
            {hasActiveFilters && (
              <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-[11px] sm:text-xs">
                <span className="text-slate-500">
                  พบ <strong>{filteredPatients.length}</strong> จาก {patients.length} รายการ
                </span>
                <button
                  onClick={clearAllFilters}
                  className="text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  ล้างตัวกรอง
                </button>
              </div>
            )}
          </div>

          {/* Directory Content List */}
          {isLoading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500 space-y-3">
              <RefreshCw className="w-7 h-7 animate-spin mx-auto text-teal-600" />
              <p className="text-xs text-slate-600">กำลังโหลดข้อมูลแบบฟอร์มทั้งหมด...</p>
            </div>
          ) : filteredPatients.length === 0 ? (
            /* Empty State */
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 sm:p-12 text-center space-y-3">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800">
                  {hasActiveFilters
                    ? "ไม่พบแบบฟอร์มที่ตรงกับเงื่อนไขการค้นหา"
                    : "ยังไม่มีแบบฟอร์มในระบบ"}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {hasActiveFilters
                    ? "ลองเปลี่ยนคำค้นหาหรือเลือกสถานะตัวกรองใหม่อีกครั้ง"
                    : "คุณสามารถเริ่มต้นโดยการสร้าง Session ใหม่ หรือกดปุ่มโหลดข้อมูลตัวอย่าง"}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {hasActiveFilters ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-xs"
                  >
                    ล้างการค้นหาและตัวกรอง
                  </Button>
                ) : (
                  <>
                    <Button
                      size="sm"
                      onClick={handleSeedDemoPatients}
                      className="bg-teal-600 hover:bg-teal-700 text-white text-xs gap-1.5"
                    >
                      <Database className="w-3.5 h-3.5" />
                      โหลดข้อมูลตัวอย่าง
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowNewModal(true)}
                      className="text-xs gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      สร้าง Session ใหม่
                    </Button>
                  </>
                )}
              </div>
            </div>
          ) : viewMode === "grid" ? (
            /* Card Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredPatients.map((patient) => {
                const fullName =
                  [patient.firstName, patient.middleName, patient.lastName].filter(Boolean).join(" ") ||
                  "ยังไม่ได้ระบุชื่อ (No Name)";
                const isRecentlyUpdated = recentlyUpdatedId === patient.id;

                return (
                  <Card
                    key={patient.id}
                    className={`border transition-all duration-200 hover:shadow-md flex flex-col justify-between ${
                      isRecentlyUpdated
                        ? "border-teal-500 bg-teal-50/20 ring-1 ring-teal-500"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div>
                      {/* Card Header */}
                      <CardHeader className="p-3.5 pb-2.5 border-b border-slate-100 bg-slate-50/40">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded truncate">
                                {patient.id}
                              </span>
                              <button
                                onClick={() => handleCopyLink("/patient-form", patient.id)}
                                className="text-slate-400 hover:text-slate-700 cursor-pointer p-0.5 rounded shrink-0"
                                title="คัดลอกลิงก์ Patient Form"
                              >
                                {copiedId === patient.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                            <CardTitle className="text-sm font-bold text-slate-900 truncate">
                              {fullName}
                            </CardTitle>
                          </div>
                          <StatusBadge status={patient.status} className="scale-90 origin-top-right shrink-0" />
                        </div>
                      </CardHeader>

                      {/* Card Body Information */}
                      <CardContent className="p-3.5 space-y-2 text-xs text-slate-600">
                        {/* Phone & Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                          <div className="flex items-center gap-1.5 truncate">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="font-mono">{patient.phoneNumber || "-"}</span>
                          </div>
                          <div className="flex items-center gap-1.5 truncate">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{patient.email || "-"}</span>
                          </div>
                        </div>

                        {/* DOB & Gender */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                          <div className="flex items-center gap-1.5 truncate">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{patient.dateOfBirth || "-"}</span>
                          </div>
                          <div className="flex items-center gap-1.5 truncate">
                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{patient.gender || "-"}</span>
                          </div>
                        </div>

                        {/* Emergency Contact */}
                        {patient.emergencyName && (
                          <div className="rounded-md bg-slate-50 p-2 border border-slate-200/80 text-[11px] space-y-0.5">
                            <span className="text-slate-500 font-medium block">ผู้ติดต่อฉุกเฉิน:</span>
                            <span className="font-medium text-slate-800">
                              {patient.emergencyName} ({patient.emergencyRelation || "ไม่ระบุ"})
                            </span>
                          </div>
                        )}

                        {/* Updated At */}
                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-100">
                          <span className="flex items-center gap-1 text-slate-500">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {patient.updatedAt
                              ? `แก้ไข ${formatRelativeTime(patient.updatedAt)}`
                              : "สร้างใหม่"}
                          </span>
                          <span className="text-slate-500 font-medium">
                            {patient.preferredLanguage || "ไทย"}
                          </span>
                        </div>
                      </CardContent>
                    </div>

                    {/* Card Footer Actions (Optimized for Mobile) */}
                    <div className="p-2.5 sm:p-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        <Link href={`/staff-view?id=${patient.id}`} title="เปิดหน้าจอเจ้าหน้าที่ (Staff View)" className="flex-1 min-w-0">
                          <Button size="sm" variant="outline" className="w-full h-7 px-1.5 sm:px-2.5 text-[11px] sm:text-xs gap-1 text-slate-700 bg-white hover:bg-slate-50 truncate">
                            <LayoutDashboard className="w-3 h-3 text-teal-600 shrink-0" />
                            <span className="truncate">Staff</span>
                          </Button>
                        </Link>
                        <Link href={`/patient-form?id=${patient.id}`} title="เปิดแบบฟอร์มผู้ป่วย (Patient Form)" className="flex-1 min-w-0">
                          <Button size="sm" variant="outline" className="w-full h-7 px-1.5 sm:px-2.5 text-[11px] sm:text-xs gap-1 text-slate-700 bg-white hover:bg-slate-50 truncate">
                            <UserPen className="w-3 h-3 text-slate-600 shrink-0" />
                            <span className="truncate">Form</span>
                          </Button>
                        </Link>
                        <Link href={`/demo?id=${patient.id}`} title="เปิดเดโม 2 หน้าจอ (Split View)" className="flex-1 min-w-0">
                          <Button size="sm" variant="outline" className="w-full h-7 px-1 sm:px-2 text-[11px] sm:text-xs gap-1 text-teal-800 bg-teal-50 border-teal-200 hover:bg-teal-100/60 truncate">
                            <SplitSquareVertical className="w-3 h-3 text-teal-600 shrink-0" />
                            <span className="truncate">Demo</span>
                          </Button>
                        </Link>
                      </div>

                      <button
                        onClick={() => handleDeletePatient(patient.id, fullName)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition cursor-pointer shrink-0 ml-0.5"
                        title="ลบฟอร์มนี้"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            /* Table View */
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                    <tr>
                      <th className="py-3 px-4">Session ID</th>
                      <th className="py-3 px-4">ชื่อ-นามสกุล</th>
                      <th className="py-3 px-4">เบอร์โทร / อีเมล</th>
                      <th className="py-3 px-4">วันเกิด / เพศ</th>
                      <th className="py-3 px-4">สถานะ (Status)</th>
                      <th className="py-3 px-4">แก้ไขล่าสุด</th>
                      <th className="py-3 px-4 text-right">การกระทำ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredPatients.map((patient) => {
                      const fullName =
                        [patient.firstName, patient.middleName, patient.lastName].filter(Boolean).join(" ") ||
                        "ยังไม่ได้ระบุชื่อ";
                      const isRecentlyUpdated = recentlyUpdatedId === patient.id;

                      return (
                        <tr
                          key={patient.id}
                          className={`transition-colors hover:bg-slate-50/80 ${
                            isRecentlyUpdated ? "bg-teal-50/60" : ""
                          }`}
                        >
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">
                            {patient.id}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {fullName}
                          </td>
                          <td className="py-3 px-4 space-y-0.5">
                            <div className="font-mono text-slate-800">{patient.phoneNumber || "-"}</div>
                            <div className="text-[11px] text-slate-400">{patient.email || "-"}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div>{patient.dateOfBirth || "-"}</div>
                            <div className="text-[11px] text-slate-400">{patient.gender || "-"}</div>
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge status={patient.status} className="scale-90 origin-left" />
                          </td>
                          <td className="py-3 px-4 text-slate-500 text-[11px]">
                            {patient.updatedAt ? formatRelativeTime(patient.updatedAt) : "-"}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Link href={`/staff-view?id=${patient.id}`}>
                                <Button size="sm" variant="outline" className="h-7 px-2 text-xs text-slate-700 bg-white">
                                  Staff View
                                </Button>
                              </Link>
                              <Link href={`/patient-form?id=${patient.id}`}>
                                <Button size="sm" variant="outline" className="h-7 px-2 text-xs text-slate-700 bg-white">
                                  Form
                                </Button>
                              </Link>
                              <Link href={`/demo?id=${patient.id}`}>
                                <Button size="sm" variant="outline" className="h-7 px-2 text-xs text-teal-800 bg-teal-50 border-teal-200">
                                  Demo
                                </Button>
                              </Link>
                              <button
                                onClick={() => handleDeletePatient(patient.id, fullName)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition cursor-pointer ml-1"
                                title="ลบฟอร์ม"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal: Create New Session */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">สร้าง Session ผู้ป่วยใหม่</h3>
                  <p className="text-[11px] text-slate-500">กำหนดรหัสหรือสร้างแบบฟอร์มว่าง</p>
                </div>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewSession} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  รหัสอ้างอิงผู้ป่วย (Session ID)
                </label>
                <Input
                  placeholder="เช่น patient-001, hn-1094..."
                  value={newCustomId}
                  onChange={(e) => setNewCustomId(e.target.value)}
                  className="font-mono text-xs"
                  autoFocus
                />
                <p className="text-[11px] text-slate-400">
                  * หากเว้นว่างไว้ ระบบจะสร้างรหัสสุ่มให้โดยอัตโนมัติ
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewModal(false)}
                  className="text-xs"
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
                >
                  ไปที่หน้ากรอกฟอร์ม
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FormsDirectoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <RefreshCw className="w-4 h-4 animate-spin text-teal-600" />
            กำลังโหลดระบบ...
          </div>
        </div>
      }
    >
      <FormsDirectoryContent />
    </Suspense>
  );
}
