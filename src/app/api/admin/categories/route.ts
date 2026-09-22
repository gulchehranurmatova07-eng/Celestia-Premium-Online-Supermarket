import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const auth = await requireAdmin(["SUPER_ADMIN", "PRODUCT_MANAGER"]);
  if (auth instanceof NextResponse) return auth;

  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json({ categories });
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[‘’'`]/g, "")
    .replace(/[^a-z0-9Ѐ-ӿ]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(["SUPER_ADMIN", "PRODUCT_MANAGER"]);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => null);
  if (!body?.name) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const slug = body.slug?.trim() || slugify(body.name);
  const existing = await db.category.findUnique({ where: { slug } });
  if (existing) return NextResponse.json({ error: "slug_taken" }, { status: 409 });

  const category = await db.category.create({
    data: {
      slug,
      name: body.name,
      icon: body.icon || "🛒",
      image: body.image || null,
      sortOrder: body.sortOrder ? Number(body.sortOrder) : 0,
      visible: body.visible ?? true,
    },
  });
  return NextResponse.json({ category });
}
