import Link from "next/link";

export function Pagination({
  page,
  pageCount,
  makeHref,
}: {
  page: number;
  pageCount: number;
  makeHref: (page: number) => string;
}) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1
  );

  return (
    <div className="mt-10 flex items-center justify-center gap-1.5">
      <Link
        href={makeHref(Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={`flex h-9 w-9 items-center justify-center rounded-full border border-navy-900/12 text-navy-900 ${page === 1 ? "pointer-events-none opacity-30" : "hover:bg-navy-900/5"}`}
      >
        ‹
      </Link>
      {pages.map((p, i) => (
        <span key={p} className="flex items-center">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="px-1 text-navy-900/30">…</span>}
          <Link
            href={makeHref(p)}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium ${
              p === page ? "bg-navy-900 text-white" : "text-navy-900 hover:bg-navy-900/5"
            }`}
          >
            {p}
          </Link>
        </span>
      ))}
      <Link
        href={makeHref(Math.min(pageCount, page + 1))}
        className={`flex h-9 w-9 items-center justify-center rounded-full border border-navy-900/12 text-navy-900 ${page === pageCount ? "pointer-events-none opacity-30" : "hover:bg-navy-900/5"}`}
      >
        ›
      </Link>
    </div>
  );
}
