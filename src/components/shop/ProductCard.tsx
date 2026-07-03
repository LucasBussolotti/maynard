"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();

  return (
    <motion.div
      className="group bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#c0c0c0]/40 transition-colors duration-200 flex flex-col h-full"
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {/* Image placeholder */}
      <Link href={`/producto/${product.slug}`} className="block relative bg-[#111] aspect-square overflow-hidden">
        {product.imagen ? (
          <img
            src={product.imagen}
            alt={product.nombre}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#3a3a3a] group-hover:text-[#5a5a5a] transition-colors">
            <MusicIcon />
            <span className="text-xs text-center px-2 leading-tight line-clamp-2 text-[#4a4a4a]">
              {product.subcategory}
            </span>
          </div>
        )}

        {/* Stock badge */}
        {product.stock === 0 && (
          <div className="absolute top-2 left-2 bg-[#2a2a2a] text-[#6b7280] text-xs px-2 py-0.5 rounded-full">
            Sin stock
          </div>
        )}
        {product.stock > 0 && product.stock <= 3 && (
          <div className="absolute top-2 left-2 bg-amber-900/80 text-amber-300 text-xs px-2 py-0.5 rounded-full">
            Últimos {product.stock}
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1 gap-2">
        <div className="flex-1">
          <p className="text-[#9ca3af] text-xs">{product.marca}</p>
          <Link href={`/producto/${product.slug}`}>
            <h3 className="text-white text-sm font-medium leading-tight mt-0.5 line-clamp-2 hover:text-[#c0c0c0] transition-colors">
              {product.nombre}
            </h3>
          </Link>
        </div>

        <div className="flex items-center justify-between gap-2 mt-1">
          <span className="text-[#c0c0c0] font-bold text-base">
            {product.precio > 0 ? formatPrice(product.precio) : "Consultar"}
          </span>
          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="bg-[#c0c0c0] hover:bg-white disabled:bg-[#3a3a3a] disabled:text-[#6b7280] text-black text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shrink-0"
          >
            {product.stock === 0 ? "Sin stock" : "Agregar"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function MusicIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
    </svg>
  );
}
