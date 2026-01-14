import { useAppSelector } from "@/hooks/useAppSelector";
import { selectUser, selectUserProfile } from "@/store/reducers/userSlice";
import { Redirect } from "expo-router";

export default function DashboardRedirect() {
  const user = useAppSelector(selectUser);
  const userProfile = useAppSelector(selectUserProfile);

  if (user && !user?.email?.isVerified) {
    return <Redirect href="/(dashboard)/verify-email" />;
  } else if (userProfile && !userProfile.isOnboarded) {
    return <Redirect href="/(onboarding)" />;
  }
  return <Redirect href="/(dashboard)/(tabs)/jobs" />;
}
