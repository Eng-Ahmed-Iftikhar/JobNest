import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "@/components/ui/BottomSheet";

type EmploymentType = {
  name: string;
  label: string;
};

type CompanyJobsFiltersProps = {
  visible: boolean;
  onClose: () => void;
  selectedEmploymentTypes: string[];
  onApplyFilters: (selectedTypes: string[]) => void;
};

const EMPLOYMENT_TYPES: EmploymentType[] = [
  { name: "FULL_TIME", label: "Full time" },
  { name: "PART_TIME", label: "Part time" },
  { name: "CONTRACT", label: "Contract" },
  { name: "INTERNSHIP", label: "Internship" },
];

export default function CompanyJobsFilters({
  visible,
  onClose,
  selectedEmploymentTypes,
  onApplyFilters,
}: CompanyJobsFiltersProps) {
  const [localSelectedTypes, setLocalSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    if (visible) {
      setLocalSelectedTypes(selectedEmploymentTypes);
    }
  }, [visible, selectedEmploymentTypes]);

  const toggleFilter = (filter: string) => {
    if (localSelectedTypes.includes(filter)) {
      setLocalSelectedTypes(localSelectedTypes.filter((f) => f !== filter));
    } else {
      setLocalSelectedTypes([...localSelectedTypes, filter]);
    }
  };

  const handleApplyFilters = () => {
    onApplyFilters(localSelectedTypes);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Filters">
      <View className="py-4">
        <View className="px-4 mb-6">
          <Text className="text-sm font-medium text-gray-900 mb-3">
            Employment type
          </Text>
          {EMPLOYMENT_TYPES.map((type) => (
            <Pressable
              key={type.name}
              onPress={() => toggleFilter(type.name)}
              className="flex-row items-center justify-between py-3 border-b border-gray-100"
            >
              <Text className="text-sm font-medium text-gray-700">
                {type.label}
              </Text>
              <View
                className={`w-5 h-5 rounded border-2 items-center justify-center ${
                  localSelectedTypes.includes(type.name)
                    ? "bg-azure-radiance-500 border-azure-radiance-500"
                    : "border-gray-300"
                }`}
              >
                {localSelectedTypes.includes(type.name) && (
                  <Ionicons name="checkmark" size={14} color="white" />
                )}
              </View>
            </Pressable>
          ))}
        </View>

        <View className="px-4">
          <Pressable
            onPress={handleApplyFilters}
            className="bg-azure-radiance-500 py-3 rounded-lg items-center"
          >
            <Text className="text-white font-semibold">Apply Filters</Text>
          </Pressable>
        </View>
      </View>
    </BottomSheet>
  );
}
