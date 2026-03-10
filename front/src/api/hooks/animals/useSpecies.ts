import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import AnimalsManager from "../../managers/animals.manager";

export function useSpecies() {
  return useQuery({
    queryKey: queryKeys.species.all,
    queryFn: () => AnimalsManager.getSpecies(),
  });
}
