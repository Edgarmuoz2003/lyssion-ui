import { useCallback, useEffect, useMemo } from "react";
import { useMainStore } from "../../store/useMainStore";
import { getVariationPriceByMode } from "@/components/detalle.helpers";

const emitKartUpdated = () => {
  if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
    window.dispatchEvent(new Event("kartUpdated"));
  }
};

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const resolveKartProductPrice = (producto, priceMode) => {
  const resolvedPrice = getVariationPriceByMode(
    {
      precio: producto?.precioDetal ?? producto?.precio,
      precioMayorista: producto?.precioMayorista,
    },
    priceMode,
  );

  return Number.isFinite(resolvedPrice)
    ? resolvedPrice
    : toNumber(producto?.precio);
};

export function useKartProductos() {
  const kartProductos = useMainStore((state) => state.kartProductos);
  const setKartProductos = useMainStore((state) => state.setKartProductos);
  const priceMode = useMainStore((state) => state.priceMode);

  const safeKartProductos = Array.isArray(kartProductos) ? kartProductos : [];
  const resolvedKartProductos = useMemo(() => {
    return safeKartProductos.map((producto) => ({
      ...producto,
      precio: resolveKartProductPrice(producto, priceMode),
    }));
  }, [safeKartProductos, priceMode]);

  useEffect(() => {
    if (!safeKartProductos.length) return;

    const shouldSyncPrices = safeKartProductos.some((producto) => {
      return toNumber(producto?.precio) !== resolveKartProductPrice(producto, priceMode);
    });

    if (!shouldSyncPrices) return;

    setKartProductos(
      safeKartProductos.map((producto) => ({
        ...producto,
        precio: resolveKartProductPrice(producto, priceMode),
      })),
    );
  }, [priceMode, safeKartProductos, setKartProductos]);

  const hasProducts = useMemo(
    () => safeKartProductos.length > 0,
    [safeKartProductos.length]
  );

  const total = useMemo(() => {
    return resolvedKartProductos.reduce((acc, producto) => {
      const precio = toNumber(producto?.precio);
      const cantidad = toNumber(producto?.cantidad);
      return acc + precio * cantidad;
    }, 0);
  }, [resolvedKartProductos]);

  const totalQuantity = useMemo(() => {
    return safeKartProductos.reduce((acc, producto) => {
      return acc + toNumber(producto?.cantidad);
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
    kartProductos: resolvedKartProductos,
    hasProducts,
    total,
    totalQuantity,
    addOrUpdateProduct,
    clearKart,
    removeProductAt,
  };
}
