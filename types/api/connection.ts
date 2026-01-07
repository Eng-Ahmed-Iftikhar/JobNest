import { Connection } from "../connection";

export interface GetConnectionsResponse {
  data: Connection[];
  total: number;
  page: number;
  pageSize: number;
}

export interface GetConnectionsRequest {
  params: { page: number; pageSize: number; search?: string };
}
