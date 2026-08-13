"use client";

import { UseFormRegister } from "react-hook-form";
import { ShieldAlert, HeartHandshake } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { PatientFormSchemaType } from "@/lib/validations/patient.schema";

interface EmergencySectionProps {
  register: UseFormRegister<PatientFormSchemaType>;
}

export function EmergencySection({ register }: EmergencySectionProps) {
  return (
    <Card className="border-teal-100 shadow-sm transition-all hover:border-teal-200">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base text-slate-800">
              3. บุคคลติดต่อกรณีฉุกเฉิน (Emergency Contact)
              <span className="ml-2 text-xs font-normal text-slate-500">(ไม่บังคับ / Optional)</span>
            </CardTitle>
            <CardDescription>
              บุคคลที่โรงพยาบาลสามารถติดต่อได้ทันทีเมื่อเกิดเหตุฉุกเฉิน
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Emergency Name */}
          <div className="space-y-1.5">
            <Label htmlFor="emergencyName">
              ชื่อ-นามสกุล ผู้ติดต่อฉุกเฉิน (Contact Name)
            </Label>
            <Input
              id="emergencyName"
              placeholder="สมศรี ใจดี"
              {...register("emergencyName")}
            />
          </div>

          {/* Emergency Relationship */}
          <div className="space-y-1.5">
            <Label htmlFor="emergencyRelation" className="flex items-center gap-1.5">
              <HeartHandshake className="h-3.5 w-3.5 text-slate-400" />
              ความสัมพันธ์ (Relationship)
            </Label>
            <Select id="emergencyRelation" {...register("emergencyRelation")}>
              <option value="">-- เลือกความสัมพันธ์ --</option>
              <option value="บิดา/มารดา (Parent)">บิดา/มารดา (Parent)</option>
              <option value="คู่สมรส (Spouse)">คู่สมรส (Spouse)</option>
              <option value="บุตร (Child)">บุตร (Child)</option>
              <option value="พี่/น้อง (Sibling)">พี่/น้อง (Sibling)</option>
              <option value="ญาติ (Relative)">ญาติ (Relative)</option>
              <option value="เพื่อน/เพื่อนร่วมงาน (Friend/Colleague)">เพื่อน/เพื่อนร่วมงาน (Friend/Colleague)</option>
              <option value="อื่นๆ (Other)">อื่นๆ (Other)</option>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
