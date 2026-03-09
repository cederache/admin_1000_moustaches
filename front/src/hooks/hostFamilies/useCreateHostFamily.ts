import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../api/queryKeys";
import HostFamiliesManager from "../../managers/hostFamilies.manager";
import HostFamily from "../../logic/entities/HostFamily";

export function useCreateHostFamily() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (hostFamily: HostFamily) => HostFamiliesManager.create(hostFamily),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hostFamilies"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.hostFamiliesAvailable });
    },
  });
}
