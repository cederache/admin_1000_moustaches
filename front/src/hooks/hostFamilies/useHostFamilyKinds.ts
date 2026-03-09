import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../api/queryKeys";
import HostFamilyKindsManager from "../../managers/hostFamilyKinds.manager";

export function useHostFamilyKinds() {
  return useQuery({
    queryKey: queryKeys.hostFamilyKinds.all,
    queryFn: () => HostFamilyKindsManager.getAll(),
  });
}
