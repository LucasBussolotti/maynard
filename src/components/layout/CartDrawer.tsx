"use client";

import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";
import Link from "next/link";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, totalItems, totalPrice } = useCart();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#1a1a1a] border-l border-[#2a2a2a] z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a]">
          <h2 className="text-white font-semibold text-lg">
            Carrito
            {totalItems > 0 && (
              <span className="ml-2 text-sm text-[#9ca3af]">({totalItems} {totalItems === 1 ? "item" : "items"})</span>
            )}
          </h2>
          <button
            onClick={closeCart}
            className="text-[#9ca3af] hover:text-white transition-colors p-1"
            aria-label="Cerrar carrito"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3a3a3a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
              </svg>
              <p className="text-[#6b7280]">Tu carrito está vacío</p>
              <button
                onClick={closeCart}
                className="text-sm text-[#c0c0c0] underline hover:text-white"
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-3 bg-[#0d0d0d] rounded-lg p-3 border border-[#2a2a2a]">
                {/* Product info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium leading-tight line-clamp-2">
                    {item.product.nombre}
                  </p>
                  <p className="text-[#9ca3af] text-xs mt-0.5">{item.product.marca}</p>
                  <p className="text-[#c0c0c0] text-sm font-semibold mt-1">
                    {formatPrice(item.product.precio)}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-end justify-between gap-2 shrink-0">
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-[#6b7280] hover:text-red-400 transition-colors"
                    aria-label="Eliminar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    </svg>
                  </button>
                  <div className="flex items-center border border-[#3a3a3a] rounded-md">
                    <button
                      onClick={() => updateQty(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center text-[#9ca3af] hover:text-white"
                    >−</button>
                    <span className="w-8 text-center text-white text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-[#9ca3af] hover:text-white"
                    >+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#2a2a2a] px-5 py-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[#9ca3af]">Subtotal</span>
              <span className="text-white font-bold text-lg">{formatPrice(totalPrice)}</span>
            </div>
            <p className="text-xs text-[#6b7280]">Envío calculado al finalizar la compra</p>
            <Link
              href="/carrito"
              onClick={closeCart}
              className="block w-full bg-[#c0c0c0] hover:bg-white text-black text-center font-semibold py-3 rounded-lg transition-colors"
            >
              Finalizar compra
            </Link>
            <button
              onClick={closeCart}
              className="block w-full text-center text-sm text-[#9ca3af] hover:text-white py-1"
            >
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
}
