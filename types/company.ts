import { Follower } from "./follower";
import { Location } from "./user";

export interface CompanyWebsite {
  id: string;
  url?: string;
  name?: string;
}
export interface CompanyProfile {
  id: string;
  employerId?: string;
  companyId?: string;
  locationId?: string;
  address: string;
  status: string;
  websiteId: string;
  website?: CompanyWebsite;
  pictureUrl?: string;
  about: string;
  location?: Location;
}

export interface Company {
  id: string;
  name: string;
  profile: CompanyProfile;
  followers?: Array<Follower>;
}
