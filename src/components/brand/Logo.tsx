import Link from "next/link";

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M40 8C27.8 8 18 17.8 18 30s9.8 22 22 22c3.4 0 6.6-.8 9.5-2.1C43.6 52.9 36 56 27.7 56 13.5 56 2 44.5 2 30.3S13.5 4.6 27.7 4.6c8.3 0 15.9 3.1 21.8 8.1C46.6 8.8 43.4 8 40 8Z"
        fill="var(--color-navy-900, #0b1e3d)"
      />
      <path
        d="M34 26c3.5 3 5.5 7.3 5.5 12 0 3.6-1.2 6.9-3.2 9.6 6.7-1.6 11.7-7.6 11.7-14.8 0-4.7-2.1-8.9-5.5-11.7-2.9.6-5.9 2.2-8.5 4.9Z"
        fill="var(--color-gold-500, #c9a04f)"
      />
      <path
        d="M50 10l1.8 4.6L56.4 16l-4.6 1.8L50 22.4l-1.8-4.6L43.6 16l4.6-1.4L50 10Z"
        fill="var(--color-gold-500, #c9a04f)"
      />
    </svg>
  );
}

export function Logo({
  className = "",
  markClassName = "h-9 w-9",
  showTagline = false,
  href = "/",
}: {
  className?: string;
  markClassName?: string;
  showTagline?: boolean;
  href?: string | null;
}) {
  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark className={markClassName} />
      <div className="flex flex-col leading-none">
        <span className="font-display text-[1.4rem] font-semibold tracking-tight text-navy-900">
          Celestia
        </span>
        {showTagline && (
          <span className="mt-0.5 text-[0.6rem] font-medium uppercase tracking-[0.25em] text-gold-600">
            Supermarket
          </span>
        )}
      </div>
    </div>
  );

  if (href === null) return content;
  return (
    <Link href={href} aria-label="Celestia — bosh sahifa">
      {content}
    </Link>
  );
}
