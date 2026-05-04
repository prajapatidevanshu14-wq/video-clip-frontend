import type { ProcessingStage } from "../types";

interface ProcessingOverlayProps {
  stage: ProcessingStage;
}

const stages = [
  {
    key: "uploading",
    label: "Uploading video",
    description: "Sending your video to the processing server...",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    ),
  },
  {
    key: "processing",
    label: "AI processing",
    description: "Transcribing audio, detecting highlights and generating clips...",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
      </svg>
    ),
  },
  {
    key: "receiving",
    label: "Receiving clips",
    description: "Downloading your generated clips from the server...",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
  },
] as const;

const stageOrder: ProcessingStage[] = ["uploading", "processing", "receiving"];

export default function ProcessingOverlay({ stage }: ProcessingOverlayProps) {
  const currentIndex = stageOrder.indexOf(stage as "uploading" | "processing" | "receiving");

  return (
    <div className="flex flex-col items-center gap-10 py-8">
      {/* Central spinner */}
      <div className="relative flex h-28 w-28 items-center justify-center">
        {/* Outer ring */}
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-purple-500 border-r-fuchsia-500" style={{ animationDuration: "1.2s" }} />
        {/* Middle ring */}
        <div className="absolute inset-3 animate-spin rounded-full border-2 border-transparent border-t-violet-400 border-r-purple-400" style={{ animationDuration: "1.8s", animationDirection: "reverse" }} />
        {/* Inner pulse */}
        <div className="absolute inset-6 animate-pulse rounded-full bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30" />
        {/* Icon */}
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-lg shadow-purple-900/50">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <circle cx="6" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <line x1="20" y1="4" x2="8.12" y2="15.88" />
            <line x1="14.47" y1="14.48" x2="20" y2="20" />
            <line x1="8.12" y1="8.12" x2="12" y2="12" />
          </svg>
        </div>
      </div>

      {/* Stage list */}
      <div className="w-full max-w-sm space-y-3">
        {stages.map((s, i) => {
          const isDone = i < currentIndex;
          const isActive = i === currentIndex;

          return (
            <div
              key={s.key}
              className={`flex items-center gap-4 rounded-xl border px-4 py-3 transition-all ${
                isActive
                  ? "border-purple-500/40 bg-purple-500/10"
                  : isDone
                  ? "border-green-500/20 bg-green-500/5"
                  : "border-white/5 bg-white/[0.02] opacity-40"
              }`}
            >
              {/* Status indicator */}
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                  isActive
                    ? "bg-purple-500/20 text-purple-400"
                    : isDone
                    ? "bg-green-500/20 text-green-400"
                    : "bg-white/5 text-white/20"
                }`}
              >
                {isDone ? (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : isActive ? (
                  <div className="h-3.5 w-3.5">
                    <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </div>
                ) : (
                  <div className="h-2 w-2 rounded-full bg-white/20" />
                )}
              </div>

              <div className="min-w-0">
                <p className={`text-sm font-medium ${isActive ? "text-white" : isDone ? "text-green-300" : "text-white/30"}`}>
                  {s.label}
                </p>
                {isActive && (
                  <p className="mt-0.5 text-xs text-white/40 truncate">{s.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-white/25 max-w-xs">
        This may take 1–5 minutes depending on video length. Do not close this tab.
      </p>
    </div>
  );
}
