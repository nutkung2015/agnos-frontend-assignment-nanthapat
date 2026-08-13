import { io, Socket } from "socket.io-client";

let socketInstance: Socket | null = null;

export const getSocketUrl = (): string => {
  return process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
};

export const getSocket = (): Socket => {
  if (!socketInstance) {
    const url = getSocketUrl();
    socketInstance = io(url, {
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    socketInstance.on("connect", () => {
      console.log(`[Socket] Connected successfully: ${socketInstance?.id}`);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log(`[Socket] Disconnected: ${reason}`);
    });

    socketInstance.on("connect_error", (error) => {
      console.warn(`[Socket] Connection error:`, error.message);
    });
  }

  return socketInstance;
};

export const disconnectSocket = (): void => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};
