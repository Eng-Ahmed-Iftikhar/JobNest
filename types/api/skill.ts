export interface CreateSkillRequest {
  name: string;
}

export interface CreateSkillResponse {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
