import { Nullable } from "./global";

export enum SocialProvider {
  EMAIL = "EMAIL",
  GOOGLE = "GOOGLE",
  FACEBOOK = "FACEBOOK",
  LINKEDIN = "LINKEDIN",
  GITHUB = "GITHUB",
}

export type Location = {
  city: string;
  state: string;
  country: string;
  id: string;
};

export type UserPhoneNumber = {
  id: string;
  profileId: string;
  phoneNumberId: string;
  phoneNumber: PhoneNumber;
  createdAt: string;
  updatedAt: string;
  deletedAt: Nullable<string>;
};

export type PhoneNumber = {
  countryCode: string;
  number: string;
  isVerified: boolean;
};

export enum USER_ROLE {
  EMPLOYER = "EMPLOYER",
  EMPLOYEE = "EMPLOYEE",
}

export type User = {
  id: string;
  email: UserEmail;
  password?: string; // Optional for social logins
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Profile = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  isOnboarded: boolean;
  role: USER_ROLE;
  locationId: string;
  location?: Location;
  address: string;
  pictureUrl: string;
  bio: string;
  resumeUrl: string | null;
  userPhoneNumbers: UserPhoneNumber[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
export interface UserEmail {
  email: string;
  isVerified: boolean;
  provider: SocialProvider;
}

export type FollowedCompany = {
  id: string;
  name: string;
  address?: string;
  location?: Location;
  pictureUrl?: string;
};
