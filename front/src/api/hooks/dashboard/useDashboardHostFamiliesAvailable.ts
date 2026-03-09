import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import hostFamiliesAvailabledManager from "../../managers/hostFamiliesAvailable.manager";

export function useDashboardHostFamiliesAvailable() {
  return useQuery({
    queryKey: queryKeys.dashboard.hostFamiliesAvailable,
    queryFn: () => hostFamiliesAvailabledManager.getAll(),
  });
}
