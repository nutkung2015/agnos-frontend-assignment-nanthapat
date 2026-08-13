"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Phone, Mail, MapPin, Languages } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { PatientFormSchemaType } from "@/lib/validations/patient.schema";

interface ContactInfoSectionProps {
  register: UseFormRegister<PatientFormSchemaType>;
  errors: FieldErrors<PatientFormSchemaType>;
}

export function ContactInfoSection({ register, errors }: ContactInfoSectionProps) {
  return (
    <Card className="border-teal-100 shadow-sm transition-all hover:border-teal-200">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
            <Phone className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base text-slate-800">
              2. ข้อมูลการติดต่อ (Contact Information)
            </CardTitle>
            <CardDescription>
              ใช้สำหรับการติดต่อเพื่อแจ้งผลตรวจหรือนัดหมายของโรงพยาบาล
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Phone Number */}
          <div className="space-y-1.5">
            <Label htmlFor="phoneNumber" required className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-slate-400" />
              เบอร์โทรศัพท์ (Phone Number)
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="0812345678"
              error={!!errors.phoneNumber}
              aria-invalid={!!errors.phoneNumber}
              aria-describedby={errors.phoneNumber ? "phone-error" : undefined}
              {...register("phoneNumber")}
            />
            {errors.phoneNumber && (
              <p id="phone-error" className="text-xs text-rose-500 font-medium" role="alert">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" required className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              อีเมล (Email)
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="example@domain.com"
              error={!!errors.email}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
            {errors.email && (
              <p id="email-error" className="text-xs text-rose-500 font-medium" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="space-y-1.5">
          <Label htmlFor="address" required className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            ที่อยู่ปัจจุบัน (Current Address)
          </Label>
          <Input
            id="address"
            placeholder="บ้านเลขที่, ซอย, ถนน, ตำบล/แขวง, อำเภอ/เขต, จังหวัด, รหัสไปรษณีย์"
            error={!!errors.address}
            aria-invalid={!!errors.address}
            aria-describedby={errors.address ? "address-error" : undefined}
            {...register("address")}
          />
          {errors.address && (
            <p id="address-error" className="text-xs text-rose-500 font-medium" role="alert">
              {errors.address.message}
            </p>
          )}
        </div>

        {/* Preferred Language */}
        <div className="space-y-1.5">
          <Label htmlFor="preferredLanguage" className="flex items-center gap-1.5">
            <Languages className="h-3.5 w-3.5 text-slate-400" />
            ภาษาที่สะดวกในการสื่อสาร (Preferred Language)
          </Label>
          <Select id="preferredLanguage" {...register("preferredLanguage")}>
            <option value="ไทย (Thai)">ไทย (Thai)</option>
            <option value="อังกฤษ (English)">อังกฤษ (English)</option>
            <option value="จีน (Chinese)">จีน (Chinese)</option>
            <option value="ญี่ปุ่น (Japanese)">ญี่ปุ่น (Japanese)</option>
            <option value="อื่นๆ (Other)">อื่นๆ (Other)</option>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
