"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  SplitSquareVertical,
  UserPen,
  LayoutDashboard,
  Send,
  FileText,
  User,
  Calendar,
  Users,
  Phone,
  Mail,
  MapPin,
  Globe,
  HeartHandshake,
  Compass,
} from "lucide-react";

import {
  patientFormSchema,
  PatientFormSchemaType,
  defaultPatientFormValues,
} from "@/lib/validations/patient.schema";
import { PatientRecord } from "@/types/patient";
import { useSocket } from "@/hooks/useSocket";
import { useInactivity } from "@/hooks/useInactivity";
import { Navbar } from "@/components/common/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/staff/status-badge";
import { LiveFieldCard } from "@/components/staff/live-field-card";
import { ConnectionStatus } from "@/components/staff/connection-status";
import { LastUpdatedTimer } from "@/components/staff/last-updated-timer";
import { AutoSaveIndicator } from "@/components/patient/auto-save-indicator";
import { PersonalInfoSection } from "@/components/patient/personal-info-section";
import { ContactInfoSection } from "@/components/patient/contact-info-section";
import { EmergencySection } from "@/components/patient/emergency-section";

function DemoSplitContent() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("id") || "patient-demo-001";

  // Staff State
  const [staffRecord, setStaffRecord] = useState<PatientRecord | null>(null);

  // Patient Form State
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormSchemaType>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: defaultPatientFormValues,
    mode: "onTouched",
  });

  // Socket Connection for the shared room
  const handleStaffUpdate = useCallback((data: PatientRecord) => {
    setStaffRecord(data);
  }, []);

  const { isConnected, socketId, emitPatientUpdate, emitPatientSubmit } = useSocket({
    patientId,
    onStaffUpdate: handleStaffUpdate,
  });

  const formValues = watch();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Inactivity tracking (5s idle -> status: inactive)
  const handleInactive = useCallback(() => {
    if (!isSubmitted && isConnected) {
      const currentValues = getValues();
      emitPatientUpdate(currentValues, "inactive");
      if (staffRecord) {
        setStaffRecord((prev) => (prev ? { ...prev, status: "inactive" } : null));
      }
    }
  }, [isSubmitted, isConnected, emitPatientUpdate, getValues, staffRecord]);

  const { recordActivity } = useInactivity({
    timeoutMs: 5000,
    onInactive: handleInactive,
    enabled: !isSubmitted && isConnected,
  });

  // Real-time synchronization
  useEffect(() => {
    if (isSubmitted) return;

    const subscription = watch((values) => {
      recordActivity();
      setIsSaving(true);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        if (isConnected) {
          emitPatientUpdate(values as PatientFormSchemaType, "filling");
          setLastSavedAt(new Date());
          setIsSaving(false);
        } else {
          setIsSaving(false);
        }
      }, 300);
    });

    return () => {
      subscription.unsubscribe();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [watch, isConnected, isSubmitted, emitPatientUpdate, recordActivity]);

  const onSubmit = (data: PatientFormSchemaType) => {
    emitPatientSubmit(data);
    setIsSubmitted(true);
    toast.success("ส่งแบบฟอร์มสำเร็จ", {
      description: "ข้อมูลอัปเดตบนหน้าจอ Staff View เป็น SUBMITTED เรียบร้อย",
    });
  };

  const handleFillDemoData = () => {
    const demoData: PatientFormSchemaType = {
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
    };
    reset(demoData);
    toast.info("กรอกข้อมูลตัวอย่างเรียบร้อยแล้ว");
  };

  const handleResetForm = () => {
    reset(defaultPatientFormValues);
    setIsSubmitted(false);
    setStaffRecord(null);
    toast.info("รีเซ็ตแบบฟอร์มเป็นค่าเริ่มต้น");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar />

      {/* Top Banner Control */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 shadow-2xs">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white font-bold text-xs">
              <SplitSquareVertical className="h-4 w-4" />
            </span>
            <div>
              <h1 className="text-sm font-bold text-slate-800 leading-tight flex items-center gap-1.5">
                Split-Screen Live Synchronization Demo
              </h1>
              <p className="text-[11px] text-slate-400">
                พิมพ์ที่หน้าจอฝั่งซ้าย (Patient) ข้อมูลจะซิงค์ไปจอขวา (Staff) ทันที
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFillDemoData}
              className="gap-1.5 text-xs text-slate-700 hover:bg-slate-50"
            >
              <FileText className="h-3.5 w-3.5 text-slate-500" />
              กรอกข้อมูลตัวอย่าง (Sample Data)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetForm}
              className="text-xs text-slate-600"
            >
              รีเซ็ตฟอร์ม
            </Button>
          </div>
        </div>
      </div>

      {/* Dual Column Layout */}
      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT COLUMN: Patient Form */}
          <div className="flex flex-col space-y-4">
            <div className="rounded-xl border border-teal-200 bg-teal-600 p-3.5 text-white flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <UserPen className="w-5 h-5" />
                <div>
                  <h2 className="text-sm font-bold">จอที่ 1: Patient Form (ฝั่งคนไข้)</h2>
                  <p className="text-[11px] text-teal-100">ผู้ป่วยกรอกข้อมูลฟอร์ม</p>
                </div>
              </div>
              <AutoSaveIndicator
                isConnected={isConnected}
                isSaving={isSaving}
                isDirty={false}
                lastSavedAt={lastSavedAt}
              />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex-1">
              <PersonalInfoSection register={register} errors={errors} />
              <ContactInfoSection register={register} errors={errors} />
              <EmergencySection register={register} />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 gap-2 shadow-md shadow-teal-900/10"
                size="lg"
              >
                <Send className="w-4 h-4" />
                ส่งแบบฟอร์ม (Submit to Staff View)
              </Button>
            </form>
          </div>

          {/* RIGHT COLUMN: Staff View */}
          <div className="flex flex-col space-y-4">
            <div className="rounded-xl border border-sky-200 bg-slate-900 p-3.5 text-white flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-teal-400" />
                <div>
                  <h2 className="text-sm font-bold text-white">จอที่ 2: Staff Real-Time Monitor (ฝั่งเจ้าหน้าที่)</h2>
                  <p className="text-[11px] text-slate-400">อัปเดตแบบเรียลไทม์ผ่าน WebSocket</p>
                </div>
              </div>
              <ConnectionStatus isConnected={isConnected} socketId={socketId} />
            </div>

            {/* Staff Monitor Content */}
            <div className="space-y-4">
              {/* Status Header */}
              <Card className="border-slate-200 shadow-2xs">
                <CardHeader className="bg-slate-50/60 pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      สถานะผู้ป่วยปัจจุบัน
                    </CardTitle>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Session: <strong className="font-mono text-teal-700">{patientId}</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={staffRecord?.status || (isSubmitted ? "submitted" : "filling")} />
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-3 flex items-center justify-between text-xs text-slate-500">
                  <LastUpdatedTimer updatedAt={staffRecord?.updatedAt || new Date().toISOString()} />
                  <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span className={`inline-block h-2 w-2 rounded-full ${isConnected ? "bg-emerald-500" : "bg-rose-500"}`} />
                    {isConnected ? "เชื่อมต่อ Socket แล้ว" : "ขาดการเชื่อมต่อ"}
                  </span>
                </CardContent>
              </Card>

              {/* Personal Details */}
              <Card className="border-slate-200 shadow-2xs">
                <CardHeader className="bg-slate-50/60 pb-2 border-b border-slate-100">
                  <CardTitle className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-teal-600" />
                    ข้อมูลส่วนตัว (Personal Details)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <LiveFieldCard
                    label="ชื่อจริง"
                    labelEn="First Name"
                    value={staffRecord?.firstName || formValues.firstName}
                    icon={<User className="w-3.5 h-3.5" />}
                  />
                  <LiveFieldCard
                    label="ชื่อกลาง"
                    labelEn="Middle Name"
                    value={staffRecord?.middleName || formValues.middleName}
                    icon={<User className="w-3.5 h-3.5" />}
                  />
                  <LiveFieldCard
                    label="นามสกุล"
                    labelEn="Last Name"
                    value={staffRecord?.lastName || formValues.lastName}
                    icon={<User className="w-3.5 h-3.5" />}
                  />
                  <LiveFieldCard
                    label="วันเกิด"
                    labelEn="Date of Birth"
                    value={staffRecord?.dateOfBirth || formValues.dateOfBirth}
                    icon={<Calendar className="w-3.5 h-3.5" />}
                  />
                  <LiveFieldCard
                    label="เพศสภาพ"
                    labelEn="Gender"
                    value={staffRecord?.gender || formValues.gender}
                    icon={<Users className="w-3.5 h-3.5" />}
                  />
                  <LiveFieldCard
                    label="สัญชาติ"
                    labelEn="Nationality"
                    value={staffRecord?.nationality || formValues.nationality}
                    icon={<Globe className="w-3.5 h-3.5" />}
                  />
                  <LiveFieldCard
                    label="ศาสนา"
                    labelEn="Religion"
                    value={staffRecord?.religion || formValues.religion}
                    icon={<Compass className="w-3.5 h-3.5" />}
                    className="sm:col-span-2"
                  />
                </CardContent>
              </Card>

              {/* Contact & Emergency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Contact */}
                <Card className="border-slate-200 shadow-2xs">
                  <CardHeader className="bg-slate-50/60 pb-2 border-b border-slate-100">
                    <CardTitle className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-teal-600" />
                      ข้อมูลติดต่อ
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-3 space-y-2">
                    <LiveFieldCard
                      label="เบอร์โทร"
                      value={staffRecord?.phoneNumber || formValues.phoneNumber}
                      icon={<Phone className="w-3.5 h-3.5" />}
                      isMono
                    />
                    <LiveFieldCard
                      label="อีเมล"
                      value={staffRecord?.email || formValues.email}
                      icon={<Mail className="w-3.5 h-3.5" />}
                    />
                    <LiveFieldCard
                      label="ที่อยู่"
                      value={staffRecord?.address || formValues.address}
                      icon={<MapPin className="w-3.5 h-3.5" />}
                    />
                  </CardContent>
                </Card>

                {/* Emergency */}
                <Card className="border-slate-200 shadow-2xs">
                  <CardHeader className="bg-slate-50/60 pb-2 border-b border-slate-100">
                    <CardTitle className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <HeartHandshake className="w-3.5 h-3.5 text-teal-600" />
                      ผู้ติดต่อฉุกเฉิน
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-3 space-y-2">
                    <LiveFieldCard
                      label="ชื่อผู้ติดต่อ"
                      value={staffRecord?.emergencyName || formValues.emergencyName}
                      icon={<User className="w-3.5 h-3.5" />}
                    />
                    <LiveFieldCard
                      label="ความสัมพันธ์"
                      value={staffRecord?.emergencyRelation || formValues.emergencyRelation}
                      icon={<HeartHandshake className="w-3.5 h-3.5" />}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DemoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-100 flex items-center justify-center text-sm text-slate-500">กำลังโหลดเดโม...</div>}>
      <DemoSplitContent />
    </Suspense>
  );
}
