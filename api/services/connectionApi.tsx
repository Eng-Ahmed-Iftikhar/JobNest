import API_ROUTES from "@/api/routes";
import {
  GetConnectionsRequest,
  GetConnectionsResponse,
} from "@/types/api/connection";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseApi";

export const connectionApi = createApi({
  reducerPath: "connectionApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getMeConnections: builder.query<
      GetConnectionsResponse,
      GetConnectionsRequest
    >({
      query: ({ params }) => ({
        url: API_ROUTES.connections.me,
        method: "GET",
        params,
      }),
    }),
    getMeConnectionsCount: builder.query<number, void>({
      query: () => ({
        url: API_ROUTES.connections.countMe,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetMeConnectionsQuery,
  useLazyGetMeConnectionsQuery,
  useGetMeConnectionsCountQuery,
  useLazyGetMeConnectionsCountQuery,
} = connectionApi;
