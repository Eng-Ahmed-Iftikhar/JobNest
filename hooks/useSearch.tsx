import { useContext } from "react";
import { SearchContext, SearchContextType } from "@/contexts/SearchContext";

export function useSearch(): SearchContextType {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
