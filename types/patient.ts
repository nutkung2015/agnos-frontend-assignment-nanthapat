export type PatientStatus = "filling" | "submitted" | "inactive";

export interface PatientFormData {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  preferredLanguage?: string;
  nationality?: string;
  emergencyName?: string;
  emergencyRelation?: string;
  religion?: string;
}

export interface PatientRecord extends PatientFormData {
  id: string;
  status: PatientStatus;
  createdAt: string;
  updatedAt: string;
}

export interface JoinRoomPayload {
  patientId: string;
}

export interface PatientUpdatePayload {
  patientId: string;
  data: PatientFormData;
  status: "filling" | "inactive";
}

export interface PatientSubmitPayload {
  patientId: string;
  data: PatientFormData;
}

export type StaffUpdatePayload = PatientRecord;
