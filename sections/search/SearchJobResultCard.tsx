import { SearchJob } from "@/types/search";
import { jobTypeObj } from "@/utils/constants";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface Props {
  job: SearchJob;
  onPress?: () => void;
}

export default function SearchJobResultCard({ job, onPress }: Props) {
  const router = useRouter();

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
  const employer = job?.employers?.[0].employer;
  const company = employer?.companyProfiles?.[0]?.company;

  return (
    <Pressable
      onPress={handlePress}
      className="bg-white py-4 px-4 border-b border-gray-200"
    >
      <View className="flex-row items-start gap-3">
        <View className="flex-1">
          <Text
            className="text-base font-semibold text-gray-900"
            numberOfLines={2}
          >
            {job.name}
          </Text>
          {job.publishAt && (
            <Text className="text-sm font-medium text-gray-500 mt-1">
              Published{" "}
              {new Date(job.publishAt).toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
              })}
            </Text>
          )}

          <Text
            className="text-sm font-medium text-gray-700 mt-1"
            numberOfLines={1}
          >
            {[
              company?.name,
              job.location
                ? `• ${job.location.city ? job.location.city : ""} ${job.location.state ? ", " + job.location.state : ""} ${job.location.country ? ", " + job.location.country : ""}`
                : null,
            ]
              .filter(Boolean)
              .join(" ")}
          </Text>

          <View className="flex-row items-center gap-3 mt-2">
            {job.wageRate && (
              <View className="flex-row items-center gap-1">
                <Ionicons name="cash-outline" size={14} color="#6B7280" />
                <Text
                  className="text-sm font-medium text-gray-700"
                  numberOfLines={1}
                >
                  {job.currency} {job.wage}/{job.wageRate}
                </Text>
              </View>
            )}
            {job.jobType && (
              <View className="flex-row items-center gap-1">
                <Ionicons name="briefcase-outline" size={14} color="#6B7280" />
                <Text
                  className="text-sm font-medium text-gray-700"
                  numberOfLines={1}
                >
                  {jobTypeObj[job.jobType]}
                </Text>
              </View>
            )}
          </View>

          <Pressable className="mt-3" onPress={handlePress}>
            <Text className="text-sm font-medium  text-azure-radiance-500">
              Learn more
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}
