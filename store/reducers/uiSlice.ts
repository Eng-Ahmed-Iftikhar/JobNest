import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NativeTouchEvent } from "react-native";
import { RootState } from ".";

// Define the initial state for the UI slice
interface UIState {
  mode: "light" | "dark";
  nativeEvent: NativeTouchEvent | null;
}

const initialState: UIState = {
  mode: "light",
  nativeEvent: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setMode(state, action: PayloadAction<"light" | "dark">) {
      state.mode = action.payload;
    },
    toggleMode(state) {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setNativeEvent(state, action: PayloadAction<NativeTouchEvent>) {
      state.nativeEvent = action.payload;
    },
  },
});

export const { setMode, toggleMode, setNativeEvent } = uiSlice.actions;
export const selectNativeEvent = (state: RootState) => state.ui.nativeEvent;

export default uiSlice.reducer;
