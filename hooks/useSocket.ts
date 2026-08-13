"use client";

import { useEffect, useCallback, useRef } from "react";
import { getSocket } from "@/lib/socket";
import { useSocketStore } from "@/stores/socket.store";
import { PatientFormData, PatientRecord, PatientStatus } from "@/types/patient";

interface UseSocketOptions {
  patientId?: string;
  onStaffUpdate?: (patient: PatientRecord) => void;
  onError?: (error: { message: string }) => void;
}

export function useSocket({
  patientId,
  onStaffUpdate,
  onError,
}: UseSocketOptions = {}) {
  const socket = getSocket();
  const { isConnected, socketId, setConnected, setCurrentRoomId } = useSocketStore();
  const onStaffUpdateRef = useRef(onStaffUpdate);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onStaffUpdateRef.current = onStaffUpdate;
    onErrorRef.current = onError;
  });

  useEffect(() => {
    const handleConnect = () => {
      setConnected(true, socket.id, socket.io.engine?.transport?.name);
      if (patientId) {
        socket.emit("join-room", { patientId });
        setCurrentRoomId(patientId);
      }
    };

    const handleDisconnect = () => {
      setConnected(false, null, null);
    };

    const handleStaffUpdate = (data: PatientRecord) => {
      if (onStaffUpdateRef.current) {
        onStaffUpdateRef.current(data);
      }
    };

    const handleError = (err: { message: string }) => {
      console.error("[Socket Error Event]:", err);
      if (onErrorRef.current) {
        onErrorRef.current(err);
      }
    };

    if (socket.connected) {
      handleConnect();
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("staff-update", handleStaffUpdate);
    socket.on("error", handleError);

    if (socket.connected && patientId) {
      socket.emit("join-room", { patientId });
      setCurrentRoomId(patientId);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("staff-update", handleStaffUpdate);
      socket.off("error", handleError);
    };
  }, [patientId, setConnected, setCurrentRoomId, socket]);

  const joinRoom = useCallback(
    (targetPatientId: string) => {
      if (socket && targetPatientId) {
        socket.emit("join-room", { patientId: targetPatientId });
        setCurrentRoomId(targetPatientId);
      }
    },
    [socket, setCurrentRoomId]
  );

  const emitPatientUpdate = useCallback(
    (data: PatientFormData, status: PatientStatus = "filling") => {
      if (!patientId) return;
      socket.emit("patient-update", {
        patientId,
        data,
        status,
      });
    },
    [socket, patientId]
  );

  const emitPatientSubmit = useCallback(
    (data: PatientFormData) => {
      if (!patientId) return;
      socket.emit("patient-submit", {
        patientId,
        data,
      });
    },
    [socket, patientId]
  );

  return {
    socket,
    isConnected,
    socketId,
    joinRoom,
    emitPatientUpdate,
    emitPatientSubmit,
  };
}
