import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseApi";
import API_ROUTES from "@/api/routes";
import { Skill } from "@/types/skill";
import { CreateSkillRequest, CreateSkillResponse } from "@/types/api/skill";

export const skillApi = createApi({
  reducerPath: "skillApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["Skills"],
  endpoints: (builder) => ({
    // Get all skills
    getSkills: builder.query<Skill[], void>({
      query: () => ({
        url: API_ROUTES.skills.all,
        method: "GET",
      }),
      providesTags: ["Skills"],
    }),
    // Create a new skill
    createSkill: builder.mutation<CreateSkillResponse, CreateSkillRequest>({
      query: (body) => ({
        url: API_ROUTES.skills.create,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Skills"],
    }),
  }),
});

export const { useGetSkillsQuery, useCreateSkillMutation } = skillApi;
