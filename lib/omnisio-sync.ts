// lib/omnisio-sync.ts
// Celliva.life — Omnisio ID Auth Sync
// Fetches user biomarker data, applies personalization and ecosystem discounts

import { cookies } from "next/headers";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface OmnisioUserProfile {
  omnisioId: string;
  email: string;
  displayName: string;
  biomarkers: OmnisBiomarker[];
  ecosystemTier: "basic" | "pro" | "elite";
  lastSyncedAt: string;
}

export interface OmnisBiomarker {
  key: string; // e.g. "hs-CRP", "NAD+", "BDNF", "Homocysteine"
  value: number;
  unit: string;
  status: "optimal" | "elevated" | "low" | "critical";
  measuredAt: string;
  recommendation?: string; // e.g. "omega-3-ultra"
}

export interface PersonalizationResult {
  user: OmnisioUserProfile | null;
  recommendedProductIds: number[];
  ecosystemDiscount: number; // 0.0 – 1.0
  biomarkerAlerts: BiomarkerAlert[];
  connected: boolean;
}

export interface BiomarkerAlert {
  biomarker: string;
  status: "elevated" | "low" | "critical";
  message: string;
  recommendedProductId: number;
}

// ─── Biomarker → Product mapping ─────────────────────────────────────────────
const BIOMARKER_PRODUCT_MAP: Record<string, { productId: number; threshold: { elevated?: number; low?: number }; unit: string }> = {
  "hs-CRP": { productId: 1, threshold: { elevated: 3.0 }, unit: "mg/L" },     // Omega-3 Ultra
  "NAD+":   { productId: 2, threshold: { low: 40 }, unit: "µM" },              // NMN Elevate+
  "BDNF":   { productId: 3, threshold: { low: 10 }, unit: "ng/mL" },           // Neuro Focus Stack
  "Cortisol": { productId: 4, threshold: { elevated: 20 }, unit: "µg/dL" },   // Recovery Matrix
  "Homocysteine": { productId: 6, threshold: { elevated: 12 }, unit: "µmol/L" } // Longevity Baseline
};

// ─── Discount tiers ───────────────────────────────────────────────────────────
const ECOSYSTEM_DISCOUNT: Record<OmnisioUserProfile["ecosystemTier"], number> = {
  basic: 0.05,  // 5%
  pro:   0.10,  // 10%
  elite: 0.15,  // 15%
};

// ─── Main sync function ───────────────────────────────────────────────────────
export async function syncOmnisioUser(
  omnisioIdOrEmail: string,
  mode: "omnisio_id" | "email"
): Promise<PersonalizationResult> {
  try {
    if (!process.env.OMNISIO_API_URL || !process.env.OMNISIO_SUPER_ADMIN_SECRET) {
      const mockUser: OmnisioUserProfile = {
        omnisioId: "demo-user",
        email: mode === "email" ? omnisioIdOrEmail : "demo@celliva.life",
        displayName: "Demo User",
        ecosystemTier: "pro",
        lastSyncedAt: new Date().toISOString(),
        biomarkers: [
          { key: "hs-CRP", value: 4.2, unit: "mg/L", status: "elevated", measuredAt: new Date().toISOString() },
          { key: "NAD+", value: 32, unit: "µM", status: "low", measuredAt: new Date().toISOString() },
        ],
      };
      return await finalizeResult(mockUser);
    }

    const endpoint = mode === "omnisio_id"
      ? `/users/${omnisioIdOrEmail}/profile`
      : `/users/lookup?email=${encodeURIComponent(omnisioIdOrEmail)}`;

    const res = await fetch(`${process.env.OMNISIO_API_URL}${endpoint}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.OMNISIO_SUPER_ADMIN_SECRET}`,
        "X-Client": "celliva.life/1.0",
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return { user: null, recommendedProductIds: [], ecosystemDiscount: 0, biomarkerAlerts: [], connected: false };
    }

    const payload = await res.json();
    const normalized = normalizeOmnisioPayload(payload);

    if (!normalized) {
      return { user: null, recommendedProductIds: [], ecosystemDiscount: 0, biomarkerAlerts: [], connected: false };
    }

    return await finalizeResult(normalized);

  } catch (error) {
    console.error("[Omnisio Sync] Error:", error);
    return { user: null, recommendedProductIds: [], ecosystemDiscount: 0, biomarkerAlerts: [], connected: false };
  }
}

