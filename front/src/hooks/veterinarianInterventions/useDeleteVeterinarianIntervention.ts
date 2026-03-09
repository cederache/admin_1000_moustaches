import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../api/queryKeys";
import VeterinarianInterventionsManager from "../../managers/veterinarianInterventions.manager";
import VeterinarianIntervention from "../../logic/entities/VeterinarianIntervention";

export function useDeleteVeterinarianIntervention() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vetInter: VeterinarianIntervention) =>
      VeterinarianInterventionsManager.delete(vetInter),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["veterinarianInterventions"] });
    },
  });
}
