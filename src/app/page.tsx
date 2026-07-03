import Link from "next/link";
import Image from "next/image";
import { categories, getFeaturedProducts } from "@/lib/products";
import ProductCard from "@/components/shop/ProductCard";
import { FadeUp, StaggerGrid, StaggerItem, HeroStagger, HeroItem } from "@/components/ui/animations";

export default async function Home() {
  const featured = await getFeaturedProducts(8);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[520px] md:min-h-[620px] flex items-center bg-[#0d0d0d]">
        {/* Background image */}
        <Image
          src="/imagen-guitarra.png"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        {/* Gradient overlay: dark on left for readability, fades to transparent on right */}
        <div className="absolute inset-0 bg-linear-to-r from-[#0d0d0d] from-40% via-[#0d0d0d]/75 to-[#0d0d0d]/10" />
        {/* Bottom fade to blend with next section */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-[#0d0d0d] to-transparent" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-36 w-full">
          <div className="max-w-xl">
            <HeroStagger>
              <HeroItem>
                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                  Tu música,{" "}
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-[#c0c0c0] to-[#f0f0f0]">
                    tu instrumento
                  </span>
                </h1>
              </HeroItem>
              <HeroItem>
                <p className="mt-4 text-[#9ca3af] text-lg md:text-xl">
                  Más de 3.000 productos para músicos de todos los niveles. Guitarras, baterías, teclados, audio y mucho más.
                </p>
              </HeroItem>
              <HeroItem>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/shop"
                    className="bg-[#c0c0c0] hover:bg-white text-black font-semibold px-8 py-3 rounded-lg transition-colors text-center"
                  >
                    Ver catálogo
                  </Link>
                  <Link
                    href="/shop?categoria=guitarras-bajos"
                    className="border border-[#c0c0c0]/40 hover:border-[#c0c0c0] text-white px-8 py-3 rounded-lg transition-colors text-center backdrop-blur-sm"
                  >
                    Guitarras & Bajos
                  </Link>
                </div>
              </HeroItem>
            </HeroStagger>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-[#1a1a1a] border-y border-[#2a2a2a]">
        <StaggerGrid className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4" staggerDelay={0.1}>
          {[
            { icon: "🚚", label: "Envíos a todo el país" },
            { icon: "💳", label: "Hasta 12 cuotas" },
            { icon: "🏬", label: "Retiro en local" },
            { icon: "✅", label: "Garantía oficial" },
          ].map((b) => (
            <StaggerItem key={b.label}>
              <div className="flex items-center gap-2 justify-center md:justify-start text-sm text-[#9ca3af]">
                <span className="text-lg">{b.icon}</span>
                <span>{b.label}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <FadeUp>
          <h2 className="text-2xl font-bold text-white mb-8">Explorar categorías</h2>
        </FadeUp>
        <StaggerGrid className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <StaggerItem key={cat.slug}>
              <Link
                href={`/shop?categoria=${cat.slug}`}
                className="group bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#c0c0c0]/50 rounded-xl p-4 flex flex-col items-center gap-2 transition-all hover:bg-[#222] h-full"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-sm text-white font-medium text-center leading-tight group-hover:text-[#c0c0c0] transition-colors">
                  {cat.name}
                </span>
                <span className="text-xs text-[#6b7280]">{cat.count} productos</span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 pb-14">
        <FadeUp>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Destacados</h2>
            <Link href="/shop" className="text-sm text-[#c0c0c0] hover:text-white transition-colors">
              Ver todos →
            </Link>
          </div>
        </FadeUp>
        <StaggerGrid className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {featured.map((p) => (
            <StaggerItem key={p.id}>
              <ProductCard product={p} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      {/* Brands strip */}
      <section className="border-t border-[#2a2a2a] py-10 bg-[#1a1a1a]">
        <FadeUp>
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-center text-[#6b7280] text-sm mb-6 uppercase tracking-widest">Principales marcas</p>
            <div className="flex flex-wrap justify-center gap-4">
              {["Parquer", "Stagg", "Evans", "Hohner", "Behringer", "Dixon", "Warwick", "Daddario", "Cort", "Lexsen"].map((brand) => (
                <Link
                  key={brand}
                  href={`/shop?marca=${encodeURIComponent(brand)}`}
                  className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-[#9ca3af] hover:text-white text-sm px-4 py-2 rounded-full transition-colors"
                >
                  {brand}
                </Link>
              ))}
            </div>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}

