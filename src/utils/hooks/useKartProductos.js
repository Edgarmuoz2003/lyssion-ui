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

const normalizeKartProductPricing = (producto) => {
  const fallbackDetalPrice = toNumber(producto?.precio);
  const detalPrice = Number(producto?.precioDetal);
  const wholesalePrice = Number(producto?.precioMayorista);

  return {
    ...producto,
    precioDetal: Number.isFinite(detalPrice) && detalPrice > 0 ? detalPrice : fallbackDetalPrice,
    precioMayorista:
      Number.isFinite(wholesalePrice) && wholesalePrice > 0 ? wholesalePrice : null,
  };
};

const resolveKartProductPrice = (producto, priceMode) => {
  const normalizedProduct = normalizeKartProductPricing(producto);
  const resolvedPrice = getVariationPriceByMode(
    {
      precio: normalizedProduct.precioDetal,
      precioMayorista: normalizedProduct.precioMayorista,
    },
    priceMode,
  );

  return Number.isFinite(resolvedPrice) ? resolvedPrice : normalizedProduct.precioDetal;
};

export function useKartProductos() {
  const kartProductos = useMainStore((state) => state.kartProductos);
  const setKartProductos = useMainStore((state) => state.setKartProductos);
  const priceMode = useMainStore((state) => state.priceMode);

  const safeKartProductos = Array.isArray(kartProductos) ? kartProductos : [];
  const resolvedKartProductos = useMemo(() => {
    return safeKartProductos.map((producto) => {
      const normalizedProduct = normalizeKartProductPricing(producto);

      return {
        ...normalizedProduct,
        precio: resolveKartProductPrice(normalizedProduct, priceMode),
      };
    });
  }, [safeKartProductos, priceMode]);

  useEffect(() => {
    if (!safeKartProductos.length) return;

    const shouldSyncPrices = safeKartProductos.some((producto) => {
      const normalizedProduct = normalizeKartProductPricing(producto);

      return (
        toNumber(normalizedProduct?.precio) !==
          resolveKartProductPrice(normalizedProduct, priceMode) ||
        toNumber(producto?.precioDetal) !== normalizedProduct.precioDetal ||
        toNumber(producto?.precioMayorista) !== toNumber(normalizedProduct.precioMayorista)
      );
    });

    if (!shouldSyncPrices) return;

    setKartProductos(
      safeKartProductos.map((producto) => {
        const normalizedProduct = normalizeKartProductPricing(producto);

        return {
          ...normalizedProduct,
          precio: resolveKartProductPrice(normalizedProduct, priceMode),
        };
      }),
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
      const normalizedNewProduct = normalizeKartProductPricing(newProduct);

      const existingIndex = nextProducts.findIndex((product) => {
        if (product?.variationId && normalizedNewProduct?.variationId) {
          return Number(product.variationId) === Number(normalizedNewProduct.variationId);
        }
        return (
          Number(product?.id) === Number(normalizedNewProduct?.id) &&
          Number(product?.colorId) === Number(normalizedNewProduct?.colorId) &&
          Number(product?.tallaId) === Number(normalizedNewProduct?.tallaId)
        );
      });

      if (existingIndex >= 0) {
        const current = nextProducts[existingIndex];
        const mergedQuantity =
          toNumber(current?.cantidad) + toNumber(normalizedNewProduct?.cantidad);
        nextProducts[existingIndex] = {
          ...current,
          ...normalizeKartProductPricing(current),
          ...normalizedNewProduct,
          cantidad: mergedQuantity,
        };
      } else {
        nextProducts.push({ ...normalizedNewProduct });
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
