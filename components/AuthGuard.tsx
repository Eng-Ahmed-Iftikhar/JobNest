import { useMeQuery } from "@/api/services/authApi";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectAuth } from "@/store/reducers/authSlice";
import AppLoader from "./AppLoader";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { access_token } = useAppSelector(selectAuth);

  const { isFetching, error } = useMeQuery(undefined, {
    skip: !access_token,
    refetchOnMountOrArgChange: true,
  });

  if (isFetching && !error) {
    return <AppLoader />;
  }
  return children;
}

export default AuthGuard;
