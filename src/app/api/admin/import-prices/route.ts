import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { supabase } from '@/lib/supabase';

function checkAuth(req: NextRequest): boolean {
  const pwd = req.headers.get('x-admin-password');
  return typeof pwd === 'string' && pwd.length > 0 && pwd === process.env.ADMIN_PASSWORD;
}

function normalize(str: unknown): string {
  if (!str) return '';
  return String(str).trim().toLowerCase();
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['xlsx', 'xls'].includes(ext ?? '')) {
      return NextResponse.json({ error: 'El archivo debe ser .xlsx o .xls' }, { status: 400 });
    }

    // Parse Excel
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

    // Find header row (contains "Tipo Componente")
    let headerRowIdx = -1;
    for (let i = 0; i < Math.min(rows.length, 20); i++) {
      if (rows[i].some((v) => typeof v === 'string' && v.includes('Tipo Componente'))) {
        headerRowIdx = i;
        break;
      }
    }

    if (headerRowIdx === -1) {
      return NextResponse.json(
        { error: 'No se encontró la fila de encabezados (debe tener "Tipo Componente")' },
        { status: 400 }
      );
    }

    const headers = rows[headerRowIdx] as string[];
    const colNombre = headers.findIndex((h) => typeof h === 'string' && h.includes('Tipo Componente'));
    const colMarca = headers.findIndex((h) => typeof h === 'string' && h.includes('Marca'));
    const colPrecio = headers.findIndex((h) => typeof h === 'string' && h.includes('Contado'));
    const colStock = headers.findIndex((h) => typeof h === 'string' && h.includes('Stock'));

    if (colNombre === -1 || colPrecio === -1) {
      return NextResponse.json(
        { error: 'El Excel debe tener columnas "Tipo Componente" y "Contado $"' },
        { status: 400 }
      );
    }

    // Build lookup map from Excel: normalize(nombre) -> { precio, stock, marca }
    interface ExcelRow { precio: number; stock: number; marca: string }
    const excelMap = new Map<string, ExcelRow>();
    const excelMapWithMarca = new Map<string, ExcelRow>();

    for (let i = headerRowIdx + 1; i < rows.length; i++) {
      const row = rows[i];
      const nombre = row[colNombre];
      const precio = row[colPrecio];
      const stock = colStock !== -1 ? row[colStock] : null;
      const marca = colMarca !== -1 ? row[colMarca] : null;

      if (!nombre || typeof precio !== 'number') continue;

      const normNombre = normalize(nombre);
      const normMarca = normalize(marca);
      const entry: ExcelRow = {
        precio: precio,
        stock: typeof stock === 'number' ? stock : 0,
        marca: String(marca ?? ''),
      };

      excelMap.set(normNombre, entry);
      excelMapWithMarca.set(`${normNombre}||${normMarca}`, entry);
    }

    // Load products from Supabase
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, nombre, marca, precio, stock');

    if (fetchError) {
      return NextResponse.json({ error: 'Error al leer productos' }, { status: 500 });
    }

    let matched = 0;
    let updated = 0;
    const updates: Array<{ id: number; precio: number; stock: number }> = [];

    for (const product of products) {
      const normNombre = normalize(product.nombre);
      const normMarca = normalize(product.marca);

      let entry = excelMapWithMarca.get(`${normNombre}||${normMarca}`);
      if (!entry) entry = excelMap.get(normNombre);

      if (!entry) continue;
      matched++;

      const newPrecio = entry.precio;
      const newStock = colStock !== -1 ? entry.stock : product.stock;

      if (product.precio !== newPrecio || product.stock !== newStock) {
        updates.push({ id: product.id, precio: newPrecio, stock: newStock });
        updated++;
      }
    }

    // Apply updates in batches
    for (const u of updates) {
      await supabase.from('products').update({ precio: u.precio, stock: u.stock }).eq('id', u.id);
    }

    return NextResponse.json({
      total: products.length,
      excelRows: excelMap.size,
      matched,
      updated,
    });
  } catch (err) {
    console.error('import-prices error:', err);
    return NextResponse.json({ error: 'Error al procesar el archivo' }, { status: 500 });
  }
}
