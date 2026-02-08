import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum AlertType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

interface Alert {
  id: string;
  type: AlertType;
  message: string;
  duration?: number;
}

interface AlertState {
  alerts: Alert[];
}

const initialState: AlertState = {
  alerts: [],
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    showSuccessAlert: (state, action: PayloadAction<string>) => {
      const id = Date.now().toString();
      state.alerts.push({
        id,
        type: AlertType.SUCCESS,
        message: action.payload,
        duration: 3000,
      });
    },
    showErrorAlert: (state, action: PayloadAction<string>) => {
      const id = Date.now().toString();
      state.alerts.push({
        id,
        type: AlertType.ERROR,
        message: action.payload,
        duration: 4000,
      });
    },
    showWarningAlert: (state, action: PayloadAction<string>) => {
      const id = Date.now().toString();
      state.alerts.push({
        id,
        type: AlertType.WARNING,
        message: action.payload,
        duration: 3000,
      });
    },
    showInfoAlert: (state, action: PayloadAction<string>) => {
      const id = Date.now().toString();
      state.alerts.push({
        id,
        type: AlertType.INFO,
        message: action.payload,
        duration: 3000,
      });
    },
    removeAlert: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter((n) => n.id !== action.payload);
    },
    clearAllAlerts: (state) => {
      state.alerts = [];
    },
  },
});

export const {
  showSuccessAlert,
  showErrorAlert,
  showWarningAlert,
  showInfoAlert,
  removeAlert,
  clearAllAlerts,
} = alertSlice.actions;

export const selectAlerts = (state: { alert: AlertState }) =>
  state.alert.alerts;
export default alertSlice.reducer;
