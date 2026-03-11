import { getSupabaseAdmin } from "@/lib/supabase/server";

export interface CatalogProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  biomarker_link?: string | null;
  stock?: number | null;
  metadata: Record<string, any>;
  image_url: string | null;
}

const DEFAULT_IMAGE_BASE = process.env.SUPABASE_URL
  ? `${process.env.SUPABASE_URL.replace(/\/$/, "")}/storage/v1/object/public/celliva`
  : "";

const IMAGE_BASE = process.env.PRODUCT_IMAGE_BASE_URL ?? DEFAULT_IMAGE_BASE;

const normalizeCategory = (value?: string | null) => {
  if (!value) return "general";
  return value.trim();
};

const resolveImageUrl = (path?: string | null) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  if (!IMAGE_BASE) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${IMAGE_BASE}${normalized}`;
};

export async function fetchCatalogProducts(): Promise<CatalogProduct[]> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, description, category, price, stock, biomarker_link, metadata, image_url, active"
    )
    .eq("active", true)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    category: normalizeCategory(product.category),
    price: product.price ?? 0,
    biomarker_link: product.biomarker_link,
    stock: product.stock,
    metadata: product.metadata ?? {},
    image_url: resolveImageUrl(product.image_url),
  }));
}
