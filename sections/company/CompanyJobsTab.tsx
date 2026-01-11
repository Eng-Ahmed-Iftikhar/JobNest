import { useGetCompanyJobsQuery } from "@/api/services/companyApi";
import { SuggestedJobResponseItem } from "@/api/services/jobsApi";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import CompanyJobItem from "./CompanyJobItem";
import CompanyJobsFilters from "./CompanyJobsFilters";

const PAGE_SIZE = 10;

interface CompanyJobsTabProps {
  companyId: string;
  companyName: string;
}

export default function CompanyJobsTab({
  companyId,
  companyName,
}: CompanyJobsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const colorScheme = useColorScheme();
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<
    string[]
  >([]);

  const [page, setPage] = useState(1);
  const [data, setData] = useState<SuggestedJobResponseItem[]>([]);

  const { data: jobsData, isFetching } = useGetCompanyJobsQuery({
    companyId,
    page,
    pageSize: PAGE_SIZE,
  });

  const filteredJobs = useMemo(() => {
    return data.filter((job) => {
      const matchesSearch = job.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesEmploymentType =
        selectedEmploymentTypes.length === 0 ||
        selectedEmploymentTypes.some(
          (type) =>
            type.toLowerCase().includes(job.jobType?.toLowerCase() || "") ||
            job.jobType?.toLowerCase().includes(type.toLowerCase())
        );
      return matchesSearch && matchesEmploymentType;
    });
  }, [data, searchQuery, selectedEmploymentTypes]);

  const toggleFilter = (filter: string) => {
    if (selectedEmploymentTypes.includes(filter)) {
      setSelectedEmploymentTypes(
        selectedEmploymentTypes.filter((f) => f !== filter)
      );
    } else {
      setSelectedEmploymentTypes([...selectedEmploymentTypes, filter]);
    }
  };

  const dataPage = jobsData?.page || 1;
  const dataPageSize = jobsData?.pageSize || PAGE_SIZE;
  const dataTotal = jobsData?.total || 0;

  const handleEndReached = useCallback(() => {
    if (dataPage * dataPageSize >= dataTotal) return;
    setPage((prev) => prev + 1);
  }, [dataPage, dataPageSize, dataTotal]);

  useEffect(() => {
    if (jobsData?.data) {
      if (page === 1) {
        setData(jobsData.data);
      } else {
        setData((prev) => [...prev, ...jobsData.data]);
      }
    }
  }, [jobsData, page]);

  // Rendering moved to CompanyJobItem component

  const renderEmptyJobs = () => (
    <View className="flex-1 items-center justify-center py-16">
      <View className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full items-center justify-center mb-4">
        <Ionicons name="briefcase-outline" size={40} color="#9CA3AF" />
      </View>
      <Text className="text-base font-medium dark:text-gray-100 text-black">
        No jobs found
      </Text>
    </View>
  );

  return (
    <View className="flex-1">
      {/* Search and Filter Bar */}
      <View className="bg-white dark:bg-black px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex-row items-center gap-3">
        <View className="flex-1 flex-row items-center bg-white dark:bg-gray-800 rounded-lg px-3 h-10">
          <Ionicons
            name="search"
            size={18}
            color={colorScheme === "dark" ? "white" : "gray"}
          />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search jobs"
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-2 text-sm font-medium bg-white dark:bg-gray-800 dark:text-gray-100"
          />
        </View>
        <Pressable
          onPress={() => setShowFilters(true)}
          className="w-10 h-10 items-center justify-center bg-white dark:bg-gray-800 rounded-lg relative"
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={colorScheme === "dark" ? "white" : "gray"}
          />
          {selectedEmploymentTypes.length > 0 && (
            <View className="absolute top-1 right-1 w-2 h-2 bg-azure-radiance-500 rounded-full" />
          )}
        </Pressable>
      </View>

      {/* Jobs Count */}
      <View className="bg-white dark:bg-black px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <Text className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {filteredJobs.length} jobs found
        </Text>
      </View>

      {/* Jobs List */}

      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CompanyJobItem
            item={item}
            companyId={companyId}
            companyName={companyName}
          />
        )}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          isFetching ? (
            <View className="py-4 items-center">
              <Text className="text-gray-500 dark:text-gray-300">
                Loading more jobs…
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={renderEmptyJobs()}
        className="flex-1 bg-gray-50 dark:bg-black"
      />

      {/* Filter Component */}
      <CompanyJobsFilters
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        selectedEmploymentTypes={selectedEmploymentTypes}
        onApplyFilters={(selectedTypes) => {
          setSelectedEmploymentTypes(selectedTypes);
        }}
      />
    </View>
  );
}
