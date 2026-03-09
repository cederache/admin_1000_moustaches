import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../api/queryKeys";
import AnimalsToHostFamiliesManager from "../../managers/animalsToHostFamilies.manager";

export function useAnimalHostFamiliesByHostFamily(hostFamilyId: number | null) {
  return useQuery({
    queryKey: queryKeys.animalHostFamilies.byHostFamily(hostFamilyId!),
    queryFn: () => AnimalsToHostFamiliesManager.getByHostFamilyId(hostFamilyId!),
    enabled: hostFamilyId != null && !Number.isNaN(hostFamilyId),
  });
}
