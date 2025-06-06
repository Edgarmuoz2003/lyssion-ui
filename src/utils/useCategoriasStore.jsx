import { useEffect } from "react";
import { useMainStore } from "../store/useMainStore";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIAS } from "../graphql/queries/productQueries";


export function useCategoriasStore() {
  const setCategorias = useMainStore((state) => state.setCategorias);
  const { data, loading, error } = useQuery(GET_CATEGORIAS);

  useEffect(() => {
    if (data?.categorias) {
      setCategorias(data.categorias);
    }
  }, [data, setCategorias]);

  return { loading, error };
}