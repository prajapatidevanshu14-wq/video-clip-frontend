import Logo from "./Logo";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#0d0d14]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Logo />
        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400 sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
            AI-Powered
          </span>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-white/50 transition-colors hover:text-white"
          >
            How it works
          </a>
        </div>
      </div>
    </header>
  );
}
