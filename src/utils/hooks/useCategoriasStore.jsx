import { useMutation, useQuery } from "@apollo/client";
import { GET_CATEGORIAS } from "../../graphql/queries/productQueries";
import {
  CREATE_CATEGORIAS,
  DELETE_CATEGORIAS,
} from "../../graphql/mutations/productMutatios";



export function useCategoriasStore() {
  const { data, loading, error, refetch } = useQuery(GET_CATEGORIAS);

  const [createCategoria] = useMutation(CREATE_CATEGORIAS, {
    update: (cache, { data }) => {
      const newCategoria = data?.createCategoria;
      if (!newCategoria) return;

      const existing = cache.readQuery({ query: GET_CATEGORIAS });
      const categorias = existing?.categorias ?? [];

      cache.writeQuery({
        query: GET_CATEGORIAS,
        data: { categorias: [...categorias, newCategoria] },
      });
    },
  });

  const [deleteCategoria] = useMutation(DELETE_CATEGORIAS, {
    update: (cache, { data }) => {
      const removed = data?.deleteCategoria;
      if (!removed) return;

      const existing = cache.readQuery({ query: GET_CATEGORIAS });
      const categorias = existing?.categorias ?? [];

      cache.writeQuery({
        query: GET_CATEGORIAS,
        data: {
          categorias: categorias.filter((categoria) => categoria.id !== removed.id),
        },
      });
    },
  });
  return { 
    categorias: data?.categorias || [],
    refetch,
    loading,
    error,
    createCategoria,
    deleteCategoria
  };
}