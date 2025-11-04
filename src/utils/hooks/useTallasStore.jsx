import { useMutation, useQuery } from "@apollo/client";
import { GET_TALLAS } from "../../graphql/queries/productQueries";
import { CREATE_TALLAS, DELETE_TALLAS } from "../../graphql/mutations/productMutatios";

export function useTallasStore() {
  const { data, loading, error, refetch } = useQuery(GET_TALLAS);

  const [createTalla] = useMutation(CREATE_TALLAS, {
    update: (cache, { data }) => {
      const newTalla = data?.createTalla;
      if (!newTalla) return;

      const existing = cache.readQuery({ query: GET_TALLAS });
      const tallas = existing?.tallas ?? [];

      cache.writeQuery({
        query: GET_TALLAS,
        data: { tallas: [...tallas, newTalla] },
      });
    },
  });

  const [deleteTalla] = useMutation(DELETE_TALLAS, {
    update: (cache, { data, variables }) => {
      const removedId = data?.deleteTalla ?? variables?.id;
      if (!removedId) return;

      cache.modify({
        fields: {
          tallas(existingRefs = [], { readField }) {
            return existingRefs.filter(
              (ref) => readField("id", ref) !== removedId
            );
          },
        },
      });
    },
  });

  return {
    tallas: data?.tallas || [],
    loading,
    error,
    refetch,
    createTalla,
    deleteTalla,
  };
}
