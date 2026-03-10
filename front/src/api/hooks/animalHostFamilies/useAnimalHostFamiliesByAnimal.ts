import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import AnimalsToHostFamiliesManager from "../../managers/animalsToHostFamilies.manager";

export function useAnimalHostFamiliesByAnimal(animalId: number | null) {
  return useQuery({
    queryKey: queryKeys.animalHostFamilies.byAnimal(animalId!),
    queryFn: () => AnimalsToHostFamiliesManager.getByAnimalId(animalId!),
    enabled: animalId != null && !Number.isNaN(animalId),
  });
}
