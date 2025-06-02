import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_COLORS } from "../graphql/queries/productQueries";
import { useProductsStore } from "../store/useProductsStore";

export function useColoresStore() {
  const setColores = useProductsStore((state) => state.setColores);
  const { data, loading, error } = useQuery(GET_COLORS);

  useEffect(() => {
    if (data?.colores) {
      setColores(data.colores);
    }
  }, [data, setColores]);

  return { loading, error };
}