import { useMemo } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ORDENES } from "../../graphql/queries/productQueries";
import {
  CREATE_PEDIDO,
  DELETE_ORDEN,
  UPDATE_ORDEN_ESTADO,
} from "../../graphql/mutations/productMutatios";

function useNormalizedWhere(where = {}) {
  const serialized = JSON.stringify(where ?? {});
  return useMemo(() => JSON.parse(serialized), [serialized]);
}

export function useOrdenesStore(options = {}) {
  const { where = {}, skipQuery = false } = options ?? {};
  const normalizedWhere = useNormalizedWhere(where);
  const variables = useMemo(
    () => ({ where: normalizedWhere }),
    [normalizedWhere]
  );

  const {
    data,
    loading: loadingOrdenes,
    error: errorOrdenes,
    refetch,
  } = useQuery(GET_ORDENES, {
    variables,
    skip: skipQuery,
    fetchPolicy: "network-only",
  });

  const [createOrden, createOrdenState] = useMutation(CREATE_PEDIDO);

  const [updateOrdenEstado, updateOrdenEstadoState] = useMutation(
    UPDATE_ORDEN_ESTADO
  );

  const [deleteOrden, deleteOrdenState] = useMutation(DELETE_ORDEN, {
    update: (cache, { data: mutationData, variables: mutationVars }) => {
      const deletedId = mutationData?.deleteOrden ?? mutationVars?.id;
      if (!deletedId || skipQuery) return;

      const existing = cache.readQuery({
        query: GET_ORDENES,
        variables,
      });

      if (!existing?.ordenes) return;

      cache.writeQuery({
        query: GET_ORDENES,
        variables,
        data: {
          ordenes: existing.ordenes.filter((orden) => orden.id !== deletedId),
        },
      });
    },
  });

  return {
    ordenes: data?.ordenes ?? [],
    loadingOrdenes,
    errorOrdenes,
    refetchOrdenes: refetch,
    createOrden,
    creandoOrden: createOrdenState.loading,
    updateOrdenEstado,
    actualizandoOrden: updateOrdenEstadoState.loading,
    deleteOrden,
    eliminandoOrden: deleteOrdenState.loading,
  };
}
