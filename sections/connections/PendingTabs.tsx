import { useAppSelector } from "@/hooks/useAppSelector";
import {
  PENDING_CONNECTIONS_TABS,
  PendingConnectionsTab,
} from "@/types/connection";
import React, { useCallback } from "react";
import { ScrollView, View } from "react-native";
import TabButton from "./TabButton";

import { selectConnectionRequests } from "@/store/reducers/connectionRequestSlice";
import { usePathname, useRouter } from "expo-router";
import { selectUser } from "@/store/reducers/userSlice";

const pendingTabs: PendingConnectionsTab[] = [
  {
    key: PENDING_CONNECTIONS_TABS.INBOUND,
    label: "Inbound",
    path: "/connections/pending/inbound",
  },
  {
    key: PENDING_CONNECTIONS_TABS.OUTBOUND,
    label: "Outbound",
    path: "/connections/pending/outbound",
  },
];

function PendingConnectionsTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const connectionRequests = useAppSelector(selectConnectionRequests);

  const handleTabPress = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );
  const inboundCount = connectionRequests.filter(
    (request) => request.receiverId === user?.id
  ).length;
  const outboundCount = connectionRequests.filter(
    (request) => request.senderId === user?.id
  ).length;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingInline: 16 }}
    >
      <View className="flex-row items-center ">
        {pendingTabs.map((pendingTab) => {
          let count = 0;
          switch (pendingTab.key) {
            case PENDING_CONNECTIONS_TABS.INBOUND:
              count = inboundCount;
              break;
            case PENDING_CONNECTIONS_TABS.OUTBOUND:
              count = outboundCount;
              break;
            default:
              count = 0;
          }

          const isActive = pathname === pendingTab.path;

          return (
            <TabButton
              key={pendingTab.key}
              label={pendingTab.label}
              count={count}
              active={isActive}
              onPress={handleTabPress.bind(null, pendingTab.path)}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}

export default PendingConnectionsTabs;
