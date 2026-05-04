import { useState } from "react";

interface BackendConfigProps {
  backendUrl: string;
  onSave: (url: string) => void;
}

export default function BackendConfig({ backendUrl, onSave }: BackendConfigProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(backendUrl);

  const handleSave = () => {
    const cleaned = draft.replace(/\/+$/, ""); // strip trailing slash
    onSave(cleaned);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/60 transition hover:border-purple-500/40 hover:bg-white/10 hover:text-white"
        title="Configure backend URL"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
        </svg>
        API Config
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-96 rounded-xl border border-white/10 bg-[#13131f] p-4 shadow-2xl shadow-black/50">
          <h3 className="mb-1 text-sm font-semibold text-white">Backend API URL</h3>
          <p className="mb-3 text-xs text-white/40">
            Set this to your backend server URL. The app will POST to{" "}
            <code className="rounded bg-white/10 px-1 py-0.5 text-purple-300">/process-video</code>
          </p>
          <input
            type="url"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="https://your-backend.com"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30"
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 py-2 text-xs font-semibold text-white transition hover:from-violet-500 hover:to-purple-500"
            >
              Save & Close
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-white/50 transition hover:text-white"
            >
              Cancel
            </button>
          </div>
          <p className="mt-3 text-[10px] text-white/25">
            Tip: You can also set{" "}
            <code className="text-purple-400/70">VITE_BACKEND_URL</code> in your .env file.
          </p>
        </div>
      )}
    </div>
  );
}
