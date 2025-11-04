import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_TALLAS } from "../../graphql/queries/productQueries";
import { useMainStore } from "../../store/useMainStore";

export function useTallasStore() {
  const setTallas = useMainStore((state) => state.setTallas);
  const { data, loading, error } = useQuery(GET_TALLAS);

  useEffect(() => {
    if (data?.tallas) {
      setTallas(data.tallas);
    }
  }, [data, setTallas]);

  return { loading, error };
}