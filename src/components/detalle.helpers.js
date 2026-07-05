export const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const getPriceModeLabel = (priceMode) =>
  priceMode === "mayorista" ? "al por mayor" : "al detal";

export const getVariationPriceByMode = (variacion, priceMode = "detal") => {
  const detal = Number(variacion?.precio);
  const mayorista = Number(variacion?.precioMayorista);

  if (
    priceMode === "mayorista" &&
    Number.isFinite(mayorista) &&
    mayorista > 0
  ) {
    return mayorista;
  }

  return Number.isFinite(detal) ? detal : null;
};

export const getProductPriceByMode = (producto, priceMode = "detal") => {
  const prices =
    producto?.variaciones
      ?.map((variacion) => getVariationPriceByMode(variacion, priceMode))
      .filter((precio) => Number.isFinite(precio)) || [];

  return prices.length > 0 ? Math.min(...prices) : null;
};

export const getCheapestVariationByMode = (
  variaciones = [],
  priceMode = "detal",
) => {
  return (variaciones || []).reduce((cheapest, variacion) => {
    const currentPrice = getVariationPriceByMode(variacion, priceMode);
    if (!Number.isFinite(currentPrice)) {
      return cheapest;
    }

    if (!cheapest) {
      return variacion;
    }

    const cheapestPrice = getVariationPriceByMode(cheapest, priceMode);
    if (!Number.isFinite(cheapestPrice) || currentPrice < cheapestPrice) {
      return variacion;
    }

    return cheapest;
  }, null);
};

export const getPrincipalImage = (colorEntry) => {
  if (!colorEntry?.imagenes?.length) return null;
  return (
    colorEntry.imagenes.find((imagen) => Boolean(imagen?.isPrincipal)) ||
    colorEntry.imagenes[0]
  );
};

export const ensurePrincipalImage = (imagenes) => {
  const normalized = imagenes.map((img) => ({ ...img }));
  if (normalized.length > 0 && !normalized.some((img) => img.isPrincipal)) {
    normalized[0].isPrincipal = true;
  }
  return normalized;
};

export const buildEditDraft = (producto) => {
  if (!producto) return null;

  return {
    nombre: producto.nombre || "",
    descripcion: producto.descripcion || "",
    categoriaId: producto.categoria?.id || "",
    colores: (producto.coloresDisponibles || []).map((colorEntry) => {
      const colorVariaciones = (producto.variaciones || []).filter(
        (variacion) =>
          Number(variacion?.infoColor?.id) === Number(colorEntry?.color?.id),
      );

      return {
        id: colorEntry.id,
        colorId: colorEntry.color?.id,
        color: {
          id: colorEntry.color?.id,
          nombre: colorEntry.color?.nombre,
          codigo_hex: colorEntry.color?.codigo_hex,
        },
        imagenes: (colorEntry.imagenes || []).map((img) => ({
          id: img.id,
          url: img.url,
          isPrincipal: Boolean(img.isPrincipal),
          isNew: false,
          file: null,
        })),
        variaciones: colorVariaciones.map((variacion) => ({
          id: variacion.id,
          tallaId: variacion.infoTalla?.id,
          tallaNombre: variacion.infoTalla?.nombre,
          precio: Number(variacion.precio) || 0,
          precioMayorista:
            Number(variacion.precioMayorista) > 0
              ? Number(variacion.precioMayorista)
              : "",
          stock: Number(variacion.stock) || 0,
        })),
      };
    }),
  };
};

export const buildProductoUpdateInput = (draft) => {
  if (!draft) return null;

  return {
    nombre: draft.nombre.trim(),
    descripcion: draft.descripcion.trim(),
    categoriaId: draft.categoriaId,
    colores: draft.colores.map((color) => {
      const normalizedImages = ensurePrincipalImage(color.imagenes || []);

      return {
        id: color.id || undefined,
        colorId: color.colorId,
        imagenes: normalizedImages.map((img) =>
          img.isNew
            ? {
                archivo: img.file,
                isPrincipal: Boolean(img.isPrincipal),
              }
            : {
                id: img.id,
                isPrincipal: Boolean(img.isPrincipal),
              },
        ),
        variaciones: color.variaciones.map((variacion) => ({
          id: variacion.id || undefined,
          tallaId: variacion.tallaId,
          precio: Number(variacion.precio),
          precioMayorista:
            variacion.precioMayorista === "" ||
            variacion.precioMayorista === null ||
            variacion.precioMayorista === undefined
              ? null
              : Number(variacion.precioMayorista),
          stock: Number(variacion.stock),
        })),
      };
    }),
  };
};

export const cleanupDraftObjectUrls = (draft) => {
  if (!draft?.colores?.length) return;

  draft.colores.forEach((color) => {
    (color.imagenes || []).forEach((img) => {
      if (img.isNew && img.url) {
        URL.revokeObjectURL(img.url);
      }
    });
  });
};
