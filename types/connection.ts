import { ConnectionRequest } from "./connection-request";
import { Nullable } from "./global";

export enum CONNECTIONS_TABS {
  CONNECTIONS = "CONNECTIONS",
  FOLLOWING = "FOLLOWING",
  PENDING = "PENDING",
}

export enum PENDING_CONNECTIONS_TABS {
  INBOUND = "INBOUND",
  OUTBOUND = "OUTBOUND",
}
// list of keys of CONNECTIONS_TABS
export type TabKeys = Array<keyof typeof CONNECTIONS_TABS>;

export type ConnectionsTab = {
  key: CONNECTIONS_TABS;
  label: string;
  path: string;
  name: string[] | string;
};

export type PendingConnectionsTab = {
  key: PENDING_CONNECTIONS_TABS;
  label: string;
  path: string;
};

/** ===== Root ===== */
export interface Connection {
  id: string;
  connectionRequestId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: Nullable<string>;
  connectionRequest?: ConnectionRequest;
}
