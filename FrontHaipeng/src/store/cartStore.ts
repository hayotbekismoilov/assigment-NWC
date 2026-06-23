import { create } from 'zustand';
import type { CartItem, Product } from '../types';

interface CartStore {
    items: CartItem[];
    isDrawerOpen: boolean;
    addItem: (product: Product, color?: string) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    openDrawer: () => void;
    closeDrawer: () => void;
    total: () => number;
    totalItems: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],
    isDrawerOpen: false,

    addItem: (product, color) => {
        const items = get().items;
        const existing = items.find((i) => i.product.id === product.id);
        if (existing) {
            set({
                items: items.map((i) =>
                    i.product.id === product.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                ),
            });
        } else {
            set({ items: [...items, { product, quantity: 1, color }] });
        }
        set({ isDrawerOpen: true });
    },

    removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.product.id !== productId) });
    },

    updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
            get().removeItem(productId);
            return;
        }
        set({
            items: get().items.map((i) =>
                i.product.id === productId ? { ...i, quantity } : i
            ),
        });
    },

    clearCart: () => set({ items: [] }),
    openDrawer: () => set({ isDrawerOpen: true }),
    closeDrawer: () => set({ isDrawerOpen: false }),

    total: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

    totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
