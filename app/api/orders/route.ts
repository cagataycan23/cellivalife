import { NextResponse } from "next/server";
import crypto from "node:crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId = crypto.randomUUID();

    console.log("[Celliva Orders]", JSON.stringify(body, null, 2));

    return NextResponse.json({
      orderId,
      status: "processing",
    });
  } catch (error) {
    console.error("[Celliva Orders] Error", error);
    return NextResponse.json(
      { error: "Unable to process order" },
      { status: 400 }
    );
  }
}
