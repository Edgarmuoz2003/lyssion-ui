import { useMemo } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CLIENTES } from "../../graphql/queries/productQueries";
import {
  CREATE_CLIENTE,
  UPDATE_CLIENTE,
} from "../../graphql/mutations/productMutatios";

function useNormalizedWhere(where = {}) {
  const serialized = JSON.stringify(where ?? {});
  return useMemo(() => JSON.parse(serialized), [serialized]);
}

export function useClienteStore(options = {}) {
  const { where = {}, skipQuery = false } = options ?? {};
  const normalizedWhere = useNormalizedWhere(where);
  const variables = useMemo(
    () => ({ where: normalizedWhere }),
    [normalizedWhere]
  );

  const {
    data,
    loading: loadingClientes,
    error: errorClientes,
    refetch,
  } = useQuery(GET_CLIENTES, {
    variables,
    skip: skipQuery,
    fetchPolicy: "network-only",
  });

  const [createCliente, createClienteState] = useMutation(CREATE_CLIENTE);
  const [updateCliente, updateClienteState] = useMutation(UPDATE_CLIENTE);

  return {
    clientes: data?.clientes ?? [],
    loadingClientes,
    errorClientes,
    refetchClientes: refetch,
    createCliente,
    creandoCliente: createClienteState.loading,
    updateCliente,
    actualizandoCliente: updateClienteState.loading,
  };
}
