"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { User, Calendar, Users, Globe, Compass } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { PatientFormSchemaType } from "@/lib/validations/patient.schema";

interface PersonalInfoSectionProps {
  register: UseFormRegister<PatientFormSchemaType>;
  errors: FieldErrors<PatientFormSchemaType>;
}

export function PersonalInfoSection({ register, errors }: PersonalInfoSectionProps) {
  return (
    <Card className="border-teal-100 shadow-sm transition-all hover:border-teal-200">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
            <User className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base text-slate-800">
              1. ข้อมูลส่วนตัว (Personal Information)
            </CardTitle>
            <CardDescription>
              กรุณากรอกข้อมูลส่วนตัวตามบัตรประชาชนหรือเอกสารราชการ
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        {/* Name Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="firstName" required>
              ชื่อจริง (First Name)
            </Label>
            <Input
              id="firstName"
              placeholder="สมชาย"
              error={!!errors.firstName}
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? "firstName-error" : undefined}
              {...register("firstName")}
            />
            {errors.firstName && (
              <p id="firstName-error" className="text-xs text-rose-500 font-medium" role="alert">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="middleName">
              ชื่อกลาง (Middle Name)
              <span className="text-[10px] text-slate-400 font-normal ml-1">(ถ้ามี)</span>
            </Label>
            <Input
              id="middleName"
              placeholder="มิตร"
              {...register("middleName")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lastName" required>
              นามสกุล (Last Name)
            </Label>
            <Input
              id="lastName"
              placeholder="ใจดี"
              error={!!errors.lastName}
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
              {...register("lastName")}
            />
            {errors.lastName && (
              <p id="lastName-error" className="text-xs text-rose-500 font-medium" role="alert">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        {/* DOB & Gender Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="dateOfBirth" required className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              วันเดือนปีเกิด (Date of Birth)
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              error={!!errors.dateOfBirth}
              aria-invalid={!!errors.dateOfBirth}
              aria-describedby={errors.dateOfBirth ? "dateOfBirth-error" : undefined}
              {...register("dateOfBirth")}
            />
            {errors.dateOfBirth && (
              <p id="dateOfBirth-error" className="text-xs text-rose-500 font-medium" role="alert">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="gender" required className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-slate-400" />
              เพศสภาพ (Gender)
            </Label>
            <Select
              id="gender"
              error={!!errors.gender}
              aria-invalid={!!errors.gender}
              aria-describedby={errors.gender ? "gender-error" : undefined}
              {...register("gender")}
            >
              <option value="">-- เลือกเพศสภาพ --</option>
              <option value="ชาย (Male)">ชาย (Male)</option>
              <option value="หญิง (Female)">หญิง (Female)</option>
              <option value="หลากหลายทางเพศ (LGBTQ+ / Other)">หลากหลายทางเพศ (LGBTQ+ / Other)</option>
              <option value="ไม่ต้องการระบุ (Prefer not to say)">ไม่ต้องการระบุ (Prefer not to say)</option>
            </Select>
            {errors.gender && (
              <p id="gender-error" className="text-xs text-rose-500 font-medium" role="alert">
                {errors.gender.message}
              </p>
            )}
          </div>
        </div>

        {/* Nationality & Religion */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="nationality" className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              สัญชาติ (Nationality)
            </Label>
            <Input
              id="nationality"
              placeholder="ไทย (Thai)"
              {...register("nationality")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="religion" className="flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-slate-400" />
              ศาสนา (Religion)
              <span className="text-[10px] text-slate-400 font-normal ml-1">(ไม่บังคับ)</span>
            </Label>
            <Select id="religion" {...register("religion")}>
              <option value="">-- ไม่ระบุ (Optional) --</option>
              <option value="พุทธ (Buddhism)">พุทธ (Buddhism)</option>
              <option value="คริสต์ (Christianity)">คริสต์ (Christianity)</option>
              <option value="อิสลาม (Islam)">อิสลาม (Islam)</option>
              <option value="ฮินดู (Hinduism)">ฮินดู (Hinduism)</option>
              <option value="อื่นๆ (Other)">อื่นๆ (Other)</option>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
