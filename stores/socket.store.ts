import { create } from "zustand";

interface SocketState {
  isConnected: boolean;
  socketId: string | null;
  currentRoomId: string | null;
  transportType: string | null;
  setConnected: (connected: boolean, socketId?: string | null, transport?: string | null) => void;
  setCurrentRoomId: (roomId: string | null) => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  isConnected: false,
  socketId: null,
  currentRoomId: null,
  transportType: null,
  setConnected: (isConnected, socketId = null, transportType = null) =>
    set({ isConnected, socketId, transportType }),
  setCurrentRoomId: (currentRoomId) => set({ currentRoomId }),
}));
