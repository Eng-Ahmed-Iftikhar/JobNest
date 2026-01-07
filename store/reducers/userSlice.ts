import { authApi } from "@/api/services/authApi";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";

import { Profile, User, USER_ROLE } from "@/types/user";

// Define a type for the slice state

interface UserState {
  user: User | null;
  profile: Profile | null;
  isLoggedIn: boolean;
}

// Define the initial state using that type
const initialState: UserState = {
  user: null,
  profile: null,
  isLoggedIn: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state["user"] = action.payload;
    },
    setUserProfile: (state, action: PayloadAction<Profile | null>) => {
      state["profile"] = action.payload;
    },
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.profile = null;
      state.isLoggedIn = false;
    },
    updateIsOnboarded: (state, action: PayloadAction<boolean>) => {
      if (state.profile) {
        state.profile.isOnboarded = action.payload;
      }
    },
    updateProfile: (state, action: PayloadAction<Partial<Profile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    setEmailVerified: (state, action: PayloadAction<boolean>) => {
      if (state.user && state.user.email) {
        state.user.email.isVerified = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.me.matchFulfilled, (state, action) => {
        if (action.payload.profile.role !== USER_ROLE.EMPLOYEE) return;

        state["user"] = action.payload.user;
        state["profile"] = action.payload.profile;

        state.isLoggedIn = true;
      })
      .addMatcher(authApi.endpoints.me.matchRejected, (state, action) => {
        state.user = null;
        state.isLoggedIn = false;
      })

      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
      })
      .addMatcher(authApi.endpoints.logout.matchRejected, (state) => {
        // Even if logout API fails, we should still clear local state
        state.isLoggedIn = false;
        state.user = null;
      });

    // Handle login/signup success
  },
});

export const {
  setUser,
  updateProfile,
  setLoggedIn,
  setUserProfile,
  clearUser,
  updateIsOnboarded,
  setEmailVerified,
} = userSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.user.user;
export const selectUserProfile = (state: RootState) => state.user.profile;
export const selectIsLoggedIn = (state: RootState) => state.user.isLoggedIn;

export default userSlice.reducer;
