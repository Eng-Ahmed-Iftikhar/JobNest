import API_ROUTES from "@/api/routes";
import {
  GetNotificationsRequest,
  GetNotificationsResponse,
} from "@/types/api/notification";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseApi";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getNotifications: builder.query<
      GetNotificationsResponse,
      GetNotificationsRequest
    >({
      query: ({ params }) => ({
        url: API_ROUTES.notification.me,
        method: "GET",
        params,
      }),
    }),
  }),
});

export const { useGetNotificationsQuery } = notificationApi;
