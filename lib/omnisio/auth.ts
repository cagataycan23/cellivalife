import { NextResponse } from "next/server";

const SUPER_ADMIN_SECRET = process.env.OMNISIO_SUPER_ADMIN_SECRET;

function extractBearerToken(header: string | null): string | null {
  if (!header) return null;
  if (header.startsWith("Bearer ")) return header.slice(7).trim();
  return header.trim() || null;
}

export function enforceSuperAdminAuth(request: Request) {
  if (!SUPER_ADMIN_SECRET) {
    console.warn("[Omnisio] OMNISIO_SUPER_ADMIN_SECRET not set; skipping auth check");
    return null;
  }

  const token = extractBearerToken(request.headers.get("authorization"));
  if (token !== SUPER_ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
