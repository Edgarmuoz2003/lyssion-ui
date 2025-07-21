import { useQuery } from "@apollo/client";
import { useMainStore } from "../store/useMainStore";
import { useEffect } from "react";
import { GET_PRODUCTOS } from "../graphql/queries/productQueries";

export function useProductosStore() {
  const setProductos = useMainStore((state) => state.setProductos);
  const { data, loading, error } = useQuery(GET_PRODUCTOS, {
    variables: { where: {} }, 
  });

  useEffect(() => {
    if (data?.productos) {
      setProductos(data.productos);
    }
  }, [data, setProductos]);

  return { loading, error };
}
