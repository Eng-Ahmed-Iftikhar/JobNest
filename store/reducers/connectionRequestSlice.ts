import { connectionRequestsApi } from "@/api/services/connectionRequestsApi";
import { ConnectionRequest } from "@/types/connection-request";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";
import { RootState } from ".";

interface ConnectionRequestState {
  requests: ConnectionRequest[];
  count: number;
}

const initialState: ConnectionRequestState = {
  requests: [],
  count: 0,
};

const connectionRequestSlice = createSlice({
  name: "connectionRequest",
  initialState,
  reducers: {
    addRequest(state, action: PayloadAction<ConnectionRequest>) {
      state.requests.push(action.payload);
    },
    updateRequestCount(state, action: PayloadAction<number>) {
      state.count = action.payload;
    },
    removeRequest(state, action: PayloadAction<string>) {
      state.requests = state.requests.filter(
        (req) => req.id !== action.payload
      );
      state.count -= 1;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      connectionRequestsApi.endpoints.getMeConnectionRequests.matchFulfilled,
      (state, action) => {
        const payload = action.payload;
        if (payload.page === 1) {
          state.requests = payload.data;
        } else {
          state.requests = _.uniqBy([...state.requests, ...payload.data], "id");
        }
      }
    );
    builder.addMatcher(
      connectionRequestsApi.endpoints.getMeConnectionRequestsCount
        .matchFulfilled,
      (state, action) => {
        state.count = action.payload;
      }
    );
    builder.addMatcher(
      connectionRequestsApi.endpoints.acceptConnectionRequest.matchFulfilled,
      (state, action) => {
        const acceptedRequest = action.payload;
        state.requests = state.requests.filter(
          (request) => request.id !== acceptedRequest.id
        );
        state.count -= 1;
      }
    );
    builder.addMatcher(
      connectionRequestsApi.endpoints.rejectConnectionRequest.matchFulfilled,
      (state, action) => {
        const rejectedRequest = action.payload;
        state.requests = state.requests.filter(
          (request) => request.id !== rejectedRequest.id
        );
        state.count -= 1;
      }
    );
  },
});

export const { addRequest, updateRequestCount, removeRequest } =
  connectionRequestSlice.actions;

export const selectConnectionRequests = (state: RootState) =>
  state.connectionRequest.requests;
export const selectConnectionRequestsCount = (state: RootState) =>
  state.connectionRequest.count;

export default connectionRequestSlice.reducer;
