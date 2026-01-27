import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, User, Order } from './types';

interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  total: number;
  clearCart: () => void;
  
  // Wishlist & Comparison
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  compareList: string[];
  toggleCompare: (productId: string) => void;
  clearCompare: () => void;

  // Checkout State
  checkoutStep: number;
  setCheckoutStep: (step: number) => void;
  paymentMethod: 'mpesa' | 'card' | 'paypal';
  setPaymentMethod: (method: 'mpesa' | 'card' | 'paypal') => void;
  installationTier: 'basic' | 'pro' | 'elite';
  setInstallationTier: (tier: 'basic' | 'pro' | 'elite') => void;

  // Auth & Account State
  user: User | null;
  isAuthenticated: boolean;
  lifetimeSpend: number;
  orderHistory: Order[];
  setUser: (user: User | null) => void;
  logout: () => void;
  addOrderToHistory: (order: Order) => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      total: 0,
      setIsOpen: (open) => set({ isOpen: open }),
      addItem: (product) => {
        const items = get().items;
        const existing = items.find((i) => i.id === product.id);
        let newItems;
        if (existing) {
          newItems = items.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          newItems = [...items, { ...product, quantity: 1 }];
        }
        const total = newItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
        set({ items: newItems, total, isOpen: !get().isAuthenticated || get().isOpen });
      },
      removeItem: (id) => {
        const items = get().items.filter((i) => i.id !== id);
        const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
        set({ items, total });
      },
      updateQuantity: (id, delta) => {
        const items = get().items.map((i) =>
          i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
        );
        const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
        set({ items, total });
      },
      clearCart: () => set({ items: [], total: 0 }),

      // Wishlist & Comparison
      wishlist: [],
      toggleWishlist: (id) => {
        const current = get().wishlist;
        set({ wishlist: current.includes(id) ? current.filter(x => x !== id) : [...current, id] });
      },
      compareList: [],
      toggleCompare: (id) => {
        const current = get().compareList;
        if (current.includes(id)) {
          set({ compareList: current.filter(x => x !== id) });
        } else if (current.length < 3) {
          set({ compareList: [...current, id] });
        }
      },
      clearCompare: () => set({ compareList: [] }),

      // Checkout
      checkoutStep: 1,
      setCheckoutStep: (checkoutStep) => set({ checkoutStep }),
      paymentMethod: 'mpesa',
      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
      installationTier: 'basic',
      setInstallationTier: (installationTier) => set({ installationTier }),

      // Auth & History
      user: null,
      isAuthenticated: false,
      lifetimeSpend: 845000, 
      orderHistory: [
        { 
          id: 'ORD_7721', 
          total_amount: 185000, 
          status: 'pending', 
          created_at: new Date(Date.now() - 86400000).toISOString(),
          items: [{ name: 'Hisense 75" U8K Mini-LED', price: 185000 }]
        },
        { 
          id: 'ORD_6542', 
          total_amount: 165000, 
          status: 'Paid', 
          created_at: new Date(Date.now() - 604800000).toISOString(),
          items: [{ name: 'iPhone 15 Pro Titanium', price: 165000 }]
        },
        { 
          id: 'ORD_4420', 
          total_amount: 54500, 
          status: 'delivered', 
          created_at: '2023-11-20T14:30:00Z',
          items: [{ name: 'Hisense 55" A6K UHD', price: 54500 }]
        },
        { 
          id: 'SRV_1029', 
          total_amount: 8500, 
          status: 'delivered', 
          created_at: '2023-10-15T09:15:00Z',
          items: [{ name: 'Master Calibration & Stealth Mount', price: 8500 }]
        }
      ],
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => {
        set({ user: null, isAuthenticated: false, items: [], orderHistory: [], lifetimeSpend: 0, wishlist: [], compareList: [] });
        localStorage.removeItem('sb-token');
      },
      addOrderToHistory: (order) => {
        const history = [order, ...get().orderHistory];
        const newSpend = get().lifetimeSpend + order.total_amount;
        set({ orderHistory: history, lifetimeSpend: newSpend });
      },
      updateProfile: (data) => {
        const user = get().user;
        if (user) {
          set({ user: { ...user, ...data } });
        }
      }
    }),
    {
      name: 'smart-duka-storage',
    }
  )
);