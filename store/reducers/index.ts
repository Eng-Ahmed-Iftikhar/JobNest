// third-party
import { combineReducers } from "redux";
import { apiReducers } from "@/api/services";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import notificationReducer from "./notificationSlice";
import jobReducer from "./jobSlice";
import uiSlice from "./uiSlice";
import chatSlice from "./chatSlice";
import socketSlice from "./socketSlice";
import connectionSlice from "./connectionSlice";
import connectionRequestSlice from "./connectionRequestSlice";
import companySlice from "./companySlice";

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  auth: authReducer,
  user: userReducer,
  notification: notificationReducer,
  job: jobReducer,
  ui: uiSlice,
  chats: chatSlice,
  socket: socketSlice,
  connection: connectionSlice,
  connectionRequest: connectionRequestSlice,
  company: companySlice,
  ...apiReducers,
});

export type RootState = ReturnType<typeof reducers>; // ✅ this is important

export default reducers;
