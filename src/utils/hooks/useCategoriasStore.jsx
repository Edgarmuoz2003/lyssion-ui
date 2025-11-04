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
    update: (cache, { data, variables }) => {
      const removedId = data?.deleteCategoria ?? variables?.id;
      if (!removedId) return;

      cache.modify({
        fields: {
          categorias(existingRefs = [], { readField }) {
            return existingRefs.filter(
              (ref) => readField("id", ref) !== removedId
            );
          },
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
