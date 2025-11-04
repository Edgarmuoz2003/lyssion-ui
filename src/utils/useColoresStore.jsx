import { useQuery } from "@apollo/client";
import { GET_COLORS } from "../graphql/queries/productQueries";


export function useColoresStore() {
  const { data, loading, error, refetch } = useQuery(GET_COLORS);
  return { colores: data?.colores || [], loading, error, refetch };
}