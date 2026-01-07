import { Follower } from "../follower";

export interface CompanyFollowersResponse {
  data: Follower[];
  page: number;
  pageSize: number;
  total: number;
}

export interface CompanyFollowersRequest {
  params: {
    page: number;
    pageSize: number;
    search?: string;
  };
}
