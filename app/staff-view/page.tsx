"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  LayoutDashboard,
  User,
  Calendar,
  Users,
  Phone,
  Mail,
  MapPin,
  Globe,
  HeartHandshake,
  Compass,
  Copy,
  Check,
  Printer,
  RefreshCw,
} from "lucide-react";

import { PatientRecord } from "@/types/patient";
import { useSocket } from "@/hooks/useSocket";
import { Navbar } from "@/components/common/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/staff/status-badge";
import { LiveFieldCard } from "@/components/staff/live-field-card";
import { ConnectionStatus } from "@/components/staff/connection-status";
import { LastUpdatedTimer } from "@/components/staff/last-updated-timer";

function StaffViewContent() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("id") || "patient-demo-001";

  const [patient, setPatient] = useState<PatientRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  // 1. Initial Snapshot Fetch via REST API
  useEffect(() => {
    let ignore = false;

    async function loadSnapshot() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
        const res = await fetch(`${backendUrl}/api/patients/${patientId}`);
        if (!ignore && res.ok) {
          const data: PatientRecord = await res.json();
          setPatient(data);
        } else if (!ignore && res.status === 404) {
          // Patient not in DB yet - initialize empty placeholder
          setPatient({
            id: patientId,
            status: "filling",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.warn("[Staff View REST fallback]:", err);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadSnapshot();

    return () => {
      ignore = true;
    };
  }, [patientId]);

  const handleManualRefresh = async () => {
    setIsLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
      const res = await fetch(`${backendUrl}/api/patients/${patientId}`);
      if (res.ok) {
        const data: PatientRecord = await res.json();
        setPatient(data);
      }
    } catch (err) {
      console.warn("[Staff View REST manual refresh]:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Real-Time Socket Connection & Staff Update Listener
  const handleStaffUpdate = useCallback(
    (updatedPatient: PatientRecord) => {
      setPatient((prev) => {
        // If status transitioned to submitted, trigger an alert toast
        if (prev?.status !== "submitted" && updatedPatient.status === "submitted") {
          toast.success(`ผู้ป่วย ${updatedPatient.firstName || ""} ได้ส่งแบบฟอร์มแล้ว`, {
            description: "ข้อมูลได้รับการยืนยันและบันทึกลงฐานข้อมูลเรียบร้อยแล้ว",
          });
        }
        return updatedPatient;
      });
    },
    []
  );

  const { isConnected, socketId } = useSocket({
    patientId,
    onStaffUpdate: handleStaffUpdate,
    onError: (err) => {
      toast.error(`Socket error: ${err.message}`);
    },
  });

  const handleCopyAll = () => {
    if (!patient) return;
    const text = `
ข้อมูลผู้ป่วย (Patient ID: ${patient.id})
-----------------------------------------
ชื่อ-นามสกุล: ${patient.firstName || "-"} ${patient.middleName || ""} ${patient.lastName || "-"}
วันเกิด: ${patient.dateOfBirth || "-"}
เพศ: ${patient.gender || "-"}
เบอร์โทร: ${patient.phoneNumber || "-"}
อีเมล: ${patient.email || "-"}
ที่อยู่: ${patient.address || "-"}
ภาษา: ${patient.preferredLanguage || "-"}
สัญชาติ: ${patient.nationality || "-"}
ศาสนา: ${patient.religion || "-"}
ผู้ติดต่อฉุกเฉิน: ${patient.emergencyName || "-"} (${patient.emergencyRelation || "-"})
สถานะ: ${patient.status}
อัปเดตล่าสุด: ${patient.updatedAt}
    `.trim();

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.success("คัดลอกข้อมูลผู้ป่วยทั้งหมดลง Clipboard แล้ว");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Header & Status Banner */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5 text-teal-600" />
                    หน้าจอเฝ้าดูข้อมูลผู้ป่วย (Staff Real-Time View)
                  </h1>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                  <span>
                    Session ID: <strong className="font-mono text-teal-700">{patientId}</strong>
                  </span>
                  <span>•</span>
                  <LastUpdatedTimer updatedAt={patient?.updatedAt} />
                </div>
              </div>

              {/* Status and Connection Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                <ConnectionStatus isConnected={isConnected} socketId={socketId} />
                <StatusBadge status={patient?.status} />
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualRefresh}
                  className="gap-1.5 text-xs text-slate-600"
                  disabled={isLoading}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                  รีเฟรชข้อมูล (Sync REST)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyAll}
                  className="gap-1.5 text-xs text-slate-600"
                  disabled={!patient}
                >
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  คัดลอกข้อมูลทั้งหมด
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="gap-1.5 text-xs text-slate-600"
              >
                <Printer className="w-3.5 h-3.5" />
                พิมพ์รายงาน (Print)
              </Button>
            </div>
          </div>

          {/* Patient Details Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Section 1: Personal Details */}
            <Card className="md:col-span-2 border-slate-200/80 shadow-2xs">
              <CardHeader className="bg-slate-50/60 border-b border-slate-100 pb-3">
                <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <User className="w-4 h-4 text-teal-600" />
                  ข้อมูลส่วนตัว (Personal Details)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <LiveFieldCard
                  label="ชื่อจริง"
                  labelEn="First Name"
                  value={patient?.firstName}
                  icon={<User className="w-3.5 h-3.5" />}
                />
                <LiveFieldCard
                  label="ชื่อกลาง"
                  labelEn="Middle Name"
                  value={patient?.middleName}
                  icon={<User className="w-3.5 h-3.5" />}
                />
                <LiveFieldCard
                  label="นามสกุล"
                  labelEn="Last Name"
                  value={patient?.lastName}
                  icon={<User className="w-3.5 h-3.5" />}
                />
                <LiveFieldCard
                  label="วันเดือนปีเกิด"
                  labelEn="Date of Birth"
                  value={patient?.dateOfBirth}
                  icon={<Calendar className="w-3.5 h-3.5" />}
                />
                <LiveFieldCard
                  label="เพศสภาพ"
                  labelEn="Gender"
                  value={patient?.gender}
                  icon={<Users className="w-3.5 h-3.5" />}
                />
                <LiveFieldCard
                  label="สัญชาติ"
                  labelEn="Nationality"
                  value={patient?.nationality}
                  icon={<Globe className="w-3.5 h-3.5" />}
                />
                <LiveFieldCard
                  label="ศาสนา"
                  labelEn="Religion"
                  value={patient?.religion}
                  icon={<Compass className="w-3.5 h-3.5" />}
                  className="sm:col-span-2"
                />
              </CardContent>
            </Card>

            {/* Section 2 & 3 Side Column: Contact & Emergency */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card className="border-slate-200/80 shadow-2xs">
                <CardHeader className="bg-slate-50/60 border-b border-slate-100 pb-3">
                  <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-teal-600" />
                    ข้อมูลติดต่อ (Contact)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-4 space-y-3">
                  <LiveFieldCard
                    label="เบอร์โทรศัพท์"
                    labelEn="Phone"
                    value={patient?.phoneNumber}
                    icon={<Phone className="w-3.5 h-3.5" />}
                    isMono
                  />
                  <LiveFieldCard
                    label="อีเมล"
                    labelEn="Email"
                    value={patient?.email}
                    icon={<Mail className="w-3.5 h-3.5" />}
                  />
                  <LiveFieldCard
                    label="ภาษาที่สะดวก"
                    labelEn="Language"
                    value={patient?.preferredLanguage}
                    icon={<Globe className="w-3.5 h-3.5" />}
                  />
                  <LiveFieldCard
                    label="ที่อยู่ปัจจุบัน"
                    labelEn="Address"
                    value={patient?.address}
                    icon={<MapPin className="w-3.5 h-3.5" />}
                  />
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card className="border-slate-200/80 shadow-2xs">
                <CardHeader className="bg-slate-50/60 border-b border-slate-100 pb-3">
                  <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-teal-600" />
                    ผู้ติดต่อฉุกเฉิน (Emergency)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-4 space-y-3">
                  <LiveFieldCard
                    label="ชื่อผู้ติดต่อ"
                    labelEn="Contact Name"
                    value={patient?.emergencyName}
                    icon={<User className="w-3.5 h-3.5" />}
                  />
                  <LiveFieldCard
                    label="ความสัมพันธ์"
                    labelEn="Relationship"
                    value={patient?.emergencyRelation}
                    icon={<HeartHandshake className="w-3.5 h-3.5" />}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function StaffViewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm text-slate-500">กำลังโหลดหน้าจอเจ้าหน้าที่...</div>}>
      <StaffViewContent />
    </Suspense>
  );
}
