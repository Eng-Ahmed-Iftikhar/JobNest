import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 10,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems || 0);

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  return (
    <View className="items-center py-4">
      {/* Page Numbers */}
      <View className="flex-row items-center gap-2 mb-3">
        <Pressable
          onPress={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 items-center justify-center"
        >
          <Ionicons
            name="chevron-back"
            size={18}
            color={currentPage === 1 ? "#D1D5DB" : "#6B7280"}
          />
        </Pressable>

        {renderPageNumbers().map((page, index) => (
          <View key={index}>
            {page === "..." ? (
              <Text className="text-gray-400 px-2">...</Text>
            ) : (
              <Pressable
                onPress={() => onPageChange(page as number)}
                className={`w-8 h-8 rounded-lg items-center justify-center ${
                  currentPage === page
                    ? "bg-azure-radiance-500"
                    : "bg-white border border-gray-200"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    currentPage === page ? "text-white" : "text-gray-700"
                  }`}
                >
                  {page}
                </Text>
              </Pressable>
            )}
          </View>
        ))}

        <Pressable
          onPress={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 items-center justify-center"
        >
          <Ionicons
            name="chevron-forward"
            size={18}
            color={currentPage === totalPages ? "#D1D5DB" : "#6B7280"}
          />
        </Pressable>
      </View>

      {/* Items Info */}
      {totalItems && (
        <Text className="text-sm font-medium text-gray-500">
          Showing {startItem}-{endItem} of {totalItems}
        </Text>
      )}
    </View>
  );
}
