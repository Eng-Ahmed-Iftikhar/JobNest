import { Connection } from "@/types/connection";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { connectionApi } from "@/api/services/connectionApi";
import _, { update } from "lodash";

interface ConnectionState {
  connections: Connection[];
  count: number;
}

const initialState: ConnectionState = {
  connections: [],
  count: 0,
};

const connectionSlice = createSlice({
  name: "connection",
  initialState,
  reducers: {
    setConnections(state, action: PayloadAction<Connection[]>) {
      state.connections = action.payload;
    },
    increaseConnectionsCount(state) {
      state.count += 1;
    },
    addConnection(state, action: PayloadAction<Connection>) {
      const exists = state.connections.find(
        (conn) => conn.id === action.payload.id
      );
      if (!exists) {
        state.connections.unshift(action.payload);
      }
    },
    updateConnectionCount(state, action: PayloadAction<number>) {
      state.count = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      connectionApi.endpoints.getMeConnections.matchFulfilled,
      (state, action) => {
        const payload = action.payload;

        const page = payload.page;
        if (page === 1) {
          state.connections = payload.data;
        } else {
          state.connections = _.uniqBy(
            [...state.connections, ...payload.data],
            "id"
          );
        }
      }
    );
    builder.addMatcher(
      connectionApi.endpoints.getMeConnectionsCount.matchFulfilled,
      (state, action) => {
        state.count = action.payload;
      }
    );
  },
});

export const {
  setConnections,
  increaseConnectionsCount,
  addConnection,
  updateConnectionCount,
} = connectionSlice.actions;

export const selectConnections = (state: RootState) =>
  state.connection.connections;
export const selectConnectionsCount = (state: RootState) =>
  state.connection.count;

export default connectionSlice.reducer;
