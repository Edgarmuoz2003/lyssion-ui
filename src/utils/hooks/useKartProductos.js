import { useCallback, useMemo } from "react";
import { useMainStore } from "../../store/useMainStore";

const emitKartUpdated = () => {
  if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
    window.dispatchEvent(new Event("kartUpdated"));
  }
};

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export function useKartProductos() {
  const kartProductos = useMainStore((state) => state.kartProductos);
  const setKartProductos = useMainStore((state) => state.setKartProductos);

  const safeKartProductos = Array.isArray(kartProductos) ? kartProductos : [];

  const hasProducts = useMemo(
    () => safeKartProductos.length > 0,
    [safeKartProductos.length]
  );

  const total = useMemo(() => {
    return safeKartProductos.reduce((acc, producto) => {
      const precio = toNumber(producto?.precio);
      const cantidad = toNumber(producto?.cantidad);
      return acc + precio * cantidad;
    }, 0);
  }, [safeKartProductos]);

  const addOrUpdateProduct = useCallback(
    (newProduct) => {
      if (!newProduct) return;
      const nextProducts = [...safeKartProductos];

      const existingIndex = nextProducts.findIndex((product) => {
        if (product?.variationId && newProduct?.variationId) {
          return Number(product.variationId) === Number(newProduct.variationId);
        }
        return (
          Number(product?.id) === Number(newProduct?.id) &&
          Number(product?.colorId) === Number(newProduct?.colorId) &&
          Number(product?.tallaId) === Number(newProduct?.tallaId)
        );
      });

      if (existingIndex >= 0) {
        const current = nextProducts[existingIndex];
        const mergedQuantity =
          toNumber(current?.cantidad) + toNumber(newProduct?.cantidad);
        nextProducts[existingIndex] = {
          ...current,
          ...newProduct,
          cantidad: mergedQuantity,
        };
      } else {
        nextProducts.push({ ...newProduct });
      }

      setKartProductos(nextProducts);
      emitKartUpdated();
    },
    [safeKartProductos, setKartProductos]
  );

  const clearKart = useCallback(() => {
    setKartProductos([]);
    emitKartUpdated();
  }, [setKartProductos]);

  const removeProductAt = useCallback(
    (index) => {
      if (index < 0 || index >= safeKartProductos.length) return;
      const nextProducts = safeKartProductos.filter((_, idx) => idx !== index);
      setKartProductos(nextProducts);
      emitKartUpdated();
    },
    [safeKartProductos, setKartProductos]
  );

  return {
    kartProductos: safeKartProductos,
    hasProducts,
    total,
    addOrUpdateProduct,
    clearKart,
    removeProductAt,
  };
}
