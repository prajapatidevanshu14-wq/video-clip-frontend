import { useState, useCallback } from "react";
import type { Clip, ProcessingStage, AppError } from "./types";
import Header from "./components/Header";
import InputPanel from "./components/InputPanel";
import ProcessingOverlay from "./components/ProcessingOverlay";
import ClipsGrid from "./components/ClipsGrid";
import ErrorPanel from "./components/ErrorPanel";
import HowItWorks from "./components/HowItWorks";
import BackendConfig from "./components/BackendConfig";

// ─── Default backend URL (override via VITE_BACKEND_URL env or in-app config) ─
const DEFAULT_BACKEND =
  (import.meta.env.VITE_BACKEND_URL as string) || "https://YOUR_BACKEND_URL";

export default function App() {
  const [stage, setStage] = useState<ProcessingStage>("idle");
  const [clips, setClips] = useState<Clip[]>([]);
  const [error, setError] = useState<AppError | null>(null);
  const [lastInput, setLastInput] = useState<{ youtubeUrl: string } | { file: File } | null>(null);
  const [backendUrl, setBackendUrl] = useState<string>(DEFAULT_BACKEND);

  const handleSubmit = useCallback(
    async (input: { youtubeUrl: string } | { file: File }) => {
      setLastInput(input);
      setError(null);
      setClips([]);
      setStage("uploading");

      try {
        // Temporarily override the module-level backend URL for this call
        // by patching the env variable is not possible at runtime, so we pass it through
        // the processVideo call via a workaround: build a custom fetch inside the call.
        const result = await processVideoWithUrl(input, backendUrl, (s) => setStage(s));
        setClips(result);
        setStage("done");
      } catch (err: unknown) {
        const appError: AppError =
          err && typeof err === "object" && "type" in err
            ? (err as AppError)
            : {
                type: "unknown",
                message: "An unexpected error occurred.",
                detail: String(err),
              };
        setError(appError);
        setStage("error");
      }
    },
    [backendUrl]
  );

  const handleRetry = () => {
    if (lastInput) handleSubmit(lastInput);
  };

  const handleReset = () => {
    setStage("idle");
    setClips([]);
    setError(null);
    setLastInput(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-radial from-purple-900/20 via-violet-900/5 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[500px] rounded-full bg-gradient-radial from-fuchsia-900/10 to-transparent blur-3xl" />
        <div className="absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full bg-gradient-radial from-indigo-900/10 to-transparent blur-3xl" />
      </div>

      <Header />

      <main className="relative mx-auto max-w-7xl px-4 pb-32 pt-28 sm:px-6 lg:px-8">

        {/* ── HERO ── */}
        {stage === "idle" && (
          <div className="flex flex-col items-center gap-16">
            {/* Hero copy */}
            <div className="max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-purple-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-400" />
                Powered by Whisper · FFmpeg · AI
              </div>
              <h1 className="text-5xl font-black leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
                Turn Long Videos into
                <br />
                <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Viral Clips
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg text-white/50">
                Paste a YouTube URL or upload a video. Our AI finds the best moments,
                crops to 9:16, burns in subtitles, and delivers ready-to-post clips.
              </p>
            </div>

            {/* Input card */}
            <div className="w-full max-w-2xl">
              <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-2xl shadow-black/50 backdrop-blur-sm">
                {/* Card header */}
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-white">Generate Clips</h2>
                    <p className="text-xs text-white/30">Upload or link · Takes 1–5 min</p>
                  </div>
                  <BackendConfig backendUrl={backendUrl} onSave={setBackendUrl} />
                </div>

                <InputPanel onSubmit={handleSubmit} disabled={false} />
              </div>

              {/* Backend URL hint */}
              {backendUrl.includes("YOUR_BACKEND_URL") && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-amber-500/15 bg-amber-500/5 px-4 py-2.5">
                  <svg className="h-4 w-4 flex-shrink-0 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-xs text-amber-300/80">
                    <strong className="text-amber-300">Backend not configured.</strong>{" "}
                    Click <span className="font-semibold">API Config</span> above to set your backend URL, or set{" "}
                    <code className="rounded bg-amber-500/10 px-1 text-amber-200">VITE_BACKEND_URL</code> in your .env file.
                  </p>
                </div>
              )}
            </div>

            {/* Social proof badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/25">
              {["TikTok-ready 9:16", "Auto subtitles", "Virality scoring", "Instant download", "MP4 output"].map((b) => (
                <span key={b} className="flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {b}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── PROCESSING ── */}
        {(stage === "uploading" || stage === "processing" || stage === "receiving") && (
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 shadow-2xl shadow-black/50 backdrop-blur-sm">
                <div className="mb-2 text-center">
                  <h2 className="text-lg font-bold text-white">Generating Your Clips</h2>
                  <p className="text-sm text-white/40">
                    {"youtubeUrl" in (lastInput ?? {}) && (lastInput as { youtubeUrl: string }).youtubeUrl
                      ? `Processing YouTube video…`
                      : lastInput && "file" in lastInput
                      ? `Processing ${(lastInput as { file: File }).file.name}…`
                      : "Processing…"}
                  </p>
                </div>
                <ProcessingOverlay stage={stage} />
              </div>
            </div>
          </div>
        )}

        {/* ── ERROR ── */}
        {stage === "error" && error && (
          <div className="flex justify-center">
            <div className="w-full max-w-lg">
              <div className="rounded-2xl border border-red-500/10 bg-white/[0.02] p-8 shadow-2xl shadow-black/50 backdrop-blur-sm">
                <ErrorPanel error={error} onRetry={handleRetry} onReset={handleReset} />
              </div>
            </div>
          </div>
        )}

        {/* ── RESULTS ── */}
        {stage === "done" && clips.length > 0 && (
          <ClipsGrid clips={clips} onReset={handleReset} />
        )}
      </main>

      {/* How it works section (only on idle) */}
      {stage === "idle" && <HowItWorks />}

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-8 text-center text-xs text-white/20">
        <p>ClipForge — AI Video Clip Generator · Frontend client · All processing done server-side</p>
      </footer>
    </div>
  );
}

// ─── Custom processVideo that accepts a runtime backendUrl ─────────────────────
async function processVideoWithUrl(
  input: { youtubeUrl: string } | { file: File },
  backendUrl: string,
  onProgress: (stage: "uploading" | "processing" | "receiving") => void
): Promise<Clip[]> {
  const endpoint = `${backendUrl.replace(/\/+$/, "")}/process-video`;
  const formData = new FormData();

  if ("youtubeUrl" in input) {
    formData.append("youtube_url", input.youtubeUrl);
  } else {
    formData.append("video", input.file, input.file.name);
  }

  onProgress("uploading");

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });
  } catch (err: unknown) {
    const appError: AppError = {
      type: "network",
      message: "Cannot reach the backend server.",
      detail:
        err instanceof TypeError
          ? `${err.message}. Ensure the backend is running at: ${endpoint} and CORS is enabled.`
          : `Unexpected network error. Backend URL: ${endpoint}`,
    };
    throw appError;
  }

  onProgress("receiving");

  if (!response.ok) {
    let detail = "";
    try {
      const body = await response.json();
      detail = body?.error || body?.message || body?.detail || JSON.stringify(body);
    } catch {
      detail = await response.text().catch(() => "");
    }
    const appError: AppError = {
      type: "server",
      message: `Server returned HTTP ${response.status} ${response.statusText}.`,
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
      message: "Server returned an invalid response (not valid JSON).",
      detail: "Expected a JSON array of clip objects from the backend.",
    };
    throw appError;
  }

  onProgress("processing");

  if (!Array.isArray(data)) {
    const appError: AppError = {
      type: "server",
      message: "Unexpected response format from server.",
      detail: `Expected a JSON array, got: ${typeof data}. Response: ${JSON.stringify(data).slice(0, 200)}`,
    };
    throw appError;
  }

  const clips = (data as Clip[]).filter(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      typeof item.video_url === "string" &&
      item.video_url.length > 0
  );

  if (clips.length === 0) {
    const appError: AppError = {
      type: "server",
      message: "No valid clips returned by the server.",
      detail:
        "The server responded with an empty array or objects missing required fields (video_url). " +
        `Raw response: ${JSON.stringify(data).slice(0, 300)}`,
    };
    throw appError;
  }

  return clips;
}
