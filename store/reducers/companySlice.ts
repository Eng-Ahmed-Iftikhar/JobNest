import { companyApi } from "@/api/services/companyApi";
import { Follower } from "@/types/follower";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";
import { RootState } from ".";

interface CompanyState {
  followers: Follower[];
}

const initialState: CompanyState = {
  followers: [],
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    addFollower(state, action: PayloadAction<Follower>) {
      state.followers.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      companyApi.endpoints.getFollowedCompanies.matchFulfilled,
      (state, action) => {
        const payload = action.payload;
        const page = payload.page;
        if (page > 1) {
          state.followers = _.uniqBy(
            [...state.followers, ...payload.data],
            "id"
          );
          return;
        }
        state.followers = payload.data;
      }
    );
  },
});

export const { addFollower } = companySlice.actions;

export const selectCompanyFollowers = (state: RootState) =>
  state.company.followers;

export default companySlice.reducer;
