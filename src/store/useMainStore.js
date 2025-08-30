import { create } from "zustand";

const savedToken = localStorage.getItem("token");
const savedUser = JSON.parse(localStorage.getItem("user"));

export const useMainStore = create((set) => ({
  loginData: {
    user: savedUser,
    token: savedToken || null,
  },
  productos: [],
  colores: [],
  tallas: [],
  categorias: [],
  usuarios: [],
  imgenFondo: null,

  setCategorias: (categorias) => set({ categorias }),
  setTallas: (tallas) => set({ tallas }),
  setColores: (colores) => set({ colores }),
  setProductos: (productos) => set({ productos }),
  setUsuarios: (usuarios) => set({ usuarios }),
  setImagenFondo: (imagenFondo) => set({ imagenFondo }),

  setLoginData: (loginData) => set({ loginData }),
  addProducto: (producto) =>
    set((state) => ({
      productos: [...state.productos, producto],
    })),
  addColor: (color) =>
    set((state) => ({
      colores: [...state.colores, color],
    })),
  addTalla: (talla) =>
    set((state) => ({
      tallas: [...state.tallas, talla],
    })),
  addCategoria: (categoria) =>
    set((state) => ({
      categorias: [...state.categorias, categoria],
    })),
  addUsuario: (usuario) =>
    set((state) => ({
      usuarios: [...state.usuarios, usuario],
    })),

  delColor: (id) =>
    set((state) => ({
      colores: state.colores.filter((color) => color.id !== id),
    })),
  delTalla: (id) =>
    set((state) => ({
      tallas: state.tallas.filter((talla) => talla.id !== id),
    })),
  delCategoria: (id) =>
    set((state) => ({
      categorias: state.categorias.filter((categoria) => categoria.id !== id),
    })),
  delUsuario: (id) =>
    set((state) => ({
      usuarios: state.usuarios.filter((usuario) => usuario.id !== id),
    })),
   delProducto: (id) =>
    set((state) => ({
      productos: state.productos.filter((producto) => producto.id !== id),
    })),
  }));
 