import { create } from "zustand";
import { PatientFormData, PatientStatus } from "@/types/patient";
import { defaultPatientFormValues } from "@/lib/validations/patient.schema";

interface PatientFormState {
  formData: PatientFormData;
  status: PatientStatus;
  isDirty: boolean;
  isSaving: boolean;
  lastSavedAt: Date | null;
  setFormData: (data: Partial<PatientFormData>) => void;
  updateField: <K extends keyof PatientFormData>(field: K, value: PatientFormData[K]) => void;
  setStatus: (status: PatientStatus) => void;
  setIsSaving: (isSaving: boolean) => void;
  setLastSavedAt: (date: Date) => void;
  resetForm: () => void;
}

export const usePatientFormStore = create<PatientFormState>((set) => ({
  formData: defaultPatientFormValues,
  status: "filling",
  isDirty: false,
  isSaving: false,
  lastSavedAt: null,
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
      isDirty: true,
    })),
  updateField: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
      isDirty: true,
    })),
  setStatus: (status) => set({ status }),
  setIsSaving: (isSaving) => set({ isSaving }),
  setLastSavedAt: (lastSavedAt) => set({ lastSavedAt, isSaving: false, isDirty: false }),
  resetForm: () =>
    set({
      formData: defaultPatientFormValues,
      status: "filling",
      isDirty: false,
      isSaving: false,
      lastSavedAt: null,
    }),
}));
