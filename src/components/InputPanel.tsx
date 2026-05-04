import { useState, useRef, useCallback } from "react";
import type { InputMode } from "../types";
import { isValidYouTubeURL, extractYouTubeID } from "../api";

interface InputPanelProps {
  onSubmit: (input: { youtubeUrl: string } | { file: File }) => void;
  disabled: boolean;
}

export default function InputPanel({ onSubmit, disabled }: InputPanelProps) {
  const [mode, setMode] = useState<InputMode>("youtube");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const youtubePreviewId = youtubeUrl && isValidYouTubeURL(youtubeUrl)
    ? extractYouTubeID(youtubeUrl)
    : null;

  const handleUrlChange = (val: string) => {
    setYoutubeUrl(val);
    setUrlError("");
  };

  const handleFileChange = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("video/")) {
      setUrlError("Please select a valid video file (MP4, MOV, AVI, etc.)");
      return;
    }
    if (f.size > 2 * 1024 * 1024 * 1024) {
      setUrlError("File is too large. Maximum allowed size is 2 GB.");
      return;
    }
    setUrlError("");
    setFile(f);
    const objectUrl = URL.createObjectURL(f);
    setPreviewUrl(objectUrl);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFileChange(droppedFile);
    },
    [] // eslint-disable-line
  );

  const handleSubmit = () => {
    if (mode === "youtube") {
      const trimmed = youtubeUrl.trim();
      if (!trimmed) {
        setUrlError("Please enter a YouTube URL.");
        return;
      }
      if (!isValidYouTubeURL(trimmed)) {
        setUrlError(
          "Invalid YouTube URL. Accepted formats: youtube.com/watch?v=..., youtu.be/..., youtube.com/shorts/..."
        );
        return;
      }
      onSubmit({ youtubeUrl: trimmed });
    } else {
      if (!file) {
        setUrlError("Please select or drop a video file.");
        return;
      }
      onSubmit({ file });
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Mode Switcher */}
      <div className="flex rounded-xl border border-white/10 bg-white/5 p-1">
        <button
          onClick={() => { setMode("youtube"); setUrlError(""); }}
          disabled={disabled}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
            mode === "youtube"
              ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-900/30"
              : "text-white/50 hover:text-white"
          }`}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          YouTube URL
        </button>
        <button
          onClick={() => { setMode("upload"); setUrlError(""); }}
          disabled={disabled}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
            mode === "upload"
              ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-900/30"
              : "text-white/50 hover:text-white"
          }`}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Upload Video
        </button>
      </div>

      {/* YouTube Input */}
      {mode === "youtube" && (
        <div className="space-y-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
              <svg className="h-4 w-4 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !disabled && handleSubmit()}
              disabled={disabled}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/20 outline-none transition focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50"
            />
          </div>

          {/* YouTube Preview */}
          {youtubePreviewId && (
            <div className="overflow-hidden rounded-xl border border-white/10">
              <div className="relative aspect-video w-full">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubePreviewId}`}
                  title="YouTube preview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
              <div className="flex items-center gap-2 border-t border-white/10 bg-white/5 px-4 py-2">
                <div className="h-2 w-2 rounded-full bg-green-400" />
                <span className="text-xs text-white/50">Video preview loaded — ready to generate clips</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* File Upload */}
      {mode === "upload" && (
        <div className="space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => !disabled && fileInputRef.current?.click()}
            className={`relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-all ${
              isDragging
                ? "border-purple-400 bg-purple-500/10"
                : file
                ? "border-green-500/40 bg-green-500/5"
                : "border-white/10 bg-white/[0.02] hover:border-purple-500/40 hover:bg-white/5"
            } ${disabled ? "pointer-events-none opacity-50" : ""}`}
          >
            {file ? (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                  <svg className="h-6 w-6 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-white">{file.name}</p>
                  <p className="text-xs text-white/40">
                    {(file.size / (1024 * 1024)).toFixed(1)} MB · {file.type}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setFile(null); setPreviewUrl(null); }}
                  className="text-xs text-white/30 underline hover:text-white/60"
                >
                  Remove file
                </button>
              </>
            ) : (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <svg className="h-7 w-7 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82V15.18a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-white/70">
                    {isDragging ? "Drop video here" : "Drag & drop or click to select"}
                  </p>
                  <p className="mt-1 text-xs text-white/30">MP4, MOV, AVI, MKV · Max 2 GB</p>
                </div>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            />
          </div>

          {/* Video Preview */}
          {previewUrl && (
            <div className="overflow-hidden rounded-xl border border-white/10">
              <video
                src={previewUrl}
                controls
                className="w-full max-h-60 bg-black"
              />
              <div className="flex items-center gap-2 border-t border-white/10 bg-white/5 px-4 py-2">
                <div className="h-2 w-2 rounded-full bg-green-400" />
                <span className="text-xs text-white/50">Video loaded locally — ready to upload and process</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {urlError && (
        <div className="flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
          <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-sm text-red-300">{urlError}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={disabled}
        className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 py-4 text-sm font-semibold text-white shadow-lg shadow-purple-900/40 transition-all hover:shadow-purple-900/60 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Generate Viral Clips
        </span>
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      </button>
    </div>
  );
}
