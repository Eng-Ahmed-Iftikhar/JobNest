import { authApi } from "@/api/services/authApi";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";

// Define a type for the slice state
interface AuthState {
  access_token?: string;
}

// Define the initial state using that type
const initialState: AuthState = {
  access_token: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.access_token = action.payload;
    },
    logout: (state) => {
      state.access_token = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.signIn.matchFulfilled, (state, action) => {
        const { access_token } = action.payload;
        state.access_token = access_token;
      })
      .addMatcher(authApi.endpoints.signIn.matchRejected, (state) => {
        state.access_token = undefined;
      })
      .addMatcher(authApi.endpoints.signUp.matchFulfilled, (state, action) => {
        const { access_token } = action.payload;
        state.access_token = access_token;
      })
      .addMatcher(authApi.endpoints.signUp.matchRejected, (state) => {
        state.access_token = undefined;
      })
      .addMatcher(
        authApi.endpoints.socialLogin.matchFulfilled,
        (state, action) => {
          const { access_token } = action.payload;
          state.access_token = access_token;
        }
      )
      .addMatcher(authApi.endpoints.socialLogin.matchRejected, (state) => {
        state.access_token = undefined;
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.access_token = undefined;
      })
      .addMatcher(authApi.endpoints.logout.matchRejected, (state) => {
        // Even if logout API fails, we should still clear local state
        state.access_token = undefined;
      })
      // Handle /me endpoint for token validation
      .addMatcher(authApi.endpoints.me.matchFulfilled, (state) => {
        // Token is valid, keep access token
      })
      .addMatcher(authApi.endpoints.me.matchRejected, (state) => {
        // Token is invalid or expired, clear access token
        state.access_token = undefined;
      });
  },
});

export const { setAccessToken, logout } = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
