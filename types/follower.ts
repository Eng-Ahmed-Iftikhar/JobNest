import { Company } from "./company";
import { Profile } from "./user";

export interface Follower {
  id: string;
  companyId: string;
  followerId: string;
  company?: Company;
  createdAt: string;
  folowwer?: {
    profile: Profile;
  };
  updatedAt: string;
  deletedAt: string | null;
}
