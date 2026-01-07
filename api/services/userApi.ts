import API_ROUTES from "@/api/routes";
import {
  ChangePasswordRequest,
  ChangePasswordResponse,
  CreatePhoneNumberRequest,
  CreatePhoneNumberResponse,
  ReauthenticateRequest,
  ReauthenticateResponse,
  UpdateCvDetailsRequest,
  UpdateCvDetailsResponse,
  UpdateGeneralInfoRequest,
  UpdateGeneralInfoResponse,
  UpdateLocationRequest,
  UpdateLocationResponse,
  UpdatePhoneNumberRequest,
  UpdatePhoneNumberResponse,
  UpdateProfilePictureRequest,
  UpdateProfilePictureResponse,
  UpdateResumeRequest,
  UpdateResumeResponse,
  UserListResponse,
} from "@/types/api/user";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseApi";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    // update general info (requires auth)
    updateGeneralInfo: builder.mutation<
      UpdateGeneralInfoResponse,
      UpdateGeneralInfoRequest
    >({
      query: (body) => ({
        url: API_ROUTES.user.me,
        method: "PUT",
        body,
      }),
    }),
    getUsers: builder.query<
      UserListResponse,
      { page: number; pageSize: number; search?: string; location?: string }
    >({
      query: ({ page = 1, pageSize = 10, search, location }) => ({
        url: API_ROUTES.users.all,
        method: "GET",
        params: { page, pageSize, search, location },
      }),
    }),
    // update location (requires auth)
    updateLocation: builder.mutation<
      UpdateLocationResponse,
      UpdateLocationRequest
    >({
      query: (body) => ({
        url: API_ROUTES.user.profile,
        method: "PUT",
        body,
      }),
    }),

    // update phone number (requires auth)
    updatePhoneNumber: builder.mutation<
      UpdatePhoneNumberResponse,
      UpdatePhoneNumberRequest
    >({
      query: (body) => ({
        url: API_ROUTES.user.phoneNumber,
        method: "PUT",
        body,
      }),
    }),
    // create phone number (requires auth)
    createPhoneNumber: builder.mutation<
      CreatePhoneNumberResponse,
      CreatePhoneNumberRequest
    >({
      query: (body) => ({
        url: API_ROUTES.user.phoneNumber,
        method: "POST",
        body,
      }),
    }),
    // update resume (requires auth)
    updateResume: builder.mutation<UpdateResumeResponse, UpdateResumeRequest>({
      query: (body) => ({
        url: API_ROUTES.user.resume,
        method: "PUT",
        body,
      }),
    }),
    // update profile picture (requires auth)
    updateProfilePicture: builder.mutation<
      UpdateProfilePictureResponse,
      UpdateProfilePictureRequest
    >({
      query: (body) => ({
        url: API_ROUTES.user.profile,
        method: "PUT",
        body,
      }),
    }),
    // get CV details (requires auth)
    getCvDetails: builder.query<UpdateCvDetailsResponse, void>({
      query: () => ({
        url: `${API_ROUTES.user.me}/cv-details`,
        method: "GET",
      }),
    }),
    // update CV details (requires auth)
    updateCvDetails: builder.mutation<
      UpdateCvDetailsResponse,
      UpdateCvDetailsRequest
    >({
      query: (body) => ({
        url: `${API_ROUTES.user.me}/cv-details`,
        method: "PUT",
        body,
      }),
    }),
    // reauthenticate current user (requires auth)
    reauthenticate: builder.mutation<
      ReauthenticateResponse,
      ReauthenticateRequest
    >({
      query: (body) => ({
        url: API_ROUTES.user.reauthenticate,
        method: "POST",
        body,
      }),
    }),
    // change password (requires auth)
    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordRequest
    >({
      query: (body) => ({
        url: API_ROUTES.user.changePassword,
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const {
  useUpdateGeneralInfoMutation,
  useUpdateLocationMutation,
  useUpdatePhoneNumberMutation,
  useCreatePhoneNumberMutation,
  useUpdateResumeMutation,
  useUpdateProfilePictureMutation,
  useGetCvDetailsQuery,
  useUpdateCvDetailsMutation,
  useReauthenticateMutation,
  useChangePasswordMutation,
  useGetUsersQuery,
} = userApi;
