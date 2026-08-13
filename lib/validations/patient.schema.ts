import { z } from "zod";

// Thai mobile number regex: 10 digits starting with 0
const phoneRegex = /^0[0-9]{8,9}$/;

export const patientFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "กรุณากรอกชื่อจริง (First Name is required)")
    .min(2, "ชื่อจริงต้องมีความยาวอย่างน้อย 2 ตัวอักษร"),
  middleName: z.string().trim().optional().or(z.literal("")),
  lastName: z
    .string()
    .trim()
    .min(1, "กรุณากรอกนามสกุล (Last Name is required)")
    .min(2, "นามสกุลต้องมีความยาวอย่างน้อย 2 ตัวอักษร"),
  dateOfBirth: z
    .string()
    .min(1, "กรุณาเลือกวันเดือนปีเกิด (Date of Birth is required)")
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date <= new Date();
    }, "วันเกิดต้องไม่ใช่วันที่ในอนาคต"),
  gender: z
    .string()
    .min(1, "กรุณาระบุเพศสภาพ (Gender is required)"),
  phoneNumber: z
    .string()
    .trim()
    .min(1, "กรุณากรอกเบอร์โทรศัพท์ (Phone number is required)")
    .regex(phoneRegex, "กรุณากรอกเบอร์โทรศัพท์ 10 หลักที่ถูกต้อง (เช่น 0812345678)"),
  email: z
    .string()
    .trim()
    .min(1, "กรุณากรอกอีเมล (Email is required)")
    .email("รูปแบบอีเมลไม่ถูกต้อง (เช่น example@domain.com)"),
  address: z
    .string()
    .trim()
    .min(1, "กรุณากรอกที่อยู่ปัจจุบัน (Address is required)")
    .min(5, "ที่อยู่ต้องมีความยาวอย่างน้อย 5 ตัวอักษร"),
  preferredLanguage: z.string().trim().optional().or(z.literal("")),
  nationality: z.string().trim().optional().or(z.literal("")),
  emergencyName: z.string().trim().optional().or(z.literal("")),
  emergencyRelation: z.string().trim().optional().or(z.literal("")),
  religion: z.string().trim().optional().or(z.literal("")),
});

export type PatientFormSchemaType = z.infer<typeof patientFormSchema>;

export const defaultPatientFormValues: PatientFormSchemaType = {
  firstName: "",
  middleName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  phoneNumber: "",
  email: "",
  address: "",
  preferredLanguage: "ไทย (Thai)",
  nationality: "ไทย (Thai)",
  emergencyName: "",
  emergencyRelation: "",
  religion: "",
};
