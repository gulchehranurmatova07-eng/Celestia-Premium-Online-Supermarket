"use client";

import { useRef, useState } from "react";

export function ImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError("");
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    setUploading(false);
    if (!res.ok) {
      setError("Yuklashda xatolik yuz berdi.");
      return;
    }
    const data = await res.json();
    onChange(data.url);
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy-900/70">Mahsulot rasmi</label>
      <div className="flex items-center gap-4">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-navy-900/12 bg-cream-200">
          {value ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={value} alt="preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl text-navy-900/20">🖼️</div>
          )}
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded-full border border-navy-900/15 px-4 py-2 text-xs font-semibold text-navy-900 hover:bg-cream-100 disabled:opacity-50"
          >
            {uploading ? "Yuklanmoqda..." : "Rasm yuklash"}
          </button>
          {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
