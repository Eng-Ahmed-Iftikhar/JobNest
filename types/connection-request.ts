import { Nullable } from "./global";
import { Profile } from "./user";

/** ===== Connection Request ===== */
export interface ConnectionRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: CONNECTION_REQUEST_STATUS;
  createdAt: string;
  updatedAt: string;
  deletedAt: Nullable<string>;
  sender?: { profile: Profile };
  receiver?: { profile: Profile };
}

export enum CONNECTION_REQUEST_STATUS {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}
