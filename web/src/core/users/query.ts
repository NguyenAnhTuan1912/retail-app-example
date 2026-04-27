import { useQuery } from "@tanstack/react-query";
import { usersApi } from "./api";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => usersApi.me(),
    staleTime: Infinity,
  });
}
