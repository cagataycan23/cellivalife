import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { addRecommendation } from "@/lib/omnisio/admin";
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
    .from("crm_recommendations")
    .select("id, product_id, priority, status, source, created_at")
    .eq("omnisio_id", omnisioId)
    .order("priority", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ recommendations: data ?? [] });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ omnisioId: string }> }
) {
  const authError = enforceSuperAdminAuth(request);
  if (authError) return authError;
  const { omnisioId } = await context.params;
  const body = await request.json();
  if (typeof body.productId !== "number") {
    return NextResponse.json({ error: "productId number required" }, { status: 400 });
  }

  try {
    const recommendation = await addRecommendation({
      omnisioId,
      productId: body.productId,
      priority: body.priority,
      source: body.source,
    });
    return NextResponse.json({ recommendation });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create recommendation";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
