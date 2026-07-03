import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getProductsByCategory, formatPrice } from "@/lib/products";
import AddToCartButton from "./AddToCartButton";
import ProductCard from "@/components/shop/ProductCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: `${product.nombre} | Maynard`,
    description: `${product.marca} - ${product.nombre}`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const allInCategory = await getProductsByCategory(product.category);
  const related = allInCategory
    .filter((p) => p.id !== product.id && p.stock > 0)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#6b7280] mb-8">
        <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-white transition-colors">Catálogo</Link>
        <span>/</span>
        <Link
          href={`/shop?categoria=${encodeURIComponent(product.category.toLowerCase().replace(/[^a-z0-9]/g, "-"))}`}
          className="hover:text-white transition-colors"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-[#9ca3af] truncate max-w-[200px]">{product.nombre}</span>
      </nav>

      {/* Product layout */}
      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl aspect-square flex items-center justify-center text-[#3a3a3a]">
          <div className="flex flex-col items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
            </svg>
            <span className="text-sm">{product.subcategory}</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-[#c0c0c0] text-sm font-medium uppercase tracking-wide">{product.marca}</p>
            <h1 className="text-2xl md:text-3xl font-bold text-white mt-2 leading-tight">{product.nombre}</h1>
            {product.modelo && (
              <p className="text-[#6b7280] text-sm mt-1">Modelo: {product.modelo}</p>
            )}
          </div>

          {/* Price */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
            <p className="text-3xl font-bold text-[#c0c0c0]">
              {product.precio > 0 ? formatPrice(product.precio) : "Consultar precio"}
            </p>
            <p className="text-[#6b7280] text-sm mt-1">Precio en efectivo / transferencia</p>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                <span className="text-green-400 text-sm">
                  {product.stock <= 3 ? `Últimas ${product.stock} unidades` : "En stock"}
                </span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-[#6b7280] inline-block" />
                <span className="text-[#6b7280] text-sm">Sin stock</span>
              </>
            )}
          </div>

          {/* Add to cart */}
          <AddToCartButton product={product} />

          {/* Details */}
          <div className="border border-[#2a2a2a] rounded-xl p-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Categoría</span>
              <span className="text-white">{product.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Subcategoría</span>
              <span className="text-white">{product.subcategory}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Marca</span>
              <span className="text-white">{product.marca}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Rubro original</span>
              <span className="text-[#9ca3af]">{product.rubro}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-white mb-6">Productos relacionados</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
