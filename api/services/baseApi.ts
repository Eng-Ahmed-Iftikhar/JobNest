import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import Constants from "expo-constants";
import { router } from "expo-router";

import { RootState } from "@/store/reducers";
import API_ROUTES from "@/api/routes";

const BASE_URL = Constants.expoConfig?.extra?.BASE_URL;

console.log("BASE_URL", BASE_URL);

// BaseQuery without auth headers
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");

    // Add ngrok-skip-browser-warning header for ngrok URLs
    if (BASE_URL?.includes("ngrok")) {
      headers.set("ngrok-skip-browser-warning", "any");
      headers.set("User-Agent", "ReactNative");
    }

    return headers;
  },
});

// BaseQuery with auth headers
const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: async (headers, { getState }) => {
    // Set common headers
    // Note: Content-Type will be automatically removed for FormData in the query function
    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");

    // Add ngrok-skip-browser-warning header for ngrok URLs
    if (BASE_URL?.includes("ngrok")) {
      headers.set("ngrok-skip-browser-warning", "any");
      headers.set("User-Agent", "ReactNative");
    }

    const session = (await getState()) as RootState;
    const access_token = session?.auth?.access_token;
    if (access_token) {
      headers.set("Authorization", `Bearer ${access_token}`);
    }
    return headers;
  },
});

// Helper function to check if URL is an auth endpoint that shouldn't trigger refresh
const isAuthEndpoint = (url: string): boolean => {
  return (
    url === API_ROUTES.auth.sign_in ||
    url === API_ROUTES.auth.sign_up ||
    url === API_ROUTES.auth.social_login ||
    url === API_ROUTES.auth.refresh
  );
};

// BaseQuery with auth headers and re-auth if 401
const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQueryWithAuth(args, api, extraOptions);

  // Handle network errors
  if (result.error) {
    if (result.error.status === 401) {
      // Get the URL from args
      const url = typeof args === "string" ? args : args.url;

      // Skip refresh logic for auth endpoints (login, register, refresh)
      if (isAuthEndpoint(url)) {
        return result;
      }

      // Try to refresh the token for other endpoints
      const state = api.getState() as RootState;
      const currentAccessToken = state.auth.access_token;

      if (currentAccessToken) {
        // Attempt to refresh the token
        const refreshResult = await baseQuery(
          {
            url: API_ROUTES.auth.refresh,
            method: "POST",
            body: { access_token: currentAccessToken },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          // Update the access token in store using action type string
          const newToken = (refreshResult.data as { access_token: string })
            .access_token;
          api.dispatch({
            type: "auth/setAccessToken",
            payload: newToken,
          });

          // Retry the original request with new token
          return baseQueryWithAuth(args, api, extraOptions);
        }
      }

      // If refresh failed, redirect to login
      router.replace("/(auth)/login");
    } else if (result.error.status === "FETCH_ERROR") {
      // Network error - no internet connection
      api.dispatch({
        type: "notification/showErrorNotification",
        payload:
          result.error.error || "Network error. Please check your connection.",
      });
    } else if (result.error.status === "PARSING_ERROR") {
      // Response parsing error
      api.dispatch({
        type: "notification/showErrorNotification",
        payload: "Failed to parse response. Please try again.",
      });
    } else if (
      result.error.status &&
      typeof result.error.status === "number" &&
      result.error.status >= 500
    ) {
      // Server error
      api.dispatch({
        type: "notification/showErrorNotification",
        payload: "Server error. Please try again later.",
      });
    }
  }

  return result;
};

export { BASE_URL, baseQuery, baseQueryWithAuth, baseQueryWithReAuth };
