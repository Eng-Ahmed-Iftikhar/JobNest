import { CompanyProfile } from "../company";
import { Location } from "../user";

export interface SuggestedJobEmployerRef {
  id: string;
  jobId: string;
  employerId: string;
  employer?: {
    id: string;
    emailId?: string;
    companyProfiles?: CompanyProfile[];
  };
}

export interface SuggestedJobResponseItem {
  id: string;
  name: string;
  address?: string;
  locationId?: string;
  description?: string;
  jobType?: string;
  wage?: string;
  wageRate?: string;
  currency?: string;
  hiringStatus?: string;
  workMode?: string;
  status?: string;
  publishAt?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  location?: Location;
  isSaved: boolean;
  isApplied: boolean;
  employers?: SuggestedJobEmployerRef[];
}

export interface SavedBy {
  id: string;
  jobId: string;
  employeeId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface SuggestedJobResponse {
  data: SuggestedJobResponseItem[];
  total: number;
  page: number;
  pageSize: number;
}
