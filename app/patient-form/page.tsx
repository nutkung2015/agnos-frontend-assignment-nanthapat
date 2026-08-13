"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Send, FileText } from "lucide-react";

import {
  patientFormSchema,
  PatientFormSchemaType,
  defaultPatientFormValues,
} from "@/lib/validations/patient.schema";
import { useSocket } from "@/hooks/useSocket";
import { useInactivity } from "@/hooks/useInactivity";
import { usePatientFormStore } from "@/stores/patient-form.store";
import { Navbar } from "@/components/common/navbar";
import { Button } from "@/components/ui/button";
import { AutoSaveIndicator } from "@/components/patient/auto-save-indicator";
import { PersonalInfoSection } from "@/components/patient/personal-info-section";
import { ContactInfoSection } from "@/components/patient/contact-info-section";
import { EmergencySection } from "@/components/patient/emergency-section";
import { SubmitSuccessScreen } from "@/components/patient/submit-success";

function PatientFormContent() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("id") || "patient-demo-001";

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<PatientFormSchemaType | null>(null);

  const {
    isDirty,
    isSaving,
    lastSavedAt,
    setFormData,
    setStatus,
    setIsSaving,
    setLastSavedAt,
    resetForm,
  } = usePatientFormStore();

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

  const { isConnected, emitPatientUpdate, emitPatientSubmit } = useSocket({
    patientId,
    onError: (err) => {
      toast.error(`Socket Error: ${err.message}`);
    },
  });

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Inactivity tracking (5s idle -> status: inactive)
  const handleInactive = useCallback(() => {
    if (!isSubmitted && isConnected) {
      const currentValues = getValues();
      setStatus("inactive");
      emitPatientUpdate(currentValues, "inactive");
      console.log("[Inactivity] Sent status: inactive");
    }
  }, [isSubmitted, isConnected, setStatus, emitPatientUpdate, getValues]);

  const { recordActivity } = useInactivity({
    timeoutMs: 5000,
    onInactive: handleInactive,
    enabled: !isSubmitted && isConnected,
  });

  // Real-time synchronization on keystroke with 300ms debounce
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
          setStatus("filling");
          setFormData(values as PatientFormSchemaType);
          emitPatientUpdate(values as PatientFormSchemaType, "filling");
          setLastSavedAt(new Date());
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
  }, [
    watch,
    isConnected,
    isSubmitted,
    emitPatientUpdate,
    recordActivity,
    setFormData,
    setIsSaving,
    setLastSavedAt,
    setStatus,
  ]);

  // Handle Form Submission
  const onSubmit = (data: PatientFormSchemaType) => {
    try {
      emitPatientSubmit(data);
      setStatus("submitted");
      setSubmittedData(data);
      setIsSubmitted(true);
      toast.success("บันทึกและส่งข้อมูลเรียบร้อยแล้ว!", {
        description: "เจ้าหน้าที่ได้รับข้อมูลของคุณเรียบร้อยแล้ว",
      });
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง");
    }
  };

  const handleReset = () => {
    reset(defaultPatientFormValues);
    resetForm();
    setIsSubmitted(false);
    setSubmittedData(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4 bg-white p-4 rounded-xl border shadow-2xs">
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                แบบฟอร์มลงทะเบียนผู้ป่วย (Patient Intake Form)
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Session ID: <span className="font-mono font-semibold text-teal-700">{patientId}</span>
              </p>
            </div>

            <AutoSaveIndicator
              isConnected={isConnected}
              isSaving={isSaving}
              isDirty={isDirty}
              lastSavedAt={lastSavedAt}
            />
          </div>

          {/* Form or Success State */}
          {isSubmitted && submittedData ? (
            <SubmitSuccessScreen
              patientId={patientId}
              data={submittedData}
              onReset={handleReset}
            />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              {/* Section 1: Personal Info */}
              <PersonalInfoSection register={register} errors={errors} />

              {/* Section 2: Contact Info */}
              <ContactInfoSection register={register} errors={errors} />

              {/* Section 3: Emergency Contact */}
              <EmergencySection register={register} />

              {/* Submit CTA */}
              <div className="sticky bottom-4 z-30 rounded-xl bg-white/95 p-4 border border-slate-200/80 shadow-lg backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  <span className="text-rose-500 font-bold">*</span> ช่องที่มีเครื่องหมายดอกจันเป็นข้อมูลที่จำเป็นต้องระบุ
                </div>

                <div className="flex w-full sm:w-auto gap-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-semibold gap-2 shadow-md shadow-teal-900/10"
                    size="lg"
                  >
                    <Send className="w-4 h-4" />
                    ยืนยันและส่งแบบฟอร์ม (Submit)
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default function PatientFormPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm text-slate-500">กำลังโหลดแบบฟอร์ม...</div>}>
      <PatientFormContent />
    </Suspense>
  );
}
