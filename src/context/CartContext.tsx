import React, { createContext, useContext, useState, useEffect } from 'react';
import { OrderItem } from '../types';

interface CartContextType {
  cart: OrderItem[];
  addToCart: (item: { name: string; price: number; id?: string }) => void;
  decrementQuantity: (name: string) => void;
  removeFromCart: (name: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<OrderItem[]>([]);

  const addToCart = (item: { name: string; price: number; id?: string }) => {
    setCart(prev => {
      const existing = prev.find(i => i.name === item.name);
      if (existing) {
        return prev.map(i => i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: item.id || Math.random().toString(), name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const decrementQuantity = (name: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.name === name);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.name === name ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.name !== name);
    });
  };

  const removeFromCart = (name: string) => {
    setCart(prev => prev.filter(i => i.name !== name));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, decrementQuantity, removeFromCart, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
