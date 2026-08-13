import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useInactivity } from "@/hooks/useInactivity";

describe("useInactivity hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should trigger onInactive after specified timeoutMs of no activity", () => {
    const onInactive = vi.fn();
    const { result } = renderHook(() =>
      useInactivity({
        timeoutMs: 3000,
        onInactive,
        enabled: true,
      })
    );

    // Initial activity
    act(() => {
      result.current.recordActivity();
    });

    // Advance time to 2999ms - should NOT fire yet
    act(() => {
      vi.advanceTimersByTime(2999);
    });
    expect(onInactive).not.toHaveBeenCalled();

    // Advance past 3000ms - should fire
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onInactive).toHaveBeenCalledTimes(1);
  });

  it("should reset countdown if activity is recorded before timeout", () => {
    const onInactive = vi.fn();
    const { result } = renderHook(() =>
      useInactivity({
        timeoutMs: 3000,
        onInactive,
        enabled: true,
      })
    );

    act(() => {
      result.current.recordActivity();
    });

    // Advance 2000ms
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Record new activity (resets timer)
    act(() => {
      result.current.recordActivity();
    });

    // Advance another 2000ms (total 4000ms, but only 2000ms since reset)
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(onInactive).not.toHaveBeenCalled();

    // Advance 1000ms more (now 3000ms since reset)
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onInactive).toHaveBeenCalledTimes(1);
  });

  it("should not fire if disabled", () => {
    const onInactive = vi.fn();
    const { result } = renderHook(() =>
      useInactivity({
        timeoutMs: 3000,
        onInactive,
        enabled: false,
      })
    );

    act(() => {
      result.current.recordActivity();
      vi.advanceTimersByTime(5000);
    });

    expect(onInactive).not.toHaveBeenCalled();
  });
});
