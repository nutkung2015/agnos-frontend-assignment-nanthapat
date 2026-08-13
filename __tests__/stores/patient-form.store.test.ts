import { describe, it, expect, beforeEach } from "vitest";
import { usePatientFormStore } from "@/stores/patient-form.store";

describe("usePatientFormStore", () => {
  beforeEach(() => {
    usePatientFormStore.getState().resetForm();
  });

  it("should initialize with default empty values and status filling", () => {
    const state = usePatientFormStore.getState();
    expect(state.status).toBe("filling");
    expect(state.isDirty).toBe(false);
    expect(state.formData.firstName).toBe("");
  });

  it("should update a single field and mark isDirty as true", () => {
    const { updateField } = usePatientFormStore.getState();
    updateField("firstName", "สมชาย");

    const state = usePatientFormStore.getState();
    expect(state.formData.firstName).toBe("สมชาย");
    expect(state.isDirty).toBe(true);
  });

  it("should update status", () => {
    const { setStatus } = usePatientFormStore.getState();
    setStatus("submitted");

    expect(usePatientFormStore.getState().status).toBe("submitted");
  });

  it("should reset form state back to defaults", () => {
    const { updateField, setStatus, resetForm } = usePatientFormStore.getState();
    updateField("firstName", "สมชาย");
    setStatus("submitted");

    resetForm();

    const state = usePatientFormStore.getState();
    expect(state.formData.firstName).toBe("");
    expect(state.status).toBe("filling");
    expect(state.isDirty).toBe(false);
  });
});
