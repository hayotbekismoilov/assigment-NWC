export type ProductCategory = 'motorcycle' | 'scooter' | 'electric' | 'accessories' | 'cross' | 'atv' | 'tricycle' | 'parts' | 'helmets' | 'tires';

export interface ProductSpec {
  engine?: string;
  power?: string;
  maxSpeed?: string;
  fuelCapacity?: string;
  weight?: string;
  seatHeight?: string;
  range?: string;
  brakes?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  oldPrice?: number;
  image: string;
  images: string[];
  badge?: 'New' | 'Popular' | 'Sale' | 'Electric';
  description: string;
  specs: ProductSpec;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  colors?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  color?: string;
}

export interface Category {
  id: ProductCategory;
  name: string;
  nameUz: string;
  description: string;
  image: string;
  count: number;
}

export interface FilterState {
  category: ProductCategory | 'all';
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  sortBy: 'price-asc' | 'price-desc' | 'rating' | 'newest';
}
