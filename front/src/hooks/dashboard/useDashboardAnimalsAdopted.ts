import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../api/queryKeys";
import AnimalsAdoptedManager from "../../managers/AnimalsAdopted.manager";

export function useDashboardAnimalsAdopted() {
  return useQuery({
    queryKey: queryKeys.dashboard.animalsAdopted,
    queryFn: () => AnimalsAdoptedManager.getAll(),
  });
}
