import { useMutation, useQuery } from "@apollo/client";
import { useMainStore } from "../../store/useMainStore";
import {
  GET_PRODUCTOS,
  GET_ULTIMOS_PRODUCTOS,
} from "../../graphql/queries/productQueries";
import {
  CREATE_PRODUCTS,
  DELETE_PRODUCTS,
  UPDATE_PRODUCTS,
} from "../../graphql/mutations/productMutatios";

const sanitizeWhereForApi = (where) => {
  if (!where || typeof where !== "object") return {};

  const safeWhere = { ...where };

  if (safeWhere.nombre && typeof safeWhere.nombre === "object") {
    const fallbackValue =
      safeWhere.nombre.contains ??
      safeWhere.nombre.containsi ??
      safeWhere.nombre.eq;

    if (typeof fallbackValue === "string") {
      safeWhere.nombre = fallbackValue;
    } else {
      delete safeWhere.nombre;
    }
  }

  return safeWhere;
};

export function useProductosStore() {
  const productoWhere = useMainStore((s) => s.productoWhere);
  const setProductoWhere = useMainStore((s) => s.setProductoWhere);
  const safeWhere = sanitizeWhereForApi(productoWhere);

  const { data, loading, error, refetch } = useQuery(GET_PRODUCTOS, {
    variables: { where: safeWhere },
    fetchPolicy: "cache-and-network",
  });

  const [createProducto, { loading: creandoProducto }] = useMutation(CREATE_PRODUCTS, {
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GET_PRODUCTOS, variables: { where: safeWhere } },
      { query: GET_ULTIMOS_PRODUCTOS },
    ],
  });

  const [deleteProducto] = useMutation(DELETE_PRODUCTS, {
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GET_PRODUCTOS, variables: { where: safeWhere } },
      { query: GET_ULTIMOS_PRODUCTOS },
    ],
  });

  const [updateProducto, { loading: actualizandoProducto }] = useMutation(
    UPDATE_PRODUCTS,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        { query: GET_PRODUCTOS, variables: { where: safeWhere } },
        { query: GET_ULTIMOS_PRODUCTOS },
      ],
    },
  );

  return {
    productos: data?.productos || [],
    creando: creandoProducto,
    actualizando: actualizandoProducto,
    loading,
    error,
    productoWhere,
    setProductoWhere,
    createProducto,
    updateProducto,
    deleteProducto,
    refetch,
  };
}
