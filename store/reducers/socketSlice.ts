// src/store/socketSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

interface SocketState {
  connected: boolean;
  socket: Socket | null;
}

const initialState: SocketState = {
  connected: false,
  socket: null,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    socketConnected(state, action) {
      state.connected = true;
      state.socket = action.payload;
    },
    socketDisconnected(state) {
      state.connected = false;
      state.socket = null;
    },
  },
});

export const { socketConnected, socketDisconnected } = socketSlice.actions;

export const selectSocketConnected = (state: { socket: SocketState }) =>
  state.socket.connected;
export const selectSocket = (state: { socket: SocketState }) =>
  state.socket.socket;

export default socketSlice.reducer;
