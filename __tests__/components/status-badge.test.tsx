import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "@/components/staff/status-badge";

describe("StatusBadge Component", () => {
  it("renders actively filling status badge", () => {
    render(<StatusBadge status="filling" />);
    expect(screen.getByText(/ACTIVELY FILLING/i)).toBeDefined();
    expect(screen.getByRole("status")).toBeDefined();
  });

  it("renders inactive status badge", () => {
    render(<StatusBadge status="inactive" />);
    expect(screen.getByText(/INACTIVE/i)).toBeDefined();
  });

  it("renders submitted status badge", () => {
    render(<StatusBadge status="submitted" />);
    expect(screen.getByText(/SUBMITTED/i)).toBeDefined();
  });
});
