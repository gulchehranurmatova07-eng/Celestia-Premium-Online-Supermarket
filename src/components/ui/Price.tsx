import { formatSum } from "@/lib/format";

export function Price({
  price,
  oldPrice,
  size = "md",
}: {
  price: number;
  oldPrice?: number | null;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: { price: "text-sm", old: "text-xs" },
    md: { price: "text-base", old: "text-xs" },
    lg: { price: "text-2xl", old: "text-sm" },
  }[size];

  return (
    <div className="flex items-baseline gap-2">
      <span className={`font-display font-semibold text-navy-900 ${sizes.price}`}>{formatSum(price)}</span>
      {oldPrice && oldPrice > price && (
        <span className={`text-navy-900/40 line-through ${sizes.old}`}>{formatSum(oldPrice)}</span>
      )}
    </div>
  );
}
