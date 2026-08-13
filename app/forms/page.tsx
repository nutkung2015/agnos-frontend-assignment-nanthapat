"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ClipboardList,
  Search,
  Filter,
  ArrowUpDown,
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
  Sparkles,
  CheckCircle2,
  FileText,
  UserPen,
  LayoutDashboard,
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
        // Upsert via socket or local state fallback
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
      toast.success("เพิ่มข้อมูลตัวอย่าง 3 Session เรียบร้อยแล้ว");
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                      รายการแบบฟอร์มคนไข้ทั้งหมด
                      <span className="text-xs font-semibold px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-full">
                        Directory
                      </span>
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      ศูนย์รวมการเฝ้าดู จัดการ และเข้าถึงแบบฟอร์มคนไข้ทุก Session แบบ Real-Time
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons & Status */}
              <div className="flex flex-wrap items-center gap-2">
                <ConnectionStatus isConnected={isConnected} socketId={socketId} />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualRefresh}
                  disabled={isRefreshing}
                  className="gap-1.5 text-xs text-slate-600 shadow-2xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-teal-600" : ""}`} />
                  รีเฟรช
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSeedDemoPatients}
                  className="gap-1.5 text-xs text-teal-700 border-teal-200 bg-teal-50/50 hover:bg-teal-100/60 shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  เพิ่มข้อมูลตัวอย่าง (Demo Data)
                </Button>

                {/* Quick Session Start */}
                <form onSubmit={handleCreateNewSession} className="flex items-center gap-1.5">
                  <Input
                    placeholder="รหัส Session ใหม่..."
                    value={newCustomId}
                    onChange={(e) => setNewCustomId(e.target.value)}
                    className="h-8 text-xs w-36 sm:w-44 font-mono"
                  />
                  <Button size="sm" type="submit" className="h-8 gap-1 bg-teal-600 hover:bg-teal-700 text-white text-xs">
                    <Plus className="w-3.5 h-3.5" />
                    สร้างฟอร์ม
                  </Button>
                </form>
              </div>
            </div>

            {/* Metric / KPI Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              {/* Total */}
              <div
                onClick={() => setStatusFilter("all")}
                className={`cursor-pointer rounded-xl border p-3 transition-all ${
                  statusFilter === "all"
                    ? "border-teal-400 bg-teal-50/50 shadow-xs"
                    : "border-slate-200 bg-slate-50/40 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>ฟอร์มทั้งหมด</span>
                  <ClipboardList className="w-4 h-4 text-slate-400" />
                </div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{stats.total}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">ทุก Session ในระบบ</div>
              </div>

              {/* Actively Filling */}
              <div
                onClick={() => setStatusFilter("filling")}
                className={`cursor-pointer rounded-xl border p-3 transition-all ${
                  statusFilter === "filling"
                    ? "border-amber-400 bg-amber-50/50 shadow-xs"
                    : "border-slate-200 bg-slate-50/40 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold text-amber-800">
                  <span className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    กำลังกรอก
                  </span>
                  <Activity className="w-4 h-4 text-amber-500" />
                </div>
                <div className="mt-2 text-2xl font-bold text-amber-900">{stats.filling}</div>
                <div className="text-[11px] text-amber-700 mt-0.5">Actively Filling</div>
              </div>

              {/* Inactive */}
              <div
                onClick={() => setStatusFilter("inactive")}
                className={`cursor-pointer rounded-xl border p-3 transition-all ${
                  statusFilter === "inactive"
                    ? "border-slate-400 bg-slate-100/70 shadow-xs"
                    : "border-slate-200 bg-slate-50/40 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>หยุดพิมพ์</span>
                  <Clock className="w-4 h-4 text-slate-500" />
                </div>
                <div className="mt-2 text-2xl font-bold text-slate-800">{stats.inactive}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Inactive (&gt;5s)</div>
              </div>

              {/* Submitted */}
              <div
                onClick={() => setStatusFilter("submitted")}
                className={`cursor-pointer rounded-xl border p-3 transition-all ${
                  statusFilter === "submitted"
                    ? "border-emerald-400 bg-emerald-50/50 shadow-xs"
                    : "border-slate-200 bg-slate-50/40 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-800">
                  <span>ส่งฟอร์มแล้ว</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="mt-2 text-2xl font-bold text-emerald-900">{stats.submitted}</div>
                <div className="text-[11px] text-emerald-700 mt-0.5">Submitted Data</div>
              </div>
            </div>
          </div>

          {/* Search, Filter & Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="ค้นหาชื่อ, รหัสคนไข้, เบอร์โทร, อีเมล..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            {/* Filter, Sort & View Mode controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Status Filter */}
              <div className="flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as "all" | PatientStatus)}
                  className="text-xs h-9 py-1 px-2 w-32"
                >
                  <option value="all">สถานะทั้งหมด</option>
                  <option value="filling">กำลังกรอก (Filling)</option>
                  <option value="inactive">หยุดพิมพ์ (Inactive)</option>
                  <option value="submitted">ส่งแล้ว (Submitted)</option>
                </Select>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "updatedAt" | "name" | "status")}
                  className="text-xs h-9 py-1 px-2 w-32"
                >
                  <option value="updatedAt">เวลาแก้ไขล่าสุด</option>
                  <option value="name">ชื่อผู้ป่วย</option>
                  <option value="status">สถานะ</option>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                  className="h-9 px-2 text-xs"
                  title="สลับลำดับ เรียงหน้า/หลัง"
                >
                  {sortOrder === "desc" ? "↓ ล่าสุด" : "↑ เก่าสุด"}
                </Button>
              </div>

              {/* View Toggle */}
              <div className="flex items-center rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition ${
                    viewMode === "grid"
                      ? "bg-white text-teal-700 shadow-2xs font-semibold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                  title="Card Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-md transition ${
                    viewMode === "table"
                      ? "bg-white text-teal-700 shadow-2xs font-semibold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                  title="Table View"
                >
                  <TableIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Directory Content List */}
          {isLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-600" />
              <p className="text-sm">กำลังโหลดข้อมูลแบบฟอร์มทั้งหมด...</p>
            </div>
          ) : filteredPatients.length === 0 ? (
            /* Empty State */
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                <FileText className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800">
                  {searchQuery || statusFilter !== "all"
                    ? "ไม่พบแบบฟอร์มที่ตรงกับเงื่อนไขการค้นหา"
                    : "ยังไม่มีแบบฟอร์มในระบบ"}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchQuery || statusFilter !== "all"
                    ? "ลองเปลี่ยนคำค้นหาหรือตัวกรองสถานะใหม่อีกครั้ง"
                    : "คุณสามารถเริ่มต้นโดยการสร้างฟอร์มใหม่ หรือกดปุ่มเพิ่มข้อมูลตัวอย่าง"}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <Button
                  onClick={handleSeedDemoPatients}
                  className="bg-teal-600 hover:bg-teal-700 text-white text-xs gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  เพิ่มข้อมูลตัวอย่างทันที (Seed Demo)
                </Button>
                <Link href="/patient-form?id=patient-demo-001">
                  <Button variant="outline" className="text-xs gap-1.5">
                    <UserPen className="w-3.5 h-3.5" />
                    เปิดกรอกฟอร์ม patient-demo-001
                  </Button>
                </Link>
              </div>
            </div>
          ) : viewMode === "grid" ? (
            /* Card Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPatients.map((patient) => {
                const fullName =
                  [patient.firstName, patient.middleName, patient.lastName].filter(Boolean).join(" ") ||
                  "ยังไม่ได้ระบุชื่อ (No Name)";
                const isRecentlyUpdated = recentlyUpdatedId === patient.id;

                return (
                  <Card
                    key={patient.id}
                    className={`border transition-all duration-300 hover:shadow-md flex flex-col justify-between ${
                      isRecentlyUpdated
                        ? "ring-2 ring-teal-500 bg-teal-50/30"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div>
                      {/* Card Header */}
                      <CardHeader className="p-4 pb-3 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                                {patient.id}
                              </span>
                              <button
                                onClick={() => handleCopyLink("/patient-form", patient.id)}
                                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                                title="คัดลอกลิงก์ Patient Form"
                              >
                                {copiedId === patient.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                            <CardTitle className="text-sm font-bold text-slate-900 line-clamp-1">
                              {fullName}
                            </CardTitle>
                          </div>
                          <StatusBadge status={patient.status} className="scale-90 origin-top-right" />
                        </div>
                      </CardHeader>

                      {/* Card Body Information */}
                      <CardContent className="p-4 space-y-2.5 text-xs text-slate-600">
                        {/* Phone & Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                          <div className="rounded-md bg-slate-50 p-2 border border-slate-100 text-[11px] space-y-0.5">
                            <span className="text-slate-400 font-semibold block">ผู้ติดต่อฉุกเฉิน:</span>
                            <span className="font-medium text-slate-800">
                              {patient.emergencyName} ({patient.emergencyRelation || "ไม่ระบุ"})
                            </span>
                          </div>
                        )}

                        {/* Updated At */}
                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {patient.updatedAt
                              ? `อัปเดต ${formatRelativeTime(patient.updatedAt)}`
                              : "เพิ่งสร้าง"}
                          </span>
                          <span className="text-slate-400">
                            {patient.preferredLanguage || "ไทย"}
                          </span>
                        </div>
                      </CardContent>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1">
                        <Link href={`/staff-view?id=${patient.id}`} title="เปิดหน้า Staff View">
                          <Button size="sm" variant="outline" className="h-7 px-2 text-[11px] gap-1 text-slate-700">
                            <LayoutDashboard className="w-3 h-3 text-teal-600" />
                            Staff
                          </Button>
                        </Link>
                        <Link href={`/patient-form?id=${patient.id}`} title="เปิดหน้า Patient Form">
                          <Button size="sm" variant="outline" className="h-7 px-2 text-[11px] gap-1 text-slate-700">
                            <UserPen className="w-3 h-3 text-sky-600" />
                            Form
                          </Button>
                        </Link>
                        <Link href={`/demo?id=${patient.id}`} title="เปิดหน้า Split-Screen Demo">
                          <Button size="sm" variant="outline" className="h-7 px-2 text-[11px] gap-1 text-teal-800 bg-teal-50/50 border-teal-200">
                            <SplitSquareVertical className="w-3 h-3 text-teal-600" />
                            Demo
                          </Button>
                        </Link>
                      </div>

                      <button
                        onClick={() => handleDeletePatient(patient.id, fullName)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition cursor-pointer"
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
                          <td className="py-3 px-4 font-mono font-bold text-teal-700">
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
                                <Button size="sm" variant="outline" className="h-7 px-2 text-[11px] text-teal-700">
                                  Staff View
                                </Button>
                              </Link>
                              <Link href={`/patient-form?id=${patient.id}`}>
                                <Button size="sm" variant="outline" className="h-7 px-2 text-[11px]">
                                  Form
                                </Button>
                              </Link>
                              <Link href={`/demo?id=${patient.id}`}>
                                <Button size="sm" variant="outline" className="h-7 px-2 text-[11px] text-teal-800 bg-teal-50 border-teal-200">
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
    </div>
  );
}

export default function FormsDirectoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm text-slate-500">กำลังโหลดรายการแบบฟอร์ม...</div>}>
      <FormsDirectoryContent />
    </Suspense>
  );
}
