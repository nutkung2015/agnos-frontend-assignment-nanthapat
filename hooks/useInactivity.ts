"use client";

import { useEffect, useRef, useCallback } from "react";

interface UseInactivityOptions {
  timeoutMs?: number;
  onInactive: () => void;
  enabled?: boolean;
}

export function useInactivity({
  timeoutMs = 5000,
  onInactive,
  enabled = true,
}: UseInactivityOptions) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const onInactiveRef = useRef(onInactive);

  useEffect(() => {
    onInactiveRef.current = onInactive;
  });

  const clearInactivityTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetInactivityTimer = useCallback(() => {
    if (!enabled) return;
    clearInactivityTimer();
    timerRef.current = setTimeout(() => {
      if (onInactiveRef.current) {
        onInactiveRef.current();
      }
    }, timeoutMs);
  }, [enabled, timeoutMs, clearInactivityTimer]);

  useEffect(() => {
    return () => {
      clearInactivityTimer();
    };
  }, [clearInactivityTimer]);

  return {
    recordActivity: resetInactivityTimer,
    clearTimer: clearInactivityTimer,
  };
}
