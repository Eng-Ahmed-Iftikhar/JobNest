import AppLoader from "@/components/AppLoader";
import Tabs from "@/components/ui/Tabs";
import SearchSuggestionFilterBtn from "@/sections/search-suggestions/SearchSuggestionFilterBtn";
import SearchSuggestionFilters from "@/sections/search-suggestions/SearchSuggestionFilters";
import { Slot, usePathname } from "expo-router";
import React, { Suspense, useMemo } from "react";
import { View } from "react-native";

export default function JobsTopTabsLayout() {
  const pathname = usePathname();
  const [filtersOpen, setFiltersOpen] = React.useState<boolean>(false);
  const activeKey = useMemo(() => {
    if (pathname?.endsWith("/search-suggestions")) return "jobs";
    if (pathname?.endsWith("/search-suggestions/companies")) return "companies";
    if (pathname?.endsWith("/search-suggestions/users")) return "users";
    return "jobs";
  }, [pathname]);

  const items = [
    {
      key: "jobs",
      label: "Suggested jobs",
      href: "/search-suggestions",
    },
    {
      key: "companies",
      label: "Companies",
      href: "/search-suggestions/companies",
    },
    { key: "users", label: "Users", href: "/search-suggestions/users" },
  ];

  return (
    <View className="flex-1  bg-gray-50">
      <View className="flex-row px-4 justify-between">
        <Tabs items={items} activeKey={activeKey} />
        <SearchSuggestionFilterBtn openFilters={() => setFiltersOpen(true)} />
      </View>

      <Suspense fallback={<AppLoader />}>
        <Slot />
      </Suspense>

      <SearchSuggestionFilters
        show={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      />
    </View>
  );
}
