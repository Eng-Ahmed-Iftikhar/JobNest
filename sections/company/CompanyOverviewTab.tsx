import React, { useMemo } from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SuggestedJobResponseItem } from "@/api/services/jobsApi";
import { CompanyDetail } from "@/api/services/companyApi";
import CompanyOverviewJobItem from "./CompanyOverviewJobItem";

interface CompanyOverviewTabProps {
  company: CompanyDetail;
  onSeeAllJobs: () => void;
  onSeeAllPosts: () => void;
  jobs: SuggestedJobResponseItem[];
  posts: any[];
}

export default function CompanyOverviewTab({
  company,
  onSeeAllJobs,
  onSeeAllPosts,
  jobs,
  posts,
}: CompanyOverviewTabProps) {
  const router = useRouter();
  const aboutText = company?.profile?.about || "No description provided.";
  const companyJobs = useMemo(() => jobs.slice(0, 3), [jobs]);
  const companyPosts = useMemo(() => posts.slice(0, 2), [posts]);

  const handleViewJob = (jobId: string) => {
    router.push({
      pathname: "/(dashboard)/(tabs)/job-detail",
      params: { id: jobId },
    });
  };

  return (
    <View className="flex-1">
      <View className="p-4">
        <Text className="text-lg font-bold text-gray-900 mb-3">About</Text>
        <Text className="text-sm font-medium text-gray-700 leading-6">
          {aboutText}
        </Text>
      </View>

      {/* Jobs Section */}
      <View className="border-t border-gray-100 p-4">
        <Text className="text-lg font-bold text-gray-900 mb-3">Jobs</Text>
        {companyJobs.length ? (
          <>
            {companyJobs.map((job) => (
              <CompanyOverviewJobItem
                key={job.id}
                item={job}
                companyId={company.id}
                companyName={company.name}
              />
            ))}
            {jobs.length > 3 && (
              <Pressable
                onPress={onSeeAllJobs}
                className="flex-row items-center justify-between py-3"
              >
                <Text className="text-sm font-medium text-azure-radiance-500">
                  See all jobs
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#1eadff" />
              </Pressable>
            )}
          </>
        ) : (
          <Text className="text-sm font-medium text-gray-600">
            No jobs available for this company yet.
          </Text>
        )}
      </View>

      {/* Posts Section */}
      <View className="border-t border-gray-100 p-4">
        <Text className="text-lg font-bold text-gray-900 mb-3">Posts</Text>
        {companyPosts.length ? (
          <>
            {companyPosts.map((post) => (
              <View key={post.id} className="mb-4">
                <View className="flex-row items-start gap-3 mb-3">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: post.authorAvatar || "#38bdf8" }}
                  >
                    <Ionicons name="person" size={20} color="white" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-900">
                      {post.authorName}
                    </Text>
                    <Text className="text-sm font-medium text-gray-500">
                      {post.timestamp}
                      {post.location ? ` • ${post.location}` : ""}
                    </Text>
                  </View>
                  <Pressable className="p-1">
                    <Ionicons name="share-outline" size={18} color="#6B7280" />
                  </Pressable>
                </View>
                {post.content ? (
                  <Text className="text-sm font-medium text-gray-700 mb-3">
                    {post.content}
                  </Text>
                ) : null}
              </View>
            ))}
            {posts.length > 2 && (
              <Pressable
                onPress={onSeeAllPosts}
                className="flex-row items-center justify-between py-3"
              >
                <Text className="text-sm font-medium text-azure-radiance-500">
                  See all posts
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#1eadff" />
              </Pressable>
            )}
          </>
        ) : (
          <Text className="text-sm font-medium text-gray-600">
            No posts from this company yet.
          </Text>
        )}
      </View>
    </View>
  );
}
