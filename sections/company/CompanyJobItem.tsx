import { SuggestedJobResponseItem } from "@/api/services/jobsApi";
import LocationText from "@/components/LocationText";
import JobCardMenuIcon from "@/sections/dashboard/jobCardMenuIcon";
import { jobTypeObj } from "@/utils/constants";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, useColorScheme, View } from "react-native";

type CompanyJobItemProps = {
  item: SuggestedJobResponseItem;
  companyId: string;
  companyName: string;
};

export default function CompanyJobItem({
  item,
  companyId,
  companyName,
}: CompanyJobItemProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const handleViewJob = () => {
    router.push({
      pathname: "/(dashboard)/(tabs)/job-detail",
      params: { id: item.id },
    });
  };

  return (
    <Pressable
      onPress={handleViewJob}
      className="bg-white dark:bg-black p-4 border-b border-gray-100 dark:border-gray-700"
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-row items-start gap-3 flex-1">
          <View className="w-10 h-10 rounded-lg bg-orange-500 items-center justify-center">
            <Ionicons
              name="briefcase"
              size={20}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold dark:bg-black dark:text-gray-100 mb-1">
              {item.name}
            </Text>
            {item.publishAt ? (
              <Text className="text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">
                Published{" "}
                {new Date(item.publishAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            ) : null}
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
      </View>

      <View className="flex-row items-center gap-1 mb-2">
        <Text className="text-sm font-medium dark:bg-black dark:text-gray-100">
          {companyName}
        </Text>
        <LocationText location={item.location} />
      </View>

      <View className="flex-row items-center gap-2 mb-2">
        <View className="flex-row items-center gap-1">
          <Ionicons name="briefcase-outline" size={14} color="#6B7280" />
          <Text className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {jobTypeObj[item.jobType || "FULL_TIME"]}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons name="cash-outline" size={14} color="#6B7280" />
          {item.wage ? (
            <Text className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {item.wage}{" "}
              {item.wageRate ? `/${item.wageRate.toLowerCase()}` : ""}
            </Text>
          ) : null}
        </View>
      </View>

      {item.hiringStatus === "URGENT" && (
        <View className="bg-orange-50 w-24 border border-orange-200 dark:bg-orange-900 dark:border-orange-700 rounded-lg px-3 py-2 mb-2">
          <Text className="text-sm font-medium text-orange-600 dark:text-orange-200 ">
            URGENT
          </Text>
        </View>
      )}

      {!(item.hiringStatus === "URGENT") && item.description && (
        <Text className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
          {item.description}
        </Text>
      )}
    </Pressable>
  );
}
