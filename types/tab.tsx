import { Ionicons } from "@expo/vector-icons";

export enum TabNames {
  JOBS = "jobs",
  CONNECTIONS = "connections",
  MESSAGES = "messages",
  SEARCH_SUGGESTIONS = "search-suggestions",
  JOB_DETAIL = "job-detail",
  PROFILE = "profile",
  PROFILE_DETAIL = "profile-detail",
  COMPANY_DETAIL = "company-detail",
}

export type Tab = {
  name: TabNames;
  title: string;
  href?: string;
  icon?: typeof Ionicons.glyphMap;
};
