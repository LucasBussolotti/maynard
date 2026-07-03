import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Only these fields can be updated via the admin panel
const ALLOWED_FIELDS = ['precio', 'imagen', 'stock', 'destacado', 'oferta', 'precioOferta'] as const;

function checkAuth(req: NextRequest): boolean {
  const pwd = req.headers.get('x-admin-password');
  return typeof pwd === 'string' && pwd.length > 0 && pwd === process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const { data, error } = await supabase.from('products').select('*').order('nombre');
  if (error) return NextResponse.json({ error: 'Error al leer productos' }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { id, changes } = body;

    if (typeof id !== 'number' || !changes || typeof changes !== 'object') {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    // Only allow whitelisted fields
    const safeChanges: Record<string, unknown> = {};
    for (const field of ALLOWED_FIELDS) {
      if (field in changes) {
        safeChanges[field] = changes[field];
      }
    }

    const { data, error } = await supabase
      .from('products')
      .update(safeChanges)
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 });
  }
}
