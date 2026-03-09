import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import VeterinariansManager from "../../managers/veterinarians.manager";
import Veterinarian from "../../../logic/entities/Veterinarian";

export function useUpdateVeterinarian() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (veterinarian: Veterinarian) => VeterinariansManager.update(veterinarian),
    onSuccess: (updatedVeterinarian) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.veterinarians.all });
      if (updatedVeterinarian.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.veterinarians.detail(updatedVeterinarian.id),
        });
      }
    },
  });
}
