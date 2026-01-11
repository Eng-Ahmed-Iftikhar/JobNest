import { useLogoutMutation } from "@/api/services/authApi";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import SearchInput from "@/components/ui/SearchInput";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useSearch } from "@/hooks/useSearch";
import NotificationsContent from "@/sections/notifications/NotificationsContent";
import { selectUser, selectUserProfile } from "@/store/reducers/userSlice";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

function DashboardHeader() {
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const userProfile = useAppSelector(selectUserProfile);
  const colorScheme = useColorScheme();

  const { searchQuery } = useSearch();
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const fullName = useMemo(() => {
    const first = userProfile?.firstName;
    const last = userProfile?.lastName;
    return (
      [first, last].filter(Boolean).join(" ") || user?.email.email || "User"
    );
  }, [userProfile, user]);

  const avatarUrl = userProfile?.pictureUrl || undefined;

  const handleLogout = useCallback(async () => {
    try {
      await logoutApi().unwrap();
      setOpen(false);
    } catch (error) {
      setOpen(false);
    }
  }, [logoutApi]);

  const handleEditProfile = useCallback(() => {
    setOpen(false);
    router.push("/(dashboard)/(tabs)/profile");
  }, [router]);

  const handleSettings = useCallback(() => {
    setOpen(false);
    router.push("/(dashboard)");
  }, [router]);

  return (
    <View className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => router.push("/(dashboard)/search")}
          style={{ flex: 1, marginRight: 12 }}
        >
          <SearchInput
            value={searchQuery}
            onChangeText={() => {}}
            placeholder="Search"
            editable={false}
            pointerEvents="none"
          />
        </TouchableOpacity>

        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            activeOpacity={0.8}
            className=" relative"
            onPress={() => setNotificationsOpen(true)}
          >
            <Icon name="notifications-outline" size={22} color="#6B7280" />
            <Badge count={5} size="small" />
          </TouchableOpacity>

          <Avatar
            name={fullName}
            imageUrl={avatarUrl}
            size={36}
            onPress={() => setOpen(!open)}
          />
        </View>
      </View>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable className="flex-1" onPress={() => setOpen(false)}>
          <View className="flex-1">
            <View className="absolute right-10 top-24  bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg w-56">
              <View className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <Text
                  className="text-base font-semibold dark:bg-black dark:text-white"
                  numberOfLines={1}
                >
                  {fullName}
                </Text>
                {user?.email && (
                  <Text
                    className="text-sm font-medium text-gray-500 dark:text-gray-400"
                    numberOfLines={1}
                  >
                    {user.email.email}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                className="flex-row items-center px-4 py-3"
                onPress={handleEditProfile}
              >
                <Icon
                  name="person-outline"
                  size={18}
                  color={colorScheme === "dark" ? "#D1D5DB" : "#4B5563"}
                  style={{ marginRight: 10 }}
                />
                <Text className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Edit profile
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center px-4 py-3"
                onPress={handleSettings}
              >
                <Icon
                  name="settings-outline"
                  size={18}
                  color={colorScheme === "dark" ? "#D1D5DB" : "#4B5563"}
                  style={{ marginRight: 10 }}
                />
                <Text className="text-sm font-medium text-gray-800 dark:text-gray-200 ">
                  Settings
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center px-4 py-3"
                onPress={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <ActivityIndicator
                    size="small"
                    color={colorScheme === "dark" ? "#D1D5DB" : "#4B5563"}
                    style={{ marginRight: 10 }}
                  />
                ) : (
                  <Icon
                    name="log-out-outline"
                    size={18}
                    color={"#EF4444"}
                    style={{ marginRight: 10 }}
                  />
                )}
                <Text className="text-sm font-medium text-red-500 dark:text-red-400">
                  Log out
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={notificationsOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setNotificationsOpen(false)}
      >
        <View className="flex-1 bg-black/50">
          <View className="flex-1 bg-gray-50 dark:bg-black pt-16 rounded-t-3xl">
            <NotificationsContent onClose={() => setNotificationsOpen(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default DashboardHeader;
