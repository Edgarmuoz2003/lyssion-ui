import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_CLIENTES, GET_COLORS } from "../../graphql/queries/productQueries";
import { useMainStore } from "../../store/useMainStore";

export function useClienteStore() {
  const setClientes = useMainStore((state) => state.setClientes);
  const { data, loading, error } = useQuery(GET_CLIENTES);

  useEffect(() => {
    if (data?.clientes) {
      setClientes(data.clientes);
    }
  }, [data, setClientes]);

  return { loading, error };
}