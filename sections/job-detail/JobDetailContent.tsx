import {
  useFollowCompanyMutation,
  useUnfollowCompanyMutation,
} from "@/api/services/companyApi";
import {
  useApplyJobMutation,
  useGetJobByIdQuery,
  useSaveJobMutation,
  useUnsaveJobMutation,
} from "@/api/services/jobsApi";
import AppLoader from "@/components/AppLoader";
import ApplyJobSheet from "@/components/ApplyJobSheet";
import EmptyState from "@/components/EmptyState";
import LocationText from "@/components/LocationText";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import RelatedJobs from "@/sections/job-detail/RelatedJobs";
import { selectCompanyFollowers } from "@/store/reducers/companySlice";
import { selectAppliedJobs, selectSavedJobs } from "@/store/reducers/jobSlice";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/store/reducers/notificationSlice";
import { SuggestedJobResponseItem } from "@/types/api/job";

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  const { id: routeJobId } = useLocalSearchParams<{ id?: string }>();
  const targetJobId = jobId || (routeJobId as string | undefined);
  const { data, isFetching, isError } = useGetJobByIdQuery(
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
  const dispatch = useAppDispatch();
  const employer = job?.employers?.[0];
  const companyProfile = employer?.employer?.companyProfiles?.[0];
  const company = companyProfile?.company;
  const companyName = company?.name ?? "Unknown Company";
  const companyLocation = companyProfile?.location;

  const locationText = `${job?.location?.city || ""}${
    job?.location?.state ? ", " + job.location.state : ""
  }${job?.location?.country ? ", " + job.location.country : ""}`;
  const companyColor = "#1eadff";
  const savedJobs = useAppSelector(selectSavedJobs);

  const [saveJob, { isLoading: isSaving }] = useSaveJobMutation();
  const [unsaveJob, { isLoading: isUnsaving }] = useUnsaveJobMutation();
  const bookmarked = job
    ? savedJobs.some((savedJob) => String(savedJob.id) === String(job.id))
    : false;
  const [applyJob, { isLoading: isApplying }] = useApplyJobMutation();
  const appliedJobs = useAppSelector(selectAppliedJobs);
  const followedCompanies = useAppSelector(selectCompanyFollowers);
  const [followCompany, { isLoading: isFollowing }] =
    useFollowCompanyMutation();
  const [unfollowCompany, { isLoading: isUnfollowing }] =
    useUnfollowCompanyMutation();
  const companyId = company?.id;
  const isFollowed = companyId
    ? followedCompanies.some((c) => c.id === String(companyId))
    : false;
  const [applySheetVisible, setApplySheetVisible] = useState(false);
  const isApplied = appliedJobs.some(
    (appliedJob) => String(appliedJob.id) === String(job?.id)
  );
  const [interviewScheduled, setInterviewScheduled] = useState(false);

  const handleApply = () => {
    setApplySheetVisible(true);
  };

  const handleConfirmApply = async (coverLetter: string) => {
    if (!job?.id || isApplying) return;
    try {
      await applyJob({ jobId: String(job.id), coverLetter }).unwrap();
      dispatch(showSuccessNotification("Application submitted successfully."));
      setInterviewScheduled(true);
      setApplySheetVisible(false);
    } catch (e) {
      dispatch(
        showErrorNotification(
          "Failed to submit job application. Please try again."
        )
      );
      console.warn("Failed to apply for job", e);
    }
  };

  const handleRetractApplication = () => {
    setInterviewScheduled(false);
  };

  const handleAddToCalendar = () => {
    console.log("Add interview to calendar");
    // Implement calendar integration
  };

  const handleShare = () => {
    if (job) {
      console.log("Share job:", job.id);
    }
  };

  const handleBookmark = async () => {
    if (!job?.id || isSaving || isUnsaving) return;
    try {
      if (bookmarked) {
        await unsaveJob({ jobId: String(job.id) }).unwrap();
        dispatch(showSuccessNotification("Job removed from saved jobs."));
      } else {
        await saveJob({ jobId: String(job.id) }).unwrap();
        dispatch(showSuccessNotification("Job added to saved jobs."));
      }
    } catch (e) {
      console.warn("Failed to toggle save job", e);
    }
  };

  const handleFollowCompany = async () => {
    if (!companyId || isFollowing || isUnfollowing) return;
    try {
      if (isFollowed) {
        await unfollowCompany({ companyId: String(companyId) }).unwrap();
        dispatch(showSuccessNotification(`Unfollowed ${companyName}.`));
      } else {
        await followCompany({ companyId: String(companyId) }).unwrap();
        dispatch(showSuccessNotification(`Following ${companyName}.`));
      }
    } catch (e) {
      console.warn("Failed to toggle follow company", e);
    }
  };

  if (isFetching) {
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
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
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
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {jobTitle}
          </Text>

          {/* Published Date */}
          {publishedAt && (
            <Text className="text-sm font-medium text-gray-500 mb-3">
              Published {publishedAt}
            </Text>
          )}

          {/* Work Mode / Location */}
          <View className="flex-row items-center gap-2 mb-3">
            <Ionicons
              name={isOnsite ? "location-outline" : "globe-outline"}
              size={16}
              color="#6B7280"
            />
            <Text className="text-sm font-medium  text-gray-700 flex-1">
              {isOnsite ? locationText : "Remote"}
            </Text>
          </View>

          {/* Job Type */}
          {jobTypeLabel && (
            <View className="flex-row items-center gap-2 mb-2">
              <Ionicons name="briefcase-outline" size={16} color="#6B7280" />
              <Text className="text-sm font-semibold text-gray-900">
                {jobTypeObj[jobTypeLabel]}
              </Text>
            </View>
          )}

          {/* Rate */}
          {wageText && (
            <View className="flex-row items-center gap-2 mb-4">
              <Ionicons name="cash-outline" size={16} color="#6B7280" />
              <Text className="text-sm font-semibold text-gray-900">
                {wageText}
              </Text>
            </View>
          )}

          {/* Job Description */}
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Job description
          </Text>
          <Text className="text-sm font-medium text-gray-700 leading-6 mb-6">
            {jobDescription}
          </Text>

          {/* Company Section */}
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/(dashboard)/(tabs)/company-detail",
                params: { id: companyId },
              })
            }
            className="flex-row items-center justify-between py-4 px-4 bg-gray-50 rounded-xl mb-4"
          >
            <View className="flex-row items-center gap-3 flex-1">
              <View
                className="w-12 h-12 rounded-full items-center justify-center overflow-hidden"
                style={{ backgroundColor: companyColor }}
              >
                {companyProfile?.pictureUrl ? (
                  <Image
                    source={{ uri: companyProfile.pictureUrl }}
                    className="w-12 h-12 rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="storefront" size={20} color="white" />
                )}
              </View>
              <View className="flex-1">
                <Text
                  className="text-base font-semibold text-gray-900"
                  numberOfLines={1}
                >
                  {companyName}
                </Text>
                <LocationText location={companyLocation} />
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
                  : "bg-white border border-azure-radiance-200"
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
                    isFollowed
                      ? "text-azure-radiance-600"
                      : "text-azure-radiance-500"
                  }`}
                >
                  {isFollowed ? "Following" : "Follow"}
                </Text>
              </View>
            </Pressable>
          </Pressable>
        </View>

        {/* Related Jobs */}
        <RelatedJobs currentJob={job} />
      </ScrollView>

      {/* Floating Action Buttons */}
      <View className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-white border-t border-gray-200">
        {interviewScheduled && (
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-sm font-medium text-gray-700">
              Job interview scheduled for{"\n"}
              <Text className="font-semibold">Feb 14, 4:30 PM</Text>
            </Text>
            <Pressable onPress={handleAddToCalendar}>
              <Text className="text-sm font-semibold text-azure-radiance-500">
                Add to Google Calendar
              </Text>
            </Pressable>
          </View>
        )}

        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            className="bg-azure-radiance-500 h-14 rounded-xl flex-1 items-center justify-center"
            onPress={isApplied ? handleRetractApplication : handleApply}
            disabled={isApplying}
            activeOpacity={0.8}
          >
            {isApplied ? (
              <View className="flex-row items-center gap-2">
                <Ionicons name="arrow-undo" size={20} color="white" />
                <Text className="text-white font-semibold text-base">
                  Retract application
                </Text>
              </View>
            ) : (
              <Text className="text-white font-semibold text-base">
                Apply now
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="w-14 h-14 rounded-xl border border-gray-200 bg-white items-center justify-center"
            onPress={handleBookmark}
            activeOpacity={0.8}
          >
            <Ionicons
              name={bookmarked ? "bookmark" : "bookmark-outline"}
              size={22}
              color={bookmarked ? "#1eadff" : "#6B7280"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="w-14 h-14 rounded-xl border border-gray-200 bg-white items-center justify-center"
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Ionicons name="share-outline" size={22} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ApplyJobSheet
        visible={applySheetVisible}
        onClose={() => setApplySheetVisible(false)}
        onApply={handleConfirmApply}
        jobTitle={jobTitle}
      />
    </View>
  );
}
