export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 shadow-lg shadow-purple-900/40">
        {/* Scissors / clip icon */}
        <svg
          className="h-5 w-5 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="6" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <line x1="20" y1="4" x2="8.12" y2="15.88" />
          <line x1="14.47" y1="14.48" x2="20" y2="20" />
          <line x1="8.12" y1="8.12" x2="12" y2="12" />
        </svg>
        {/* Glow */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-400 to-fuchsia-600 opacity-0 blur-md transition-opacity group-hover:opacity-60" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-xl font-bold tracking-tight text-white">
          Clip<span className="text-purple-400">Forge</span>
        </span>
        <span className="text-[10px] font-medium uppercase tracking-widest text-white/40">
          AI Clip Generator
        </span>
      </div>
    </div>
  );
}
