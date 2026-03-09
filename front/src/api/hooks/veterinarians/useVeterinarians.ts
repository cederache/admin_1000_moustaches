import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import VeterinariansManager from "../../managers/veterinarians.manager";

export function useVeterinarians() {
  return useQuery({
    queryKey: queryKeys.veterinarians.all,
    queryFn: () => VeterinariansManager.getAll(),
  });
}
