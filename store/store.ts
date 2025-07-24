import { Product } from "@/sanity.types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import  {fabric}  from "fabric";
import { costEngine } from "@/lib/costEngine";

export interface BasketItem {
  product: Product;
  quantity: number;
}

export interface BasketState {
  items: BasketItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void; // Changed to productId
  getItemCount: (productId: string) => number;
  clearBasket: () => void;
  getTotalPrice: () => number;
  getGroupedItems: () => BasketItem[]; // Renamed for consistency
}

interface EditorState {
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas) => void;
  shirtStyle: "slim" | "oversized";
  toggleShirtStyle: () => void;
  totalCost: number;
  setTotalCost: (cost: number) => void;
  
  history: string[];
  setHistory: (history: string[]) => void;
  historyIndex: number;
  setHistoryIndex: (index: number) => void;

  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  canvas: null,
  setCanvas: (canvas) => {
    set({ canvas });
    // Initialize history with the initial canvas state
    const initialState = JSON.stringify(canvas.toJSON(['cost', 'type']));
    set({ history: [initialState], historyIndex: 0, canUndo: false, canRedo: false });
    // Set initial cost
    const cost = costEngine.calculate(canvas.getObjects());
    set({ totalCost: cost });
  },
  
  shirtStyle: "slim",
  toggleShirtStyle: () =>
    set((state) => ({
      shirtStyle: state.shirtStyle === "slim" ? "oversized" : "slim",
    })),
    
  totalCost: 6.00, // Initial base cost
  setTotalCost: (cost) => set({ totalCost: cost }),

  history: [],
  setHistory: (history) => set({ history, canUndo: get().historyIndex > 0, canRedo: get().historyIndex < history.length - 1 }),
  historyIndex: -1,
  setHistoryIndex: (index) => set({ historyIndex: index, canUndo: index > 0, canRedo: index < get().history.length - 1 }),

  undo: () => {
    const { history, historyIndex, canvas, setHistoryIndex, setTotalCost } = get();
    if (historyIndex > 0 && canvas) {
      const newIndex = historyIndex - 1;
      // Disable callbacks to prevent history duplication
      canvas.loadFromJSON(JSON.parse(history[newIndex]), () => {
        canvas.renderAll();
        const objects = canvas.getObjects();
        const cost = costEngine.calculate(objects);
        setTotalCost(cost);
        setHistoryIndex(newIndex);
      });
    }
  },

  redo: () => {
    const { history, historyIndex, canvas, setHistoryIndex, setTotalCost } = get();
    if (historyIndex < history.length - 1 && canvas) {
      const newIndex = historyIndex + 1;
      // Disable callbacks to prevent history duplication
      canvas.loadFromJSON(JSON.parse(history[newIndex]), () => {
        canvas.renderAll();
        const objects = canvas.getObjects();
        const cost = costEngine.calculate(objects);
        setTotalCost(cost);
        setHistoryIndex(newIndex);
      });
    }
  },
  
  canUndo: false,
  canRedo: false,
}));

const useBasketStore = create<BasketState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product._id === product._id
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return { items: [...state.items, { product, quantity: 1 }] };
          }
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.reduce((acc, item) => {
            if (item.product._id === productId) {
              if (item.quantity > 1) {
                acc.push({ ...item, quantity: item.quantity - 1 });
              } else {
                // Remove the item if quantity is 1
              }
            } else {
              acc.push(item);
            }
            return acc;
          }, [] as BasketItem[]),
        })),
      clearBasket: () => set({ items: [] }),
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + (item.product.price ?? 0) * item.quantity,
          0
        );
      },
      getItemCount: (productId) => {
        const item = get().items.find((item) => item.product._id === productId);
        return item ? item.quantity : 0;
      },
      getGroupedItems: () => get().items,
    }),
    {
      name: "basket-store",
      storage: createJSONStorage(() => localStorage), // Added storage
    }
  )
);

export default useBasketStore;
