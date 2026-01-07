import API_ROUTES from "@/api/routes";
import { SearchPayload, SearchResponse } from "@/types/api/search";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseApi";

export const searchApi = createApi({
  reducerPath: "searchApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    search: builder.query<SearchResponse, SearchPayload>({
      query: (payload) => ({
        url: API_ROUTES.search.all,
        method: "GET",
        params: payload,
      }),
      // Do not retain unused cached data to minimize stale flashes
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useLazySearchQuery, useSearchQuery } = searchApi;
