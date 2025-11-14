import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTOS_VARIACIONES } from "../../graphql/queries/productQueries";

export function useVariacionesProductoMap(options = {}) {
  const { skip = false } = options ?? {};

  const { data, loading, error } = useQuery(GET_PRODUCTOS_VARIACIONES, {
    skip,
    fetchPolicy: "cache-first",
  });

  const variacionesMap = useMemo(() => {
    const map = new Map();
    if (!data?.productos) return map;

    data.productos.forEach((producto) => {
      if (!producto?.variaciones) return;
      producto.variaciones.forEach((variacion) => {
        if (!variacion?.id) return;
        map.set(String(variacion.id), {
          productoId: producto.id,
          productoNombre: producto.nombre,
          infoTalla: variacion.infoTalla,
          infoColor: variacion.infoColor,
        });
      });
    });

    return map;
  }, [data]);

  return {
    variacionesMap,
    loadingVariaciones: loading,
    errorVariaciones: error,
  };
}

