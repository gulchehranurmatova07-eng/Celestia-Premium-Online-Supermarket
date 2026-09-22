"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/Toast";

export function DeleteButton({
  url,
  confirmText,
  onSuccess,
}: {
  url: string;
  confirmText: string;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const { show } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function confirm() {
    setLoading(true);
    const res = await fetch(url, { method: "DELETE" });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error === "has_products" ? `Ushbu kategoriyada ${data.count} ta mahsulot bor.` : "O‘chirishda xatolik.");
      return;
    }
    setOpen(false);
    show("O‘chirildi.");
    onSuccess?.();
    router.refresh();
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-red-500 transition hover:text-red-600" aria-label="delete">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div onClick={() => setOpen(false)} className="absolute inset-0 bg-navy-950/50" />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <p className="text-navy-900">{confirmText}</p>
            {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
            <div className="mt-5 flex gap-3">
              <button
                onClick={confirm}
                disabled={loading}
                className="flex-1 rounded-full bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
              >
                {loading ? "..." : "Ha, o‘chirish"}
              </button>
              <button onClick={() => setOpen(false)} className="flex-1 rounded-full border border-navy-900/15 py-2.5 text-sm font-medium text-navy-900">
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
