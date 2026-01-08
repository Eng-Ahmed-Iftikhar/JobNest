import AppLoader from "@/components/AppLoader";
import Tabs from "@/components/ui/Tabs";
import { Slot, usePathname } from "expo-router";
import React, { Suspense, useMemo } from "react";
import { View } from "react-native";

export default function JobLayout() {
  const pathname = usePathname();
  const path = pathname || "";

  const activeKey = useMemo(() => {
    const appliedSuffix = "/jobs/applied";
    const savedSuffix = "/jobs/saved";

    if (path.slice(-appliedSuffix.length) === appliedSuffix) return "applied";
    if (path.slice(-savedSuffix.length) === savedSuffix) return "saved";
    return "suggested";
  }, [path]);

  const items = [
    {
      key: "suggested",
      label: "Suggested jobs",
      href: "/(dashboard)/(tabs)/jobs",
    },
    {
      key: "applied",
      label: "Applied",
      href: "/(dashboard)/(tabs)/jobs/applied",
    },
    { key: "saved", label: "Saved", href: "/(dashboard)/(tabs)/jobs/saved" },
  ];

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        items={items}
        activeKey={activeKey}
        className="px-4  bg-white border-b border-gray-200 "
      />

      <Suspense fallback={<AppLoader />}>
        <Slot />
      </Suspense>
    </View>
  );
}
