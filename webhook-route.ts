// app/api/orders/webhook/route.ts
// Celliva.life → Omnisio Super Admin Webhook
// Pushes successful order data for fulfillment + predictive refill tracking

import { NextRequest, NextResponse } from "next/server";

interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
  biomarker?: string; // e.g. "hs-CRP", "NAD+", "BDNF"
}

interface OrderPayload {
  orderId: string;
  userId?: string;
  omnisioId?: string; // if Omnisio-synced user
  email: string;
  items: OrderItem[];
  subtotal: number;
  discountApplied: number; // 0.0 – 1.0 (e.g. 0.10 for 10%)
  discountCode?: string;
  ecosystemDiscount: boolean; // true if Omnisio sync discount applied
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
  };
  createdAt: string; // ISO 8601
  webhookVersion: "1.0";
}

export async function POST(req: NextRequest) {
  try {
    const payload: OrderPayload = await req.json();

    // ── Validate payload ──────────────────────────────────────────────────
    if (!payload.orderId || !payload.email || !payload.items?.length) {
      return NextResponse.json(
        { error: "Invalid payload: orderId, email, and items are required." },
        { status: 400 }
      );
    }

    // ── Enrich with refill prediction ─────────────────────────────────────
    const refillSchedule = payload.items.map((item) => ({
      productId: item.productId,
      productName: item.name,
      qty: item.qty,
      // 30-day supply per unit, predict next order date
      predictedRefillDate: new Date(
        Date.now() + item.qty * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      biomarkerTarget: item.biomarker ?? null,
    }));

    // ── Build Omnisio Admin payload ───────────────────────────────────────
    const omnisioPayload = {
      source: "celliva.life",
      type: "ORDER_CREATED",
      data: {
        ...payload,
        refillSchedule,
        fulfillmentStatus: "PENDING",
        omnisioSyncEnabled: !!payload.omnisioId,
      },
      timestamp: new Date().toISOString(),
    };

    // ── Push to Omnisio Super Admin API ───────────────────────────────────
    const omnisioRes = await fetch(
      `${process.env.OMNISIO_API_URL}/admin/orders/ingest`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OMNISIO_SUPER_ADMIN_SECRET}`,
          "X-Celliva-Signature": generateHmac(
            JSON.stringify(omnisioPayload),
            process.env.WEBHOOK_SECRET!
          ),
        },
        body: JSON.stringify(omnisioPayload),
      }
    );

    if (!omnisioRes.ok) {
      const err = await omnisioRes.text();
      console.error("[Celliva Webhook] Omnisio push failed:", err);
      // Don't fail the customer order — queue for retry
      await queueForRetry(omnisioPayload);
      return NextResponse.json(
        {
          success: true,
          omnisioSync: "QUEUED_FOR_RETRY",
          orderId: payload.orderId,
        },
        { status: 202 }
      );
    }

    const omnisioData = await omnisioRes.json();

    return NextResponse.json(
      {
        success: true,
        orderId: payload.orderId,
        omnisioSync: "CONFIRMED",
        omnisioOrderRef: omnisioData.ref,
        refillSchedule,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Celliva Webhook] Unhandled error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ── HMAC signature for webhook authenticity ───────────────────────────────────
function generateHmac(payload: string, secret: string): string {
  // In production: use Node.js crypto.createHmac('sha256', secret)
  // Placeholder for illustration
  return `sha256=${Buffer.from(`${secret}:${payload}`).toString("base64").slice(0, 32)}`;
}

// ── Retry queue (use Redis/BullMQ in production) ──────────────────────────────
async function queueForRetry(payload: unknown) {
  // In production: push to Redis queue or SQS
  console.log("[Celliva Webhook] Queued for retry:", JSON.stringify(payload));
}
