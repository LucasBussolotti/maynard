"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { categories } from "@/lib/products";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { totalItems, toggleCart } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-[#0d0d0d] border-b border-[#2a2a2a]">
      {/* Top bar */}
      <div className="bg-[#1a1a1a] text-xs text-[#9ca3af] text-center py-1.5 px-4">
        Envíos a todo el país · Pagá en cuotas · Local físico disponible
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="shrink-0 flex items-center group">
          <Image
            src="/logo.png"
            alt="Maynard Instrumentos Musicales"
            width={240}
            height={80}
            className="object-contain block h-[64px] w-auto"
            style={{ filter: 'invert(1)', mixBlendMode: 'screen' }}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {categories.map((cat) => (
            <div
              key={cat.slug}
              className="relative"
              onMouseEnter={() => setActiveDropdown(cat.slug)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={`/shop?categoria=${cat.slug}`}
                className="px-3 py-2 text-sm text-[#d1d5db] hover:text-white transition-colors whitespace-nowrap"
              >
                {cat.name}
              </Link>
              {activeDropdown === cat.slug && cat.subcategories.length > 0 && (
                <div className="absolute top-full left-0 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-2xl min-w-52 py-2 z-50">
                  {cat.subcategories.slice(0, 10).map((sub) => (
                    <Link
                      key={sub.slug}
                      href={`/shop?categoria=${cat.slug}&sub=${sub.slug}`}
                      className="block px-4 py-2 text-sm text-[#9ca3af] hover:text-white hover:bg-[#2a2a2a] transition-colors"
                    >
                      {sub.name}
                      <span className="ml-2 text-xs text-[#6b7280]">({sub.count})</span>
                    </Link>
                  ))}
                  <div className="border-t border-[#2a2a2a] mt-1 pt-1">
                    <Link
                      href={`/shop?categoria=${cat.slug}`}
                      className="block px-4 py-2 text-sm text-[#c0c0c0] hover:text-white font-medium"
                    >
                      Ver todo →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos..."
                className="bg-[#1a1a1a] border border-[#3a3a3a] text-white text-sm rounded-l-md px-3 py-1.5 w-48 focus:outline-none focus:border-[#c0c0c0]"
                onBlur={() => !searchQuery && setSearchOpen(false)}
              />
              <button
                type="submit"
                className="bg-[#c0c0c0] text-black px-3 py-1.5 rounded-r-md text-sm hover:bg-white transition-colors"
              >
                <SearchIcon />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="text-[#9ca3af] hover:text-white transition-colors p-2"
              aria-label="Buscar"
            >
              <SearchIcon />
            </button>
          )}

          {/* Cart */}
          <button
            onClick={toggleCart}
            className="relative text-[#9ca3af] hover:text-white transition-colors p-2"
            aria-label="Carrito"
          >
            <CartIcon />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#c0c0c0] text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>

          {/* Mobile menu */}
          <button
            className="md:hidden text-[#9ca3af] hover:text-white transition-colors p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#1a1a1a] border-t border-[#2a2a2a] max-h-[70vh] overflow-y-auto">
          {categories.map((cat) => (
            <div key={cat.slug}>
              <Link
                href={`/shop?categoria=${cat.slug}`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 text-[#d1d5db] hover:text-white hover:bg-[#2a2a2a] border-b border-[#2a2a2a]"
              >
                <span className="text-sm font-medium">{cat.icon} {cat.name}</span>
                <span className="text-xs text-[#6b7280]">{cat.count}</span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  );
}

function CartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>
    </svg>
  );
}
