import { io, Socket } from "socket.io-client";
import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig?.extra?.BASE_URL;

let socket: Socket | null = null;

export const initSocket = (accessToken?: string) => {
  if (!socket) {
    socket = io(BASE_URL, {
      transports: ["websocket"],
      autoConnect: false,
      auth: accessToken ? { token: accessToken } : undefined,
    });
  } else if (accessToken) {
    // update token if already exists
    socket.auth = { token: accessToken };
  }
  return socket;
};

export const getSocket = () => socket;
