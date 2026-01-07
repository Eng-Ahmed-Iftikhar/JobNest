import { CONNECTIONS_TABS } from "@/types/connection";

export const jobTypeIconObj: { [key: string]: string } = {
  FULL_TIME: "briefcase",
  PART_TIME: "time",
  CONTRACT: "document-text",
  INTERNSHIP: "school",
};

export const jobTypeObj: { [key: string]: string } = {
  FULL_TIME: "Full time",
  PART_TIME: "Part time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

export const connectionsTabs: Record<CONNECTIONS_TABS, string> = {
  [CONNECTIONS_TABS.CONNECTIONS]: "connections",
  [CONNECTIONS_TABS.FOLLOWING]: "following",
  [CONNECTIONS_TABS.PENDING]: "pending",
};
