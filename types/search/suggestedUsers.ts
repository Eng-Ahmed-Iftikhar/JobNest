export interface SuggestedUser {
  id: string;
  name: string;
  location: string;
  mutualConnections: number;
  color: string;
}

export interface SuggestedUsersResponse {
  data: SuggestedUser[];
  total: number;
  page: number;
  pageSize: number;
}
