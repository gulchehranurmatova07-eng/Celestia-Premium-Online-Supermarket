export function SimplePage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="mb-6 font-display text-3xl font-semibold text-navy-900">{title}</h1>
      <div className="space-y-4 text-[15px] leading-relaxed text-navy-900/70">{children}</div>
    </div>
  );
}
