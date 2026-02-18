export const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

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
          stock: Number(variacion.stock) || 0,
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
