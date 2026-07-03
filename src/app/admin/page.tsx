'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Product {
  id: number;
  slug: string;
  nombre: string;
  marca: string;
  precio: number;
  stock: number;
  rubro: string;
  category: string;
  subcategory: string;
  modelo: string;
  imagen: string | null;
}

const PAGE_SIZE = 50;

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [storedPwd, setStoredPwd] = useState('');
  const [loginError, setLoginError] = useState('');

  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editPrecio, setEditPrecio] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editImagen, setEditImagen] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Import Excel
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ total: number; excelRows: number; matched: number; updated: number } | null>(null);
  const [importError, setImportError] = useState('');

  // Restore session
  useEffect(() => {
    const pwd = sessionStorage.getItem('maynard_admin_pwd');
    if (pwd) { setStoredPwd(pwd); setAuthed(true); }
  }, []);

  // Load products
  useEffect(() => {
    if (!authed || !storedPwd) return;
    setLoading(true);
    fetch('/api/admin/products', { headers: { 'x-admin-password': storedPwd } })
      .then(r => r.json())
      .then(data => { setProducts(data); setFiltered(data); })
      .finally(() => setLoading(false));
  }, [authed, storedPwd]);

  // Filter
  useEffect(() => {
    let result = products;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.nombre.toLowerCase().includes(q) ||
        p.marca.toLowerCase().includes(q) ||
        (p.modelo && p.modelo.toLowerCase().includes(q))
      );
    }
    if (filterCat) {
      result = result.filter(p => p.category === filterCat);
    }
    setFiltered(result);
    setPage(1);
  }, [search, filterCat, products]);

  const categories = [...new Set(products.map(p => p.category))].sort();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      sessionStorage.setItem('maynard_admin_pwd', password);
      setStoredPwd(password);
      setAuthed(true);
    } else {
      setLoginError('Contraseña incorrecta');
    }
  };

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setEditPrecio(String(p.precio));
    setEditStock(String(p.stock));
    setEditImagen(p.imagen || '');
    setSaveMsg('');
  };

  const handleSave = async () => {
    if (!editProduct) return;
    setSaving(true);
    const changes = {
      precio: parseFloat(editPrecio) || 0,
      stock: parseInt(editStock) || 0,
      imagen: editImagen.trim() || null,
    };
    const res = await fetch('/api/admin/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': storedPwd },
      body: JSON.stringify({ id: editProduct.id, changes }),
    });
    if (res.ok) {
      const updated: Product = await res.json();
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
      setSaveMsg('✓ Guardado');
      setTimeout(() => { setEditProduct(null); setSaveMsg(''); }, 800);
    } else {
      setSaveMsg('Error al guardar');
    }
    setSaving(false);
  };

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageProducts = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const withImages = products.filter(p => p.imagen).length;

  const handleImport = async () => {
    if (!importFile) return;
    setImporting(true);
    setImportResult(null);
    setImportError('');
    try {
      const formData = new FormData();
      formData.append('file', importFile);
      const res = await fetch('/api/admin/import-prices', {
        method: 'POST',
        headers: { 'x-admin-password': storedPwd },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error desconocido');
      setImportResult(data);
      setImportFile(null);
      // Reload products to reflect changes
      const r2 = await fetch('/api/admin/products', { headers: { 'x-admin-password': storedPwd } });
      const fresh = await r2.json();
      setProducts(fresh);
      setFiltered(fresh);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Error al importar');
    } finally {
      setImporting(false);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4">
          <div className="text-center mb-2">
            <div className="text-3xl mb-3">🔐</div>
            <h1 className="text-white text-xl font-bold">Panel de Administración</h1>
            <p className="text-[#9ca3af] text-sm mt-1">Maynard Instrumentos Musicales</p>
          </div>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-[#555] outline-none focus:border-[#c0c0c0] transition-colors"
          />
          {loginError && <p className="text-red-400 text-sm text-center">{loginError}</p>}
          <button type="submit" className="bg-[#c0c0c0] text-black font-semibold rounded-lg py-3 hover:bg-white transition-colors">
            Ingresar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white pb-16">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Panel de Administración</h1>
            <p className="text-[#9ca3af] text-sm mt-1">
              {products.length.toLocaleString()} productos ·{' '}
              <span className="text-green-400">{withImages} con imagen</span> ·{' '}
              <span className="text-amber-400">{products.length - withImages} sin imagen</span>
            </p>
          </div>
          <button
            onClick={() => { sessionStorage.removeItem('maynard_admin_pwd'); setAuthed(false); setProducts([]); }}
            className="text-[#9ca3af] hover:text-white text-sm border border-[#2a2a2a] hover:border-[#555] rounded-lg px-3 py-1.5 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Import Excel */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-white mb-0.5">Importar lista de precios</h2>
              <p className="text-[#9ca3af] text-xs">Subí un archivo .xlsx con columnas: Tipo Componente, Marca, Contado $, Stock. Actualiza precios y stock masivamente.</p>
            </div>
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <label className="cursor-pointer bg-[#0d0d0d] border border-[#2a2a2a] hover:border-[#555] rounded-lg px-3 py-2 text-sm text-[#c0c0c0] transition-colors whitespace-nowrap">
                {importFile ? importFile.name : '📂 Seleccionar Excel'}
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={e => { setImportFile(e.target.files?.[0] ?? null); setImportResult(null); setImportError(''); }}
                />
              </label>
              <button
                onClick={handleImport}
                disabled={!importFile || importing}
                className="bg-[#c0c0c0] hover:bg-white disabled:opacity-40 text-black font-semibold rounded-lg px-4 py-2 text-sm transition-colors whitespace-nowrap"
              >
                {importing ? 'Importando...' : 'Actualizar precios'}
              </button>
            </div>
          </div>

          {importError && (
            <div className="mt-3 bg-red-950/50 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
              ✗ {importError}
            </div>
          )}
          {importResult && (
            <div className="mt-3 bg-green-950/50 border border-green-500/30 rounded-lg px-4 py-3 text-sm">
              <span className="text-green-400 font-semibold">✓ Importación completada</span>
              <span className="text-[#9ca3af] ml-3">
                {importResult.excelRows.toLocaleString()} filas en Excel ·{' '}
                {importResult.matched.toLocaleString()} productos encontrados ·{' '}
                <span className="text-white font-medium">{importResult.updated.toLocaleString()} actualizados</span>
              </span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total productos', value: products.length.toLocaleString(), color: 'text-white' },
            { label: 'Con imagen', value: withImages.toLocaleString(), color: 'text-green-400' },
            { label: 'Sin imagen', value: (products.length - withImages).toLocaleString(), color: 'text-amber-400' },
            { label: 'Sin stock', value: products.filter(p => p.stock === 0).length.toLocaleString(), color: 'text-red-400' },
          ].map(s => (
            <div key={s.label} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[#9ca3af] text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Buscar por nombre, marca o modelo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white placeholder-[#555] outline-none focus:border-[#c0c0c0] transition-colors text-sm"
          />
          <select
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#c0c0c0] transition-colors text-sm min-w-[200px]"
          >
            <option value="">Todas las categorías</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-20 text-[#9ca3af]">Cargando productos...</div>
        ) : (
          <>
            <p className="text-[#9ca3af] text-xs mb-3">
              {filtered.length.toLocaleString()} resultados · página {page} de {totalPages}
            </p>

            {/* Table */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a2a2a] text-[#9ca3af] text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 text-left w-8">#</th>
                    <th className="px-4 py-3 text-center">Img</th>
                    <th className="px-4 py-3 text-left">Producto</th>
                    <th className="px-4 py-3 text-left">Marca</th>
                    <th className="px-4 py-3 text-left">Categoría</th>
                    <th className="px-4 py-3 text-right">Precio</th>
                    <th className="px-4 py-3 text-right">Stock</th>
                    <th className="px-4 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pageProducts.map((p, i) => (
                    <tr key={p.id} className={`border-b border-[#2a2a2a] hover:bg-[#222] transition-colors ${i % 2 === 1 ? 'bg-[#171717]' : ''}`}>
                      <td className="px-4 py-3 text-[#555] text-xs">{(page - 1) * PAGE_SIZE + i + 1}</td>
                      <td className="px-4 py-3 text-center">
                        {p.imagen ? (
                          <div className="w-9 h-9 mx-auto rounded-md overflow-hidden bg-white border border-[#2a2a2a]">
                            <img src={p.imagen} alt="" className="w-full h-full object-contain" onError={e => (e.currentTarget.style.display = 'none')} />
                          </div>
                        ) : (
                          <div className="w-9 h-9 mx-auto rounded-md bg-[#2a2a2a] flex items-center justify-center text-[#555] text-xs">—</div>
                        )}
                      </td>
                      <td className="px-4 py-3 max-w-[260px]">
                        <div className="font-medium text-white truncate">{p.nombre}</div>
                        {p.modelo && <div className="text-[#555] text-xs truncate">{p.modelo}</div>}
                      </td>
                      <td className="px-4 py-3 text-[#9ca3af] whitespace-nowrap">{p.marca}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-[#2a2a2a] text-[#9ca3af] px-2 py-0.5 rounded-full whitespace-nowrap">{p.category}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-[#c0c0c0] whitespace-nowrap">
                        {p.precio > 0 ? `$${p.precio.toLocaleString('es-AR')}` : <span className="text-[#555]">—</span>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={p.stock > 0 ? 'text-green-400 font-medium' : 'text-red-400'}>{p.stock}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => openEdit(p)}
                          className="text-xs bg-[#2a2a2a] hover:bg-[#c0c0c0] hover:text-black text-[#c0c0c0] px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <span className="text-[#9ca3af] text-sm">
                Mostrando {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length.toLocaleString()}
              </span>
              <div className="flex gap-2">
                <button onClick={() => setPage(1)} disabled={page === 1} className="px-2.5 py-1.5 text-xs border border-[#2a2a2a] rounded-lg disabled:opacity-30 hover:border-[#c0c0c0] transition-colors">«</button>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-sm border border-[#2a2a2a] rounded-lg disabled:opacity-30 hover:border-[#c0c0c0] transition-colors">← Anterior</button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 text-sm border border-[#2a2a2a] rounded-lg disabled:opacity-30 hover:border-[#c0c0c0] transition-colors">Siguiente →</button>
                <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="px-2.5 py-1.5 text-xs border border-[#2a2a2a] rounded-lg disabled:opacity-30 hover:border-[#c0c0c0] transition-colors">»</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4" onClick={e => { if (e.target === e.currentTarget) setEditProduct(null); }}>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="mb-5">
              <h2 className="text-white font-bold text-base leading-tight">{editProduct.nombre}</h2>
              <p className="text-[#9ca3af] text-sm mt-0.5">{editProduct.marca} · {editProduct.category}</p>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-[#9ca3af] uppercase tracking-wider mb-1.5 block">Precio (ARS)</label>
                <input
                  type="number"
                  min="0"
                  value={editPrecio}
                  onChange={e => setEditPrecio(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#c0c0c0] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-[#9ca3af] uppercase tracking-wider mb-1.5 block">Stock</label>
                <input
                  type="number"
                  min="0"
                  value={editStock}
                  onChange={e => setEditStock(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#c0c0c0] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-[#9ca3af] uppercase tracking-wider mb-1.5 block">URL de imagen</label>
                <input
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={editImagen}
                  onChange={e => setEditImagen(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white placeholder-[#444] outline-none focus:border-[#c0c0c0] transition-colors text-sm"
                />
                {editImagen && (
                  <div className="mt-2 bg-white rounded-lg p-1 w-24 h-24 flex items-center justify-center border border-[#2a2a2a]">
                    <img
                      src={editImagen}
                      alt="preview"
                      className="max-w-full max-h-full object-contain"
                      onError={e => { e.currentTarget.parentElement!.innerHTML = '<span class="text-xs text-red-400 p-2">URL inválida</span>'; }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditProduct(null)}
                className="flex-1 border border-[#2a2a2a] hover:border-[#555] rounded-lg py-2.5 text-[#9ca3af] hover:text-white transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-[#c0c0c0] hover:bg-white disabled:opacity-50 text-black font-semibold rounded-lg py-2.5 transition-colors text-sm"
              >
                {saving ? 'Guardando...' : saveMsg || 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
