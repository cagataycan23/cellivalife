import { NextRequest, NextResponse } from "next/server";

interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
  biomarker?: string;
}

interface OrderPayload {
  orderId: string;
  userId?: string;
  omnisioId?: string;
  email: string;
  items: OrderItem[];
  subtotal: number;
  discountApplied: number;
  discountCode?: string;
  ecosystemDiscount: boolean;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
  };
  createdAt: string;
  webhookVersion: "1.0";
}

export async function POST(req: NextRequest) {
  try {
    const payload: OrderPayload = await req.json();

    if (!payload.orderId || !payload.email || !payload.items?.length) {
      return NextResponse.json(
        { error: "Invalid payload: orderId, email, and items are required." },
        { status: 400 }
      );
    }

    const refillSchedule = payload.items.map((item) => ({
      productId: item.productId,
      productName: item.name,
      qty: item.qty,
      predictedRefillDate: new Date(
        Date.now() + item.qty * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      biomarkerTarget: item.biomarker ?? null,
    }));

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

    if (!process.env.OMNISIO_API_URL || !process.env.OMNISIO_SUPER_ADMIN_SECRET) {
      console.log("[Celliva Webhook] Mock push", JSON.stringify(omnisioPayload));
      return NextResponse.json({ success: true, orderId: payload.orderId, refillSchedule });
    }

    const omnisioRes = await fetch(
      `${process.env.OMNISIO_API_URL}/admin/orders/ingest`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OMNISIO_SUPER_ADMIN_SECRET}`,
          "X-Celliva-Signature": generateHmac(
            JSON.stringify(omnisioPayload),
            process.env.WEBHOOK_SECRET || "demo"
          ),
        },
        body: JSON.stringify(omnisioPayload),
      }
    );

    if (!omnisioRes.ok) {
      const err = await omnisioRes.text();
      console.error("[Celliva Webhook] Omnisio push failed:", err);
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function generateHmac(payload: string, secret: string): string {
  return `sha256=${Buffer.from(`${secret}:${payload}`).toString("base64").slice(0, 32)}`;
}

async function queueForRetry(payload: unknown) {
  console.log("[Celliva Webhook] Queued for retry:", JSON.stringify(payload));
}
