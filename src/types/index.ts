export interface Product {
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

export interface Category {
  name: string;
  slug: string;
  icon: string;
  count: number;
  subcategories: Subcategory[];
}

export interface Subcategory {
  name: string;
  slug: string;
  count: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