async function finalizeResult(user: OmnisioUserProfile): Promise<PersonalizationResult> {
  const biomarkerAlerts: BiomarkerAlert[] = [];
  const recommendedProductIds: number[] = [];

  for (const bm of user.biomarkers) {
    const mapping = BIOMARKER_PRODUCT_MAP[bm.key];
    if (!mapping) continue;

    let triggered = false;
    let status: BiomarkerAlert["status"] = "elevated";

    if (mapping.threshold.elevated && bm.value > mapping.threshold.elevated) {
      triggered = true;
      status = bm.value > mapping.threshold.elevated * 2 ? "critical" : "elevated";
    }
    if (mapping.threshold.low && bm.value < mapping.threshold.low) {
      triggered = true;
      status = bm.value < mapping.threshold.low * 0.5 ? "critical" : "low";
    }

    if (triggered) {
      recommendedProductIds.push(mapping.productId);
      biomarkerAlerts.push({
        biomarker: bm.key,
        status,
        message: generateAlertMessage(bm, status),
        recommendedProductId: mapping.productId,
      });
    }
  }

  const ecosystemDiscount = ECOSYSTEM_DISCOUNT[user.ecosystemTier] ?? 0.10;

  try {
    const cookieStore: any = await cookies();
    // In route handlers cookies() is mutable; in other runtimes it's read-only.
    cookieStore.set?.("omnisio_session", JSON.stringify({
      omnisioId: user.omnisioId,
      email: user.email,
      tier: user.ecosystemTier,
      discount: ecosystemDiscount,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
    });
  } catch (error) {
    console.warn("[Omnisio Sync] Unable to set cookie", error);
  }

  return {
    user,
    recommendedProductIds: Array.from(new Set(recommendedProductIds)),
    ecosystemDiscount,
    biomarkerAlerts,
    connected: true,
  };
}

function mapBiomarker(entry: any): OmnisBiomarker {
  return {
    key: entry?.key ?? entry?.biomarker ?? "unknown",
    value: Number(entry?.value ?? 0),
    unit: entry?.unit ?? entry?.unit_label ?? "",
    status: entry?.status ?? "optimal",
    measuredAt: entry?.measuredAt ?? entry?.measured_at ?? new Date().toISOString(),
    recommendation: entry?.recommendation ?? entry?.recommendation_slug ?? undefined,
  };
}

function normalizeOmnisioPayload(payload: any): OmnisioUserProfile | null {
  if (!payload) return null;

  const profileBlock = payload.profile ?? payload.user ?? payload;
  if (!profileBlock) return null;

  const normalized: OmnisioUserProfile = {
    omnisioId: profileBlock.omnisioId ?? profileBlock.omnisio_id ?? profileBlock.id ?? "unknown",
    email: profileBlock.email ?? "",
    displayName:
      profileBlock.displayName ?? profileBlock.full_name ?? profileBlock.fullName ?? profileBlock.email ?? "",
    ecosystemTier: profileBlock.ecosystemTier ?? profileBlock.ecosystem_tier ?? "basic",
    lastSyncedAt: profileBlock.lastSyncedAt ?? profileBlock.last_synced_at ?? new Date().toISOString(),
    biomarkers:
      (payload.biomarkers ?? profileBlock.biomarkers ?? []).map((bm: OmnisBiomarker) => mapBiomarker(bm)),
  };

  return normalized;
}

// ─── Alert message generator ─────────────────────────────────────────────────
function generateAlertMessage(bm: OmnisBiomarker, status: BiomarkerAlert["status"]): string {
  const messages: Record<string, Record<string, string>> = {
    "hs-CRP": {
      elevated: `Your hs-CRP (${bm.value} ${bm.unit}) indicates subclinical inflammation. Omega-3 EPA/DHA has been clinically shown to reduce hs-CRP by 34%.`,
      critical:  `Your hs-CRP (${bm.value} ${bm.unit}) is critically elevated. Immediate Omega-3 Ultra supplementation is strongly recommended.`,
    },
    "NAD+": {
      low: `Your NAD+ levels (${bm.value} ${bm.unit}) are below optimal range. NMN Elevate+ can restore NAD+ via the Preiss-Handler pathway.`,
    },
    "BDNF": {
      low: `Your BDNF (${bm.value} ${bm.unit}) is below the neuroprotective threshold. Neuro Focus Stack supports NGF and BDNF synthesis.`,
    },
    "Homocysteine": {
      elevated: `Your homocysteine (${bm.value} ${bm.unit}) is above the cardiovascular risk threshold. Methylated B-vitamins can reduce it by up to 42%.`,
    },
  };
  return messages[bm.key]?.[status] ?? `Your ${bm.key} levels require attention. View our recommended supplement.`;
}

// ─── Session retrieval (for client components) ────────────────────────────────
export async function getOmnisioSession() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("omnisio_session")?.value;
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

// ─── API Route: POST /api/auth/omnisio ────────────────────────────────────────
// app/api/auth/omnisio/route.ts
export async function POST_omnisioAuth(req: Request) {
  const { omnisioId, email } = await req.json();
  const mode = omnisioId ? "omnisio_id" : "email";
  const identifier = omnisioId ?? email;

  if (!identifier) {
    return Response.json({ error: "omnisioId or email required" }, { status: 400 });
  }

  const result = await syncOmnisioUser(identifier, mode);
  return Response.json(result);
}
