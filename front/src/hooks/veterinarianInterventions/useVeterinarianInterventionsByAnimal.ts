import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../api/queryKeys";
import VeterinarianInterventionsManager from "../../managers/veterinarianInterventions.manager";

export function useVeterinarianInterventionsByAnimal(animalId: number | null) {
  return useQuery({
    queryKey: queryKeys.veterinarianInterventions.byAnimal(animalId!),
    queryFn: () => VeterinarianInterventionsManager.getByAnimalId(animalId!),
    enabled: animalId != null && !Number.isNaN(animalId),
  });
}
