import { useGetJobByIdQuery } from "@/api/services/jobsApi";
import AppLoader from "@/components/AppLoader";
import EmptyState from "@/components/EmptyState";
import LocationText from "@/components/LocationText";
import RelatedJobs from "@/sections/job-detail/RelatedJobs";
import { SuggestedJobResponseItem } from "@/types/api/job";

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import JobActionButton from "./JobActionButton";
import JobCompany from "./JobCompany";

interface JobDetailContentProps {
  jobId?: string;
}

const jobTypeObj: { [key: string]: string } = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};
export default function JobDetailContent({ jobId }: JobDetailContentProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const { id: routeJobId } = useLocalSearchParams<{ id?: string }>();
  const targetJobId = jobId || (routeJobId as string | undefined);
  const { data, isLoading, isError, refetch } = useGetJobByIdQuery(
    { jobId: targetJobId as string },
    { skip: !targetJobId }
  );

  const job = useMemo(
    () => data as SuggestedJobResponseItem | undefined,
    [data]
  );
  const jobTitle = job?.name ?? "Job";
  const jobDescription = job?.description ?? "No description available.";
  const publishedAt = job?.publishAt
    ? new Date(job.publishAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : undefined;
  const jobTypeLabel = job?.jobType ?? undefined;
  const wageText = job?.wage
    ? `${job.currency ? job.currency + " " : ""}${job.wage}${
        job.wageRate ? `/${job.wageRate.toLowerCase()}` : ""
      }`
    : undefined;
  const workMode = job?.workMode?.toUpperCase?.();
  const isOnsite = workMode === "ONSITE";

  const employer = job?.employers?.[0];
  const companyProfile = employer?.employer?.companyProfiles?.[0];

  const companyLocation = companyProfile?.location;

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  if (isLoading) {
    return <AppLoader />;
  }

  if (!job || isError) {
    return (
      <EmptyState
        iconName="briefcase-outline"
        title="Job not found"
        description="We couldn't load this job. Please try again or go back to jobs."
        buttonText="Back to jobs"
        buttonIcon="arrow-back"
        onButtonPress={() => router.push("/(dashboard)/(tabs)/jobs")}
      />
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <View className="px-4 pt-4">
          <TouchableOpacity
            className="flex-row items-center gap-1 mb-4"
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={20} color="#1eadff" />
            <Text className="text-sm font-semibold text-azure-radiance-500">
              Back
            </Text>
          </TouchableOpacity>

          {/* Job Title */}
          <Text className="text-2xl font-bold dark:bg-black dark:text-gray-100 mb-2">
            {jobTitle}
          </Text>

          {/* Published Date */}
          {publishedAt && (
            <Text className="text-sm font-medium text-gray-500 dark:text-gray-200 mb-3">
              Published {publishedAt}
            </Text>
          )}

          {/* Work Mode / Location */}
          <View className="flex-row items-center gap-2 mb-3">
            <Ionicons
              name={isOnsite ? "location-outline" : "globe-outline"}
              size={16}
              color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
            />
            <LocationText location={companyLocation} />
          </View>

          {/* Job Type */}
          {jobTypeLabel && (
            <View className="flex-row items-center gap-2 mb-2">
              <Ionicons
                name="briefcase-outline"
                size={16}
                color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
              />
              <Text className="text-sm font-semibold dark:bg-black dark:text-gray-100">
                {jobTypeObj[jobTypeLabel]}
              </Text>
            </View>
          )}

          {/* Rate */}
          {wageText && (
            <View className="flex-row items-center gap-2 mb-4">
              <Ionicons
                name="cash-outline"
                size={16}
                color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
              />
              <Text className="text-sm font-semibold dark:bg-black dark:text-gray-100">
                {wageText}
              </Text>
            </View>
          )}

          {/* Job Description */}
          <Text className="text-lg font-bold dark:bg-black dark:text-gray-100 mb-3">
            Job description
          </Text>
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-200 leading-6 mb-6">
            {jobDescription}
          </Text>

          {/* Company Section */}
          <JobCompany profile={companyProfile!} />
        </View>

        {/* Related Jobs */}
        <RelatedJobs currentJob={job} />
      </ScrollView>

      {/* Floating Action Buttons */}
      <JobActionButton job={job} />
    </View>
  );
}
