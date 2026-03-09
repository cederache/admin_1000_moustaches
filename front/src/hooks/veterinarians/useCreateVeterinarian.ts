import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../api/queryKeys";
import VeterinariansManager from "../../managers/veterinarians.manager";
import Veterinarian from "../../logic/entities/Veterinarian";

export function useCreateVeterinarian() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (veterinarian: Veterinarian) => VeterinariansManager.create(veterinarian),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.veterinarians.all });
    },
  });
}
