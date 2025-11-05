import { useMutation, useQuery } from "@apollo/client";
import { useMainStore } from "../../store/useMainStore";
import {
  GET_PRODUCTOS,
  GET_ULTIMOS_PRODUCTOS,
} from "../../graphql/queries/productQueries";
import {
  CREATE_PRODUCTS,
  DELETE_PRODUCTS,
} from "../../graphql/mutations/productMutatios";

export function useProductosStore() {
  const productoWhere = useMainStore((s) => s.productoWhere);
  const setProductoWhere = useMainStore((s) => s.setProductoWhere);
  const { data, loading, error, refetch } = useQuery(GET_PRODUCTOS, {
    variables: { where: productoWhere ?? {} },
    fetchPolicy: "cache-and-network",
  });

  const [createProducto] = useMutation(CREATE_PRODUCTS, {
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GET_PRODUCTOS, variables: { where: productoWhere ?? {} } },
      { query: GET_ULTIMOS_PRODUCTOS },
    ],
  });

  const [deleteProducto] = useMutation(DELETE_PRODUCTS, {
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GET_PRODUCTOS, variables: { where: productoWhere ?? {} } },
      { query: GET_ULTIMOS_PRODUCTOS },
    ],
  });

  return {
    productos: data?.productos || [],
    loading,
    error,
    productoWhere,
    setProductoWhere,
    createProducto,
    deleteProducto,
    refetch,
  };
}
