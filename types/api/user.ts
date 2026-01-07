import { Connection } from "../connection";

// User list response types
export interface UserListEmail {
  id: string;
  email: string;
  isVerified: boolean;
  provider: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface UserListProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  isOnboarded: boolean;
  location: {
    id: string;
    city: string;
    state: string;
    country: string;
  };
  role: string;
  locationId: string | null;
  address: string | null;
  pictureUrl: string | null;
  bio: string | null;
  resumeUrl: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface UserListItem {
  id: string;
  password: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  emailId: string;
  email: UserListEmail;
  profile: UserListProfile;

  mutualConnections: number;
  connectionRequest: {
    id: string;
    senderId: string;
    receiverId: string;
  };
}

export interface UserListResponse {
  data: UserListItem[];
  total: number;
  page: number;
  pageSize: number;
}
// User-related types moved from userApi.ts
export interface UpdateGeneralInfoRequest {
  firstName: string;
  lastName: string;
  email?: string;
}

export interface UpdateLocationRequest {
  country: string;
  state: string;
  city: string;
  address: string;
}

export interface UpdatePhoneNumberRequest {
  countryCode: string;
  number: string;
  isVerified: boolean;
}

export interface CreatePhoneNumberRequest {
  countryCode: string;
  number: string;
}

export interface UpdateGeneralInfoResponse {
  id: string;
  email: any; // UserEmail
  profile: {
    firstName: string;
    lastName: string;
    role: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateLocationResponse {
  id: string;
  userId: string;
  location: {
    city: string;
    state: string;
    country: string;
    id: string;
  };
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePhoneNumberResponse {
  id: string;
  userId: string;
  profileId: string;
  phoneNumber: {
    countryCode: string;
    number: string;
    isVerified: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreatePhoneNumberResponse {
  id: string;
  userId: string;
  profileId: string;
  phoneNumber: {
    countryCode: string;
    number: string;
    isVerified: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateResumeRequest {
  resumeUrl: string;
  fileName: string;
}

export interface UpdateResumeResponse {
  id: string;
  userId: string;
  profileId: string;
  resumeUrl: string;
  fileName: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePictureRequest {
  pictureUrl: string;
}

export interface UpdateProfilePictureResponse {
  id: string;
  userId: string;
  profileId: string;
  pictureUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExperienceInput {
  position: string;
  company: string;
  startDate: string; // ISO string
  endDate?: string; // ISO string
  isCurrent?: boolean;
}

export interface EducationInput {
  school: string;
  degree: string;
  fieldOfStudy?: string;
  yearStarted: number;
  yearGraduated?: number;
  inProgress?: boolean;
}

export interface UpdateCvDetailsRequest {
  experiences?: ExperienceInput[];
  educations?: EducationInput[];
  skillIds?: string[];
  bio?: string;
  resumeUrl?: string;
}

export interface UpdateCvDetailsResponse {
  id: string;
  userId: string;
  experiences?: ExperienceInput[];
  educations?: EducationInput[];
  skillIds?: string[];
  bio?: string;
  resumeUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReauthenticateRequest {
  password: string;
}

export interface ReauthenticateResponse {
  isAuthenticated: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}
