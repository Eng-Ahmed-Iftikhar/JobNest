import { useLazyMeQuery } from "@/api/services/authApi";
import { useAppSelector } from "@/hooks/useAppSelector";
import AppLoader from "./AppLoader";
import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useLazyGetMeConnectionRequestsCountQuery } from "@/api/services/connectionRequestsApi";
import { useLazyGetMeConnectionsCountQuery } from "@/api/services/connectionApi";
import { selectAuth } from "@/store/reducers/authSlice";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { access_token } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const [trigger, { isLoading, isFetching }] = useLazyMeQuery();
  const [triggerCount] = useLazyGetMeConnectionRequestsCountQuery();
  const [triggerConnectionsCount] = useLazyGetMeConnectionsCountQuery();

  useEffect(() => {
    if (access_token) {
      trigger().then(async () => {
        dispatch({ type: "socket/connect" });
        await triggerCount();
        await triggerConnectionsCount();
      });
    }
  }, [access_token, trigger, triggerCount, triggerConnectionsCount, dispatch]);

  const gettingUser = isLoading || isFetching;
  if (gettingUser) {
    return <AppLoader />;
  }

  return children;
}

export default AuthGuard;
