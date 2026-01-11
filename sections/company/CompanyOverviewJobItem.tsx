import JobCardMenuIcon from "@/sections/dashboard/jobCardMenuIcon";
import { SuggestedJobResponseItem } from "@/types/api/job";
import { jobTypeObj } from "@/utils/constants";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, useColorScheme, View } from "react-native";

type CompanyOverviewJobItemProps = {
  item: SuggestedJobResponseItem;
  companyId: string;
  companyName: string;
};

export default function CompanyOverviewJobItem({
  item,
  companyId,
  companyName,
}: CompanyOverviewJobItemProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const handlePress = () => {
    router.push({
      pathname: "/(dashboard)/(tabs)/job-detail",
      params: { id: item.id },
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      className="flex-row items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-700"
    >
      <View className="w-12 h-12 rounded-lg bg-orange-500 items-center justify-center">
        <Ionicons name="briefcase" size={24} color="white" />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-medium dark:bg-black dark:text-gray-100 mb-1">
          {item.name}
        </Text>
        <Text className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {companyName} {item.location ? `• ${item.location.city}` : ""}
        </Text>
        <View className="flex-row items-center gap-1 mt-1">
          <Ionicons
            name="briefcase-outline"
            size={12}
            color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
          />
          <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {jobTypeObj[item.jobType || "FULL_TIME"]}
          </Text>
        </View>
      </View>
      <View className="p-1">
        <JobCardMenuIcon
          isSaved={item.isSaved}
          jobId={item.id}
          jobTitle={item.name}
          jobCompany={{ id: companyId, name: companyName }}
        />
      </View>
    </Pressable>
  );
}
