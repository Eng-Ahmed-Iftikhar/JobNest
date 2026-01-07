import { useSearchLocationsQuery } from "@/api/services/locationApi";
import { useDebounce } from "./useDebounce";

export function useLocationSuggestions(
  query: string,
  locationSelected: boolean
) {
  const debouncedQuery = useDebounce(query, 400);

  const { data, isFetching } = useSearchLocationsQuery(debouncedQuery, {
    skip: debouncedQuery.length === 0 || locationSelected,
    refetchOnMountOrArgChange: true,
  });

  return {
    suggestions: data,
    isFetching,
  };
}
