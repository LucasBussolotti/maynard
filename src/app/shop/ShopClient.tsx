"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  categories,
  formatPrice,
} from "@/lib/products";
import ProductCard from "@/components/shop/ProductCard";
import type { Product } from "@/types";

const ITEMS_PER_PAGE = 30;

interface Props {
  products: Product[];
}

export default function ShopClient({ products: allProducts }: Props) {
  const searchParams = useSearchParams();
  const categoriaSlug = searchParams.get("categoria") ?? "";
  const subSlug = searchParams.get("sub") ?? "";
  const marcaParam = searchParams.get("marca") ?? "";
  const queryParam = searchParams.get("q") ?? "";

  const [sort, setSort] = useState<"nombre" | "precio-asc" | "precio-desc">("nombre");
  const [page, setPage] = useState(1);
  const [soloStock, setSoloStock] = useState(false);

  // Active category object
  const activeCategory = categories.find((c) => c.slug === categoriaSlug) ?? null;

  // Unique brands for current filtered category
  const allBrands = useMemo(() => {
    let base = categoriaSlug
      ? allProducts.filter((p) => p.category === activeCategory?.name)
      : allProducts;
    return Array.from(new Set(base.map((p) => p.marca).filter(Boolean))).sort();
  }, [categoriaSlug, activeCategory]);

  // Filtered products
  const filtered = useMemo(() => {
    let list = [...allProducts];

    if (categoriaSlug && activeCategory) {
      list = list.filter((p) => p.category === activeCategory.name);
    }
    if (subSlug) {
      const sub = activeCategory?.subcategories.find((s) => s.slug === subSlug);
      if (sub) list = list.filter((p) => p.subcategory === sub.name);
    }
    if (marcaParam) {
      list = list.filter((p) => p.marca.toLowerCase() === marcaParam.toLowerCase());
    }
    if (queryParam) {
      const q = queryParam.toLowerCase();
      list = list.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          p.marca.toLowerCase().includes(q)
      );
    }
    if (soloStock) {
      list = list.filter((p) => p.stock > 0);
    }

    // Sort
    if (sort === "precio-asc") list.sort((a, b) => a.precio - b.precio);
    else if (sort === "precio-desc") list.sort((a, b) => b.precio - a.precio);
    else list.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

    return list;
  }, [categoriaSlug, subSlug, marcaParam, queryParam, soloStock, sort, activeCategory]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageItems = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  function handlePageChange(n: number) {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col gap-6 w-56 shrink-0">
        {/* Categories */}
        <div>
          <h3 className="text-[#9ca3af] text-xs uppercase tracking-widest mb-3">Categorías</h3>
          <ul className="space-y-1">
            <li>
              <Link
                href="/shop"
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  !categoriaSlug
                    ? "bg-[#2a2a2a] text-white"
                    : "text-[#9ca3af] hover:text-white hover:bg-[#1f1f1f]"
                }`}
              >
                Todos
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/shop?categoria=${cat.slug}`}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    categoriaSlug === cat.slug
                      ? "bg-[#2a2a2a] text-white"
                      : "text-[#9ca3af] hover:text-white hover:bg-[#1f1f1f]"
                  }`}
                >
                  <span>
                    {cat.icon} {cat.name}
                  </span>
                  <span className="text-xs text-[#4b5563]">{cat.count}</span>
                </Link>
                {/* Subcategories */}
                {categoriaSlug === cat.slug && cat.subcategories.length > 0 && (
                  <ul className="ml-4 mt-1 space-y-1">
                    {cat.subcategories.map((sub) => (
                      <li key={sub.slug}>
                        <Link
                          href={`/shop?categoria=${cat.slug}&sub=${sub.slug}`}
                          className={`block px-3 py-1.5 rounded-lg text-xs transition-colors ${
                            subSlug === sub.slug
                              ? "text-[#c0c0c0] bg-[#1f1f1f]"
                              : "text-[#6b7280] hover:text-white hover:bg-[#1f1f1f]"
                          }`}
                        >
                          {sub.name}
                          <span className="ml-1 text-[#4b5563]">({sub.count})</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Filters */}
        <div>
          <h3 className="text-[#9ca3af] text-xs uppercase tracking-widest mb-3">Filtros</h3>
          <label className="flex items-center gap-2 text-sm text-[#9ca3af] cursor-pointer">
            <input
              type="checkbox"
              checked={soloStock}
              onChange={(e) => { setSoloStock(e.target.checked); setPage(1); }}
              className="accent-[#c0c0c0]"
            />
            Solo con stock
          </label>
        </div>

        {/* Brands (top 20) */}
        {allBrands.length > 0 && (
          <div>
            <h3 className="text-[#9ca3af] text-xs uppercase tracking-widest mb-3">Marcas</h3>
            <ul className="space-y-1 max-h-60 overflow-y-auto">
              {allBrands.slice(0, 25).map((brand) => (
                <li key={brand}>
                  <Link
                    href={`/shop${categoriaSlug ? `?categoria=${categoriaSlug}&` : "?"}marca=${encodeURIComponent(brand)}`}
                    className={`block px-3 py-1.5 rounded-lg text-xs transition-colors ${
                      marcaParam.toLowerCase() === brand.toLowerCase()
                        ? "text-[#c0c0c0] bg-[#1f1f1f]"
                        : "text-[#6b7280] hover:text-white hover:bg-[#1f1f1f]"
                    }`}
                  >
                    {brand}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">
              {activeCategory
                ? `${activeCategory.icon} ${activeCategory.name}`
                : queryParam
                ? `Búsqueda: "${queryParam}"`
                : "Catálogo"}
            </h1>
            <p className="text-[#6b7280] text-sm mt-0.5">{filtered.length} productos</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value as typeof sort); setPage(1); }}
              className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#9ca3af] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#c0c0c0]"
            >
              <option value="nombre">Nombre A–Z</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {pageItems.length === 0 ? (
          <div className="text-center py-20 text-[#6b7280]">
            <p className="text-5xl mb-4">🎵</p>
            <p className="text-lg">No encontramos productos con esos filtros.</p>
            <Link href="/shop" className="mt-4 inline-block text-[#c0c0c0] hover:text-white">
              Limpiar filtros
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {pageItems.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-[#9ca3af] disabled:opacity-30 hover:border-[#c0c0c0] transition-colors text-sm"
            >
              ← Anterior
            </button>
            {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
              const n = i + 1;
              return (
                <button
                  key={n}
                  onClick={() => handlePageChange(n)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    page === n
                      ? "bg-[#c0c0c0] text-black"
                      : "bg-[#1a1a1a] border border-[#2a2a2a] text-[#9ca3af] hover:border-[#c0c0c0]"
                  }`}
                >
                  {n}
                </button>
              );
            })}
            {totalPages > 10 && <span className="text-[#6b7280] text-sm">… {totalPages} páginas</span>}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-[#9ca3af] disabled:opacity-30 hover:border-[#c0c0c0] transition-colors text-sm"
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
