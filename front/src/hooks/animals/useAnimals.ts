import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../api/queryKeys";
import AnimalsManager from "../../managers/animals.manager";

export function useAnimals() {
  return useQuery({
    queryKey: queryKeys.animals.all,
    queryFn: () => AnimalsManager.getAll(),
  });
}
