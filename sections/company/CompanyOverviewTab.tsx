import { useGetCompanyJobsQuery } from "@/api/services/companyApi";
import {} from "@/api/services/jobsApi";
import { Company } from "@/types/company";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import CompanyOverviewJobItem from "./CompanyOverviewJobItem";

interface CompanyOverviewTabProps {
  company: Company;
  onSeeAllJobs: () => void;
  onSeeAllPosts: () => void;
}

export default function CompanyOverviewTab({
  company,
  onSeeAllJobs,
  onSeeAllPosts,
}: CompanyOverviewTabProps) {
  const aboutText = company?.profile?.about || "No description provided.";

  const { data: jobs } = useGetCompanyJobsQuery(
    { companyId: company.id as string, page: 1, pageSize: 10 },
    { skip: !company }
  );
  const companyJobs = jobs?.data;
  const companyPosts = useMemo<any[]>(() => [], []);

  return (
    <View className="flex-1">
      <View className="p-4">
        <Text className="text-lg font-bold dark:bg-black dark:text-gray-100 mb-3">
          About
        </Text>
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-6">
          {aboutText}
        </Text>
      </View>

      {/* Jobs Section */}
      <View className="border-t border-gray-100 dark:border-gray-700 p-4">
        <Text className="text-lg font-bold dark:bg-black dark:text-gray-100 mb-3">
          Jobs
        </Text>
        {companyJobs?.length ? (
          <>
            {companyJobs.map((job) => (
              <CompanyOverviewJobItem
                key={job.id}
                item={job}
                companyId={company.id}
                companyName={company.name}
              />
            ))}
            {companyJobs.length > 3 && (
              <Pressable
                onPress={onSeeAllJobs}
                className="flex-row items-center justify-between py-3 mt-3"
              >
                <Text className="text-sm font-medium text-azure-radiance-500">
                  See all jobs
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#1eadff" />
              </Pressable>
            )}
          </>
        ) : (
          <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">
            No jobs available for this company yet.
          </Text>
        )}
      </View>

      {/* Posts Section */}
      <View className="border-t border-gray-100 dark:border-gray-700 p-4">
        <Text className="text-lg font-bold dark:bg-black dark:text-gray-100 mb-3">
          Posts
        </Text>
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
                    <Text className="text-sm font-medium dark:bg-black dark:text-gray-100">
                      {post.authorName}
                    </Text>
                    <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {post.timestamp}
                      {post.location ? ` • ${post.location}` : ""}
                    </Text>
                  </View>
                  <Pressable className="p-1">
                    <Ionicons name="share-outline" size={18} color="#6B7280" />
                  </Pressable>
                </View>
                {post.content ? (
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {post.content}
                  </Text>
                ) : null}
              </View>
            ))}
            {companyPosts.length > 2 && (
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
          <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">
            No posts from this company yet.
          </Text>
        )}
      </View>
    </View>
  );
}
