import type { Clip, AppError } from "./types";

// ─── CONFIGURE YOUR BACKEND URL HERE ──────────────────────────────────────────
// Replace this with your actual backend URL before deploying.
// Example: "https://api.myapp.com" or "http://localhost:8000"
const BACKEND_URL = "https://video-backend-mjx4.onrender.com";

export const API_ENDPOINT = `${BACKEND_URL}/process-video`;

// ─── YOUTUBE URL VALIDATOR ─────────────────────────────────────────────────────
export function isValidYouTubeURL(url: string): boolean {
  const patterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]{11}/,
    /^https?:\/\/youtu\.be\/[\w-]{11}/,
    /^https?:\/\/(www\.)?youtube\.com\/shorts\/[\w-]{11}/,
    /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]{11}/,
  ];
  return patterns.some((p) => p.test(url.trim()));
}

export function extractYouTubeID(url: string): string | null {
  const patterns = [
    /[?&]v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /\/shorts\/([\w-]{11})/,
    /\/embed\/([\w-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

// ─── API CALL ──────────────────────────────────────────────────────────────────
export async function processVideo(
  input: { youtubeUrl: string } | { file: File },
  onProgress: (stage: "uploading" | "processing" | "receiving") => void
): Promise<Clip[]> {
  const formData = new FormData();

  if ("youtubeUrl" in input) {
    formData.append("youtube_url", input.youtubeUrl);
  } else {
    formData.append("file", input.file);
  }

  onProgress("uploading");

  console.log("Sending file:", input.file)

  let response: Response;

  try {
    response = await fetch(API_ENDPOINT, {
      method: "POST",
      body: formData,
    });
  } catch (err: unknown) {
    // Network / CORS / backend unreachable
    const appError: AppError = {
      type: "network",
      message: "Cannot reach the backend server.",
      detail:
        err instanceof TypeError
          ? `Network error: ${err.message}. Make sure the backend is running and VITE_BACKEND_URL is set correctly.`
          : "An unexpected network error occurred.",
    };
    throw appError;
  }

  onProgress("receiving");

  if (!response.ok) {
    let detail = "";
    try {
      const body = await response.json();
      detail = body?.error || body?.message || JSON.stringify(body);
    } catch {
      detail = await response.text().catch(() => "");
    }

    const appError: AppError = {
      type: "server",
      message: `Server returned ${response.status} ${response.statusText}.`,
      detail: detail || "No additional detail from server.",
    };
    throw appError;
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    const appError: AppError = {
      type: "server",
      message: "Server returned an invalid response (not JSON).",
      detail: "Expected a JSON array of clip objects.",
    };
    throw appError;
  }

  if (!Array.isArray(data)) {
    const appError: AppError = {
      type: "server",
      message: "Unexpected response format from server.",
      detail: `Expected an array of clips, got: ${typeof data}`,
    };
    throw appError;
  }

  onProgress("processing");

  // Validate each clip object has required fields
  const clips = (data as Clip[]).filter((item) => {
    return (
      typeof item === "object" &&
      item !== null &&
      typeof item.video_url === "string" &&
      item.video_url.length > 0
    );
  });

  if (clips.length === 0) {
    const appError: AppError = {
      type: "server",
      message: "No clips were returned by the server.",
      detail:
        "The backend responded successfully but returned zero valid clip objects.",
    };
    throw appError;
  }

  return clips;
}
