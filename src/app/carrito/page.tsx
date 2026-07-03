"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";

function buildWhatsAppUrl(items: ReturnType<typeof useCart>['items'], totalPrice: number): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5493447402805';
  const lines: string[] = [
    'Hola! Estoy interesado en los siguientes productos:',
    '',
    ...items.map(({ product, quantity }) => {
      const price = product.precio > 0 ? ` - ${formatPrice(product.precio * quantity)}` : '';
      return `• ${quantity}x ${product.nombre}${price}`;
    }),
  ];
  if (totalPrice > 0) {
    lines.push('');
    lines.push(`Total estimado: ${formatPrice(totalPrice)}`);
  }
  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export default function CarritoPage() {
  const { items, removeItem, updateQty, clearCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-6xl mb-6">🛒</p>
        <h1 className="text-2xl font-bold text-white mb-3">Tu carrito está vacío</h1>
        <p className="text-[#9ca3af] mb-8">Explorá nuestro catálogo y encontrá tu instrumento ideal.</p>
        <Link
          href="/shop"
          className="inline-block bg-[#c0c0c0] hover:bg-white text-black font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Mi carrito</h1>
        <button
          onClick={clearCart}
          className="text-sm text-[#6b7280] hover:text-white transition-colors"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex gap-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4"
            >
              {/* Image placeholder */}
              <div className="w-20 h-20 bg-[#111] rounded-lg flex items-center justify-center shrink-0 text-[#3a3a3a]">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[#9ca3af] text-xs">{product.marca}</p>
                <Link
                  href={`/producto/${product.slug}`}
                  className="text-white text-sm font-medium leading-tight hover:text-[#c0c0c0] transition-colors line-clamp-2"
                >
                  {product.nombre}
                </Link>
                <p className="text-[#c0c0c0] font-bold mt-1">
                  {product.precio > 0 ? formatPrice(product.precio) : "Consultar"}
                </p>
              </div>

              <div className="flex flex-col items-end justify-between gap-2">
                {/* Qty controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQty(product.id, quantity - 1)}
                    className="w-7 h-7 rounded-md bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white flex items-center justify-center text-sm transition-colors"
                  >
                    −
                  </button>
                  <span className="text-white text-sm w-5 text-center">{quantity}</span>
                  <button
                    onClick={() => updateQty(product.id, quantity + 1)}
                    disabled={quantity >= (product.stock || 99)}
                    className="w-7 h-7 rounded-md bg-[#2a2a2a] hover:bg-[#3a3a3a] disabled:opacity-30 text-white flex items-center justify-center text-sm transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal for this item */}
                {product.precio > 0 && (
                  <p className="text-[#9ca3af] text-xs">
                    {formatPrice(product.precio * quantity)}
                  </p>
                )}

                <button
                  onClick={() => removeItem(product.id)}
                  className="text-[#6b7280] hover:text-red-400 transition-colors text-xs"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 sticky top-24 space-y-5">
            <h2 className="text-lg font-bold text-white">Resumen</h2>

            <div className="space-y-2 text-sm">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-[#9ca3af]">
                  <span className="line-clamp-1 flex-1 mr-2">{product.nombre}</span>
                  <span className="shrink-0">
                    {product.precio > 0 ? formatPrice(product.precio * quantity) : "—"}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#2a2a2a] pt-4 flex justify-between font-bold">
              <span className="text-white">Total</span>
              <span className="text-[#c0c0c0] text-xl">{formatPrice(totalPrice)}</span>
            </div>

            <p className="text-[#6b7280] text-xs">
              * Precios en pesos argentinos. Medios de pago y cuotas disponibles en local.
            </p>

            <a
              href={buildWhatsAppUrl(items, totalPrice)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Consultar por WhatsApp
            </a>

            <Link
              href="/shop"
              className="block text-center text-sm text-[#9ca3af] hover:text-white transition-colors"
            >
              ← Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
