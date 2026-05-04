import type { Clip } from "../types";
import ClipCard from "./ClipCard";

interface ClipsGridProps {
  clips: Clip[];
  onReset: () => void;
}

export default function ClipsGrid({ clips, onReset }: ClipsGridProps) {
  const avgScore = Math.round(clips.reduce((s, c) => s + (c.score ?? 0), 0) / clips.length);
  const topClip = [...clips].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0];

  const handleDownloadAll = async () => {
    // Download clips one by one with a small delay between each
    for (let i = 0; i < clips.length; i++) {
      const clip = clips[i];
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          const a = document.createElement("a");
          a.href = clip.video_url;
          a.download = `clip_${i + 1}_${clip.title?.replace(/[^a-z0-9]/gi, "_").toLowerCase() ?? "clip"}.mp4`;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          resolve();
        }, i * 600);
      });
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Results Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {clips.length} Clip{clips.length !== 1 ? "s" : ""} Generated
          </h2>
          <p className="mt-1 text-sm text-white/40">
            Ready to download · Avg virality score:{" "}
            <span className="font-semibold text-purple-400">{avgScore}</span>
            {topClip && (
              <> · Top clip: <span className="font-semibold text-white">{topClip.title}</span></>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadAll}
            className="flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2.5 text-sm font-semibold text-purple-300 transition hover:border-purple-500/60 hover:bg-purple-500/20 hover:text-white"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download All
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/60 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            New Video
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Clips Ready", value: clips.length.toString(), icon: "🎬" },
          { label: "Avg Score", value: `${avgScore}%`, icon: "📊" },
          { label: "Format", value: "9:16 MP4", icon: "📱" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 text-center"
          >
            <div className="text-xl">{stat.icon}</div>
            <div className="mt-1 text-lg font-bold text-white">{stat.value}</div>
            <div className="text-[10px] font-medium uppercase tracking-wider text-white/30">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Clips Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {clips
          .slice()
          .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
          .map((clip, i) => (
            <ClipCard key={`${clip.video_url}-${i}`} clip={clip} index={i} />
          ))}
      </div>
    </div>
  );
}
