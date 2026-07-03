// Script de migración: importa products.json a Supabase
// Ejecutar con: node migrate-to-supabase.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://cvhztsyrqtlkiqztqxpn.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2aHp0c3lycXRsa2lxenRxeHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwOTI4MzEsImV4cCI6MjA5ODY2ODgzMX0.xJxnq-F0fwbrM11zDDi8KQc4A4gkEbpUuSzenhh49CU';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  const filePath = path.join(__dirname, 'src', 'data', 'products.json');
  const products = JSON.parse(fs.readFileSync(filePath, 'utf-8')).map((p) => ({
    ...p,
    stock: Math.max(0, Math.round(Number(p.stock) || 0)),
    precio: Number(p.precio) || 0,
  }));

  console.log(`Importando ${products.length} productos a Supabase...`);

  const BATCH = 100;
  for (let i = 0; i < products.length; i += BATCH) {
    const batch = products.slice(i, i + BATCH);
    const { error } = await supabase.from('products').upsert(batch, { onConflict: 'id' });
    if (error) {
      console.error(`Error en el batch ${i}-${i + BATCH}:`, error.message);
      process.exit(1);
    }
    console.log(`  ✓ ${Math.min(i + BATCH, products.length)} / ${products.length}`);
  }

  console.log('\n¡Migración completada!');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
