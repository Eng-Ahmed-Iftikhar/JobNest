import { useSearch } from "@/hooks/useSearch";
import PopluarSearch from "@/sections/search/PopluarSearch";
import SearchCompanies from "@/sections/search/SearchCompanies";
import SearchHeader from "@/sections/search/SearchHeader";
import SearchJobs from "@/sections/search/SearchJobs";
import SearchLoading from "@/sections/search/SearchLoading";
import SearchNoResults from "@/sections/search/SearchNoResults";
import SearchStartHint from "@/sections/search/SearchStartHint";
import SearchUsers from "@/sections/search/SearchUsers";
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

export default function Search() {
  const { employees, companies, jobs, searchText, isSearching } = useSearch();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
    >
      <SearchHeader />
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <PopluarSearch />
        {searchText !== "" ? (
          isSearching ? (
            <SearchLoading />
          ) : (
            <View className="flex-1">
              {employees.length === 0 &&
              companies.length === 0 &&
              jobs.length === 0 ? (
                <SearchNoResults searchText={searchText} />
              ) : (
                <View className="flex-1">
                  <SearchUsers />
                  <SearchCompanies />
                  <SearchJobs />
                </View>
              )}
            </View>
          )
        ) : (
          <SearchStartHint />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
