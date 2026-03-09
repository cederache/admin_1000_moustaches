import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../api/queryKeys";
import AnimalsManager from "../../managers/animals.manager";
import Animal from "../../logic/entities/Animal";

export function useCreateAnimal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (animal: Animal) => AnimalsManager.create(animal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.animals.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.animalsNonAdopted });
    },
  });
}
