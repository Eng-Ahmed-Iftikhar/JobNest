import { Middleware, Reducer } from "@reduxjs/toolkit";

// project imports
import { authApi } from "./authApi";
import { userApi } from "./userApi";
import { fileApi } from "./fileApi";
import { skillApi } from "./skillApi";
import { notificationSettingsApi } from "./notificationSettingsApi";
import { jobsApi } from "./jobsApi";
import { companyApi } from "./companyApi";
import { searchApi } from "./searchApi";
import { locationApi } from "./locationApi";
import { connectionRequestsApi } from "./connectionRequestsApi";
import { chatApi } from "./chatApi";
import { connectionApi } from "./connectionApi";

export const apiMiddlewares: Middleware[] = [
  authApi.middleware,
  userApi.middleware,
  fileApi.middleware,
  skillApi.middleware,
  notificationSettingsApi.middleware,
  jobsApi.middleware,
  companyApi.middleware,
  searchApi.middleware,
  locationApi.middleware,
  connectionRequestsApi.middleware,
  chatApi.middleware,
  connectionApi.middleware,
];

export const apiReducers: Record<string, Reducer> = {
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [fileApi.reducerPath]: fileApi.reducer,
  [skillApi.reducerPath]: skillApi.reducer,
  [notificationSettingsApi.reducerPath]: notificationSettingsApi.reducer,
  [jobsApi.reducerPath]: jobsApi.reducer,
  [companyApi.reducerPath]: companyApi.reducer,
  [searchApi.reducerPath]: searchApi.reducer,
  [locationApi.reducerPath]: locationApi.reducer,
  [connectionRequestsApi.reducerPath]: connectionRequestsApi.reducer,
  [chatApi.reducerPath]: chatApi.reducer,
  [connectionApi.reducerPath]: connectionApi.reducer,
};
