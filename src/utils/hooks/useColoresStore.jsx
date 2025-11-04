import { useMutation, useQuery } from "@apollo/client";
import { GET_COLORS } from "../../graphql/queries/productQueries";
import {
  CREATE_COLORS,
  DELETE_COLORS,
} from "../../graphql/mutations/productMutatios";

export function useColoresStore() {
  const { data, loading, error, refetch } = useQuery(GET_COLORS);

  const [createColor] = useMutation(CREATE_COLORS, {
    update: (cache, { data }) => {
      const newColor = data?.createColor;
      if (!newColor) return;

      const existing = cache.readQuery({ query: GET_COLORS });
      const colores = existing?.colores ?? [];

      cache.writeQuery({
        query: GET_COLORS,
        data: { colores: [...colores, newColor] },
      });
    },
  });

  const [deleteColor] = useMutation(DELETE_COLORS, {
    update: (cache, { data }) => {
      const removed = data?.deleteColor;
      if (!removed) return;

      const existing = cache.readQuery({ query: GET_COLORS });
      const colores = existing?.colores ?? [];

      cache.writeQuery({
        query: GET_COLORS,
        data: {
          colores: colores.filter((color) => color.id !== removed.id),
        },
      });
    },
  });
  return {
    colores: data?.colores || [],
    loading,
    error,
    refetch,
    createColor,
    deleteColor,
  };
}
