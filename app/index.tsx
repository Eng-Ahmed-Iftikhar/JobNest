import { useAppSelector } from "@/hooks/useAppSelector";
import { selectIsLoggedIn } from "@/store/reducers/userSlice";

import { Redirect } from "expo-router";
import { useAppNotificationSetup } from "@/utils/useAppNotificationSetup";

function App() {
  useAppNotificationSetup();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  if (isLoggedIn) {
    return <Redirect href="/(dashboard)" />;
  }

  return <Redirect href="/(auth)" />;
}

export default App;
