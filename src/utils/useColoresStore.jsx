import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_COLORS } from "../graphql/queries/productQueries";
import { useMainStore } from "../store/useMainStore";

export function useColoresStore() {
  const setColores = useMainStore((state) => state.setColores);
  const { data, loading, error } = useQuery(GET_COLORS);

  useEffect(() => {
    if (data?.colores) {
      setColores(data.colores);
    }
  }, [data, setColores]);

  return { loading, error };
}