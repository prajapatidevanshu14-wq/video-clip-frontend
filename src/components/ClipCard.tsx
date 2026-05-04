import { useState, useRef } from "react";
import type { Clip } from "../types";

interface ClipCardProps {
  clip: Clip;
  index: number;
}

function ScoreRing({ score }: { score: number }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  const color =
    score >= 80
      ? "#a855f7"
      : score >= 60
      ? "#f59e0b"
      : "#6b7280";

  return (
    <div className="relative flex h-14 w-14 items-center justify-center">
      <svg className="-rotate-90 h-14 w-14" viewBox="0 0 44 44">
        {/* Track */}
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={3}
        />
        {/* Progress */}
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-white leading-none">{score}</span>
        <span className="text-[8px] text-white/40 uppercase tracking-wide">score</span>
      </div>
    </div>
  );
}

export default function ClipCard({ clip, index }: ClipCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => setVideoError(true));
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(clip.video_url);
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${clip.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: direct link download
      const a = document.createElement("a");
      a.href = clip.video_url;
      a.download = `clip_${index + 1}.mp4`;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setIsDownloading(false);
    }
  };

  const scoreLabel =
    clip.score >= 80 ? "🔥 High Viral" : clip.score >= 60 ? "⚡ Medium" : "📊 Standard";

  return (
    <div
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111118] transition-all duration-300 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-900/20"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Video Player — 9:16 aspect ratio */}
      <div className="relative w-full" style={{ paddingTop: "177.78%" /* 9:16 */ }}>
        <div className="absolute inset-0 bg-black">
          {videoError ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#0a0a12]">
              <svg className="h-10 w-10 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 9.5l-3.536 3.536M12 9.5V15m0-5.5a5 5 0 00-7.072 7.072" />
              </svg>
              <p className="text-xs text-white/30">Video unavailable</p>
              <a
                href={clip.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-purple-400 underline hover:text-purple-300"
              >
                Open directly →
              </a>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                src={clip.video_url}
                className="h-full w-full object-cover"
                preload="metadata"
                loop
                playsInline
                onEnded={() => setIsPlaying(false)}
                onError={() => setVideoError(true)}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

              {/* Play / Pause Button */}
              <button
                onClick={handlePlayPause}
                className="absolute inset-0 flex items-center justify-center"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/20 bg-black/50 backdrop-blur-sm transition-all duration-200 ${
                    isPlaying ? "opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100" : "opacity-100"
                  }`}
                >
                  {isPlaying ? (
                    <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6 translate-x-0.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  )}
                </div>
              </button>

              {/* Duration badge */}
              <div className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-0.5 backdrop-blur-sm">
                <span className="text-xs font-medium text-white">{clip.duration}</span>
              </div>

              {/* Index badge */}
              <div className="absolute top-3 left-3 rounded-md bg-black/70 px-2 py-1 backdrop-blur-sm">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/60">
                  Clip {index + 1}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Title */}
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white">
          {clip.title || `Clip ${index + 1}`}
        </h3>

        {/* Score + Stats row */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-medium uppercase tracking-wider text-white/30">
              Virality
            </span>
            <span className="text-xs font-semibold text-purple-300">{scoreLabel}</span>
          </div>
          <ScoreRing score={clip.score ?? 0} />
        </div>

        {/* Divider */}
        <div className="border-t border-white/5" />

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-900/30 transition-all hover:from-violet-500 hover:to-purple-500 hover:shadow-purple-900/50 disabled:cursor-wait disabled:opacity-70"
        >
          {isDownloading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Downloading...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download MP4
            </>
          )}
        </button>
      </div>
    </div>
  );
}
