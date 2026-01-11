import {
  useFollowCompanyMutation,
  useGetCompanyByIdQuery,
  useUnfollowCompanyMutation,
} from "@/api/services/companyApi";
import AppLoader from "@/components/AppLoader";
import EmptyState from "@/components/EmptyState";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";

import { selectCompanyFollowers } from "@/store/reducers/companySlice";
import { selectConnections } from "@/store/reducers/connectionSlice";
import { showSuccessNotification } from "@/store/reducers/notificationSlice";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  Text,
  useColorScheme,
  View,
} from "react-native";
import CompanyJobsTab from "./CompanyJobsTab";
import CompanyOverviewTab from "./CompanyOverviewTab";
import CompanyPostsTab from "./CompanyPostsTab";
import StickyTabBar from "./StickyTabBar";

type TabKey = "overview" | "jobs" | "posts";

export default function CompanyDetailContent() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const colorScheme = useColorScheme();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const dispatch = useAppDispatch();

  const {
    data: company,
    isFetching: isCompanyFetching,
    isError,
  } = useGetCompanyByIdQuery({ companyId: id as string }, { skip: !id });

  const followedCompanies = useAppSelector(selectCompanyFollowers);
  const connections = useAppSelector(selectConnections);
  const [followCompany, { isLoading: isFollowing }] =
    useFollowCompanyMutation();
  const [unfollowCompany, { isLoading: isUnfollowing }] =
    useUnfollowCompanyMutation();

  const companyProfile = company?.profile;
  const companyLocation = companyProfile?.location;
  const locationText = companyLocation
    ? `${companyLocation.city || ""}${
        companyLocation.state ? ", " + companyLocation.state : ""
      }${companyLocation.country ? ", " + companyLocation.country : ""}`
    : undefined;
  const websiteText =
    companyProfile?.website?.url ||
    companyProfile?.website?.name ||
    companyProfile?.websiteId ||
    "Website not provided";
  const followersCount = company?.followers?.length || 0;
  const connectionFollowersCount = useMemo(() => {
    if (!company?.followers) return 0;
    const followerIds = new Set(company.followers.map((f) => f.followerId));
    return connections.filter((c: any) => followerIds.has(c.user.id)).length;
  }, [company?.followers, connections]);
  const isFollowed = id
    ? followedCompanies.some((c) => c.id === String(id))
    : false;

  const companyPosts = useMemo(() => (company as any)?.posts || [], [company]);

  const handleFollowToggle = async () => {
    if (!id || isFollowing || isUnfollowing) return;
    try {
      if (isFollowed) {
        await unfollowCompany({ companyId: String(id) }).unwrap();
        dispatch(showSuccessNotification("Unfollowed company."));
      } else {
        await followCompany({ companyId: String(id) }).unwrap();
        dispatch(showSuccessNotification("Following company."));
      }
    } catch (e) {
      console.warn("Failed to toggle follow company", e);
    }
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsTabsSticky(offsetY > 280);
      },
    }
  );

  if (isCompanyFetching) {
    return <AppLoader />;
  }

  if (isError || !company) {
    return (
      <EmptyState
        iconName="storefront"
        title="Company not found"
        description="We couldn't load this company. Please try again or go back."
        buttonText="Back"
        buttonIcon="arrow-back"
        onButtonPress={() => router.back()}
      />
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      {/* Sticky Tab Bar - Appears when scrolling */}
      {isTabsSticky && (
        <StickyTabBar
          isSticky={isTabsSticky}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}

      <Animated.ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Header Section */}
        <View className="bg-white dark:bg-black border-b border-gray-100 dark:border-gray-700 p-4">
          <Pressable
            className="flex-row items-center gap-1 mb-4"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="#1eadff" />
            <Text className="text-sm font-medium text-azure-radiance-500">
              Back
            </Text>
          </Pressable>
          {/* Company Logo */}
          <View className="w-16 h-16 rounded-full bg-azure-radiance-500 items-center justify-center mb-3 overflow-hidden">
            {companyProfile?.pictureUrl ? (
              <Image
                source={{ uri: companyProfile.pictureUrl }}
                className="w-16 h-16 rounded-full"
                resizeMode="cover"
              />
            ) : (
              <Ionicons
                name="storefront"
                size={32}
                color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
              />
            )}
          </View>

          {/* Company Name and Location */}
          <Text className="text-xl font-bold dark:bg-black dark:text-gray-100 mb-1">
            {company.name}
          </Text>
          {locationText ? (
            <Text className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              {locationText}
            </Text>
          ) : null}

          {/* Followers count */}
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {followersCount} follower{followersCount === 1 ? "" : "s"}
            {connectionFollowersCount > 0 && (
              <Text className="text-green-600 dark:text-green-400">
                {" "}
                • {connectionFollowersCount} of your connection
                {connectionFollowersCount === 1 ? "" : "s"} follow
              </Text>
            )}
          </Text>

          {/* Website Link */}
          {websiteText ? (
            <View className="flex-row items-center gap-2 mb-4">
              <Ionicons name="link-outline" size={16} color="#1eadff" />
              <Text className="text-sm font-medium text-azure-radiance-500">
                {websiteText}
              </Text>
            </View>
          ) : null}

          {/* Follow Button */}
          <Pressable
            onPress={handleFollowToggle}
            className={`flex-row items-center justify-center gap-2 py-2.5 rounded-lg ${
              isFollowed
                ? "bg-gray-100 border border-gray-300"
                : "bg-azure-radiance-500"
            }`}
            disabled={isFollowing || isUnfollowing}
          >
            <Ionicons
              name={isFollowed ? "checkmark" : "add"}
              size={18}
              color={isFollowed ? "#374151" : "white"}
            />
            <Text
              className={`text-sm font-medium ${
                isFollowed ? "dark:bg-black" : "text-white"
              }`}
            >
              {isFollowed ? "Following" : "Follow"}
            </Text>
          </Pressable>
        </View>
        {/* Sticky Tab Bar */}

        <StickyTabBar
          isSticky={isTabsSticky}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Content */}
        {activeTab === "overview" && (
          <CompanyOverviewTab
            company={company}
            onSeeAllJobs={() => setActiveTab("jobs")}
            onSeeAllPosts={() => setActiveTab("posts")}
          />
        )}
        {activeTab === "jobs" && id && (
          <CompanyJobsTab companyId={id} companyName={company.name} />
        )}
        {activeTab === "posts" && (
          <CompanyPostsTab
            posts={companyPosts}
            isFetching={false}
            onEndReached={() => {}}
          />
        )}
      </Animated.ScrollView>
    </View>
  );
}
