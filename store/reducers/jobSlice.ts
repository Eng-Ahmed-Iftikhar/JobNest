import { jobsApi } from "@/api/services/jobsApi";
import { SuggestedJobResponseItem } from "@/types/api/job";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface JobState {
  jobs: SuggestedJobResponseItem[];
  savedJobs: SuggestedJobResponseItem[];
  appliedJobs: SuggestedJobResponseItem[];
}

const initialState: JobState = {
  jobs: [],
  savedJobs: [],
  appliedJobs: [],
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<SuggestedJobResponseItem[]>) => {
      state.jobs = action.payload;
    },
    clearJobs: (state) => {
      state.jobs = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Capture suggested jobs
      .addMatcher(
        jobsApi.endpoints.getSuggestedJobs.matchFulfilled,
        (state, action) => {
          const payload = action.payload;

          const page = payload.page;

          if (page && page > 1) {
            const existingIds = new Set(state.jobs.map((j) => String(j.id)));
            const newItems = payload.data.filter(
              (j) => !existingIds.has(String(j.id))
            );
            state.jobs = [...state.jobs, ...newItems];
          } else {
            state.jobs = payload.data;
          }
        }
      )
      .addMatcher(
        jobsApi.endpoints.getSavedJobs.matchFulfilled,
        (state, action) => {
          const payload = action.payload;
          const page = payload.page;

          if (page && page > 1) {
            const existingIds = new Set(
              state.savedJobs.map((j) => String(j.id))
            );
            const newItems = payload.data.filter(
              (j) => !existingIds.has(String(j.id))
            );
            state.savedJobs = [...state.savedJobs, ...newItems];
          } else {
            state.savedJobs = payload.data;
          }
        }
      )
      .addMatcher(
        jobsApi.endpoints.unsaveJob.matchFulfilled,
        (state, action) => {
          const jobId = action.payload.id;
          if (jobId) {
            state.savedJobs = state.savedJobs.filter(
              (job) => String(job.id) !== jobId
            );
            state.jobs = state.jobs.map((job) => {
              return {
                ...job,
                isSaved: String(job.id) === jobId ? false : job.isSaved,
              };
            });
            state.appliedJobs = state.appliedJobs.map((job) => {
              return {
                ...job,
                isSaved: String(job.id) === jobId ? false : job.isSaved,
              };
            });
          }
        }
      )
      .addMatcher(jobsApi.endpoints.saveJob.matchFulfilled, (state, action) => {
        const savedJob = action.payload;
        const exists = state.savedJobs.findLast(
          (job) => String(job.id) === String(savedJob.id)
        );
        if (!exists) {
          state.savedJobs.push(savedJob);
          state.jobs = state.jobs.map((job) => {
            return {
              ...job,
              isSaved: String(job.id) === String(savedJob.id),
            };
          });
          state.appliedJobs = state.appliedJobs.map((job) => {
            return {
              ...job,
              isSaved: String(job.id) === String(savedJob.id),
            };
          });
        }
      })
      .addMatcher(
        jobsApi.endpoints.getAppliedJobs.matchFulfilled,
        (state, action) => {
          const payload = action.payload;
          const page = payload.page;

          if (page && page > 1) {
            const existingIds = new Set(
              state.appliedJobs.map((j) => String(j.id))
            );
            const newItems = payload.data.filter(
              (j) => !existingIds.has(String(j.id))
            );
            state.appliedJobs = [...state.appliedJobs, ...newItems];
          } else {
            state.appliedJobs = payload.data;
          }
        }
      );
  },
});

export const { setJobs, clearJobs } = jobSlice.actions;

export default jobSlice.reducer;

// Selectors
export const selectJobs = (state: any) =>
  state.job.jobs as SuggestedJobResponseItem[];
export const selectSavedJobs = (state: any) =>
  state.job.savedJobs as SuggestedJobResponseItem[];
export const selectAppliedJobs = (state: any) =>
  state.job.appliedJobs as SuggestedJobResponseItem[];
