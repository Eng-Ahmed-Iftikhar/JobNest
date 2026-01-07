import React, { useState } from "react";
import { View, Text, Pressable, TextInput, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Pagination from "@/components/Pagination";

type TabKey = "connections" | "mutual";

interface Connection {
  id: string;
  name: string;
  location: string;
  color: string;
  isConnected: boolean;
}

const mockConnections: Connection[] = Array.from({ length: 120 }, (_, i) => ({
  id: `${i + 1}`,
  name: "Jimmy White",
  location: "Austin, TX",
  color: ["#38bdf8", "#f97316", "#ec4899", "#a855f7"][i % 4],
  isConnected: i % 2 === 0,
}));

interface ConnectionsListProps {
  userId?: string;
  connectionsCount: number;
  mutualConnectionsCount: number;
}

export default function ConnectionsList({
  userId,
  connectionsCount,
  mutualConnectionsCount,
}: ConnectionsListProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("connections");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredConnections = mockConnections.filter((conn) =>
    activeTab === "connections" ? true : conn.isConnected
  );

  const totalPages = Math.ceil(filteredConnections.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedConnections = filteredConnections.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleConnect = (connectionId: string) => {
    console.log("Connect with:", connectionId);
  };

  const handleMessage = (connectionId: string) => {
    console.log("Message:", connectionId);
  };

  const handleViewProfile = (connectionId: string) => {
    router.push({
      pathname: "/(dashboard)/(tabs)/profile-detail",
      params: { id: connectionId },
    });
  };

  const renderConnectionItem = ({ item }: { item: Connection }) => (
    <Pressable
      className="flex-row items-center gap-3 py-3 px-4 border-b border-gray-100"
      onPress={() => handleViewProfile(item.id)}
    >
      <View
        className="w-12 h-12 rounded-full items-center justify-center"
        style={{ backgroundColor: item.color }}
      >
        <Ionicons name="person" size={24} color="white" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900">
          {item.name}
        </Text>
        <Text className="text-sm font-medium text-gray-600">
          {item.location}
        </Text>
      </View>
      {activeTab === "connections" ? (
        <Pressable
          onPress={() => handleConnect(item.id)}
          className="px-4 py-2 rounded-lg bg-azure-radiance-50 border border-azure-radiance-200 flex-row items-center gap-1"
        >
          <Ionicons name="person-add" size={16} color="#1eadff" />
          <Text className="text-sm font-medium font-semibold text-azure-radiance-500">
            Connect
          </Text>
        </Pressable>
      ) : (
        <>
          <Pressable
            onPress={() => handleMessage(item.id)}
            className="px-4 py-2 rounded-lg bg-azure-radiance-50 border border-azure-radiance-200 flex-row items-center gap-1"
          >
            <Ionicons name="chatbubble" size={16} color="#1eadff" />
            <Text className="text-sm font-medium font-semibold text-azure-radiance-500">
              Message
            </Text>
          </Pressable>
          <Pressable className="p-2">
            <Ionicons name="ellipsis-vertical" size={18} color="#9CA3AF" />
          </Pressable>
        </>
      )}
    </Pressable>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Tab Navigation */}
      <View className="flex-row border-b border-gray-200 bg-white px-4">
        <Pressable
          onPress={() => {
            setActiveTab("connections");
            setCurrentPage(1);
          }}
          className="mr-8 py-3 flex-row items-center gap-2"
        >
          <Text
            className={`text-sm font-medium font-semibold ${
              activeTab === "connections"
                ? "text-azure-radiance-500"
                : "text-gray-600"
            }`}
          >
            Connections
          </Text>
          <View
            className={`px-2 py-0.5 rounded-full ${
              activeTab === "connections"
                ? "bg-azure-radiance-500"
                : "bg-gray-200"
            }`}
          >
            <Text
              className={`text-sm font-medium font-semibold ${
                activeTab === "connections" ? "text-white" : "text-gray-600"
              }`}
            >
              {connectionsCount}
            </Text>
          </View>
          {activeTab === "connections" && (
            <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-azure-radiance-500" />
          )}
        </Pressable>

        <Pressable
          onPress={() => {
            setActiveTab("mutual");
            setCurrentPage(1);
          }}
          className="py-3 flex-row items-center gap-2"
        >
          <Text
            className={`text-sm font-medium font-semibold ${
              activeTab === "mutual"
                ? "text-azure-radiance-500"
                : "text-gray-600"
            }`}
          >
            Mutual connections
          </Text>
          <View
            className={`px-2 py-0.5 rounded-full ${
              activeTab === "mutual" ? "bg-azure-radiance-500" : "bg-gray-200"
            }`}
          >
            <Text
              className={`text-sm font-medium font-semibold ${
                activeTab === "mutual" ? "text-white" : "text-gray-600"
              }`}
            >
              {mutualConnectionsCount}
            </Text>
          </View>
          {activeTab === "mutual" && (
            <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-azure-radiance-500" />
          )}
        </Pressable>
      </View>

      {/* Search Bar */}
      <View className="px-4 py-3 bg-white border-b border-gray-100">
        <View className="flex-row items-center bg-gray-50 rounded-lg px-3 h-10">
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search"
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-2 text-sm font-medium text-gray-900"
          />
        </View>
      </View>

      {/* Connections List */}
      <View className="flex-1 bg-white">
        <FlatList
          data={paginatedConnections}
          keyExtractor={(item) => item.id}
          renderItem={renderConnectionItem}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={filteredConnections.length}
              itemsPerPage={itemsPerPage}
            />
          }
        />
      </View>
    </View>
  );
}
