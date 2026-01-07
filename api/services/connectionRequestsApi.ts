import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseApi";
import API_ROUTES from "@/api/routes";
import {
  ConnectionRequestsResponse,
  CreateConnectionRequestPayload,
  CreateConnectionRequestResponse,
} from "@/types/api/connection-request";
import { ConnectionRequest } from "@/types/connection-request";

export const connectionRequestsApi = createApi({
  reducerPath: "connectionRequestsApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getMeConnectionRequests: builder.query<
      ConnectionRequestsResponse,
      {
        page?: number;
        pageSize?: number;
        search?: string;
        status: "INBOUND" | "OUTBOUND";
      }
    >({
      query: ({ page = 1, pageSize = 10, search, status }) => ({
        url: API_ROUTES.connectionRequests.me,
        method: "GET",
        params: { page, pageSize, search, status },
      }),
    }),
    acceptConnectionRequest: builder.mutation<
      ConnectionRequest, // ConnectionRequest},
      string
    >({
      query: (requestId) => ({
        url: API_ROUTES.connectionRequests.accept.replace(":id", requestId),
        method: "PATCH",
      }),
    }),
    rejectConnectionRequest: builder.mutation<ConnectionRequest, string>({
      query: (requestId) => ({
        url: API_ROUTES.connectionRequests.reject.replace(":id", requestId),
        method: "PATCH",
      }),
    }),
    createConnectionRequest: builder.mutation<
      CreateConnectionRequestResponse,
      CreateConnectionRequestPayload
    >({
      query: (body) => ({
        url: API_ROUTES.connectionRequests.create,
        method: "POST",
        body,
      }),
    }),
    getMeConnectionRequestsCount: builder.query<number, void>({
      query: () => ({
        url: API_ROUTES.connectionRequests.countMe,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetMeConnectionRequestsQuery,
  useLazyGetMeConnectionRequestsQuery,
  useCreateConnectionRequestMutation,
  useAcceptConnectionRequestMutation,
  useGetMeConnectionRequestsCountQuery,
  useLazyGetMeConnectionRequestsCountQuery,
  useRejectConnectionRequestMutation,
} = connectionRequestsApi;
