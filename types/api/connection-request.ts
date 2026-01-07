import { ConnectionRequest } from "../user";

export interface ConnectionRequestsResponse {
  data: ConnectionRequest[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateConnectionRequestPayload {
  receiverId: string;
}

export interface CreateConnectionRequestResponse {
  message: string;
  request: ConnectionRequest;
}
