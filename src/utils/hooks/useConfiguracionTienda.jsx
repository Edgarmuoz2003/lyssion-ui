import { useMutation, useQuery } from "@apollo/client";
import { GET_CONFIGURACION_TIENDA } from "../../graphql/queries/productQueries";
import { UPDATE_CONFIGURACION_TIENDA } from "../../graphql/mutations/productMutatios";

export function useConfiguracionTienda(options = {}) {
  const { skipQuery = false } = options;
  const {
    data,
    loading: loadingConfiguracionTienda,
    error: errorConfiguracionTienda,
    refetch,
  } = useQuery(GET_CONFIGURACION_TIENDA, {
    skip: skipQuery,
    fetchPolicy: "network-only",
  });

  const [updateConfiguracionTienda, updateState] = useMutation(
    UPDATE_CONFIGURACION_TIENDA
  );

  return {
    configuracionTienda: data?.configuracionTienda ?? null,
    loadingConfiguracionTienda,
    errorConfiguracionTienda,
    refetchConfiguracionTienda: refetch,
    updateConfiguracionTienda,
    actualizandoConfiguracionTienda: updateState.loading,
  };
}
