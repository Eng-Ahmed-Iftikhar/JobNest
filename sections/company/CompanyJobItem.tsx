import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SuggestedJobResponseItem } from "@/api/services/jobsApi";
import { jobTypeObj } from "@/utils/constants";
import JobCardMenuIcon from "@/sections/dashboard/jobCardMenuIcon";

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

  const handleViewJob = () => {
    router.push({
      pathname: "/(dashboard)/(tabs)/job-detail",
      params: { id: item.id },
    });
  };

  return (
    <Pressable
      onPress={handleViewJob}
      className="bg-white p-4 border-b border-gray-100"
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-row items-start gap-3 flex-1">
          <View className="w-10 h-10 rounded-lg bg-orange-500 items-center justify-center">
            <Ionicons name="briefcase" size={20} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-900 mb-1">
              {item.name}
            </Text>
            {item.publishAt ? (
              <Text className="text-sm font-medium text-gray-500 mb-1">
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
            jobId={item.id}
            jobTitle={item.name}
            jobCompany={{ id: companyId, name: companyName }}
          />
        </View>
      </View>

      <View className="flex-row items-center gap-1 mb-2">
        <Text className="text-sm font-medium text-gray-900">{companyName}</Text>
        <Text className="text-sm font-medium text-gray-500">
          {item.location
            ? `• ${item.location.city || ""}${item.location.state ? ", " + item.location.state : ""}${item.location.country ? ", " + item.location.country : ""}`
            : null}
        </Text>
      </View>

      <View className="flex-row items-center gap-2 mb-2">
        <View className="flex-row items-center gap-1">
          <Ionicons name="briefcase-outline" size={14} color="#6B7280" />
          <Text className="text-sm font-medium text-gray-600">
            {jobTypeObj[item.jobType || "FULL_TIME"]}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons name="cash-outline" size={14} color="#6B7280" />
          {item.wage ? (
            <Text className="text-sm font-medium text-gray-600">
              {item.wage}{" "}
              {item.wageRate ? `/${item.wageRate.toLowerCase()}` : ""}
            </Text>
          ) : null}
        </View>
      </View>

      {item.hiringStatus === "URGENT" && (
        <View className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 mb-2">
          <Text className="text-sm font-medium text-orange-600">URGENT</Text>
        </View>
      )}

      {!(item.hiringStatus === "URGENT") && item.description && (
        <Text className="text-sm font-medium text-gray-600 mb-2">
          {item.description}
        </Text>
      )}
    </Pressable>
  );
}
