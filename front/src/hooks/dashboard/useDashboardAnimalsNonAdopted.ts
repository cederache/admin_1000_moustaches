import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../api/queryKeys";
import AnimalsNonAdoptedManager from "../../managers/AnimalsNonAdopted.manager";

export function useDashboardAnimalsNonAdopted() {
  return useQuery({
    queryKey: queryKeys.dashboard.animalsNonAdopted,
    queryFn: () => AnimalsNonAdoptedManager.getAll(),
  });
}
