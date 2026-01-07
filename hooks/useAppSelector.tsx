import { RootState } from "@/store/reducers";
import { TypedUseSelectorHook, useSelector } from "react-redux";

// Use throughout your app instead of plain `useSelector`
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
