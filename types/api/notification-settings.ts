export interface NotificationSettingsResponse {
  id: string;
  profileId: string;
  jobInterviewScheduledSystem: boolean;
  jobInterviewScheduledEmail: boolean;
  connectionRequestSystem: boolean;
  connectionRequestEmail: boolean;
  newJobOpeningSystem: boolean;
  newJobOpeningEmail: boolean;
  interviewReminderSystem: boolean;
  interviewReminderEmail: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateNotificationSettingsRequest {
  jobInterviewScheduledSystem: boolean;
  jobInterviewScheduledEmail: boolean;
  connectionRequestSystem: boolean;
  connectionRequestEmail: boolean;
  newJobOpeningSystem: boolean;
  newJobOpeningEmail: boolean;
  interviewReminderSystem: boolean;
  interviewReminderEmail: boolean;
}
