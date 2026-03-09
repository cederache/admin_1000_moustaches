import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../api/queryKeys";
import HostFamiliesManager from "../../managers/hostFamilies.manager";

type HostFamiliesParams = { kinds?: number[]; isAvailable?: boolean };

export function useHostFamilies(params?: HostFamiliesParams) {
  return useQuery({
    queryKey: queryKeys.hostFamilies.all(params),
    queryFn: () => HostFamiliesManager.getAll(params),
  });
}
