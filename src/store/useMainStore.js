import { create } from "zustand";

const savedToken = localStorage.getItem("token");
const savedUser = JSON.parse(localStorage.getItem("user"));
const savedPriceMode = localStorage.getItem("priceMode") || "detal";

const readKart = () => {
  try {
    const stored = localStorage.getItem("kartProducts");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const useMainStore = create((set, get) => ({
  loginData: {
    user: savedUser,
    token: savedToken || null,
  },
  kartProductos: readKart(),
  productoWhere: {},
  usuarios: [],
  imgenFondo: null,
  priceMode: savedPriceMode,

  setProductoWhere: (where) => set({ productoWhere: where ?? {} }),
  setUsuarios: (usuarios) => set({ usuarios }),
  setImagenFondo: (imagenFondo) => set({ imagenFondo }),
  setLoginData: (loginData) => set({ loginData }),
  setPriceMode: (priceMode) =>
    set(() => {
      localStorage.setItem("priceMode", priceMode);
      return { priceMode };
    }),
  setKartProductos: (kartProductos) =>
    set(() => {
      localStorage.setItem("kartProducts", JSON.stringify(kartProductos));
      return { kartProductos };
    }),

  addUsuario: (usuario) =>
    set((state) => ({
      usuarios: [...state.usuarios, usuario],
    })),
  delUsuario: (id) =>
    set((state) => ({
      usuarios: state.usuarios.filter((usuario) => usuario.id !== id),
    })),
}));
