import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import AnimalsManager from "../../managers/animals.manager";

export function useAnimal(id: number | null) {
  return useQuery({
    queryKey: queryKeys.animals.detail(id!),
    queryFn: () => AnimalsManager.getById(id!),
    enabled: id != null && !Number.isNaN(id),
  });
}
