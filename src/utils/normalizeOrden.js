export const normalizeOrdenProductos = (orden, options = {}) => {
  const { variacionesMap } = options ?? {};
  if (!orden) return [];

  const normalizeLegacyProducto = (prod) => ({
    id: prod.id,
    nombre: prod.producto?.nombre ?? prod.nombre ?? "Producto",
    talla: prod.talla ?? prod.infoTalla?.nombre ?? "",
    color: prod.color ?? prod.infoColor?.nombre ?? "",
    cantidad: prod.cantidad ?? prod.ProductoOrden?.cantidad ?? prod.qty ?? 0,
    precioUnitario:
      prod.precioUnitario ??
      prod.ProductoOrden?.precioUnitario ??
      prod.price ??
      0,
  });

  if (Array.isArray(orden.productos) && orden.productos.length > 0) {
    return orden.productos.map((prod) => normalizeLegacyProducto(prod));
  }

  if (Array.isArray(orden.items) && orden.items.length > 0) {
    return orden.items.map((item) => {
      const variationInfo = variacionesMap?.get?.(String(item.id));
      return {
        id: item.id,
        nombre:
          variationInfo?.productoNombre ??
          item.producto?.nombre ??
          item.Producto?.nombre ??
          item.nombre ??
          "Producto",
        talla:
          variationInfo?.infoTalla?.nombre ??
          item.talla ??
          item.infoTalla?.nombre ??
          "",
        color:
          variationInfo?.infoColor?.nombre ??
          item.color ??
          item.infoColor?.nombre ??
          "",
        cantidad:
          item.ProductoOrden?.cantidad ?? item.cantidad ?? item.qty ?? 0,
        precioUnitario:
          item.ProductoOrden?.precioUnitario ??
          item.precioUnitario ??
          item.price ??
          0,
      };
    });
  }

  return [];
};

