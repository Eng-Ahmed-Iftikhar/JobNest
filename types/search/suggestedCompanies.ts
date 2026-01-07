export interface SuggestedCompanyLocation {
  id: string;
  city: string;
  state: string;
  country: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface SuggestedCompanyEmployerJob {
  id: string;
  jobId: string;
  employerId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  job: {
    id: string;
    name: string;
    address: string;
    locationId: string;
    description: string;
    jobType: string;
    workMode: string | null;
    wage: string;
    wageRate: string;
    currency: string;
    hiringStatus: string;
    status: string;
    publishAt: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
}

export interface SuggestedCompanyEmployer {
  id: string;
  password: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  emailId: string;
  employerJobs: SuggestedCompanyEmployerJob[];
}

export interface SuggestedCompanyProfile {
  id: string;
  employerId: string;
  companyId: string;
  locationId: string;
  address: string;
  status: string;
  websiteId: string;
  pictureUrl: string;
  about: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  location: SuggestedCompanyLocation;
  employer: SuggestedCompanyEmployer;
}

export interface SuggestedCompany {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  profile: SuggestedCompanyProfile;
}

export interface SuggestedCompaniesResponse {
  data: SuggestedCompany[];
  total: number;
  page: number;
  pageSize: number;
}
