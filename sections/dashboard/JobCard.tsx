import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import Icon from "react-native-vector-icons/Ionicons";
import JobCardMenuIcon from "./jobCardMenuIcon";
import { SuggestedJobResponseItem } from "@/api/services/jobsApi";
import { selectAppliedJobIds } from "@/store/reducers/userSlice";
import { useAppSelector } from "@/hooks/useAppSelector";
import { jobTypeIconObj, jobTypeObj } from "@/utils/constants";

export type Job = {
  id: string;
  title: string;
  company: string;
  companyAddress?: string;
  location: string;
  distance?: string;
  publishedAt?: string;
  shiftInfo?: string;
  rate?: string;
  urgent?: boolean;
  imageUrl?: string;
  description?: string;
  jobType?: string;
};

type JobCardProps = {
  job: SuggestedJobResponseItem;
  onPress?: () => void;
};

function JobCard({ job, onPress }: JobCardProps) {
  const router = useRouter();
  const appliedJobIds = useAppSelector(selectAppliedJobIds);
  const isApplied = appliedJobIds.includes(String(job.id));

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push({
        pathname: "/(dashboard)/(tabs)/job-detail",
        params: { id: job.id },
      });
    }
  };

  const employer =
    job.employers && job.employers.length > 0 ? job.employers[0] : null;
  const companyProfile = employer?.employer?.companyProfiles?.[0];
  const company = companyProfile?.company;
  const companyAddress = `${companyProfile?.address || ""}, ${companyProfile?.location?.city || ""}${companyProfile?.location?.state ? ", " + companyProfile.location.state : ""}`;

  const workMode = job?.workMode?.toUpperCase?.();
  const isOnsite = workMode === "ONSITE";
  const locationText = `${job?.location?.city || ""}${job?.location?.state ? ", " + job.location.state : ""}${job?.location?.country ? ", " + job.location.country : ""}`;

  return (
    <Animated.View entering={FadeInRight.duration(400).springify()}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        className="bg-white border  border-gray-200 rounded-xl mb-4 overflow-visible"
      >
        <View className="p-4">
          <View className="flex-row items-center justify-between mb-1">
            <Text
              className="text-lg font-semibold text-gray-900"
              numberOfLines={2}
            >
              {job.name}
            </Text>

            <JobCardMenuIcon
              jobId={job.id}
              jobTitle={job.name}
              jobCompany={company}
            />
          </View>
          {job.publishAt && (
            <Text className="text-sm font-medium text-gray-500 mb-2">
              Published{" "}
              {new Date(job.publishAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </Text>
          )}
          <View className="mb-2 flex-row items-center gap-1">
            <Text
              className="text-sm font-medium text-gray-700 mb-1"
              numberOfLines={1}
            >
              {company ? company.name : "Unknown Company"}
            </Text>
            {companyAddress && (
              <Text
                className="text-sm font-medium text-end text-gray-600 mb-1"
                numberOfLines={1}
              >
                {companyAddress}
              </Text>
            )}
          </View>

          {/* Work Mode / Location */}
          {job.workMode && (
            <View className="flex-row items-center gap-2 mb-1">
              <Icon
                name={isOnsite ? "location-outline" : "globe-outline"}
                size={14}
                color="#4B5563"
              />
              <Text
                className="text-sm font-medium text-gray-700"
                numberOfLines={1}
              >
                {isOnsite ? locationText || "Onsite" : "Remote"}
              </Text>
            </View>
          )}

          {job.jobType && (
            <View className="flex-row items-center gap-2 mb-1">
              <Icon
                name={`${jobTypeIconObj[job.jobType] || "briefcase"}-outline`}
                size={14}
                color="#4B5563"
              />
              <Text
                className="text-sm font-medium  text-gray-700"
                numberOfLines={1}
              >
                {jobTypeObj[job.jobType]}
              </Text>
            </View>
          )}

          {job.wage && (
            <View className="flex-row items-center gap-2 mb-1">
              <Icon name="cash-outline" size={14} color="#4B5563" />
              <Text
                className="text-sm font-medium text-gray-700"
                numberOfLines={1}
              >
                {job.currency} {job.wage}
                {job.wageRate ? `/${job.wageRate.toLowerCase()}` : ""}
              </Text>
            </View>
          )}

          {job.description && (
            <Text
              className="text-sm font-medium text-gray-700 mt-2"
              numberOfLines={3}
            >
              {job.description}
            </Text>
          )}

          <View className="flex-row items-center justify-between mt-3">
            {isApplied ? (
              <View className="px-3 py-2 rounded-lg bg-green-50">
                <Text className="text-green-600 text-sm font-semibold flex-row items-center gap-1">
                  ✓ Applied
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                className="px-3 py-2 rounded-lg bg-azure-radiance-50"
                onPress={() =>
                  router.push({
                    pathname: "/(dashboard)/(tabs)/job-detail",
                    params: { id: job.id },
                  })
                }
              >
                <Text className="text-azure-radiance-500 text-sm font-medium ">
                  Learn more
                </Text>
              </TouchableOpacity>
            )}

            {job.hiringStatus === "urgent" && (
              <View className="px-2 py-1 rounded-full bg-orange-100">
                <Text className="text-orange-600 text-sm font-medium ">
                  URGENT
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default JobCard;
