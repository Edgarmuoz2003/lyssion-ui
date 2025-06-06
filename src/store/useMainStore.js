import { create } from "zustand";

export const useMainStore = create((set) => ({
    productos: [],
    colores: [],
    tallas: [],
    categorias: [],
    
    setCategorias: (categorias) => set({ categorias }),
    setTallas: (tallas) => set({ tallas }),
    setColores: (colores) => set({ colores }),
    setProductos: (productos) => set({ productos }),

    addProducto: (producto) => set((state) => ({
        productos: [...state.productos, producto]
    })),
    addColor: (color) => set((state) => ({
        colores: [...state.colores, color]
      })),
    addTalla: (talla) => set((state) => ({
        tallas: [...state.tallas, talla]
    })), 
    addCategoria: (categoria) => set((state) => ({
        categorias: [...state.categorias, categoria]
    })), 

    delColor: (id) => set((state) => ({
        colores: state.colores.filter((color) => color.id !== id)
    })),
    delTalla: (id) => set((state) => ({
        tallas: state.tallas.filter((talla) => talla.id !== id)
    })),
    delCategoria: (id) => set((state) => ({
        categorias: state.categorias.filter((categoria) => categoria.id !== id)
    })),
}));
