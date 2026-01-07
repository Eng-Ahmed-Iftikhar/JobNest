import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLazyGetSuggestedJobsQuery } from "@/api/services/jobsApi";
import JobCard from "@/sections/dashboard/JobCard";
import { useRouter } from "expo-router";
import { SuggestedJobResponseItem } from "@/types/api/job";

interface RelatedJobsProps {
  currentJob: SuggestedJobResponseItem;
  limit?: number;
}

export default function RelatedJobs({
  currentJob,
  limit = 3,
}: RelatedJobsProps) {
  const router = useRouter();
  const [trigger, { data, isFetching }] = useLazyGetSuggestedJobsQuery();
  const [loaded, setLoaded] = useState(false);

  const employerId = currentJob?.employers?.[0]?.employerId;
  const companyName =
    currentJob?.employers?.[0]?.employer?.companyProfiles?.[0]?.name;

  useEffect(() => {
    // Prefetch a page of suggested jobs to derive related ones.
    trigger({ page: 1, pageSize: 20 })
      .unwrap()
      .finally(() => setLoaded(true));
  }, [trigger]);

  const relatedJobs: SuggestedJobResponseItem[] = useMemo(() => {
    const list = data?.data ?? [];
    if (!employerId) return [];
    return list
      .filter((j) => j.id !== currentJob.id)
      .filter((j) =>
        (j.employers || []).some((e) => e.employerId === employerId)
      )
      .slice(0, limit);
  }, [data, employerId, currentJob?.id, limit]);

  if (!loaded && isFetching) return null;
  if (!relatedJobs.length) return null;

  return (
    <View className="px-4 mt-2 mb-6">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-lg font-bold text-gray-900">
          {companyName ? `Jobs at ${companyName}` : "Related jobs"}
        </Text>
        <Pressable
          onPress={() => router.push("/(dashboard)/(tabs)/jobs")}
          className="flex-row items-center"
        >
          <Text className="text-azure-radiance-500 font-semibold text-sm mr-1">
            See all jobs
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#1eadff" />
        </Pressable>
      </View>

      {relatedJobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </View>
  );
}
