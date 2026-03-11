import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { upsertBiomarker } from "@/lib/omnisio/admin";
import { enforceSuperAdminAuth } from "@/lib/omnisio/auth";

export async function GET(
  request: Request,
  context: { params: Promise<{ omnisioId: string }> }
) {
  const authError = enforceSuperAdminAuth(request);
  if (authError) return authError;
  const { omnisioId } = await context.params;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("crm_biomarkers")
    .select("id, biomarker, value, unit, status, measured_at, recommendation_slug")
    .eq("omnisio_id", omnisioId)
    .order("measured_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ biomarkers: data ?? [] });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ omnisioId: string }> }
) {
  const authError = enforceSuperAdminAuth(request);
  if (authError) return authError;
  const { omnisioId } = await context.params;
  const body = await request.json();
  if (typeof body.biomarker !== "string" || typeof body.value !== "number" || typeof body.unit !== "string") {
    return NextResponse.json({ error: "biomarker, value, unit required" }, { status: 400 });
  }

  try {
    const biomarker = await upsertBiomarker({
      omnisioId,
      biomarker: body.biomarker,
      value: body.value,
      unit: body.unit,
      status: body.status,
      measuredAt: body.measuredAt,
      recommendationSlug: body.recommendationSlug,
    });
    return NextResponse.json({ biomarker });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to upsert biomarker";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
