import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_ORDENES } from "../graphql/queries/productQueries";
import { useMainStore } from "../store/useMainStore";

export function useOrdenesStore() {
  const setOrdenes = useMainStore((state) => state.setOrdenes);
  const { data, loading, error } = useQuery(GET_ORDENES);

  useEffect(() => {
    if (data?.ordenes) {
      setOrdenes(data.ordenes);
    }
  }, [data, setOrdenes]);

  return { loading, error };
}