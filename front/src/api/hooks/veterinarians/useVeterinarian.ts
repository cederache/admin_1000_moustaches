import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import VeterinariansManager from "../../managers/veterinarians.manager";

export function useVeterinarian(id: number | null) {
  return useQuery({
    queryKey: queryKeys.veterinarians.detail(id!),
    queryFn: () => VeterinariansManager.getById(id!),
    enabled: id != null && !Number.isNaN(id),
  });
}
