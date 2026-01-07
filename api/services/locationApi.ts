import API_ROUTES from "@/api/routes";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseApi";

export const locationApi = createApi({
  reducerPath: "locationApi",
  baseQuery: baseQueryWithReAuth, // Use your base URL if needed
  endpoints: (builder) => ({
    searchLocations: builder.query<string[], string>({
      query: (q) => ({
        url: API_ROUTES.location.search,
        method: "GET",
        params: { q },
      }),
    }),
  }),
});

export const { useLazySearchLocationsQuery, useSearchLocationsQuery } =
  locationApi;
