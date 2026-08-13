import { describe, it, expect } from "vitest";
import { patientFormSchema } from "@/lib/validations/patient.schema";

describe("patientFormSchema", () => {
  const validData = {
    firstName: "สมชาย",
    middleName: "มิตร",
    lastName: "ใจดี",
    dateOfBirth: "1990-05-15",
    gender: "ชาย (Male)",
    phoneNumber: "0812345678",
    email: "somchai@example.com",
    address: "123/45 ถนนสุขุมวิท กรุงเทพฯ 10110",
    preferredLanguage: "ไทย (Thai)",
    nationality: "ไทย (Thai)",
    emergencyName: "สมศรี ใจดี",
    emergencyRelation: "ภรรยา (Spouse)",
    religion: "พุทธ (Buddhism)",
  };

  it("should validate valid patient form data successfully", () => {
    const result = patientFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should fail when required fields are missing", () => {
    const result = patientFormSchema.safeParse({
      middleName: "มิตร",
      nationality: "ไทย",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      expect(fieldErrors.firstName).toBeDefined();
      expect(fieldErrors.lastName).toBeDefined();
      expect(fieldErrors.phoneNumber).toBeDefined();
      expect(fieldErrors.email).toBeDefined();
      expect(fieldErrors.address).toBeDefined();
    }
  });

  it("should reject invalid email formats", () => {
    const result = patientFormSchema.safeParse({
      ...validData,
      email: "invalid-email-format",
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid Thai phone number formats", () => {
    const result = patientFormSchema.safeParse({
      ...validData,
      phoneNumber: "12345", // too short
    });
    expect(result.success).toBe(false);
  });

  it("should reject future date of birth", () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 2);
    const result = patientFormSchema.safeParse({
      ...validData,
      dateOfBirth: futureDate.toISOString().split("T")[0],
    });
    expect(result.success).toBe(false);
  });

  it("should allow optional fields to be empty strings", () => {
    const dataWithEmptyOptionals = {
      ...validData,
      middleName: "",
      emergencyName: "",
      emergencyRelation: "",
      religion: "",
    };
    const result = patientFormSchema.safeParse(dataWithEmptyOptionals);
    expect(result.success).toBe(true);
  });
});
