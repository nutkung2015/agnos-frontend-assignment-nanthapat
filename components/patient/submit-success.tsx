"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, FileText, ArrowRight, Printer } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PatientFormSchemaType } from "@/lib/validations/patient.schema";

interface SubmitSuccessScreenProps {
  patientId: string;
  data: PatientFormSchemaType;
  onReset: () => void;
}

export function SubmitSuccessScreen({
  patientId,
  data,
  onReset,
}: SubmitSuccessScreenProps) {
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#0d9488", "#14b8a6", "#2dd4bf", "#5eead4"],
      });
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-6 animate-in fade-in zoom-in-95 duration-500">
      <Card className="border-emerald-200 bg-white text-center shadow-lg shadow-emerald-950/5 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600" />
        <CardHeader className="pt-8 pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">
            บันทึกข้อมูลเรียบร้อยแล้ว!
          </CardTitle>
          <CardDescription className="text-sm text-slate-600 max-w-md mx-auto">
            โรงพยาบาลได้รับข้อมูลการลงทะเบียนของคุณเรียบร้อยแล้ว เจ้าหน้าที่สามารถดูข้อมูลแบบเรียลไทม์ได้ทันที
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 px-6">
          {/* Reference ID Pill */}
          <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500">รหัสอ้างอิงผู้ป่วย (Patient ID):</span>
            <span className="font-mono font-bold text-teal-700 bg-white px-2 py-0.5 rounded border border-teal-200">
              {patientId}
            </span>
          </div>

          {/* Data Summary Grid */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 text-left space-y-2 text-xs">
            <div className="font-semibold text-slate-700 border-b border-slate-200 pb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-600" />
              สรุปข้อมูลที่ลงทะเบียน
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-slate-400 block text-[11px]">ชื่อ-นามสกุล:</span>
                <span className="font-medium text-slate-800">
                  {data.firstName} {data.middleName ? `${data.middleName} ` : ""}{data.lastName}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">เบอร์โทรศัพท์:</span>
                <span className="font-mono text-slate-800">{data.phoneNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">อีเมล:</span>
                <span className="text-slate-800">{data.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">วันเกิด / เพศ:</span>
                <span className="text-slate-800">{data.dateOfBirth} ({data.gender})</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[11px]">ที่อยู่:</span>
                <span className="text-slate-800">{data.address}</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-2 pt-2 justify-center border-t border-slate-100 bg-slate-50/30 p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="w-full sm:w-auto gap-1.5 text-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            พิมพ์เอกสาร (Print)
          </Button>
          <Button
            size="sm"
            onClick={onReset}
            className="w-full sm:w-auto gap-1.5 text-xs bg-teal-600 hover:bg-teal-700 text-white"
          >
            กรอกข้อมูลคนไข้ท่านอื่น
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
