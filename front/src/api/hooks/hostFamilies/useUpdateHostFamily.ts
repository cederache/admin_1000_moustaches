import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import HostFamiliesManager from "../../managers/hostFamilies.manager";
import HostFamily from "../../../logic/entities/HostFamily";

export function useUpdateHostFamily() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (hostFamily: HostFamily) => HostFamiliesManager.update(hostFamily),
    onSuccess: (updatedHostFamily) => {
      queryClient.invalidateQueries({ queryKey: ["hostFamilies"] });
      if (updatedHostFamily.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.hostFamilies.detail(updatedHostFamily.id),
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.hostFamiliesAvailable });
    },
  });
}
