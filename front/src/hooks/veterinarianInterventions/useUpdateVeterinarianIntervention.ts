import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../api/queryKeys";
import VeterinarianInterventionsManager from "../../managers/veterinarianInterventions.manager";
import VeterinarianIntervention from "../../logic/entities/VeterinarianIntervention";

export function useUpdateVeterinarianIntervention() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vetInter: VeterinarianIntervention) =>
      VeterinarianInterventionsManager.update(vetInter),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["veterinarianInterventions"] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.veterinarianInterventions.detail(updated.id),
      });
    },
  });
}
