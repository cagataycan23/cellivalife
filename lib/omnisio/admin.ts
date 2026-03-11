import { getSupabaseAdmin } from "@/lib/supabase/server";

export interface OmnisioProfileRecord {
  id: string;
  omnisio_id: string;
  email: string;
  full_name: string | null;
  ecosystem_tier: "basic" | "pro" | "elite" | null;
  last_synced_at: string | null;
  biomarkers?: OmnisioBiomarkerRecord[];
  recommendations?: OmnisioRecommendationRecord[];
}

export interface OmnisioBiomarkerRecord {
  id: string;
  omnisio_id: string;
  biomarker: string;
  value: number;
  unit: string;
  status: "optimal" | "elevated" | "low" | "critical";
  measured_at: string;
  recommendation_slug?: string | null;
}

export interface OmnisioRecommendationRecord {
  id: string;
  omnisio_id: string;
  product_id: number;
  priority: number;
  source: string;
  status: "pending" | "active" | "fulfilled";
  created_at: string;
}

export async function fetchOmnisioUserBy(field: "omnisio_id" | "email", value: string) {
  const supabase = getSupabaseAdmin();

  const profileRes = await supabase
    .from("crm_contacts")
    .select("id, omnisio_id, email, full_name, ecosystem_tier, last_synced_at")
    .eq(field, value)
    .maybeSingle();

  if (profileRes.error) throw profileRes.error;
  if (!profileRes.data) return null;

  const omniId = profileRes.data.omnisio_id;

  const [biomarkerRes, recommendationsRes] = await Promise.all([
    supabase
      .from("crm_biomarkers")
      .select("id, omnisio_id, biomarker, value, unit, status, measured_at, recommendation_slug")
      .eq("omnisio_id", omniId)
      .order("measured_at", { ascending: false }),
    supabase
      .from("crm_recommendations")
      .select("id, omnisio_id, product_id, priority, source, status, created_at")
      .eq("omnisio_id", omniId)
      .order("priority", { ascending: true }),
  ]);

  return {
    profile: profileRes.data,
    biomarkers: biomarkerRes.data ?? [],
    recommendations: recommendationsRes.data ?? [],
  };
}

export async function upsertBiomarker(input: {
  omnisioId: string;
  biomarker: string;
  value: number;
  unit: string;
  status?: OmnisioBiomarkerRecord["status"];
  measuredAt?: string;
  recommendationSlug?: string | null;
}) {
  const supabase = getSupabaseAdmin();
  const payload = {
    omnisio_id: input.omnisioId,
    biomarker: input.biomarker,
    value: input.value,
    unit: input.unit,
    status: input.status ?? "optimal",
    measured_at: input.measuredAt ?? new Date().toISOString(),
    recommendation_slug: input.recommendationSlug ?? null,
  };

  const { data, error } = await supabase
    .from("crm_biomarkers")
    .upsert(payload, { onConflict: "omnisio_id,biomarker" })
    .select("id, biomarker, value, unit, status, measured_at, recommendation_slug")
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function addRecommendation(input: {
  omnisioId: string;
  productId: number;
  priority?: number;
  source?: string;
}) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("crm_recommendations")
    .insert({
      omnisio_id: input.omnisioId,
      product_id: input.productId,
      priority: input.priority ?? 10,
      source: input.source ?? "omnisio-biotracker",
      status: "pending",
    })
    .select("id, product_id, priority, status, source, created_at")
    .maybeSingle();

  if (error) throw error;
  return data;
}
