import API_ROUTES from "@/api/routes";
import { Company } from "@/types/company";
import { SuggestedCompaniesResponse } from "@/types/search/suggestedCompanies";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseApi";
import { SuggestedJobResponse } from "@/types/api/job";
import {
  CompanyFollowersRequest,
  CompanyFollowersResponse,
} from "@/types/api/company";

export const companyApi = createApi({
  reducerPath: "companyApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getCompanyFollowers: builder.query<
      CompanyFollowersResponse,
      CompanyFollowersRequest
    >({
      query: ({ params }) => ({
        url: API_ROUTES.companies.followers,
        method: "GET",
        params,
      }),
    }),
    getCompanyById: builder.query<Company, { companyId: string }>({
      query: ({ companyId }) => ({
        url: API_ROUTES.companies.detail.replace(":id", companyId),
        method: "GET",
      }),
    }),
    getCompanyJobs: builder.query<
      SuggestedJobResponse,
      { companyId: string; page?: number; pageSize?: number }
    >({
      query: ({ companyId, page = 1, pageSize = 10 }) => ({
        url: API_ROUTES.companies.jobs.replace(":id", companyId),
        method: "GET",
        params: { page, pageSize },
      }),
    }),
    followCompany: builder.mutation<
      { message?: string },
      { companyId: string }
    >({
      query: ({ companyId }) => ({
        url: API_ROUTES.companies.follow.replace(":id", companyId),
        method: "POST",
      }),
    }),
    unfollowCompany: builder.mutation<
      { message?: string },
      { companyId: string }
    >({
      query: ({ companyId }) => ({
        url: API_ROUTES.companies.follow.replace(":id", companyId),
        method: "DELETE",
      }),
    }),
    getSuggestedCompanies: builder.query<
      SuggestedCompaniesResponse,
      { search?: string; page: number; pageSize: number; location: string }
    >({
      query: ({ search = "", page = 1, pageSize = 10, location }) => ({
        url: API_ROUTES.companies.all,
        method: "GET",
        params: { search, page, pageSize, location },
      }),
    }),
  }),
});

export const {
  useGetCompanyFollowersQuery,
  useLazyGetCompanyByIdQuery,
  useLazyGetCompanyFollowersQuery,
  useGetCompanyByIdQuery,
  useGetCompanyJobsQuery,
  useFollowCompanyMutation,
  useUnfollowCompanyMutation,
  useGetSuggestedCompaniesQuery,
} = companyApi;
