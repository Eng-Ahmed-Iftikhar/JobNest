import {
  useFollowCompanyMutation,
  useUnfollowCompanyMutation,
} from "@/api/services/companyApi";
import LocationText from "@/components/LocationText";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { showErrorAlert, showSuccessAlert } from "@/store/reducers/alertSlice";
import { selectUser } from "@/store/reducers/userSlice";
import { CompanyProfile } from "@/types/company";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { Image, Pressable, Text, useColorScheme, View } from "react-native";

type Props = {
  profile: CompanyProfile;
};
function JobCompany({ profile }: Props) {
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const colorScheme = useColorScheme();
  const [isFollowed, setIsFollowed] = React.useState(false);
  const [followCompany, { isLoading: isFollowing }] =
    useFollowCompanyMutation();
  const [unfollowCompany, { isLoading: isUnfollowing }] =
    useUnfollowCompanyMutation();
  const dispatch = useAppDispatch();
  const company = profile.company;
  const location = profile.location;
  const companyName = company.name || "Company Name";
  const profilePictureUrl = profile.pictureUrl || null;

  const handleFollowCompany = useCallback(async () => {
    if (isFollowing || isUnfollowing) return;
    try {
      if (isFollowed) {
        await unfollowCompany({ companyId: String(company.id) }).unwrap();
        setIsFollowed(false);
        dispatch(showSuccessAlert(`Unfollowed ${companyName}.`));
      } else {
        await followCompany({ companyId: String(company.id) }).unwrap();
        setIsFollowed(true);
        dispatch(showSuccessAlert(`Following ${companyName}.`));
      }
    } catch (e) {
      dispatch(showErrorAlert(`Failed to toggle follow company.`));
      console.warn("Failed to toggle follow company", e);
    }
  }, [
    company.id,
    isFollowed,
    isFollowing,
    isUnfollowing,
    followCompany,
    unfollowCompany,
    companyName,
    dispatch,
  ]);

  useEffect(() => {
    if (!company || !user) return;
    setIsFollowed(
      company.followers?.some((f) => f.id === user.id) ? true : false,
    );
  }, [company, user]);

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/(dashboard)/(tabs)/company-detail",
          params: { id: company.id },
        })
      }
      className="flex-row items-center justify-between py-4 px-4 bg-white dark:bg-gray-800 dark:border-gray-700 rounded-xl mb-4"
    >
      <View className="flex-row items-center gap-3 flex-1">
        <View className="w-12 h-12 rounded-full items-center justify-center overflow-hidden">
          {profilePictureUrl ? (
            <Image
              source={{ uri: profilePictureUrl }}
              className="w-12 h-12 rounded-full"
              resizeMode="cover"
            />
          ) : (
            <Ionicons
              name="storefront"
              size={20}
              color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
            />
          )}
        </View>
        <View className="flex-1">
          <Text
            className="text-base font-semibold text-black dark:text-gray-100"
            numberOfLines={1}
          >
            {companyName}
          </Text>
          <LocationText location={location} />
        </View>
      </View>
      <Pressable
        onPress={(e) => {
          e.stopPropagation();
          handleFollowCompany();
        }}
        disabled={isFollowing || isUnfollowing}
        className={`px-4 py-2 rounded-lg ${
          isFollowed
            ? "bg-azure-radiance-100 border border-azure-radiance-500"
            : "bg-white dark:bg-black border border-azure-radiance-200 dark:border-gray-700"
        }`}
      >
        <View className="flex-row items-center gap-1">
          <Ionicons
            name={isFollowed ? "checkmark" : "add"}
            size={16}
            color="#1eadff"
          />
          <Text
            className={`text-sm font-semibold ${
              isFollowed ? "text-azure-radiance-600" : "text-azure-radiance-500"
            }`}
          >
            {isFollowed ? "Following" : "Follow"}
          </Text>
        </View>
      </Pressable>
    </Pressable>
  );
}

export default JobCompany;
