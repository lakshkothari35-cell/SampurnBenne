export type Category = 'Dosas' | 'Idli' | 'Vada' | 'Uttapam' | 'Filter Coffee' | 'South Indian Meals' | 'Desserts';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  imageUrl: string;
  isPopular?: boolean;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  isApproved?: boolean;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivering' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  createdAt: string;
}
