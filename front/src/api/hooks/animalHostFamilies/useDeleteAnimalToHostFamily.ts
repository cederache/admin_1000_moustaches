import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import AnimalsToHostFamiliesManager from "../../managers/animalsToHostFamilies.manager";
import AnimalToHostFamily from "../../../logic/entities/AnimalToHostFamily";

export function useDeleteAnimalToHostFamily() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (athf: AnimalToHostFamily) => AnimalsToHostFamiliesManager.delete(athf),
    onSuccess: (_, athf) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.animalHostFamilies.all });
      if (athf?.animal?.id != null) {
        queryClient.invalidateQueries({ queryKey: queryKeys.animals.detail(athf.animal.id) });
      }
    },
  });
}
