import { SearchCompany, SearchJob, SearchUser } from "@/types/search";
import { useSearchQuery } from "@/api/services/searchApi";
import React, { createContext, ReactNode, useCallback, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

export interface SearchContextType {
  searchQuery: string;
  location: string;
  searchText: string;
  jobs: SearchJob[];
  jobsCount: number;
  employees: SearchUser[];
  employeesCount: number;
  companies: SearchCompany[];
  companiesCount: number;
  isSearching: boolean;
  setSearchQuery: (query: string) => void;
  setSearchText: (text: string) => void;
  setLocation: (location: string) => void;
  clearSearch: () => void;
}

export const SearchContext = createContext<SearchContextType | undefined>(
  undefined
);

interface SearchProviderProps {
  children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchText, setSearchText] = useState<string>("");
  const [location, setLocation] = useState("Austin,TX");
  const debouncedSearchText = useDebounce(searchText, 500);

  const queryResult = useSearchQuery(
    {
      text: debouncedSearchText,
      ...(location ? { location } : {}),
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !debouncedSearchText,
    }
  );
  const isSearching = queryResult.isFetching;
  // Hide previous data while fetching to avoid stale display
  const data = isSearching ? undefined : queryResult.data;

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setLocation("Austin, TX");
  }, []);

  const value: SearchContextType = {
    searchQuery,
    location,
    searchText,
    jobs: data?.jobs.data || [],
    jobsCount: data?.jobs.total || 0,
    employees: data?.employees.data || [],
    employeesCount: data?.employees.total || 0,
    companies: data?.companies.data || [],
    companiesCount: data?.companies.total || 0,
    isSearching,
    setSearchQuery,
    setSearchText,
    setLocation,
    clearSearch,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}
