import API_ROUTES from "@/api/routes";
import { RootState } from "@/store/reducers";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./baseApi";
import { FileUploadResponse } from "@/types/api/file";

// Custom base query for file uploads
const fileUploadBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: async (headers, { getState }) => {
    // DO NOT set Content-Type for FormData - let fetch handle it
    // Only set Authorization header
    const session = getState() as RootState;
    const access_token = session?.auth?.access_token;

    if (access_token) {
      headers.set("Authorization", `Bearer ${access_token}`);
    }

    // Add ngrok-skip-browser-warning header for ngrok URLs
    if (BASE_URL?.includes("ngrok")) {
      headers.set("ngrok-skip-browser-warning", "any");
      headers.set("User-Agent", "ReactNative");
    }
    return headers;
  },
});

export const fileApi = createApi({
  reducerPath: "fileApi",
  baseQuery: fileUploadBaseQuery,
  endpoints: (builder) => ({
    // Upload file (requires auth)
    uploadFile: builder.mutation<FileUploadResponse, FormData>({
      query: (formData) => {
        return {
          url: API_ROUTES.file.upload,
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const { useUploadFileMutation } = fileApi;
