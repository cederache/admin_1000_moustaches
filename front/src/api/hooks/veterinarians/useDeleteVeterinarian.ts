import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import VeterinariansManager from "../../managers/veterinarians.manager";
import Veterinarian from "../../../logic/entities/Veterinarian";

export function useDeleteVeterinarian() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (veterinarian: Veterinarian) => VeterinariansManager.delete(veterinarian),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.veterinarians.all });
    },
  });
}
