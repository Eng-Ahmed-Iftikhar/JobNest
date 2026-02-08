// third-party
import { apiReducers } from "@/api/services";
import { combineReducers } from "redux";
import alertReducer from "./alertSlice";
import authReducer from "./authSlice";
import chatSlice from "./chatSlice";
import companySlice from "./companySlice";
import connectionRequestSlice from "./connectionRequestSlice";
import connectionSlice from "./connectionSlice";
import jobReducer from "./jobSlice";
import notificationSlice from "./notificationSlice";
import socketSlice from "./socketSlice";
import uiSlice from "./uiSlice";
import userReducer from "./userSlice";
// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  auth: authReducer,
  user: userReducer,
  alert: alertReducer,
  job: jobReducer,
  ui: uiSlice,
  chats: chatSlice,
  socket: socketSlice,
  connection: connectionSlice,
  connectionRequest: connectionRequestSlice,
  company: companySlice,
  notification: notificationSlice,
  ...apiReducers,
});

export type RootState = ReturnType<typeof reducers>; // ✅ this is important

export default reducers;
