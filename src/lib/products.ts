import categoriesData from "@/data/categories.json";
import type { Product, Category } from "@/types";
import { supabase } from "./supabase";

export const categories: Category[] = categoriesData as Category[];

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("nombre");
  if (error) throw error;
  return data as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return undefined;
  return data as Product;
}

export async function getProductsByCategory(categoryName: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", categoryName);
  if (error) throw error;
  return data as Product[];
}

export async function getProductsBySubcategory(subcategorySlug: string): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*");
  if (error) throw error;
  return (data as Product[]).filter((p) => {
    const sub = p.subcategory
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    return sub === subcategorySlug;
  });
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.toLowerCase();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .or(`nombre.ilike.%${q}%,marca.ilike.%${q}%,subcategory.ilike.%${q}%,category.ilike.%${q}%`);
  if (error) throw error;
  return data as Product[];
}

export async function getFeaturedProducts(limit = 12): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .gt("stock", 0)
    .order("precio", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as Product[];
}

export async function getProductsInStock(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .gt("stock", 0);
  if (error) throw error;
  return data as Product[];
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
