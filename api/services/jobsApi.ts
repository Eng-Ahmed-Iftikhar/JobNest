import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseApi";
import API_ROUTES from "@/api/routes";
import {
  SuggestedJobResponse,
  SuggestedJobResponseItem,
} from "@/types/api/job";

export const jobsApi = createApi({
  reducerPath: "jobsApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getSuggestedJobs: builder.query<
      SuggestedJobResponse,
      { page: number; pageSize: number; search?: string; location?: string }
    >({
      query: ({ page = 1, pageSize = 10, search, location }) => ({
        url: API_ROUTES.jobs.suggested,
        method: "GET",
        params: { page, pageSize, search, location },
      }),
    }),
    getSavedJobIds: builder.query<string[], void>({
      query: () => ({
        url: API_ROUTES.jobs.savedIds,
        method: "GET",
      }),
    }),
    getAppliedJobIds: builder.query<string[], void>({
      query: () => ({
        url: API_ROUTES.jobs.appliedIds,
        method: "GET",
      }),
    }),
    getSavedJobs: builder.query<
      SuggestedJobResponse,
      { page?: number; pageSize?: number }
    >({
      query: ({ page = 1, pageSize = 10 } = {}) => ({
        url: API_ROUTES.jobs.saved,
        method: "GET",
        params: { page, pageSize },
      }),
    }),
    applyJob: builder.mutation<
      { message?: string },
      { jobId: string; coverLetter?: string }
    >({
      query: ({ jobId, coverLetter }) => ({
        url: API_ROUTES.jobs.apply.replace(":id", jobId),
        method: "POST",
        body: coverLetter ? { coverLetter } : undefined,
      }),
    }),
    getAppliedJobs: builder.query<
      SuggestedJobResponse,
      { page?: number; pageSize?: number }
    >({
      query: ({ page = 1, pageSize = 10 } = {}) => ({
        url: API_ROUTES.jobs.applied,
        method: "GET",
        params: { page, pageSize },
      }),
    }),
    getJobById: builder.query<SuggestedJobResponseItem, { jobId: string }>({
      query: ({ jobId }) => ({
        url: API_ROUTES.jobs.detail.replace(":id", jobId),
        method: "GET",
      }),
    }),
    saveJob: builder.mutation<{ message?: string }, { jobId: string }>({
      query: ({ jobId }) => ({
        url: API_ROUTES.jobs.save.replace(":id", jobId),
        method: "POST",
      }),
    }),
    unsaveJob: builder.mutation<{ message?: string }, { jobId: string }>({
      query: ({ jobId }) => ({
        url: API_ROUTES.jobs.unsave.replace(":id", jobId),
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetSuggestedJobsQuery,
  useGetSavedJobIdsQuery,
  useGetAppliedJobIdsQuery,
  useLazyGetSuggestedJobsQuery,
  useLazyGetSavedJobsQuery,
  useLazyGetAppliedJobsQuery,
  useGetSavedJobsQuery,
  useGetJobByIdQuery,
  useApplyJobMutation,
  useSaveJobMutation,
  useUnsaveJobMutation,
} = jobsApi;
