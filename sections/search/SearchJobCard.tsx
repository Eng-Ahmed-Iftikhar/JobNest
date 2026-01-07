import { SearchJob } from "@/types/search";
import { jobTypeObj } from "@/utils/constants";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface SearchResultCardProps {
  job: SearchJob;
  onPress?: () => void;
}

export default function SearchResultCard({
  job,
  onPress,
}: SearchResultCardProps) {
  const router = useRouter();
  const employer = job.employers[0]?.employer;
  const companyProfile = employer?.companyProfiles?.[0];
  const company = companyProfile?.company;
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

  return (
    <Pressable
      onPress={handlePress}
      className="flex-row bg-white px-3 items-start gap-3 py-3 border-b border-gray-100"
    >
      <View className="flex-1">
        <Text
          className="text-base font-semibold text-gray-900"
          numberOfLines={2}
        >
          {job.name}
        </Text>
        <Text
          className="text-sm font-medium text-gray-600 mt-1"
          numberOfLines={1}
        >
          {company ? company.name : ""}
          {job.location ? ` • ${job.location.city}, ${job.location.state}` : ""}
        </Text>

        {job.jobType && (
          <View className="flex-row items-center gap-3 mt-2">
            {job.jobType && (
              <View className="flex-row items-center gap-1">
                <Ionicons name="briefcase-outline" size={14} color="#6B7280" />
                <Text
                  className="text-sm  font-medium text-gray-600"
                  numberOfLines={1}
                >
                  {jobTypeObj[job.jobType]}
                </Text>
              </View>
            )}
            {job.wageRate && (
              <View className="flex-row items-center gap-1">
                <Text>•</Text>
                <Ionicons name="cash-outline" size={14} color="#6B7280" />
                <Text
                  className="text-sm font-medium text-gray-600"
                  numberOfLines={1}
                >
                  {job.wage ? `${job.wage}` : ""} /{job.wageRate}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}
