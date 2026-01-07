export interface FileUploadRequest {
  file: any; // File object from document picker or image picker
  fileType: "document" | "image";
  folderPath?: string; // Optional folder path
  customFilename?: string; // Optional custom filename
}

// Define the file upload response
export interface FileUploadResponse {
  id: string;
  originalName: string;
  fileType: string;
  mimeType: string;
  size: number;
  url: string;
  path: string;
  uploadedAt: string;
  uploadedBy: string;
}
