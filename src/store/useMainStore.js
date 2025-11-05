import { create } from "zustand";

const savedToken = localStorage.getItem("token");
const savedUser = JSON.parse(localStorage.getItem("user"));

export const useMainStore = create((set, get) => ({
  loginData: {
    user: savedUser,
    token: savedToken || null,
  },


  // otros
  productoWhere: {},
  usuarios: [],
  imgenFondo: null,
  ordenes: [],

  setProductoWhere: (where) => set({ productoWhere: where ?? {} }),
  setUsuarios: (usuarios) => set({ usuarios }),
  setImagenFondo: (imagenFondo) => set({ imagenFondo }),
  setOrdenes: (ordenes) => set({ ordenes }),
  setLoginData: (loginData) => set({ loginData }),

  addUsuario: (usuario) =>
    set((state) => ({
      usuarios: [...state.usuarios, usuario],
    })),
  addOrden: (orden) =>
    set((state) => ({
      ordenes: [...state.ordenes, orden],
    })),
  updateOrden: (updatedOrden) =>
    set((state) => ({
      ordenes: state.ordenes.map((orden) =>
        orden.id === updatedOrden.id ? { ...orden, ...updatedOrden } : orden
      ),
    })),

  delUsuario: (id) =>
    set((state) => ({
      usuarios: state.usuarios.filter((usuario) => usuario.id !== id),
    })),
  delOrden: (id) =>
    set((state) => ({
      ordenes: state.ordenes.filter((orden) => orden.id !== id),
    })),
  // Se corrige la definición para que la función sea estable.
  // Ahora, la función en el store es fija, y se le pasa el estado cuando se usa.
  getOrdenById: (id) => (state) =>
    state.ordenes.find((orden) => orden.id === id),
}));
