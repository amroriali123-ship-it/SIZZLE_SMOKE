import React, { createContext, useContext, useState } from 'react';
import { CartItem, MenuItem, CartItemOption } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity?: number, selectedOptions?: CartItemOption[], specialNotes?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  subtotal: number;
  vat: number;
  grandTotal: number;
  lastOrderTicket: {
    orderNumber: string;
    items: CartItem[];
    total: number;
    timestamp: string;
  } | null;
  submitSimulatedOrder: () => string;
  dismissOrderTicket: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastOrderTicket, setLastOrderTicket] = useState<{
    orderNumber: string;
    items: CartItem[];
    total: number;
    timestamp: string;
  } | null>(null);

  const addToCart = (
    item: MenuItem,
    quantity = 1,
    selectedOptions: CartItemOption[] = [],
    specialNotes = ''
  ) => {
    setCart(prev => {
      // Check if identical item with identical options already exists
      const optionsKey = selectedOptions.map(o => o.name.en).sort().join('|');
      const existingIndex = prev.findIndex(
        ci => ci.item.id === item.id &&
              ci.specialNotes === specialNotes &&
              ci.selectedOptions.map(o => o.name.en).sort().join('|') === optionsKey
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      const newItem: CartItem = {
        cartItemId: `${item.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        item,
        quantity,
        selectedOptions,
        specialNotes,
      };
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.cartItemId === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cart.reduce((sum, item) => {
    const optionsTotal = item.selectedOptions.reduce((optSum, o) => optSum + o.price, 0);
    return sum + (item.item.price + optionsTotal) * item.quantity;
  }, 0);

  const vat = Math.round(subtotal * 0.15 * 100) / 100;
  const grandTotal = Math.round((subtotal + vat) * 100) / 100;

  const submitSimulatedOrder = () => {
    const orderNum = `SZ-${Math.floor(1000 + Math.random() * 9000)}`;
    setLastOrderTicket({
      orderNumber: orderNum,
      items: [...cart],
      total: grandTotal,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    setCart([]);
    return orderNum;
  };

  const dismissOrderTicket = () => {
    setLastOrderTicket(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        subtotal,
        vat,
        grandTotal,
        lastOrderTicket,
        submitSimulatedOrder,
        dismissOrderTicket,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
