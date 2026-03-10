import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import VeterinarianInterventionsManager from "../../managers/veterinarianInterventions.manager";
import VeterinarianIntervention from "../../../logic/entities/VeterinarianIntervention";

export function useUpdateVeterinarianIntervention() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vetInter: VeterinarianIntervention) =>
      VeterinarianInterventionsManager.update(vetInter),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["veterinarianInterventions"] });
      if (updated.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.veterinarianInterventions.detail(updated.id),
        });
      }
    },
  });
}
