import { create } from "zustand";

export const useProductsStore = create((set) => ({
    productos: [],
    colores: [],
    setColores: (colores) => set({ colores }),
    setProductos: (productos) => set({ productos }),
    addProducto: (producto) => set((state) => ({
        productos: [...state.productos, producto]
    })),
    addColor: (color) => set((state) => ({
        colores: [...state.colores, color]
      })),  
    delColor: (id) => set((state) => ({
        colores: state.colores.filter((color) => color.id !== id)
    })),
}));
