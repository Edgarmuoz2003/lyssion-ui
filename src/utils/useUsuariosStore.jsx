import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_USUARIO } from "../graphql/queries/productQueries";
import { useMainStore } from "../store/useMainStore";

export function useUsuariosStore() {
  const setUsuarios = useMainStore((state) => state.setUsuarios);
  const { data, loading, error } = useQuery(GET_USUARIO);

  useEffect(() => {
    if (data?.usuarios) {
      setUsuarios(data.usuarios);
    }
  }, [data, setUsuarios]);

  return { loading, error };
}