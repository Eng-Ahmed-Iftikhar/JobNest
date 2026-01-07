import React from "react";
import JobDetailContent from "@/sections/job-detail/JobDetailContent";
import { useLocalSearchParams } from "expo-router";

export default function JobDetailScreen() {
  const params = useLocalSearchParams();
  const jobId = typeof params.id === "string" ? params.id : undefined;

  return <JobDetailContent jobId={jobId} />;
}
