import { useAppSelector } from "@/hooks/useAppSelector";
import { CONNECTIONS_TABS, ConnectionsTab } from "@/types/connection";
import React, { useCallback } from "react";
import { ScrollView, View } from "react-native";
import TabButton from "./TabButton";

import { selectConnectionRequestsCount } from "@/store/reducers/connectionRequestSlice";
import { selectConnectionsCount } from "@/store/reducers/connectionSlice";
import { usePathname, useRouter } from "expo-router";

const connectionsTabs: ConnectionsTab[] = [
  {
    key: CONNECTIONS_TABS.CONNECTIONS,
    label: "Connections",
    path: "/connections",
    name: ["connections"],
  },
  {
    key: CONNECTIONS_TABS.FOLLOWING,
    label: "Following",
    path: "/connections/following",
    name: ["following"],
  },
  {
    key: CONNECTIONS_TABS.PENDING,
    label: "Pending connections",
    path: "/connections/pending",
    name: ["inbound", "outbound"],
  },
];

function ConnectionsTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const connectionCounts = useAppSelector(selectConnectionsCount);
  const connectionRequestsCount = useAppSelector(selectConnectionRequestsCount);

  const handleTabPress = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: 16 }}
    >
      <View className="flex-row items-center">
        {connectionsTabs.map((connectionsTab) => {
          let count = 0;
          switch (connectionsTab.key) {
            case CONNECTIONS_TABS.CONNECTIONS:
              count = connectionCounts;
              break;
            case CONNECTIONS_TABS.FOLLOWING:
              count = 0;
              break;
            case CONNECTIONS_TABS.PENDING:
              count = connectionRequestsCount;
              break;
            default:
              count = 0;
          }
          const lastPath = pathname.split("/").pop() || "";
          let isActive = false;
          if (Array.isArray(connectionsTab.name)) {
            isActive = connectionsTab.name.includes(lastPath);
          } else {
            isActive = lastPath === connectionsTab.name;
          }

          return (
            <TabButton
              key={connectionsTab.key}
              label={connectionsTab.label}
              count={count}
              active={isActive}
              onPress={handleTabPress.bind(null, connectionsTab.path)}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}

export default ConnectionsTabs;
