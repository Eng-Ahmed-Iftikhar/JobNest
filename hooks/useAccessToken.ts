import { useAppSelector } from "@/hooks/useAppSelector";
import { selectAuth } from "@/store/reducers/authSlice";

export default function useAccessToken() {
  return useAppSelector((state) => state.auth.access_token);
}
