import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import VeterinarianInterventionsManager from "../../managers/veterinarianInterventions.manager";
import VeterinarianIntervention from "../../../logic/entities/VeterinarianIntervention";

export function useCreateVeterinarianIntervention() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vetInter: VeterinarianIntervention) =>
      VeterinarianInterventionsManager.create(vetInter),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["veterinarianInterventions"] });
    },
  });
}
