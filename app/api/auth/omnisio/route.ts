import { NextResponse } from "next/server";
import { syncOmnisioUser } from "@/lib/omnisio-sync";

export async function POST(request: Request) {
  const { omnisioId, email } = await request.json();
  const identifier = omnisioId ?? email;

  if (!identifier) {
    return NextResponse.json(
      { error: "omnisioId or email required" },
      { status: 400 }
    );
  }

  const result = await syncOmnisioUser(identifier, omnisioId ? "omnisio_id" : "email");
  return NextResponse.json(result);
}
