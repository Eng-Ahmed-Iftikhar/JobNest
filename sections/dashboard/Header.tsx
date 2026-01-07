import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import SearchInput from "@/components/ui/SearchInput";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { useLogoutMutation } from "@/api/services/authApi";
import { useRouter } from "expo-router";
import NotificationsContent from "@/sections/notifications/NotificationsContent";
import { useSearch } from "@/hooks/useSearch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectUser, selectUserProfile } from "@/store/reducers/userSlice";

function DashboardHeader() {
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const userProfile = useAppSelector(selectUserProfile);

  const { searchQuery } = useSearch();
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const fullName = useMemo(() => {
    const first = userProfile?.generalInfo?.firstName;
    const last = userProfile?.generalInfo?.lastName;
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
    <View className="bg-white border-b border-gray-200 px-4 py-3">
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
            <View className="absolute right-4 top-16 bg-white rounded-xl border border-gray-200 shadow-lg w-56">
              <View className="px-4 py-3 border-b border-gray-100">
                <Text
                  className="text-base font-semibold text-gray-900"
                  numberOfLines={1}
                >
                  {fullName}
                </Text>
                {user?.email && (
                  <Text
                    className="text-sm font-medium text-gray-500"
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
                  color="#4B5563"
                  style={{ marginRight: 10 }}
                />
                <Text className="text-sm font-medium text-gray-800">
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
                  color="#4B5563"
                  style={{ marginRight: 10 }}
                />
                <Text className="text-sm font-medium text-gray-800">
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
                    color="#EF4444"
                    style={{ marginRight: 10 }}
                  />
                ) : (
                  <Icon
                    name="log-out-outline"
                    size={18}
                    color="#EF4444"
                    style={{ marginRight: 10 }}
                  />
                )}
                <Text className="text-sm font-medium text-red-500">
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
          <View className="flex-1 bg-gray-50">
            <NotificationsContent onClose={() => setNotificationsOpen(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default DashboardHeader;
