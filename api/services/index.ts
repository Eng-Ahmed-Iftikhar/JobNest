import { Middleware, Reducer } from "@reduxjs/toolkit";

// project imports
import { authApi } from "./authApi";
import { chatApi } from "./chatApi";
import { companyApi } from "./companyApi";
import { connectionApi } from "./connectionApi";
import { connectionRequestsApi } from "./connectionRequestsApi";
import { fileApi } from "./fileApi";
import { jobsApi } from "./jobsApi";
import { locationApi } from "./locationApi";
import { notificationApi } from "./notificationApi";
import { notificationSettingsApi } from "./notificationSettingsApi";
import { searchApi } from "./searchApi";
import { skillApi } from "./skillApi";
import { userApi } from "./userApi";

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
  notificationApi.middleware,
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
  [notificationApi.reducerPath]: notificationApi.reducer,
};
