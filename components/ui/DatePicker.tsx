import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from "react-native";

type DatePickerProps = {
  label?: string;
  placeholder?: string;
  value?: string; // Format: YYYY-MM
  onChangeDate?: (date: string) => void;
  error?: string;
  isError?: boolean;
  editable?: boolean;
  minDate?: string; // Format: YYYY-MM
  maxDate?: string; // Format: YYYY-MM
};

function DatePicker({
  label,
  placeholder = "Select date",
  value,
  onChangeDate,
  error,
  isError = false,
  editable = true,
  minDate,
  maxDate,
}: DatePickerProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(
    value ? parseInt(value.split("-")[0]) : new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number | null>(
    value ? parseInt(value.split("-")[1]) : null
  );

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 60 }, (_, i) => currentYear - i);

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const formatDate = (year: number, month: number): string => {
    return `${year}-${month.toString().padStart(2, "0")}`;
  };

  const parseDate = (
    dateStr: string
  ): { year: number; month: number } | null => {
    if (!dateStr) return null;
    const parts = dateStr.split("-");
    if (parts.length !== 2) return null;
    return {
      year: parseInt(parts[0]),
      month: parseInt(parts[1]),
    };
  };

  const isDateValid = (year: number, month: number): boolean => {
    const dateStr = formatDate(year, month);

    if (minDate) {
      if (dateStr < minDate) return false;
    }

    if (maxDate) {
      if (dateStr > maxDate) return false;
    }

    return true;
  };

  const handleConfirm = () => {
    if (selectedYear && selectedMonth) {
      if (isDateValid(selectedYear, selectedMonth)) {
        const formattedDate = formatDate(selectedYear, selectedMonth);
        onChangeDate?.(formattedDate);
        setShowModal(false);
      }
    }
  };

  const handleCancel = () => {
    // Reset to current value
    if (value) {
      const parsed = parseDate(value);
      if (parsed) {
        setSelectedYear(parsed.year);
        setSelectedMonth(parsed.month);
      }
    } else {
      setSelectedYear(currentYear);
      setSelectedMonth(null);
    }
    setShowModal(false);
  };

  const getDisplayValue = () => {
    if (value) {
      const parsed = parseDate(value);
      if (parsed) {
        const monthName = months.find((m) => m.value === parsed.month)?.label;
        return `${monthName} ${parsed.year}`;
      }
    }
    return placeholder;
  };

  const isMonthDisabled = (month: number): boolean => {
    if (!selectedYear) return false;
    return !isDateValid(selectedYear, month);
  };

  return (
    <View className="flex-1">
      {label && (
        <Text className="text-sm font-medium font-normal text-gray-600 mb-1">
          {label}
        </Text>
      )}
      <TouchableOpacity
        onPress={() => editable && setShowModal(true)}
        className={`border rounded-lg px-4 py-3 ${
          isError ? "border-red-500" : "border-gray-300"
        } ${!editable ? "bg-gray-100" : "bg-white"}`}
        disabled={!editable}
      >
        <Text className={`text-base ${value ? "text-black" : "text-gray-400"}`}>
          {getDisplayValue()}
        </Text>
      </TouchableOpacity>
      {isError && error && (
        <Text className="text-red-500 text-sm font-medium mt-1">{error}</Text>
      )}

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center"
          onPress={handleCancel}
        >
          <Pressable
            className="bg-white rounded-lg w-11/12 max-h-4/5"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="p-4">
              <Text className="text-lg font-bold text-center mb-4">
                Select Date
              </Text>

              <View className="flex-row gap-4 mb-4">
                {/* Year Selector */}
                <View className="flex-1">
                  <Text className="text-sm font-medium font-medium mb-2">
                    Year
                  </Text>
                  <FlatList
                    data={years}
                    keyExtractor={(item) => item.toString()}
                    className="border border-gray-300 rounded-lg max-h-48"
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => setSelectedYear(item)}
                        className={`p-3 border-b border-gray-200 ${
                          selectedYear === item ? "bg-azure-radiance-100" : ""
                        }`}
                      >
                        <Text
                          className={`text-center ${
                            selectedYear === item
                              ? "text-azure-radiance-500 font-bold"
                              : "text-gray-700"
                          }`}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                    initialScrollIndex={years.findIndex(
                      (y) => y === selectedYear
                    )}
                    getItemLayout={(data, index) => ({
                      length: 48,
                      offset: 48 * index,
                      index,
                    })}
                  />
                </View>

                {/* Month Selector */}
                <View className="flex-1">
                  <Text className="text-sm font-medium font-medium mb-2">
                    Month
                  </Text>
                  <FlatList
                    data={months}
                    keyExtractor={(item) => item.value.toString()}
                    className="border border-gray-300 rounded-lg max-h-48"
                    renderItem={({ item }) => {
                      const disabled = isMonthDisabled(item.value);
                      return (
                        <TouchableOpacity
                          onPress={() =>
                            !disabled && setSelectedMonth(item.value)
                          }
                          disabled={disabled}
                          className={`p-3 border-b border-gray-200 ${
                            selectedMonth === item.value
                              ? "bg-azure-radiance-100"
                              : disabled
                                ? "bg-gray-100"
                                : ""
                          }`}
                        >
                          <Text
                            className={`text-center ${
                              selectedMonth === item.value
                                ? "text-azure-radiance-500 font-bold"
                                : disabled
                                  ? "text-gray-400"
                                  : "text-gray-700"
                            }`}
                          >
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
              </View>

              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={handleCancel}
                  className="flex-1 bg-gray-200 py-3 rounded-lg"
                >
                  <Text className="text-center text-gray-700 font-medium">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleConfirm}
                  disabled={
                    !selectedYear ||
                    !selectedMonth ||
                    !isDateValid(selectedYear, selectedMonth)
                  }
                  className={`flex-1 py-3 rounded-lg ${
                    selectedYear &&
                    selectedMonth &&
                    isDateValid(selectedYear, selectedMonth)
                      ? "bg-azure-radiance-500"
                      : "bg-gray-300"
                  }`}
                >
                  <Text className="text-center text-white font-medium">
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

export default DatePicker;
