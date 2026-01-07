import { SearchCompany, SearchJob, SearchUser } from "../search";

export interface SearchPayload {
  text: string;
  location?: string;
}

export interface SearchResponse {
  jobs: {
    data: SearchJob[];
    total: number;
  };
  employees: {
    data: SearchUser[];
    total: number;
  };
  companies: {
    data: SearchCompany[];
    total: number;
  };
}
