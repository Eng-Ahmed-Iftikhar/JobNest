import { Follower } from "@/types/follower";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
});

export const { addFollower } = companySlice.actions;

export const selectCompanyFollowers = (state: RootState) =>
  state.company.followers;

export default companySlice.reducer;
