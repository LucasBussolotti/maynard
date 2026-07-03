import { Suspense } from "react";
import ShopClient from "./ShopClient";
import { getAllProducts } from "@/lib/products";

export const metadata = {
  title: "Catálogo | Maynard Instrumentos Musicales",
};

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh] text-[#6b7280]">
        Cargando catálogo…
      </div>
    }>
      <ShopClient products={products} />
    </Suspense>
  );
}
