import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import AnimalsManager from "../../managers/animals.manager";
import Animal from "../../../logic/entities/Animal";

export function useDeleteAnimal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (animal: Animal) => AnimalsManager.delete(animal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.animals.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.animalsAdopted });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.animalsNonAdopted });
    },
  });
}
