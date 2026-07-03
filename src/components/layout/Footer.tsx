import Link from "next/link";
import Image from "next/image";
import { categories } from "@/lib/products";

export default function Footer() {
  return (
    <footer className="bg-[#0d0d0d] border-t border-[#2a2a2a] mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="md:col-span-1">
          <Image src="/logo.png" alt="Maynard" width={180} height={64} className="object-contain h-[56px] w-auto mb-3" style={{ filter: 'invert(1)', mixBlendMode: 'screen' }} />
          <p className="text-[#9ca3af] text-sm leading-relaxed">
            Tu tienda de instrumentos musicales. La mejor selección de marcas y productos para músicos de todos los niveles.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="#" className="text-[#6b7280] hover:text-white transition-colors" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a href="#" className="text-[#6b7280] hover:text-white transition-colors" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="#" className="text-[#6b7280] hover:text-white transition-colors" aria-label="WhatsApp">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Categorías</h3>
          <ul className="space-y-2">
            {categories.slice(0, 6).map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/shop?categoria=${cat.slug}`}
                  className="text-[#9ca3af] hover:text-white text-sm transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* More categories */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Más</h3>
          <ul className="space-y-2">
            {categories.slice(6).map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/shop?categoria=${cat.slug}`}
                  className="text-[#9ca3af] hover:text-white text-sm transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contacto</h3>
          <ul className="space-y-3 text-sm text-[#9ca3af]">
            <li className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              Buenos Aires, Argentina
            </li>
            <li className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.92 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6.29 6.29l1.28-1.28a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              (Sin número aún)
            </li>
            <li className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              contacto@maynard.com.ar
            </li>
          </ul>
          <div className="mt-4">
            <p className="text-[#9ca3af] text-xs">Medios de pago:</p>
            <div className="flex gap-2 mt-2">
              <span className="text-xs bg-[#2a2a2a] text-[#9ca3af] px-2 py-1 rounded">Efectivo</span>
              <span className="text-xs bg-[#2a2a2a] text-[#9ca3af] px-2 py-1 rounded">Tarjetas</span>
              <span className="text-xs bg-[#2a2a2a] text-[#9ca3af] px-2 py-1 rounded">Transfer.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#2a2a2a] py-4 text-center text-xs text-[#6b7280]">
        © {new Date().getFullYear()} Maynard Instrumentos Musicales · Todos los derechos reservados
      </div>
    </footer>
  );
}
