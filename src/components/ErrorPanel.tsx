import type { AppError } from "../types";

interface ErrorPanelProps {
  error: AppError;
  onRetry: () => void;
  onReset: () => void;
}

const errorIcons: Record<AppError["type"], React.ReactNode> = {
  network: (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1018 0 9 9 0 00-18 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.93 4.93l14.14 14.14" />
    </svg>
  ),
  upload: (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12" />
    </svg>
  ),
  invalid_url: (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="currentColor" strokeWidth={1.5} />
    </svg>
  ),
  server: (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8m-4-4v4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v.01M12 11v.01" />
    </svg>
  ),
  unknown: (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
    </svg>
  ),
};

const errorTips: Record<AppError["type"], string[]> = {
  network: [
    "Make sure the backend server is running.",
    "Check that VITE_BACKEND_URL is set correctly in your .env file.",
    "Verify there are no CORS issues on the backend (allow all origins or your frontend origin).",
    "Try pinging the backend URL directly in your browser.",
  ],
  upload: [
    "Try a smaller video file (under 500 MB if possible).",
    "Check available disk space on the server.",
    "Ensure the backend accepts multipart/form-data uploads.",
  ],
  invalid_url: [
    "Paste the full YouTube URL including https://",
    "Supported formats: youtube.com/watch?v=... · youtu.be/... · youtube.com/shorts/...",
    "Make sure the video is public, not private or unlisted.",
  ],
  server: [
    "Check server logs for more detail.",
    "Ensure the backend /process-video endpoint is implemented and active.",
    "Verify the server has enough resources (RAM/CPU) to process the video.",
  ],
  unknown: [
    "Try refreshing the page.",
    "Check browser console for more detail.",
  ],
};

export default function ErrorPanel({ error, onRetry, onReset }: ErrorPanelProps) {
  const tips = errorTips[error.type] ?? errorTips.unknown;
  const icon = errorIcons[error.type] ?? errorIcons.unknown;

  return (
    <div className="flex flex-col items-center gap-6 py-4 text-center">
      {/* Icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400">
        {icon}
      </div>

      {/* Message */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">Something went wrong</h3>
        <p className="text-sm font-medium text-red-300">{error.message}</p>
        {error.detail && (
          <div className="mx-auto mt-2 max-w-sm rounded-lg border border-white/5 bg-white/[0.03] p-3 text-left">
            <p className="text-xs font-mono text-white/40 break-all">{error.detail}</p>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="w-full max-w-sm rounded-xl border border-amber-500/15 bg-amber-500/5 p-4 text-left">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Troubleshooting tips
        </p>
        <ul className="space-y-1.5">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-white/50">
              <span className="mt-0.5 text-amber-500/60">›</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-900/30 transition hover:brightness-110"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white/60 transition hover:border-white/20 hover:text-white"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
