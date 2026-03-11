import { NextResponse } from "next/server";
import { fetchCatalogProducts } from "@/lib/supabase/catalog";

export const revalidate = 300; // 5 minutes

export async function GET() {
  try {
    const inventory = await fetchCatalogProducts();
    return NextResponse.json({ inventory });
  } catch (error) {
    console.error("[Inventory API] failed to load products", error);
    return NextResponse.json(
      { error: "Unable to load inventory." },
      { status: 500 }
    );
  }
}
