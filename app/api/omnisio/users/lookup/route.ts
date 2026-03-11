import { NextResponse } from "next/server";
import { fetchOmnisioUserBy } from "@/lib/omnisio/admin";
import { enforceSuperAdminAuth } from "@/lib/omnisio/auth";

export async function GET(request: Request) {
  const authError = enforceSuperAdminAuth(request);
  if (authError) return authError;
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "email query param required" }, { status: 400 });
  }

  const record = await fetchOmnisioUserBy("email", email);
  if (!record) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(record);
}
