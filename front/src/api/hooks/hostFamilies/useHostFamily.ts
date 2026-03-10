import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import HostFamiliesManager from "../../managers/hostFamilies.manager";

export function useHostFamily(id: number | null) {
  return useQuery({
    queryKey: queryKeys.hostFamilies.detail(id!),
    queryFn: () => HostFamiliesManager.getById(id!),
    enabled: id != null && !Number.isNaN(id),
  });
}
