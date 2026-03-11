import { NextResponse } from "next/server";
import { fetchOmnisioUserBy } from "@/lib/omnisio/admin";
import { enforceSuperAdminAuth } from "@/lib/omnisio/auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ omnisioId: string }> }
) {
  const authError = enforceSuperAdminAuth(request);
  if (authError) return authError;
  const { omnisioId } = await context.params;
  const record = await fetchOmnisioUserBy("omnisio_id", omnisioId);
  if (!record) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json(record);
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ omnisioId: string }> }
) {
  const authError = enforceSuperAdminAuth(request);
  if (authError) return authError;
  const { omnisioId } = await context.params;
  const body = await request.json();
  const updates: Record<string, unknown> = {};

  if (body.fullName !== undefined) updates["full_name"] = body.fullName;
  if (body.email !== undefined) updates["email"] = body.email;
  if (body.ecosystemTier !== undefined) updates["ecosystem_tier"] = body.ecosystemTier;
  updates["last_synced_at"] = new Date().toISOString();

  if (Object.keys(updates).length === 1 && "last_synced_at" in updates) {
    return NextResponse.json({ error: "No updatable fields provided" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("crm_contacts")
    .update(updates)
    .eq("omnisio_id", omnisioId)
    .select("id, omnisio_id, email, full_name, ecosystem_tier, last_synced_at")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (!data) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ profile: data });
}
