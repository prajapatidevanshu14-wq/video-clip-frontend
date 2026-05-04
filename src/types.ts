export interface Clip {
  title: string;
  video_url: string;
  duration: string;
  score: number;
}

export type InputMode = "youtube" | "upload";

export type ProcessingStage =
  | "idle"
  | "uploading"
  | "processing"
  | "receiving"
  | "done"
  | "error";

export interface AppError {
  type: "network" | "upload" | "invalid_url" | "server" | "unknown";
  message: string;
  detail?: string;
}
