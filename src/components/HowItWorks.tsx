const steps = [
  {
    step: "01",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    title: "Paste URL or Upload",
    desc: "Enter a YouTube link or upload your MP4/MOV file directly. Preview plays instantly.",
  },
  {
    step: "02",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
      </svg>
    ),
    title: "AI Analyses Content",
    desc: "Whisper transcribes audio. The AI detects high-energy moments and hooks for max virality.",
  },
  {
    step: "03",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <line x1="20" y1="4" x2="8.12" y2="15.88" />
        <line x1="14.47" y1="14.48" x2="20" y2="20" />
        <line x1="8.12" y1="8.12" x2="12" y2="12" />
      </svg>
    ),
    title: "Clips are Generated",
    desc: "FFmpeg crops to 9:16 vertical format, burns in captions, and packages each clip as an MP4.",
  },
  {
    step: "04",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    title: "Download & Post",
    desc: "Browse clips with virality scores, preview them, and download the best ones for TikTok, Reels & Shorts.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-white/[0.06] py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white">How ClipForge Works</h2>
          <p className="mt-2 text-white/40">Four steps from long video to viral shorts</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={i}
              className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition hover:border-purple-500/20 hover:bg-white/[0.04]"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute -right-3 top-10 hidden h-px w-6 bg-gradient-to-r from-white/10 to-transparent lg:block" />
              )}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/20 to-purple-600/20 text-purple-400">
                  {s.icon}
                </div>
                <span className="text-3xl font-black text-white/5">{s.step}</span>
              </div>
              <h3 className="mb-2 text-sm font-semibold text-white">{s.title}</h3>
              <p className="text-xs leading-relaxed text-white/40">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
