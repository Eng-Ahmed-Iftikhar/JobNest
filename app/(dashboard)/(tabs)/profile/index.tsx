import { Redirect } from "expo-router";

export default function ProfileIndex() {
  return <Redirect href="/(dashboard)/(tabs)/profile/edit-profile" />;
}
