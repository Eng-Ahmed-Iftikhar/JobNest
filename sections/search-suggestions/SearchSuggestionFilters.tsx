import BottomSheet from "@/components/ui/BottomSheet";
import React, { useState } from "react";
import { View } from "react-native";
import { Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type SearchSuggestionFiltersProps = {
  show: boolean;
  onClose: () => void;
};

function SearchSuggestionFilters({
  show,
  onClose,
}: SearchSuggestionFiltersProps) {
  const [sheetView, setSheetView] = useState<
    "root" | "employment" | "distance"
  >("root");
  const [distanceRange] = useState<[number, number]>([0, 5]);

  const [employmentTypes, setEmploymentTypes] = useState<{
    [key: string]: boolean;
  }>({
    fullTime: true,
    partTime: true,
    shift: false,
  });
  const sheetTitle =
    sheetView === "employment"
      ? "Employment type"
      : sheetView === "distance"
        ? "Distance"
        : "Filters";
  const clearFilters = () => {
    setEmploymentTypes({ fullTime: true, partTime: true, shift: false });
  };

  const toggleEmploymentType = (key: string) => {
    setEmploymentTypes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderFilterRoot = () => (
    <View>
      <Pressable
        className="flex-row items-center justify-between py-3"
        onPress={() => setSheetView("employment")}
      >
        <Text className="text-base text-gray-900">Employment type</Text>
        <View className="flex-row items-center gap-2">
          <Text className="text-sm font-medium text-gray-500">
            {Object.keys(employmentTypes)
              .filter((k) => employmentTypes[k])
              .map((k) =>
                k === "fullTime"
                  ? "Full time"
                  : k === "partTime"
                    ? "Part time"
                    : "Shift position"
              )
              .join(", ") || "Any"}
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </View>
      </Pressable>

      <Pressable
        className="flex-row items-center justify-between py-3"
        onPress={() => setSheetView("distance")}
      >
        <Text className="text-base text-gray-900">Distance</Text>
        <View className="flex-row items-center gap-2">
          <Text className="text-sm font-medium text-gray-500">{`${distanceRange[0]} - ${distanceRange[1]} mi`}</Text>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </View>
      </Pressable>
    </View>
  );

  const renderEmployment = () => (
    <View>
      {[
        { key: "fullTime", label: "Full time" },
        { key: "partTime", label: "Part time" },
        { key: "shift", label: "Shift position" },
      ].map((item) => (
        <Pressable
          key={item.key}
          className="flex-row items-center py-3"
          onPress={() => toggleEmploymentType(item.key)}
        >
          <Ionicons
            name={employmentTypes[item.key] ? "checkbox" : "square-outline"}
            size={22}
            color={employmentTypes[item.key] ? "#1eadff" : "#9CA3AF"}
            style={{ marginRight: 12 }}
          />
          <Text className="text-base text-gray-900">{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );

  const renderDistance = () => (
    <View className="gap-4">
      <View className="flex-row items-center gap-2">
        <View className="flex-row items-center gap-2 px-3 py-2 rounded-lg border border-gray-300">
          <Text className="text-base text-gray-900">0</Text>
        </View>
        <Text className="text-sm font-medium text-gray-500">-</Text>
        <View className="flex-row items-center gap-2 px-3 py-2 rounded-lg border border-gray-300">
          <Text className="text-base text-gray-900">5</Text>
        </View>
        <Text className="text-sm font-medium text-gray-500">mi</Text>
      </View>
      <View className="h-2 rounded-full bg-azure-radiance-100">
        <View className="h-2 rounded-full bg-azure-radiance-500 w-full" />
      </View>
    </View>
  );

  const renderSheetContent = () => {
    if (sheetView === "employment") {
      return renderEmployment();
    }
    if (sheetView === "distance") {
      return renderDistance();
    }
    return renderFilterRoot();
  };

  return (
    <BottomSheet
      visible={show}
      onClose={onClose}
      title={sheetTitle}
      onClear={sheetView === "root" ? clearFilters : undefined}
      footer={
        <Pressable
          className="bg-azure-radiance-500 h-12 rounded-xl items-center justify-center"
          onPress={onClose}
        >
          <Text className="text-white font-semibold text-base">
            Show results
          </Text>
        </Pressable>
      }
    >
      {sheetView !== "root" && (
        <Pressable
          className="flex-row items-center gap-2 mb-3"
          onPress={() => setSheetView("root")}
        >
          <Ionicons name="chevron-back" size={20} color="#6B7280" />
          <Text className="text-base text-gray-700">Back</Text>
        </Pressable>
      )}
      {renderSheetContent()}
    </BottomSheet>
  );
}

export default SearchSuggestionFilters;
