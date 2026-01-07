import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ConnectionsList from "@/sections/profile/ConnectionsList";

interface ProfileDetailContentProps {
  userId?: string;
}

// Mock data - replace with actual API call
const mockProfile = {
  id: "1",
  name: "Clarence Williams",
  location: "Austin, TX",
  joinedDate: "Joined 13 Jan",
  connectionsCount: 26,
  mutualConnectionsCount: 4,
  isConnected: false,
  color: "#f97316",
  about: `Looking for an experienced Restaurant Manager. Professional mixologists dry ice icecream today's specials Aesop handwash food truck artisnal anything. No signs Heston Bloominthal enjoy your meal foraged greens nuts and berries pastry chef The Basrossa. Field to fork slowcooked the second sitting share plates biodynamic not another parfait this is cold let's have authentic street food. Craft beer drizzle we don't take reservations smoked everything tequilla and lime chicken fish tacos eat out cut brew coffee yuzu curd. Smoked anything organic kale hand roasted coffee beans throwback comfort food with a twist organic a la carte finger licking good locally sourced.`,
};

export default function ProfileDetailContent({
  userId,
}: ProfileDetailContentProps) {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(mockProfile.isConnected);
  const [showConnectionsList, setShowConnectionsList] = useState(false);

  const handleConnect = () => {
    setIsConnected(!isConnected);
  };

  const handleMessage = () => {
    router.push("/(dashboard)/(tabs)/messages");
  };

  if (showConnectionsList) {
    return (
      <ConnectionsList
        userId={userId}
        connectionsCount={mockProfile.connectionsCount}
        mutualConnectionsCount={mockProfile.mutualConnectionsCount}
      />
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="px-4 pt-4">
          {/* Profile Picture */}
          <View className="items-center mb-4">
            <View
              className="w-20 h-20 rounded-full items-center justify-center"
              style={{ backgroundColor: mockProfile.color }}
            >
              <Ionicons name="person" size={40} color="white" />
            </View>
          </View>

          {/* Name and Info */}
          <View className="items-center mb-2">
            <Text className="text-2xl font-bold text-gray-900 mb-1">
              {mockProfile.name}
            </Text>
            <Text className="text-base text-gray-600 mb-1">
              {mockProfile.location}
            </Text>
            <Text className="text-sm font-medium text-gray-500 mb-3">
              {mockProfile.joinedDate}
            </Text>

            {/* Connections */}
            <Pressable onPress={() => setShowConnectionsList(true)}>
              <Text className="text-sm font-medium">
                <Text className="font-semibold text-azure-radiance-500">
                  {mockProfile.connectionsCount} connections
                </Text>
                <Text className="text-gray-600"> • </Text>
                <Text className="font-semibold text-azure-radiance-500">
                  {mockProfile.mutualConnectionsCount} mutual connections
                </Text>
              </Text>
            </Pressable>
          </View>

          {/* Action Buttons */}
          <View className="flex-row items-center gap-3 mb-6">
            {isConnected ? (
              <>
                <TouchableOpacity
                  onPress={handleMessage}
                  className="flex-1 bg-azure-radiance-500 h-12 rounded-xl flex-row items-center justify-center gap-2"
                  activeOpacity={0.8}
                >
                  <Ionicons name="chatbubble" size={18} color="white" />
                  <Text className="text-white font-semibold text-base">
                    Message
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleConnect}
                  className="border-2 border-red-500 bg-white h-12 px-4 rounded-xl flex-row items-center justify-center gap-2"
                  activeOpacity={0.8}
                >
                  <Ionicons name="close" size={18} color="#EF4444" />
                  <Text className="text-red-500 font-semibold text-base">
                    Remove connection
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                onPress={handleConnect}
                className="flex-1 bg-azure-radiance-500 h-12 rounded-xl flex-row items-center justify-center gap-2"
                activeOpacity={0.8}
              >
                <Ionicons name="person-add" size={18} color="white" />
                <Text className="text-white font-semibold text-base">
                  Connect
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* About Section */}
          <View>
            <Text className="text-lg font-bold text-gray-900 mb-3">About</Text>
            <Text className="text-base text-gray-700 leading-6">
              {mockProfile.about}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
