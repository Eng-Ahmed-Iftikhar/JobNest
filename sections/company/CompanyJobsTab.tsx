import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, TextInput, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SuggestedJobResponseItem } from "@/api/services/jobsApi";
import { useGetCompanyJobsQuery } from "@/api/services/companyApi";
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

  // View job is handled inside CompanyJobItem

  const handleEndReached = useCallback(() => {
    if (jobsData?.data.length === 0) return;

    setPage((prev) => prev + 1);
  }, [jobsData, page]);

  useEffect(() => {
    if (jobsData?.data) {
      if (page === 1) {
        setData(jobsData.data);
      } else {
        setData((prev) => [...prev, ...jobsData.data]);
      }
    }
  }, [jobsData]);

  // Rendering moved to CompanyJobItem component

  const renderEmptyJobs = () => (
    <View className="flex-1 items-center justify-center py-16">
      <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
        <Ionicons name="briefcase-outline" size={40} color="#9CA3AF" />
      </View>
      <Text className="text-base font-medium text-gray-900">No jobs found</Text>
    </View>
  );

  return (
    <View className="flex-1">
      {/* Search and Filter Bar */}
      <View className="bg-white px-4 py-3 border-b border-gray-100 flex-row items-center gap-3">
        <View className="flex-1 flex-row items-center bg-gray-50 rounded-lg px-3 h-10">
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search jobs"
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-2 text-sm font-medium text-gray-900"
          />
        </View>
        <Pressable
          onPress={() => setShowFilters(true)}
          className="w-10 h-10 items-center justify-center bg-gray-50 rounded-lg relative"
        >
          <Ionicons name="options-outline" size={20} color="#374151" />
          {selectedEmploymentTypes.length > 0 && (
            <View className="absolute top-1 right-1 w-2 h-2 bg-azure-radiance-500 rounded-full" />
          )}
        </Pressable>
      </View>

      {/* Jobs Count */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <Text className="text-sm font-medium text-gray-600">
          {filteredJobs.length} jobs found
        </Text>
      </View>

      {/* Jobs List */}
      {filteredJobs.length ? (
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
                <Text className="text-gray-500">Loading more jobs…</Text>
              </View>
            ) : null
          }
          className="flex-1 bg-gray-50"
        />
      ) : (
        renderEmptyJobs()
      )}

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
