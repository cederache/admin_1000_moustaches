import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import AnimalsManager from "../../managers/animals.manager";
import Animal from "../../../logic/entities/Animal";

export function useUpdateAnimal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (animal: Animal) => AnimalsManager.update(animal),
    onSuccess: (updatedAnimal) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.animals.all });
      if (updatedAnimal.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.animals.detail(updatedAnimal.id),
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.animalsAdopted });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.animalsNonAdopted });
    },
  });
}
